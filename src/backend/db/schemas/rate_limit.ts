import { InferSelectModel, sql } from "drizzle-orm"
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"

export const rateLimit = sqliteTable(
  "rateLimit",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    ipAddress: text("ipAddress", { length: 255 }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    resetAt: integer("resetAt", { mode: "timestamp" }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [uniqueIndex("rateLimit_ip_address_idx").on(t.ipAddress)],
)

export type RateLimit = InferSelectModel<typeof rateLimit>
