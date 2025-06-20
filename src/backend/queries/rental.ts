import { locker, lockerRental } from "@/backend/db/schemas"
import { db } from "@/config/drizzle"
import { sql, eq } from "drizzle-orm"

const getRentalByIdQuery = db
  .select()
  .from(lockerRental)
  .where(sql`${lockerRental.id} = ${sql.placeholder("id")}`)
  .prepare()

const getRentalByLockerIdQuery = db
  .select()
  .from(lockerRental)
  .where(sql`${lockerRental.lockerId} = ${sql.placeholder("lockerId")}`)
  .prepare()

const getRentalsByLockerIdQuery = db
  .select()
  .from(lockerRental)
  .where(sql`${lockerRental.lockerId} = ${sql.placeholder("lockerId")}`)
  .orderBy(sql`${lockerRental.createdAt} DESC`)
  .prepare()

export const getLockerByRentalIdQuery = db
  .select({
    id: locker.id,
    lockerName: locker.lockerName,
    lockerLocation: locker.lockerLocation,
    lockerStatus: locker.lockerStatus,
    lockerType: locker.lockerType,
    lockerRentalPrice: locker.lockerRentalPrice,
    createdAt: locker.createdAt,
    updatedAt: locker.updatedAt,
  })
  .from(lockerRental)
  .innerJoin(locker, eq(lockerRental.lockerId, locker.id))
  .where(eq(lockerRental.id, sql.placeholder("id")))
  .prepare()

const createRentalQuery = db
  .insert(lockerRental)
  .values({
    id: sql.placeholder("id"),
    lockerId: sql`${sql.placeholder("lockerId")}`,
    renterId: sql`${sql.placeholder("renterId")}`,
    renterName: sql`${sql.placeholder("renterName")}`,
    courseAndSet: sql`${sql.placeholder("courseAndSet")}`,
    rentalStatus: sql`${sql.placeholder("rentalStatus")}`,
    renterEmail: sql`${sql.placeholder("renterEmail")}`,
    paymentStatus: sql`${sql.placeholder("paymentStatus")}`,
    dateRented: sql`${sql.placeholder("dateRented")}`,
    dateDue: sql`${sql.placeholder("dateDue")}`,
    createdAt: sql`CURRENT_TIMESTAMP`,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  })
  .prepare()

const updateRentalQuery = db
  .update(lockerRental)
  .set({
    renterId: sql`${sql.placeholder("renterId")}`,
    renterName: sql`${sql.placeholder("renterName")}`,
    courseAndSet: sql`${sql.placeholder("courseAndSet")}`,
    rentalStatus: sql`${sql.placeholder("rentalStatus")}`,
    renterEmail: sql`${sql.placeholder("renterEmail")}`,
    paymentStatus: sql`${sql.placeholder("paymentStatus")}`,
    dateRented: sql`${sql.placeholder("dateRented")}`,
    dateDue: sql`${sql.placeholder("dateDue")}`,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  })
  .where(sql`${lockerRental.id} = ${sql.placeholder("id")}`)
  .prepare()

const deleteRentalQuery = db
  .delete(lockerRental)
  .where(sql`${lockerRental.id} = ${sql.placeholder("id")}`)
  .prepare()

const findManyRentalsQuery = db
  .select()
  .from(lockerRental)
  .orderBy(sql`${lockerRental.createdAt} DESC`)
  .limit(sql.placeholder("limit"))
  .offset(sql.placeholder("offset"))
  .prepare()

const countRentalsQuery = db
  .select({ count: sql<number>`count(*)` })
  .from(lockerRental)
  .prepare()

export {
  getRentalByIdQuery,
  getRentalByLockerIdQuery,
  getRentalsByLockerIdQuery,
  createRentalQuery,
  updateRentalQuery,
  deleteRentalQuery,
  findManyRentalsQuery,
  countRentalsQuery,
}
