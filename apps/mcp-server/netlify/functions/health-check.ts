import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { db } from '../../lib/infra/db';
import { RedisClient } from '../../lib/infra/redis';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  dependencies: {
    database: 'connected' | 'disconnected' | 'error';
    redis: 'connected' | 'disconnected' | 'error';
    netlify: 'reachable' | 'unreachable' | 'error';
  };
  metrics?: {
    totalRuns: number;
    activeRuns: number;
    errorRate: number;
    avgExecutionTime: number;
  };
}

/**
 * Health Check endpoint para monitoreo del MCP Server
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const startTime = Date.now();

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  };

  try {
    // Verificar dependencias en paralelo
    const [dbStatus, redisStatus, netlifyStatus, metrics] = await Promise.allSettled([
      checkDatabase(),
      checkRedis(),
      checkNetlify(),
      getHealthMetrics(),
    ]);

    const health: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime() * 1000, // Convert to milliseconds
      dependencies: {
        database: dbStatus.status === 'fulfilled' ? dbStatus.value : 'error',
        redis: redisStatus.status === 'fulfilled' ? redisStatus.value : 'error',
        netlify: netlifyStatus.status === 'fulfilled' ? netlifyStatus.value : 'error',
      },
    };

    // Incluir métricas si están disponibles
    if (metrics.status === 'fulfilled') {
      health.metrics = metrics.value;
    }

    // Determinar estado general
    const hasErrors = Object.values(health.dependencies).some(status => status === 'error');
    const hasDisconnections = Object.values(health.dependencies).some(status => 
      status === 'disconnected' || status === 'unreachable'
    );

    if (hasErrors) {
      health.status = 'unhealthy';
    } else if (hasDisconnections) {
      health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;

    return {
      statusCode,
      headers,
      body: JSON.stringify(health, null, 2),
    };

  } catch (error: any) {
    console.error('Health check error:', error);

    const errorHealth: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: 0,
      dependencies: {
        database: 'error',
        redis: 'error',
        netlify: 'error',
      },
    };

    return {
      statusCode: 503,
      headers,
      body: JSON.stringify(errorHealth, null, 2),
    };
  }
};

async function checkDatabase(): Promise<'connected' | 'disconnected' | 'error'> {
  try {
    // Intentar una query simple
    await db.$queryRaw`SELECT 1 as test`;
    return 'connected';
  } catch (error: any) {
    console.error('Database health check failed:', error);
    
    // Verificar si es un error de conexión o timeout
    if (error.code === 'P1001' || error.code === 'ECONNREFUSED' || error.message?.includes('timeout')) {
      return 'disconnected';
    }
    
    return 'error';
  }
}

async function checkRedis(): Promise<'connected' | 'disconnected' | 'error'> {
  try {
    const redis = RedisClient.getInstance();
    
    // Ping simple
    const result = await redis.ping();
    
    if (result === 'PONG') {
      return 'connected';
    } else {
      return 'disconnected';
    }
  } catch (error: any) {
    console.error('Redis health check failed:', error);
    
    // Verificar si es un error de conexión
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.message?.includes('timeout')) {
      return 'disconnected';
    }
    
    return 'error';
  }
}

async function checkNetlify(): Promise<'reachable' | 'unreachable' | 'error'> {
  try {
    if (!process.env.NETLIFY_FUNCTION_BASE_URL) {
      return 'unreachable';
    }

    // Verificar conectividad básica con timeout corto
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

    try {
      const response = await fetch(`${process.env.NETLIFY_FUNCTION_BASE_URL}/get-characters`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'IntegridAI-MCP-HealthCheck/1.0',
        },
      });

      clearTimeout(timeoutId);

      // Considerar reachable si responde, independientemente del status code
      return response.status < 500 ? 'reachable' : 'unreachable';
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        return 'unreachable'; // Timeout
      }
      
      throw error;
    }

  } catch (error: any) {
    console.error('Netlify health check failed:', error);
    return 'error';
  }
}

async function getHealthMetrics(): Promise<{
  totalRuns: number;
  activeRuns: number;
  errorRate: number;
  avgExecutionTime: number;
}> {
  try {
    // Obtener métricas de los últimos 24 horas
    const oneDayAgo = new Date();
    oneDayAgo.setHours(oneDayAgo.getHours() - 24);

    const [totalRuns, activeRuns, completedRuns, failedRuns, avgDuration] = await Promise.all([
      // Total runs en las últimas 24h
      db.run.count({
        where: {
          startedAt: {
            gte: oneDayAgo,
          },
        },
      }),

      // Runs activos
      db.run.count({
        where: {
          status: 'running',
        },
      }),

      // Runs completados en las últimas 24h
      db.run.count({
        where: {
          status: 'completed',
          startedAt: {
            gte: oneDayAgo,
          },
        },
      }),

      // Runs fallidos en las últimas 24h
      db.run.count({
        where: {
          status: 'failed',
          startedAt: {
            gte: oneDayAgo,
          },
        },
      }),

      // Duración promedio de runs completados
      db.run.aggregate({
        _avg: {
          duration: true,
        },
        where: {
          status: 'completed',
          startedAt: {
            gte: oneDayAgo,
          },
          duration: {
            not: null,
          },
        },
      }),
    ]);

    const errorRate = totalRuns > 0 ? (failedRuns / totalRuns) * 100 : 0;
    const avgExecutionTime = avgDuration._avg.duration || 0;

    return {
      totalRuns,
      activeRuns,
      errorRate: Math.round(errorRate * 100) / 100, // 2 decimal places
      avgExecutionTime: Math.round(avgExecutionTime),
    };

  } catch (error: any) {
    console.error('Failed to get health metrics:', error);
    
    // Devolver métricas por defecto en caso de error
    return {
      totalRuns: 0,
      activeRuns: 0,
      errorRate: 0,
      avgExecutionTime: 0,
    };
  }
}