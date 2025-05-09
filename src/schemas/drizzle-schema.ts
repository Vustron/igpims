import {
  text,
  index,
  integer,
  sqliteTable,
  uniqueIndex,
} from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"
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
    name: text("name", { length: 255 }).notNull(),
    email: text("email", { length: 100 }).notNull().unique(),
    emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
    sessionExpired: integer("sessionExpired", { mode: "boolean" }).notNull(),
    role: text("role", { enum: ["admin", "user"] })
      .notNull()
      .default("user"),
    image: text("image"),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [index("user_role_idx").on(t.id)],
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  lockerRentals: many(lockerRental),
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

export const account = sqliteTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  accountId: text("accountId", { length: 255 }).notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  providerType: text("providerType", { length: 50 }).notNull(),
  accessToken: text("accessToken", { length: 255 }),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
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
  (t) => [uniqueIndex("rate_limit_ip_address_idx").on(t.ipAddress)],
)

export const verificationToken = sqliteTable("verification_token", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  token: text("token", { length: 20 }).notNull().unique(),
  email: text("email", { length: 100 }).notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
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
  token: text("token", { length: 20 }).notNull().unique(),
  email: text("email", { length: 100 }).notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
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

export const locker = sqliteTable(
  "locker",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    lockerStatus: text("lockerStatus", { length: 20 })
      .notNull()
      .default("available")
      .$type<
        "available" | "occupied" | "reserved" | "maintenance" | "out-of-service"
      >(),
    lockerType: text("lockerType", { length: 255 }).notNull(),
    lockerName: text("lockerName", { length: 255 }).notNull(),
    lockerLocation: text("lockerType", { length: 255 }).notNull(),
    lockerRentalPrice: integer("lockerRentalPrice").default(0).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    uniqueIndex("locker_id_idx").on(t.id),
    index("locker_type_idx").on(t.lockerType),
    index("locker_status_idx").on(t.lockerStatus),
    index("locker_location_idx").on(t.lockerLocation),
    index("locker_rental_price_idx").on(t.lockerRentalPrice),
  ],
)

export const lockerRental = sqliteTable(
  "locker_rental",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    lockerId: text("lockerId")
      .notNull()
      .references(() => locker.id, { onDelete: "restrict" }),
    renterId: text("renterId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    renterName: text("renterName", { length: 100 }).notNull(),
    courseAndSet: text("courseAndSet", { length: 100 }).notNull(),
    rentalStatus: text("rentalStatus", { length: 100 }).notNull(),
    paymentStatus: text("paymentStatus", { length: 100 }).notNull(),
    dateRented: integer("dateRented", { mode: "timestamp" }).notNull(),
    dateDue: integer("dateDue", { mode: "timestamp" }).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    uniqueIndex("locker_rental_id_idx").on(t.id),
    index("locker_rental_locker_id_idx").on(t.lockerId),
    index("locker_rental_renter_id_idx").on(t.renterId),
    index("locker_rental_renter_name_idx").on(t.renterName),
    index("locker_rental_course_idx").on(t.courseAndSet),
    index("locker_rental_rental_status_idx").on(t.rentalStatus),
    index("locker_rental_payment_status_idx").on(t.paymentStatus),
    index("locker_rental_date_rented_idx").on(t.dateRented),
    index("locker_rental_date_due_idx").on(t.dateDue),
  ],
)

export const lockerRelations = relations(locker, ({ many }) => ({
  rentals: many(lockerRental),
}))

export const lockerRentalRelations = relations(lockerRental, ({ one }) => ({
  locker: one(locker, {
    fields: [lockerRental.lockerId],
    references: [locker.id],
  }),
  renter: one(user, {
    fields: [lockerRental.renterId],
    references: [user.id],
  }),
}))

export type Account = InferSelectModel<typeof account>
export type User = InferSelectModel<typeof user>
export type Session = InferSelectModel<typeof session>
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole]
export type RateLimit = InferSelectModel<typeof rateLimit>
export type OtpToken = InferSelectModel<typeof otpToken>
export type Locker = InferSelectModel<typeof locker>
export type LockerRental = InferSelectModel<typeof lockerRental>
