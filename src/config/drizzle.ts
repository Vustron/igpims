import * as schema from "@/schemas/drizzle-schema"
import { drizzle } from "drizzle-orm/libsql"
import { config } from "dotenv"

config({ path: ".env.local" })

export const db = drizzle({
  connection: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema,
})
