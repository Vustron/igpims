import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { timestamp } from "@/backend/helpers/schema-helpers"
import { user } from "./user"

export const projectRequest = sqliteTable(
  "projectRequest",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    projectLead: text("projectLead", { length: 255 }).notNull(),
    projectTitle: text("projectTitle", { length: 500 }).notNull(),
    dateSubmitted: integer("dateSubmitted", { mode: "timestamp" }).notNull(),
    status: text("status", { length: 20 })
      .notNull()
      .default("pending")
      .$type<
        | "pending"
        | "approved"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "rejected"
      >(),
    description: text("description", { length: 2000 }),
    submittedBy: text("submittedBy").references(() => user.id, {
      onDelete: "set null",
    }),
    approvedBy: text("approvedBy").references(() => user.id, {
      onDelete: "set null",
    }),
    ...timestamp,
  },
  (t) => [
    index("projectRequest_status_idx").on(t.status),
    index("projectRequest_lead_idx").on(t.projectLead),
    index("projectRequest_date_idx").on(t.dateSubmitted),
    index("projectRequest_submitted_by_idx").on(t.submittedBy),
  ],
)

export const projectRequestRelations = relations(projectRequest, ({ one }) => ({
  submitter: one(user, {
    fields: [projectRequest.submittedBy],
    references: [user.id],
    relationName: "submittedProjects",
  }),
  approver: one(user, {
    fields: [projectRequest.approvedBy],
    references: [user.id],
    relationName: "approvedProjects",
  }),
}))

export type ProjectRequest = InferSelectModel<typeof projectRequest>
export type NewProjectRequest = InferInsertModel<typeof projectRequest>
