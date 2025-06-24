import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { timestamp } from "@/backend/helpers/schema-helpers"
import { user } from "./user"

export const otpToken = sqliteTable("otp_token", {
  ...timestamp,
  id: text("id", { length: 15 })
    .primaryKey()
    .$defaultFn(() => nanoid(15)),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  email: text("email", { length: 100 }).notNull(),
  otp: text("otp", { length: 10 }).notNull(),
})

export const otpTokenRelations = relations(otpToken, ({ one }) => ({
  user: one(user, {
    fields: [otpToken.userId],
    references: [user.id],
  }),
}))

export type OtpToken = InferSelectModel<typeof otpToken>
export type NewOtpToken = InferInsertModel<typeof otpToken>
