import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { timestamp } from "@/backend/helpers/schema-helpers"

export const waterVendo = sqliteTable(
  "waterVendo",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
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
    ...timestamp,
  },
  (t) => [
    index("waterVendo_location_idx").on(t.waterVendoLocation),
    index("waterVendo_status_idx").on(t.vendoStatus),
    index("waterRefill_status_idx").on(t.waterRefillStatus),
    index("waterVendo_gallons_idx").on(t.gallonsUsed),
    index("waterVendo_created_idx").on(t.createdAt),
  ],
)

export const waterSupply = sqliteTable(
  "waterSupply",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    waterVendoId: text("waterVendoId")
      .notNull()
      .references(() => waterVendo.id, { onDelete: "cascade" }),
    supplyDate: integer("supplyDate", { mode: "timestamp" }).notNull(),
    suppliedGallons: integer("suppliedGallons").notNull(),
    expenses: integer("expenses").notNull(),
    usedGallons: integer("usedGallons").default(0).notNull(),
    remainingGallons: integer("remainingGallons").notNull(),
    ...timestamp,
  },
  (t) => [
    index("waterSupply_vendo_idx").on(t.waterVendoId),
    index("waterSupply_date_idx").on(t.supplyDate),
    index("waterSupply_remaining_idx").on(t.remainingGallons),
    index("waterSupply_vendo_date_idx").on(t.waterVendoId, t.supplyDate),
  ],
)

export const waterFunds = sqliteTable(
  "waterFunds",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    waterVendoId: text("waterVendoId")
      .notNull()
      .references(() => waterVendo.id, { onDelete: "cascade" }),
    waterVendoLocation: text("waterVendoLocation", { length: 255 }).notNull(),
    usedGallons: integer("usedGallons").default(0).notNull(),
    waterFundsExpenses: integer("waterFundsExpenses").default(0).notNull(),
    waterFundsRevenue: integer("waterFundsRevenue").default(0).notNull(),
    waterFundsProfit: integer("waterFundsProfit").default(0).notNull(),
    weekFund: integer("weekFund", { mode: "timestamp" }).notNull(),
    dateFund: integer("dateFund", { mode: "timestamp" }).notNull(),
    ...timestamp,
  },
  (t) => [
    index("waterFunds_vendo_idx").on(t.waterVendoId),
    index("waterFunds_week_idx").on(t.weekFund),
    index("waterFunds_date_idx").on(t.dateFund),
    index("waterFunds_location_idx").on(t.waterVendoLocation),
    index("waterFunds_vendo_week_idx").on(t.waterVendoId, t.weekFund),
    index("waterFunds_profit_idx").on(t.waterFundsProfit),
  ],
)

export const waterVendoRelations = relations(waterVendo, ({ many }) => ({
  supplies: many(waterSupply),
  funds: many(waterFunds),
}))

export const waterSupplyRelations = relations(waterSupply, ({ one }) => ({
  vendo: one(waterVendo, {
    fields: [waterSupply.waterVendoId],
    references: [waterVendo.id],
  }),
}))

export const waterFundsRelations = relations(waterFunds, ({ one }) => ({
  vendo: one(waterVendo, {
    fields: [waterFunds.waterVendoId],
    references: [waterVendo.id],
  }),
}))

export type WaterVendo = InferSelectModel<typeof waterVendo>
export type NewWaterVendo = InferInsertModel<typeof waterVendo>
export type WaterSupply = InferSelectModel<typeof waterSupply>
export type NewWaterSupply = InferInsertModel<typeof waterSupply>
export type WaterFunds = InferSelectModel<typeof waterFunds>
export type NewWaterFunds = InferInsertModel<typeof waterFunds>
