import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { timestamp } from "@/backend/helpers/schema-helpers"

export const rateLimit = sqliteTable(
  "rateLimit",
  {
    ...timestamp,
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    ipAddress: text("ipAddress", { length: 255 }).notNull(),
    attempts: integer("attempts").notNull().default(0),
    resetAt: integer("resetAt", { mode: "timestamp" }).notNull(),
  },
  (t) => [uniqueIndex("rateLimit_ip_address_idx").on(t.ipAddress)],
)

export type RateLimit = InferSelectModel<typeof rateLimit>
export type NewRateLimit = InferInsertModel<typeof rateLimit>
