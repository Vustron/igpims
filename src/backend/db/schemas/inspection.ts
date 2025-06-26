import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { timestamp } from "@/backend/helpers/schema-helpers"
import { violation } from "./violation"

export const inspection = sqliteTable(
  "inspection",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    dateOfInspection: integer("dateOfInspection", {
      mode: "timestamp",
    }).notNull(),
    dateSet: integer("dateSet", {
      mode: "timestamp",
    }).notNull(),
    violators: text("violators")
      .notNull()
      .$type<{ id: string; studentName: string }[]>()
      .default([]),
    totalFines: integer("totalFines").notNull(),
    ...timestamp,
  },
  (_t) => [],
)

export const inspectionRelations = relations(inspection, ({ many }) => ({
  violations: many(violation),
}))

export type Inspection = InferSelectModel<typeof inspection>
export type InsertInspection = InferInsertModel<typeof inspection>
