import { InferSelectModel, relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"

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

export const igpTransactions = sqliteTable(
  "igpTransactions",
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
    index("igTransactions_igp_id_idx").on(t.igpId),
    index("igTransactions_purchaser_idx").on(t.purchaserName),
    index("igTransactions_date_bought_idx").on(t.dateBought),
    index("igTransactions_item_received_idx").on(t.itemReceived),
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
  "igpSupply",
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
    index("igpSupply_igp_id_idx").on(t.igpId),
    index("igpSupply_date_idx").on(t.supplyDate),
  ],
)

export const igpSupplyRelations = relations(igpSupply, ({ one }) => ({
  igp: one(igp, {
    fields: [igpSupply.igpId],
    references: [igp.id],
  }),
}))

export type Igp = InferSelectModel<typeof igp>
export type IgpSupply = InferSelectModel<typeof igpSupply>
export type IgpTransaction = InferSelectModel<typeof igpTransactions>
