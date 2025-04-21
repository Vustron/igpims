import {
  text,
  index,
  integer,
  sqliteTable,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm"
import { nanoid } from "nanoid"

import type { InferSelectModel } from "drizzle-orm"

export const UserRole = {
  ADMIN: "admin",
  USER: "user",
} as const

export const user = sqliteTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
    sessionExpired: integer("sessionExpired", { mode: "boolean" }).notNull(),
    role: text("role", { enum: ["admin", "user"] })
      .notNull()
      .default("user"),
    image: text("image"),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  },
  (t) => [index("user_role_idx").on(t.id)],
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}))

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
    token: text("token").notNull().unique(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
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

export const account = sqliteTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  accountId: text("accountId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  providerType: text("providerType").notNull(),
  accessToken: text("accessToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  password: text("password"),
  salt: text("salt"),
  otpSignIn: integer("otpSignIn", { mode: "boolean" }).notNull(),
  twoFactorSecret: text("twoFactorSecret"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
})

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const rateLimit = sqliteTable(
  "rate_limit",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    ipAddress: text("ipAddress").notNull(),
    attempts: integer("attempts").notNull().default(0),
    resetAt: integer("resetAt", { mode: "timestamp" }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  },
  (t) => [uniqueIndex("rate_limit_ip_address_idx").on(t.ipAddress)],
)

export const verificationToken = sqliteTable("verification_token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  token: text("token").notNull().unique(),
  email: text("email").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
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

export const resetToken = sqliteTable("reset_token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  token: text("token").notNull().unique(),
  email: text("email").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
})

export const resetTokenRelations = relations(resetToken, ({ one }) => ({
  user: one(user, {
    fields: [resetToken.userId],
    references: [user.id],
  }),
}))

export const otpToken = sqliteTable("otp_token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  otp: text("otp").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
})

export const otpTokenRelations = relations(otpToken, ({ one }) => ({
  user: one(user, {
    fields: [otpToken.userId],
    references: [user.id],
  }),
}))

export type Account = InferSelectModel<typeof account>
export type User = InferSelectModel<typeof user>
export type Session = InferSelectModel<typeof session>
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole]
export type RateLimit = InferSelectModel<typeof rateLimit>
export type OtpToken = InferSelectModel<typeof otpToken>
