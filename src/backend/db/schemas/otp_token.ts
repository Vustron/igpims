import { InferSelectModel, relations, sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { user } from "./user"

export const otpToken = sqliteTable("otp_token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  email: text("email", { length: 100 }).notNull(),
  otp: text("otp", { length: 10 }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export const otpTokenRelations = relations(otpToken, ({ one }) => ({
  user: one(user, {
    fields: [otpToken.userId],
    references: [user.id],
  }),
}))

export type OtpToken = InferSelectModel<typeof otpToken>
