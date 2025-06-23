import { InferSelectModel, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"

export const inspection = sqliteTable(
  "inspection",
  {
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
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("inspection_date_of_inspection_idx").on(t.dateOfInspection),
    index("inspection_date_set_idx").on(t.dateSet),
  ],
)

export type Inspection = InferSelectModel<typeof inspection>
