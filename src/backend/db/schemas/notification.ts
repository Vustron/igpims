import { timestamp } from "@/backend/helpers/schema-helpers"
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm"
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { nanoid } from "nanoid"
import { user } from "./user"

export const notification = sqliteTable(
  "notification",
  {
    id: text("id", { length: 15 })
      .primaryKey()
      .$defaultFn(() => nanoid(15)),
    type: text("type", { length: 20 })
      .notNull()
      .$type<"fund_request" | "project_request" | "igp">(),
    requestId: text("requestId", { length: 15 }).notNull(),
    title: text("title", { length: 255 }).notNull(),
    description: text("description", { length: 1000 }).notNull(),
    status: text("status", { length: 10 })
      .notNull()
      .default("unread")
      .$type<"unread" | "read">(),
    action: text("action", { length: 20 })
      .notNull()
      .$type<
        | "created"
        | "updated"
        | "submitted"
        | "reviewed"
        | "approved"
        | "rejected"
        | "checked"
        | "disbursed"
        | "received"
        | "receipted"
        | "validated"
        | "resolution_created"
      >(),
    actor: text("actor", { length: 15 }).references(() => user.id, {
      onDelete: "set null",
    }),
    recipientId: text("recipientId", { length: 15 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    details: text("details", { length: 1000 }),
    ...timestamp,
  },
  (t) => [
    index("notification_type_idx").on(t.type),
    index("notification_status_idx").on(t.status),
    index("notification_recipient_idx").on(t.recipientId),
    index("notification_actor_idx").on(t.actor),
  ],
)

export const notificationRelations = relations(notification, ({ one }) => ({
  actor: one(user, {
    fields: [notification.actor],
    references: [user.id],
    relationName: "actorNotifications",
  }),
  recipient: one(user, {
    fields: [notification.recipientId],
    references: [user.id],
    relationName: "receivedNotifications",
  }),
}))

export type Notification = InferSelectModel<typeof notification>
export type NewNotification = InferInsertModel<typeof notification>
export type NotificationType = "fund_request" | "project_request" | "igp"
export type NotificationStatus = "unread" | "read"
export type NotificationAction =
  | "created"
  | "updated"
  | "submitted"
  | "reviewed"
  | "approved"
  | "rejected"
  | "checked"
  | "disbursed"
  | "received"
  | "receipted"
  | "validated"
  | "resolution_created"
