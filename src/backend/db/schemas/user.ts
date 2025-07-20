import { timestamp } from "@/backend/helpers/schema-helpers"
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { account } from "./account"
import { fundRequest } from "./fund_request"
import { igp } from "./igp"
import { projectRequest } from "./project_request"
import { session } from "./session"

export const user = sqliteTable(
  "user",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    name: text("name", { length: 255 }).notNull(),
    email: text("email", { length: 100 }).notNull().unique(),
    emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
    sessionExpired: integer("sessionExpired", { mode: "boolean" }).notNull(),
    role: text("role", {
      enum: [
        "admin",
        "user",
        "ssc_president",
        "dpdm_secretary",
        "dpdm_officers",
        "ssc_treasurer",
        "ssc_auditor",
        "chief_legislator",
        "legislative_secretary",
        "ssc_officer",
        "student",
      ],
    })
      .notNull()
      .default("user"),
    image: text("image"),
    ...timestamp,
  },
  (t) => [index("user_role_idx").on(t.id)],
)

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  requestedFunds: many(fundRequest, { relationName: "requestedFunds" }),
  approvedFunds: many(fundRequest, { relationName: "approvedFunds" }),
  submittedProjects: many(projectRequest, {
    relationName: "submittedProjects",
  }),
  approvedProjects: many(projectRequest, { relationName: "approvedProjects" }),
  ledIgpProjects: many(igp, { relationName: "ledIgpProjects" }),
}))

export type User = InferSelectModel<typeof user>
export type NewUser = InferInsertModel<typeof user>
