import RateLimiter from "async-ratelimiter"
import { config } from "dotenv"
import { Redis } from "ioredis"

config({ path: ".env.local" })

const REDIS_CONFIG = {
  connectTimeout: 10000,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
}

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL
  }
  throw new Error("REDIS_URL is not defined")
}

const redis = new Redis(getRedisUrl(), REDIS_CONFIG)
redis.config("SET", "notify-keyspace-events", "Ex")

export const rateLimiter = new RateLimiter({
  db: redis,
  max: 5,
  duration: 10_000,
  namespace: "rate-limiter",
})

export default redis
