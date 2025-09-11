import Redis from 'ioredis';

export class RedisClient {
  private static instance: Redis | null = null;

  static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis({
        host: process.env.UPSTASH_REDIS_REST_URL?.replace('https://', '').replace('http://', ''),
        port: 6379,
        password: process.env.UPSTASH_REDIS_REST_TOKEN,
        tls: process.env.NODE_ENV === 'production' ? {} : undefined,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
      });
    }
    return RedisClient.instance;
  }

  static async createSession(sessionId: string, data: any, ttl: number = 3600): Promise<void> {
    const redis = RedisClient.getInstance();
    await redis.setex(`session:${sessionId}`, ttl, JSON.stringify(data));
  }

  static async getSession(sessionId: string): Promise<any | null> {
    const redis = RedisClient.getInstance();
    const data = await redis.get(`session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  static async deleteSession(sessionId: string): Promise<void> {
    const redis = RedisClient.getInstance();
    await redis.del(`session:${sessionId}`);
  }

  static async acquireLock(lockKey: string, ttl: number = 30): Promise<boolean> {
    const redis = RedisClient.getInstance();
    const result = await redis.set(`lock:${lockKey}`, '1', 'EX', ttl, 'NX');
    return result === 'OK';
  }

  static async releaseLock(lockKey: string): Promise<void> {
    const redis = RedisClient.getInstance();
    await redis.del(`lock:${lockKey}`);
  }

  static async setRunState(runId: string, state: any, ttl: number = 7200): Promise<void> {
    const redis = RedisClient.getInstance();
    await redis.setex(`run:${runId}`, ttl, JSON.stringify(state));
  }

  static async getRunState(runId: string): Promise<any | null> {
    const redis = RedisClient.getInstance();
    const data = await redis.get(`run:${runId}`);
    return data ? JSON.parse(data) : null;
  }

  static async deleteRunState(runId: string): Promise<void> {
    const redis = RedisClient.getInstance();
    await redis.del(`run:${runId}`);
  }

  static async incrementCounter(key: string, ttl: number = 3600): Promise<number> {
    const redis = RedisClient.getInstance();
    const count = await redis.incr(`counter:${key}`);
    if (count === 1) {
      await redis.expire(`counter:${key}`, ttl);
    }
    return count;
  }
}