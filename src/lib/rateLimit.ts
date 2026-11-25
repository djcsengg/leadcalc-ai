/**
 * In-memory sliding-window rate limiter for serverless & edge routes.
 * Tracks requests per identifier (e.g. client IP) within a configurable time window.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes to avoid memory leaks
if (typeof setInterval !== "undefined") {
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);

  // Unref interval if running in Node.js so it doesn't hold the process open
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

export interface RateLimitOptions {
  limit?: number; // max requests per window
  windowMs?: number; // window duration in milliseconds (default: 60,000ms = 1 min)
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // epoch timestamp when the window resets
}

/**
 * Checks and records a request against the rate limit.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? 10;
  const windowMs = options.windowMs ?? 60000;
  const now = Date.now();

  const record = rateLimitStore.get(identifier) ?? { timestamps: [] };

  // Remove timestamps outside the sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const reset = oldestTimestamp + windowMs;
    return {
      success: false,
      limit,
      remaining: 0,
      reset,
    };
  }

  // Record this request
  record.timestamps.push(now);
  rateLimitStore.set(identifier, record);

  const remaining = Math.max(0, limit - record.timestamps.length);
  const reset = record.timestamps[0] + windowMs;

  return {
    success: true,
    limit,
    remaining,
    reset,
  };
}

/**
 * Extracts a client IP from request headers.
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Resets the rate limit store (useful for unit tests).
 */
export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}
