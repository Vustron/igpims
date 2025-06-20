import { text, index, integer, sqliteTable } from "drizzle-orm/sqlite-core"
import { relations, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

import { projectRequest } from "./project_request"
import { fundRequest } from "./fund_request"
import { session } from "./session"
import { account } from "./account"

import type { InferSelectModel } from "drizzle-orm"

export const UserRole = {
  ADMIN: "admin",
  USER: "user",
} as const

export const user = sqliteTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
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
        "ssc_secretary",
        "student",
      ],
    })
      .notNull()
      .default("user"),
    image: text("image"),
    createdAt: integer("createdAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer("updatedAt", { mode: "timestamp" })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
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
}))

export type User = InferSelectModel<typeof user>
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole]
