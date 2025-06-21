import { InferSelectModel, relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"

export const waterVendo = sqliteTable(
  "waterVendo",
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
  (t) => [
    index("waterVendo_location_idx").on(t.waterVendoLocation),
    index("waterVendo_status_idx").on(t.vendoStatus),
    index("waterRefill_status_idx").on(t.waterRefillStatus),
  ],
)

export const waterSupply = sqliteTable(
  "waterSupply",
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
export type WaterSupply = InferSelectModel<typeof waterSupply>
