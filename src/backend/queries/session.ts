import { session } from "@/backend/db/schemas"
import { db } from "@/config/drizzle"
import { eq, inArray, sql } from "drizzle-orm"

const findBySessionIdQuery = db
  .select()
  .from(session)
  .where(eq(session.id, sql.placeholder("sessionId")))
  .prepare()

const deleteBySessionIdQuery = db
  .delete(session)
  .where(eq(session.id, sql.placeholder("sessionId")))
  .returning()
  .prepare()

const deleteByUserIdQuery = db
  .delete(session)
  .where(eq(session.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const deleteByArrayUserIdsQuery = db
  .delete(session)
  .where(inArray(session.userId, sql.placeholder("userIds")))
  .returning()
  .prepare()

const insertSessionQuery = db
  .insert(session)
  .values({
    id: sql.placeholder("id"),
    userId: sql.placeholder("userId"),
    token: sql.placeholder("token"),
    expiresAt: sql.placeholder("expiresAt"),
    ipAddress: sql.placeholder("ipAddress"),
    userAgent: sql.placeholder("userAgent"),
    userRole: sql.placeholder("userRole"),
  })
  .returning()
  .prepare()

export {
  findBySessionIdQuery,
  deleteByUserIdQuery,
  deleteByArrayUserIdsQuery,
  insertSessionQuery,
  deleteBySessionIdQuery,
}
