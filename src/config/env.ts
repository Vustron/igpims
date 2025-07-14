import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    SECRET_KEY: z.string().min(32),
    EMAIL: z.email(),
    PASS: z.string(),
    TWO_FACTOR_SECRET: z.string(),
    IMAGEKIT_PRIVATE_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.url(),
    NEXT_PUBLIC_LOGO_URL: z.url(),
    NEXT_PUBLIC_APP_API_KEY: z.string().min(1, "API key cannot be empty"),
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: z.string(),
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: z.url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SECRET_KEY: process.env.SECRET_KEY,
    EMAIL: process.env.EMAIL,
    PASS: process.env.PASS,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    NEXT_PUBLIC_APP_API_KEY: process.env.NEXT_PUBLIC_APP_API_KEY,
    TWO_FACTOR_SECRET: process.env.TWO_FACTOR_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_LOGO_URL: process.env.NEXT_PUBLIC_LOGO_URL,
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:
      process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  },
  skipValidation: true,
  emptyStringAsUndefined: true,
})
