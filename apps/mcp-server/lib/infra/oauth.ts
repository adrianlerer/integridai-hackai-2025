import { NextRequest, NextResponse } from 'next/server';

export interface OAuthUser {
  id: string;
  email?: string;
  name?: string;
  scopes: string[];
}

export interface AuthContext {
  user: OAuthUser | null;
  isAuthenticated: boolean;
  hasScope: (scope: string) => boolean;
}

export class OAuthMiddleware {
  private static readonly REQUIRED_SCOPES = {
    'simulate_ethics_case': ['ethics:simulate'],
    'run_integrity_survey': ['survey:run'],
    'artifacts:read': ['artifacts:read'],
  };

  static async validateToken(authHeader: string): Promise<OAuthUser | null> {
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // TODO: Replace with actual OAuth validation
    // For now, we'll use a simple validation approach
    try {
      // Validate token with OAuth provider (Vercel OAuth or @mcpauth/auth)
      const response = await fetch(`${process.env.MCP_OAUTH_ISSUER}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const userData = await response.json();
      return {
        id: userData.sub || userData.id,
        email: userData.email,
        name: userData.name,
        scopes: userData.scopes || [],
      };
    } catch (error) {
      console.error('OAuth validation error:', error);
      return null;
    }
  }

  static createAuthContext(user: OAuthUser | null): AuthContext {
    return {
      user,
      isAuthenticated: user !== null,
      hasScope: (scope: string) => {
        return user?.scopes?.includes(scope) || false;
      },
    };
  }

  static async authenticate(request: NextRequest): Promise<AuthContext> {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return this.createAuthContext(null);
    }

    const user = await this.validateToken(authHeader);
    return this.createAuthContext(user);
  }

  static validateToolAccess(toolName: string, authContext: AuthContext): boolean {
    if (!authContext.isAuthenticated) {
      return false;
    }

    const requiredScopes = this.REQUIRED_SCOPES[toolName as keyof typeof this.REQUIRED_SCOPES];
    if (!requiredScopes) {
      return true; // Tool doesn't require specific scopes
    }

    return requiredScopes.some(scope => authContext.hasScope(scope));
  }

  static createUnauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
    return NextResponse.json(
      { error: 'unauthorized', message },
      { status: 401 }
    );
  }

  static createForbiddenResponse(message: string = 'Insufficient permissions'): NextResponse {
    return NextResponse.json(
      { error: 'forbidden', message },
      { status: 403 }
    );
  }
}

// Rate limiting utility
export class RateLimiter {
  private static readonly LIMITS = {
    default: 100, // requests per hour
    ethics_simulation: 10, // runs per hour  
    integrity_survey: 5,   // runs per hour
  };

  static async checkRateLimit(
    userId: string, 
    operation: string = 'default'
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const limit = this.LIMITS[operation as keyof typeof this.LIMITS] || this.LIMITS.default;
    const key = `rate_limit:${userId}:${operation}`;
    
    // Implementation would use Redis counter with TTL
    // For now, return allowed
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: Date.now() + (60 * 60 * 1000), // 1 hour from now
    };
  }
}