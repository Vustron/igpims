import { db } from "@/config/drizzle"
import { sql } from "drizzle-orm"
import { activity } from "../db/schemas"

export const insertActivityQuery = db
  .insert(activity)
  .values({
    id: sql`${sql.placeholder("id")}`,
    userId: sql`${sql.placeholder("userId")}`,
    action: sql`${sql.placeholder("action")}`,
  })
  .prepare()
