import { locker } from "@/backend/db/schemas"
import { db } from "@/config/drizzle"
import { sql } from "drizzle-orm"

const createLockerQuery = db
  .insert(locker)
  .values({
    id: sql.placeholder("id"),
    lockerStatus: sql.placeholder("lockerStatus"),
    lockerType: sql.placeholder("lockerType"),
    lockerName: sql.placeholder("lockerName"),
    lockerLocation: sql.placeholder("lockerLocation"),
    lockerRentalPrice: sql.placeholder("lockerRentalPrice"),
  })
  .prepare()

const getLockerByIdQuery = db
  .select({
    id: locker.id,
    lockerStatus: locker.lockerStatus,
    lockerType: locker.lockerType,
    lockerName: locker.lockerName,
    lockerLocation: locker.lockerLocation,
    lockerRentalPrice: sql<number>`${locker.lockerRentalPrice}`,
  })
  .from(locker)
  .where(sql`${locker.id} = ${sql.placeholder("id")}`)
  .prepare()

const getLockerByNameQuery = db
  .select()
  .from(locker)
  .where(sql`${locker.lockerName} = ${sql.placeholder("name")}`)
  .prepare()

const getAllLockersQuery = db.select().from(locker).prepare()

const updateLockerStatusQuery = db
  .update(locker)
  .set({ lockerStatus: sql`${sql.placeholder("status")}` })
  .where(sql`${locker.id} = ${sql.placeholder("id")}`)
  .prepare()

const deleteLockerQuery = db
  .delete(locker)
  .where(sql`${locker.id} = ${sql.placeholder("id")}`)
  .prepare()

const getPaginatedLockersQuery = db
  .select()
  .from(locker)
  .limit(sql.placeholder("limit"))
  .offset(sql.placeholder("offset"))
  .prepare()

const countLockersQuery = db
  .select({ count: sql<number>`count(*)` })
  .from(locker)
  .prepare()

export {
  createLockerQuery,
  getLockerByIdQuery,
  getLockerByNameQuery,
  getAllLockersQuery,
  updateLockerStatusQuery,
  deleteLockerQuery,
  getPaginatedLockersQuery,
  countLockersQuery,
}
