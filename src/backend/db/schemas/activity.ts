import { timestamp } from "@/backend/helpers/schema-helpers"
import { InferSelectModel, relations } from "drizzle-orm"
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { user } from "./user"

export const activity = sqliteTable(
  "activity",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    action: text("description", { length: 1000 }).notNull(),
    ...timestamp,
  },
  (t) => [index("activity_userId_idx").on(t.userId)],
)

export const activityRelations = relations(activity, ({ one }) => ({
  user: one(user, {
    fields: [activity.userId],
    references: [user.id],
  }),
}))

export type Activity = InferSelectModel<typeof activity>
