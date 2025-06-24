import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { timestamp } from "@/backend/helpers/schema-helpers"
import { user } from "./user"

export const account = sqliteTable(
  "account",
  {
    ...timestamp,
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    accountId: text("accountId", { length: 255 }).notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerType: text("providerType", { length: 50 }).notNull(),
    accessToken: text("accessToken", { length: 255 }),
    accessTokenExpiresAt: integer("accessTokenExpiresAt", {
      mode: "timestamp",
    }),
    password: text("password", { length: 255 }),
    salt: text("salt", { length: 255 }),
    otpSignIn: integer("otpSignIn", { mode: "boolean" }).notNull(),
    twoFactorSecret: text("twoFactorSecret", { length: 10 }),
  },
  (t) => [
    index("account_user_id_idx").on(t.userId),
    index("account_account_id_idx").on(t.accountId),
    index("account_provider_type_idx").on(t.providerType),
    index("account_created_at_idx").on(t.createdAt),
  ],
)

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export type Account = InferSelectModel<typeof account>
export type NewAccount = InferInsertModel<typeof account>
