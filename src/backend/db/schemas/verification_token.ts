import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { timestamp } from "@/backend/helpers/schema-helpers"
import { user } from "./user"

export const verificationToken = sqliteTable("verificationToken", {
  ...timestamp,
  id: text("id", { length: 15 })
    .primaryKey()
    .$defaultFn(() => nanoid(15)),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  token: text("token", { length: 20 }).notNull().unique(),
  email: text("email", { length: 100 }).notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
})

export const verificationTokenRelations = relations(
  verificationToken,
  ({ one }) => ({
    user: one(user, {
      fields: [verificationToken.userId],
      references: [user.id],
    }),
  }),
)

export type VerificationToken = InferSelectModel<typeof verificationToken>
export type NewVerificationToken = InferInsertModel<typeof verificationToken>
