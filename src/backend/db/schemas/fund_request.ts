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
      .$type<"pending" | "approved" | "denied" | "completed" | "cancelled">(),
    requestedBy: text("requestedBy").references(() => user.id, {
      onDelete: "set null",
    }),
    requestorPosition: text("requestorPosition", { length: 50 }),
    requestDate: integer("requestDate", {
      mode: "timestamp",
    }).notNull(),
    dateNeeded: integer("requestDate", {
      mode: "timestamp",
    }).notNull(),
    approvedBy: text("approvedBy").references(() => user.id, {
      onDelete: "set null",
    }),
    ...timestamp,
  },
  (t) => [
    index("fundRequest_status_idx").on(t.status),
    index("fundRequest_status_idx").on(t.status),
    index("fundRequest_requested_by_idx").on(t.requestedBy),
    index("fundRequest_approved_by_idx").on(t.approvedBy),
    index("fundRequest_created_at_idx").on(t.createdAt),
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

export type FundRequest = InferSelectModel<typeof fundRequest>
export type NewFundRequest = InferInsertModel<typeof fundRequest>
