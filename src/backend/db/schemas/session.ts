import { timestamp } from "@/backend/helpers/schema-helpers"
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { user } from "./user"

export const session = sqliteTable(
  "session",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
    token: text("token", { length: 255 }).notNull().unique(),
    ipAddress: text("ipAddress", { length: 255 }),
    userAgent: text("userAgent", { length: 255 }),
    userRole: text("userAgent", { length: 255 }),
    ...timestamp,
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
export type NewSession = InferInsertModel<typeof session>
