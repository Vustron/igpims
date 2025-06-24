import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { timestamp } from "@/backend/helpers/schema-helpers"

export const inspection = sqliteTable(
  "inspection",
  {
    ...timestamp,
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    dateOfInspection: integer("dateOfInspection", {
      mode: "timestamp",
    }).notNull(),
    dateSet: integer("dateSet", {
      mode: "timestamp",
    }).notNull(),
    violators: text("violators").notNull().$type<string[]>().default([]),
    totalFines: integer("totalFines").notNull(),
  },
  (_t) => [],
)

export type Inspection = InferSelectModel<typeof inspection>
export type InsertInspection = InferInsertModel<typeof inspection>
