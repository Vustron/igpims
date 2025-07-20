import { timestamp } from "@/backend/helpers/schema-helpers"
import { InferInsertModel, InferSelectModel, relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { user } from "./user"

export const igp = sqliteTable(
  "igp",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    igpName: text("igpName", { length: 255 }),
    igpDescription: text("igpDescription", { length: 2000 }),
    igpType: text("igpType", { length: 20 })
      .notNull()
      .default("permanent")
      .$type<"permanent" | "temporary" | "maintenance">(),
    iconType: text("iconType", { length: 255 })
      .notNull()
      .default("store")
      .$type<
        | "store"
        | "card"
        | "tag"
        | "package"
        | "shirt"
        | "food"
        | "coffee"
        | "bakery"
        | "event"
        | "book"
        | "tech"
        | "education"
        | "service"
        | "craft"
        | "sports"
        | "ticket"
        | "research"
        | "printing"
        | "media"
        | "farm"
        | "vendo"
        | "music"
        | "health"
        | "donation"
        | "art"
        | "rental"
        | "newspaper"
        | "pin"
      >(),
    semesterAndAcademicYear: text("semesterAndAcademicYear", {
      length: 255,
    }),
    totalSold: integer("totalSold").default(0),
    igpRevenue: integer("igpRevenue").default(0),
    igpStartDate: integer("igpStartDate", { mode: "timestamp" }),
    igpEndDate: integer("igpEndDate", { mode: "timestamp" }),
    igpDateNeeded: integer("igpDateNeeded", { mode: "timestamp" }),
    itemsToSell: text("itemsToSell", { length: 2000 }),
    assignedOfficers: text("assignedOfficers", { length: 1000 })
      .$type<string[]>()
      .default([]),
    costPerItem: integer("costPerItem").default(0),
    projectLead: text("projectLead").references(() => user.id, {
      onDelete: "set null",
    }),
    position: text("department", { length: 1000 }),
    status: text("status", { length: 20 })
      .notNull()
      .default("pending")
      .$type<
        | "pending"
        | "in_review"
        | "checking"
        | "approved"
        | "in_progress"
        | "completed"
        | "rejected"
      >(),
    currentStep: integer("currentStep").default(1),
    requestDate: integer("requestDate", {
      mode: "timestamp",
    }),
    dateNeeded: integer("dateNeeded", {
      mode: "timestamp",
    }),
    isRejected: integer("isRejected", { mode: "boolean" }).default(false),
    rejectionStep: integer("rejectionStep").default(0),
    rejectionReason: text("rejectionReason", { length: 2000 }),
    notes: text("notes", { length: 2000 }),
    reviewerComments: text("reviewerComments", { length: 2000 }),
    projectDocument: text("projectDocument", { length: 2000 }),
    resolutionDocument: text("resolutionDocument", { length: 2000 }),
    submissionDate: integer("submissionDate", {
      mode: "timestamp",
    }),
    approvalDate: integer("approvalDate", {
      mode: "timestamp",
    }),
    ...timestamp,
  },
  (t) => [
    index("igp_name_idx").on(t.igpName),
    index("igp_semester_year_idx").on(t.semesterAndAcademicYear),
    index("igp_type_idx").on(t.igpType),
    index("igp_start_date_idx").on(t.igpStartDate),
    index("igp_project_lead_idx").on(t.projectLead),
  ],
)

export const igpRelations = relations(igp, ({ many, one }) => ({
  transactions: many(igpTransactions),
  supplies: many(igpSupply),
  projectLead: one(user, {
    fields: [igp.projectLead],
    references: [user.id],
    relationName: "ledIgpProjects",
  }),
}))

export const igpTransactions = sqliteTable(
  "igpTransactions",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    igpId: text("igpId")
      .notNull()
      .references(() => igp.id, { onDelete: "cascade" }),
    igpSupplyId: text("igpSupplyId")
      .notNull()
      .references(() => igpSupply.id, { onDelete: "cascade" }),
    purchaserName: text("purchaserName", { length: 255 }).notNull(),
    courseAndSet: text("courseAndSet", { length: 100 }).notNull(),
    batch: text("batch").default("N/A"),
    quantity: integer("quantity").default(0).notNull(),
    dateBought: integer("dateBought", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    itemReceived: text("itemReceived", { length: 20 })
      .notNull()
      .default("pending")
      .$type<"pending" | "received" | "cancelled">(),
    ...timestamp,
  },
  (t) => [
    index("igTransactions_igp_id_idx").on(t.igpId),
    index("igTransactions_purchaser_idx").on(t.purchaserName),
    index("igTransactions_item_received_idx").on(t.itemReceived),
  ],
)

export const igpTransactionsRelations = relations(
  igpTransactions,
  ({ one }) => ({
    igp: one(igp, {
      fields: [igpTransactions.igpId],
      references: [igp.id],
      relationName: "transactions",
    }),
    supply: one(igpSupply, {
      fields: [igpTransactions.igpSupplyId],
      references: [igpSupply.id],
      relationName: "supplyTransactions",
    }),
  }),
)

export const igpSupply = sqliteTable(
  "igpSupply",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    igpId: text("igpId")
      .notNull()
      .references(() => igp.id, { onDelete: "cascade" }),
    supplyDate: integer("supplyDate", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    quantity: integer("quantity").default(0).notNull(),
    quantitySold: integer("quantitySold").notNull().default(0),
    unitPrice: integer("unitPrice").notNull(),
    expenses: integer("expenses").notNull().default(0),
    totalRevenue: integer("totalRevenue").notNull().default(0),
    ...timestamp,
  },
  (t) => [
    index("igpSupply_igp_id_idx").on(t.igpId),
    index("igpSupply_date_idx").on(t.supplyDate),
  ],
)

export const igpSupplyRelations = relations(igpSupply, ({ one, many }) => ({
  igp: one(igp, {
    fields: [igpSupply.igpId],
    references: [igp.id],
    relationName: "supplies",
  }),
  transactions: many(igpTransactions),
}))

export type Igp = InferSelectModel<typeof igp>
export type NewIgp = InferInsertModel<typeof igp>
export type IgpSupply = InferSelectModel<typeof igpSupply>
export type NewIgpSupply = InferInsertModel<typeof igpSupply>
export type IgpTransaction = InferSelectModel<typeof igpTransactions>
export type NewIgpTransaction = InferInsertModel<typeof igpTransactions>
