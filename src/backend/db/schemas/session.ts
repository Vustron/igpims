import { text, index, integer, sqliteTable } from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

import { user } from "./user"

import type { InferSelectModel } from "drizzle-orm"

export const session = sqliteTable(
  "session",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
    token: text("token", { length: 255 }).notNull().unique(),
    ipAddress: text("ipAddress", { length: 255 }),
    userAgent: text("userAgent", { length: 255 }),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("session_user_id_idx").on(t.userId),
    index("session_expires_idx").on(t.expiresAt),
    index("session_ip_created_idx").on(t.ipAddress, t.createdAt),
  ],
)

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export type Session = InferSelectModel<typeof session>
