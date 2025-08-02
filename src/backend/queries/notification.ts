import { db } from "@/config/drizzle"
import { sql } from "drizzle-orm"
import { notification } from "../db/schemas"

export const insertNotificationQuery = db
  .insert(notification)
  .values({
    type: sql`${sql.placeholder("type")}`,
    requestId: sql`${sql.placeholder("requestId")}`,
    title: sql`${sql.placeholder("title")}`,
    description: sql`${sql.placeholder("description")}`,
    status: sql`${sql.placeholder("status")}`,
    action: sql`${sql.placeholder("action")}`,
    actor: sql`${sql.placeholder("actor")}`,
    recipientId: sql`${sql.placeholder("recipientId")}`,
    details: sql`${sql.placeholder("details")}`,
  })
  .prepare()
