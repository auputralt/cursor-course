// Simple in-memory rate limiter
// In production, use Redis or a proper rate limiting service

import { NextResponse } from 'next/server'

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 60, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  private getKey(identifier: string): string {
    return `rate_limit:${identifier}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    this.cleanup();
    
    const key = this.getKey(identifier);
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || entry.resetTime < now) {
      // New window or expired entry
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs
      };
    }

    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }

    // Increment count
    entry.count++;
    this.store.set(key, entry);

    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }

  reset(identifier: string): void {
    const key = this.getKey(identifier);
    this.store.delete(key);
  }
}

// Create rate limiter instances for different endpoints
export const chatRateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '60'),
  60000 // 1 minute
);

export const imageRateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_IMAGE_REQUESTS_PER_MINUTE || '10'),
  60000 // 1 minute
);

export const authRateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_AUTH_REQUESTS_PER_MINUTE || '5'),
  60000 // 1 minute
);

// Rate limiting middleware
export function checkRateLimit(
  rateLimiter: RateLimiter,
  identifier: string
): { allowed: boolean; response?: NextResponse } {
  const result = rateLimiter.isAllowed(identifier);
  
  if (!result.allowed) {
    const response = NextResponse.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        resetTime: result.resetTime
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimiter['maxRequests'].toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetTime.toString(),
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
        }
      }
    );
    
    return { allowed: false, response };
  }

  return { allowed: true };
}
