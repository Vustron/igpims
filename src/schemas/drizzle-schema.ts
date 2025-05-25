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
  requestedFunds: many(fundRequest, { relationName: "requestedFunds" }),
  approvedFunds: many(fundRequest, { relationName: "approvedFunds" }),
  submittedProjects: many(projectRequest, {
    relationName: "submittedProjects",
  }),
  approvedProjects: many(projectRequest, { relationName: "approvedProjects" }),
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
    lockerLocation: text("lockerLocation", { length: 255 }).notNull(),
    lockerRentalPrice: integer("lockerRentalPrice").default(0).notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("locker_type_idx").on(t.lockerType),
    index("locker_status_idx").on(t.lockerStatus),
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
    renterId: text("renterId").notNull(),
    renterName: text("renterName", { length: 100 }).notNull(),
    courseAndSet: text("courseAndSet", { length: 100 }).notNull(),
    renterEmail: text("renterEmail", { length: 100 }).notNull(),
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
  (_t) => [],
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

export const waterVendo = sqliteTable(
  "water_vendo",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    waterVendoLocation: text("waterVendoLocation", { length: 255 }).notNull(),
    gallonsUsed: integer("gallonsUsed").default(0).notNull(),
    vendoStatus: text("vendoStatus", { length: 20 })
      .notNull()
      .default("operational")
      .$type<"operational" | "maintenance" | "out-of-service" | "offline">(),
    waterRefillStatus: text("waterRefillStatus", { length: 20 })
      .notNull()
      .default("full")
      .$type<"full" | "medium" | "low" | "empty">(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (_t) => [
    // index("water_vendo_location_idx").on(t.waterVendoLocation),
    // index("water_vendo_status_idx").on(t.vendoStatus),
    // index("water_refill_status_idx").on(t.waterRefillStatus),
  ],
)

export const waterSupply = sqliteTable(
  "water_supply",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    waterVendoId: text("waterVendoId")
      .notNull()
      .references(() => waterVendo.id, { onDelete: "cascade" }),
    supplyDate: integer("supplyDate", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    suppliedGallons: integer("suppliedGallons").notNull(),
    expenses: integer("expenses").notNull(),
    usedGallons: integer("usedGallons").default(0).notNull(),
    remainingGallons: integer("remainingGallons").notNull(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (_t) => [],
)

// export const waterFunds = sqliteView("water_funds", {
//   id: text("id"),
//   waterVendoId: text("waterVendoId"),
//   waterVendoLocation: text("waterVendoLocation"),
//   gallonsUsed: integer("gallonsUsed"),
//   expenses: integer("expenses"),
//   revenue: integer("revenue"),
//   profit: integer("profit"),
//   createdAt: integer("createdAt", { mode: "timestamp" }),
//   updatedAt: integer("updatedAt", { mode: "timestamp" }),
// }).as(sql`
//   SELECT
//     hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(2)) || '-' || hex(randomblob(6)) as id,
//     wv.id as waterVendoId,
//     wv.waterVendoLocation,
//     wv.gallonsUsed,
//     COALESCE(SUM(ws.expenses), 0) as expenses,
//     (wv.gallonsUsed * 10) as revenue,
//     ((wv.gallonsUsed * 10) - COALESCE(SUM(ws.expenses), 0)) as profit,
//     wv.createdAt,
//     wv.updatedAt
//   FROM
//     water_vendo wv
//   LEFT JOIN
//     water_supply ws ON wv.id = ws.waterVendoId
//   GROUP BY
//     wv.id
// `)

export const igp = sqliteTable(
  "igp",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    igpName: text("igpName", { length: 255 }).notNull(),
    semesterAndAcademicYear: text("semesterAndAcademicYear", {
      length: 100,
    }).notNull(),
    typeOfTransaction: text("typeOfTransaction", { length: 100 }).notNull(),
    igpStartDate: integer("igpStartDate", { mode: "timestamp" }).notNull(),
    igpEndDate: integer("igpEndDate", { mode: "timestamp" }),
    itemsToSell: text("itemsToSell", { length: 1000 }),
    assignedOfficers: text("assignedOfficers", { length: 1000 }),
    costPerItem: integer("costPerItem").notNull(),
    igpType: text("igpType", { length: 20 })
      .notNull()
      .default("goods")
      .$type<"goods" | "services" | "rentals" | "events" | "other">(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("igp_name_idx").on(t.igpName),
    index("igp_semester_year_idx").on(t.semesterAndAcademicYear),
    index("igp_type_idx").on(t.igpType),
    index("igp_start_date_idx").on(t.igpStartDate),
  ],
)

export const igpRelations = relations(igp, ({ many }) => ({
  transactions: many(igpTransactions),
  supplies: many(igpSupply),
}))

export const waterVendoRelations = relations(waterVendo, ({ many }) => ({
  supplies: many(waterSupply),
}))

export const waterSupplyRelations = relations(waterSupply, ({ one }) => ({
  vendo: one(waterVendo, {
    fields: [waterSupply.waterVendoId],
    references: [waterVendo.id],
  }),
}))

export const igpTransactions = sqliteTable(
  "igp_transactions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    igpId: text("igpId")
      .notNull()
      .references(() => igp.id, { onDelete: "cascade" }),
    purchaserName: text("purchaserName", { length: 255 }).notNull(),
    courseAndSet: text("courseAndSet", { length: 100 }).notNull(),
    batch: integer("batch").notNull(),
    quantity: integer("quantity").notNull(),
    dateBought: integer("dateBought", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    itemReceived: text("itemReceived", { length: 20 })
      .notNull()
      .default("pending")
      .$type<"pending" | "received" | "cancelled">(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("igp_transactions_igp_id_idx").on(t.igpId),
    index("igp_transactions_purchaser_idx").on(t.purchaserName),
    index("igp_transactions_date_bought_idx").on(t.dateBought),
    index("igp_transactions_item_received_idx").on(t.itemReceived),
  ],
)

export const igpTransactionsRelations = relations(
  igpTransactions,
  ({ one }) => ({
    igp: one(igp, {
      fields: [igpTransactions.igpId],
      references: [igp.id],
    }),
  }),
)

export const igpSupply = sqliteTable(
  "igp_supply",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    igpId: text("igpId")
      .notNull()
      .references(() => igp.id, { onDelete: "cascade" }),
    supplyDate: integer("supplyDate", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    quantitySold: integer("quantitySold").notNull().default(0),
    unitPrice: integer("unitPrice").notNull(),
    totalRevenue: integer("totalRevenue").notNull().default(0),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("igp_supply_igp_id_idx").on(t.igpId),
    index("igp_supply_date_idx").on(t.supplyDate),
  ],
)

export const igpSupplyRelations = relations(igpSupply, ({ one }) => ({
  igp: one(igp, {
    fields: [igpSupply.igpId],
    references: [igp.id],
  }),
}))

export const fundRequest = sqliteTable(
  "fund_request",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    purpose: text("purpose", { length: 1000 }).notNull(),
    amount: integer("amount").notNull(),
    utilizedFunds: integer("utilizedFunds").default(0).notNull(),
    allocatedFunds: integer("allocatedFunds").default(0).notNull(),
    status: text("status", { length: 20 })
      .notNull()
      .default("pending")
      .$type<"pending" | "approved" | "denied" | "completed" | "cancelled">(),
    requestedBy: text("requestedBy").references(() => user.id, {
      onDelete: "set null",
    }),
    approvedBy: text("approvedBy").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("fund_request_status_idx").on(t.status),
    index("fund_request_requested_by_idx").on(t.requestedBy),
    index("fund_request_approved_by_idx").on(t.approvedBy),
    index("fund_request_created_at_idx").on(t.createdAt),
  ],
)

export const fundRequestRelations = relations(fundRequest, ({ one }) => ({
  requester: one(user, {
    fields: [fundRequest.requestedBy],
    references: [user.id],
    relationName: "requestedFunds",
  }),
  approver: one(user, {
    fields: [fundRequest.approvedBy],
    references: [user.id],
    relationName: "approvedFunds",
  }),
}))

export const projectRequest = sqliteTable(
  "project_request",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    projectLead: text("projectLead", { length: 255 }).notNull(),
    projectTitle: text("projectTitle", { length: 500 }).notNull(),
    dateSubmitted: integer("dateSubmitted", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    status: text("status", { length: 20 })
      .notNull()
      .default("pending")
      .$type<
        | "pending"
        | "approved"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "rejected"
      >(),
    description: text("description", { length: 2000 }),
    submittedBy: text("submittedBy").references(() => user.id, {
      onDelete: "set null",
    }),
    approvedBy: text("approvedBy").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("project_request_status_idx").on(t.status),
    index("project_request_lead_idx").on(t.projectLead),
    index("project_request_date_idx").on(t.dateSubmitted),
    index("project_request_submitted_by_idx").on(t.submittedBy),
  ],
)

export const projectRequestRelations = relations(projectRequest, ({ one }) => ({
  submitter: one(user, {
    fields: [projectRequest.submittedBy],
    references: [user.id],
    relationName: "submittedProjects",
  }),
  approver: one(user, {
    fields: [projectRequest.approvedBy],
    references: [user.id],
    relationName: "approvedProjects",
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
export type WaterVendo = InferSelectModel<typeof waterVendo>
export type WaterSupply = InferSelectModel<typeof waterSupply>
export type Igp = InferSelectModel<typeof igp>
export type IgpSupply = InferSelectModel<typeof igpSupply>
export type IgpTransaction = InferSelectModel<typeof igpTransactions>
export type FundRequest = InferSelectModel<typeof fundRequest>
export type ProjectRequest = InferSelectModel<typeof projectRequest>
