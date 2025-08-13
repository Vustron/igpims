import * as schema from "@/backend/db/schemas"
import { config } from "dotenv"
import { drizzle } from "drizzle-orm/libsql"

config({ path: ".env.local" })

const isOnDevelopment = process.env.NODE_ENV === "development"

export const db = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema,
  logger: isOnDevelopment,
})
