import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { timestamp } from "@/backend/helpers/schema-helpers"
import { inspection } from "./inspection" // Added import for inspection
import { locker } from "./locker"

export const violation = sqliteTable(
  "violation",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    lockerId: text("lockerId")
      .notNull()
      .references(() => locker.id, { onDelete: "restrict" }),
    inspectionId: text("inspectionId")
      .notNull()
      .references(() => inspection.id, { onDelete: "cascade" }),
    studentName: text("studentName").notNull(),
    violations: text("violations").notNull().$type<string[]>().default([]),
    dateOfInspection: integer("dateOfInspection", {
      mode: "timestamp",
    }).notNull(),
    datePaid: integer("datePaid", {
      mode: "timestamp",
    }),
    totalFine: integer("totalFine").notNull(),
    fineStatus: text("fineStatus")
      .notNull()
      .default("unpaid")
      .$type<"paid" | "unpaid" | "partial" | "waived" | "under_review">(),
    ...timestamp,
  },
  (t) => [
    index("violation_student_name_idx").on(t.studentName),
    index("violation_fine_status_idx").on(t.fineStatus),
    index("violation_date_inspection_idx").on(t.dateOfInspection),
    index("violation_date_paid_idx").on(t.datePaid),
    index("violation_locker_id_idx").on(t.lockerId),
    index("violation_inspection_id_idx").on(t.inspectionId),
  ],
)

export const violationRelations = relations(violation, ({ one }) => ({
  locker: one(locker, {
    fields: [violation.lockerId],
    references: [locker.id],
  }),
  inspection: one(inspection, {
    fields: [violation.inspectionId],
    references: [inspection.id],
  }),
}))

export type Violation = InferSelectModel<typeof violation>
export type NewViolation = InferInsertModel<typeof violation>
