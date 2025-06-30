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
    EMAIL: z.string().email(),
    PASS: z.string(),
    TWO_FACTOR_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_LOGO_URL: z.string().url(),
    NEXT_PUBLIC_APP_API_KEY: z.string().min(1, "API key cannot be empty"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SECRET_KEY: process.env.SECRET_KEY,
    EMAIL: process.env.EMAIL,
    PASS: process.env.PASS,
    NEXT_PUBLIC_APP_API_KEY: process.env.NEXT_PUBLIC_APP_API_KEY,
    TWO_FACTOR_SECRET: process.env.TWO_FACTOR_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_LOGO_URL: process.env.NEXT_PUBLIC_LOGO_URL,
  },
  skipValidation: true,
  emptyStringAsUndefined: true,
})
