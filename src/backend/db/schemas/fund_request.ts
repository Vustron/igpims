import { timestamp } from "@/backend/helpers/schema-helpers"
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { user } from "./user"

export const fundRequest = sqliteTable(
  "fundRequest",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    purpose: text("purpose", { length: 1000 }).notNull(),
    amount: integer("amount").notNull(),
    utilizedFunds: integer("utilizedFunds").default(0).notNull(),
    allocatedFunds: integer("allocatedFunds").default(0).notNull(),
    status: text("status", { length: 20 })
      .notNull()
      .default("pending")
      .$type<
        | "pending"
        | "in_review"
        | "checking"
        | "approved"
        | "disbursed"
        | "received"
        | "receipted"
        | "validated"
        | "rejected"
      >(),
    currentStep: integer("currentStep").default(1).notNull(),
    requestDate: integer("requestDate", {
      mode: "timestamp",
    }).notNull(),
    dateNeeded: integer("dateNeeded", {
      mode: "timestamp",
    }).notNull(),
    requestor: text("requestor").references(() => user.id, {
      onDelete: "set null",
    }),
    requestorPosition: text("requestorPosition", { length: 50 }),
    isRejected: integer("isRejected", { mode: "boolean" })
      .notNull()
      .default(false),
    rejectionStep: integer("rejectionStep").notNull().default(0),
    rejectionReason: text("rejectionReason", { length: 2000 }),
    notes: text("notes", { length: 2000 }),
    reviewerComments: text("reviewerComments", { length: 2000 }),
    disbursementDate: integer("disbursementDate", {
      mode: "timestamp",
    }),
    receiptDate: integer("receiptDate", {
      mode: "timestamp",
    }),
    validationDate: integer("validationDate", {
      mode: "timestamp",
    }),
    receipts: text("receipts")
      .notNull()
      .$type<{ id: string; receiptImg: string }[]>()
      .default([]),
    approvedBy: text("approvedBy").references(() => user.id, {
      onDelete: "set null",
    }),
    ...timestamp,
  },
  (t) => [
    index("fundRequest_status_idx").on(t.status),
    index("fundRequest_status_idx").on(t.status),
    index("fundRequest_requested_by_idx").on(t.requestor),
    index("fundRequest_approved_by_idx").on(t.approvedBy),
    index("fundRequest_created_at_idx").on(t.createdAt),
  ],
)

export const fundRequestRelations = relations(fundRequest, ({ one }) => ({
  requester: one(user, {
    fields: [fundRequest.requestor],
    references: [user.id],
    relationName: "requestedFunds",
  }),
  approver: one(user, {
    fields: [fundRequest.approvedBy],
    references: [user.id],
    relationName: "approvedFunds",
  }),
}))

export const expenseTransaction = sqliteTable(
  "expenseTransaction",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    requestId: text("requestId", { length: 15 })
      .notNull()
      .references(() => fundRequest.id, { onDelete: "cascade" }),
    expenseName: text("expenseName", { length: 255 }).notNull(),
    amount: integer("amount").notNull(),
    date: integer("date", { mode: "timestamp" }).notNull(),
    receipt: text("receipt", { length: 255 }),
    status: text("status", { length: 20 })
      .notNull()
      .default("pending")
      .$type<"pending" | "validated" | "rejected">(),
    validatedBy: text("validatedBy").references(() => user.id, {
      onDelete: "set null",
    }),
    validatedDate: integer("validatedDate", { mode: "timestamp" }),
    rejectionReason: text("rejectionReason", { length: 2000 }),
    ...timestamp,
  },
  (t) => [
    index("expenseTransaction_requestId_idx").on(t.requestId),
    index("expenseTransaction_status_idx").on(t.status),
    index("expenseTransaction_validatedBy_idx").on(t.validatedBy),
  ],
)

export const expenseTransactionRelations = relations(
  expenseTransaction,
  ({ one }) => ({
    request: one(fundRequest, {
      fields: [expenseTransaction.requestId],
      references: [fundRequest.id],
      relationName: "expenseTransactions",
    }),
    validator: one(user, {
      fields: [expenseTransaction.validatedBy],
      references: [user.id],
      relationName: "validatedExpenses",
    }),
  }),
)

export type FundRequest = InferSelectModel<typeof fundRequest>
export type NewFundRequest = InferInsertModel<typeof fundRequest>
export type ExpenseTransaction = InferSelectModel<typeof expenseTransaction>
export type NewExpenseTransaction = InferInsertModel<typeof expenseTransaction>
