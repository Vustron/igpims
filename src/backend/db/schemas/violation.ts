import { InferSelectModel, relations, sql } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { locker } from "./locker"

export const violation = sqliteTable(
  "violation",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    lockerId: text("lockerId")
      .notNull()
      .references(() => locker.id, { onDelete: "restrict" }),
    studentName: text("studentName").notNull(),
    violations: text("violations").notNull().$type<string[]>().default([]),
    dateOfInspection: integer("dateOfInspection", {
      mode: "timestamp",
    }).notNull(),
    totalFine: integer("totalFine").notNull(),
    fineStatus: text("fineStatus")
      .notNull()
      .default("unpaid")
      .$type<"paid" | "unpaid" | "partial" | "waived" | "under_review">(),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("violation_student_name_idx").on(t.studentName),
    index("violation_fine_status_idx").on(t.fineStatus),
    index("violation_date_inspection_idx").on(t.dateOfInspection),
    index("violation_locker_id_idx").on(t.lockerId),
  ],
)

export const violationRelations = relations(violation, ({ one }) => ({
  locker: one(locker, {
    fields: [violation.lockerId],
    references: [locker.id],
  }),
}))

export type Violation = InferSelectModel<typeof violation>
