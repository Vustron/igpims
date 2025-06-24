import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { timestamp } from "@/backend/helpers/schema-helpers"

export const waterVendo = sqliteTable(
  "waterVendo",
  {
    ...timestamp,
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
  },
  (t) => [
    index("waterVendo_location_idx").on(t.waterVendoLocation),
    index("waterVendo_status_idx").on(t.vendoStatus),
    index("waterRefill_status_idx").on(t.waterRefillStatus),
  ],
)

export const waterSupply = sqliteTable(
  "waterSupply",
  {
    ...timestamp,
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

export const waterVendoRelations = relations(waterVendo, ({ many }) => ({
  supplies: many(waterSupply),
}))

export const waterSupplyRelations = relations(waterSupply, ({ one }) => ({
  vendo: one(waterVendo, {
    fields: [waterSupply.waterVendoId],
    references: [waterVendo.id],
  }),
}))

export type WaterVendo = InferSelectModel<typeof waterVendo>
export type NewWaterVendo = InferInsertModel<typeof waterVendo>
export type WaterSupply = InferSelectModel<typeof waterSupply>
export type NewWaterSupply = InferInsertModel<typeof waterSupply>
