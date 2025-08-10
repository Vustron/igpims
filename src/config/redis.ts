import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { env } from "./env"

export const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
})

export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(8, "10 s"),
})

export const RATE_LIMIT_DURATION = 60 * 60 * 1000
export const MAX_REQUESTS_PER_HOUR = 8
