import { text, index, integer, sqliteTable } from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

import { locker } from "./locker"
import { user } from "./user"

import type { InferSelectModel } from "drizzle-orm"

export const violation = sqliteTable(
  "violation",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    studentId: text("studentId").notNull(),
    studentName: text("studentName", { length: 255 }).notNull(),
    violations: text("violations", { length: 1000 }).notNull(),
    violationType: text("violationType", { length: 20 })
      .notNull()
      .$type<
        | "lost_key"
        | "damaged_locker"
        | "unauthorized_use"
        | "prohibited_items"
        | "late_renewal"
        | "abandoned_items"
        | "other"
      >(),
    dateOfInspection: integer("dateOfInspection", {
      mode: "timestamp",
    }).notNull(),
    dateReported: integer("dateReported", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    totalFine: integer("totalFine").notNull(),
    amountPaid: integer("amountPaid").default(0),
    fineStatus: text("fineStatus", { length: 20 })
      .notNull()
      .default("unpaid")
      .$type<"paid" | "unpaid" | "partial" | "waived" | "under_review">(),
    lockerId: text("lockerId")
      .notNull()
      .references(() => locker.id, { onDelete: "restrict" }),
    description: text("description", { length: 1000 }),
    reportedBy: text("reportedBy")
      .notNull()
      .references(() => user.id, { onDelete: "set null" }),
    evidence: text("evidence", { length: 1000 }),
    resolutionNotes: text("resolutionNotes", { length: 1000 }),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => [
    index("violation_student_id_idx").on(t.studentId),
    index("violation_type_idx").on(t.violationType),
    index("violation_locker_id_idx").on(t.lockerId),
    index("violation_fine_status_idx").on(t.fineStatus),
    index("violation_reported_by_idx").on(t.reportedBy),
    index("violation_date_reported_idx").on(t.dateReported),
  ],
)

export const violationRelations = relations(violation, ({ one }) => ({
  reporter: one(user, {
    fields: [violation.reportedBy],
    references: [user.id],
  }),
  locker: one(locker, {
    fields: [violation.lockerId],
    references: [locker.id],
  }),
}))

export type Violation = InferSelectModel<typeof violation>
