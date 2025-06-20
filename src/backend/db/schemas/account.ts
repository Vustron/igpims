import { text, index, integer, sqliteTable } from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

import { user } from "./user"

import type { InferSelectModel } from "drizzle-orm"

export const account = sqliteTable(
  "account",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
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
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
