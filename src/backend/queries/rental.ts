import { lockerRental } from "@/schemas/drizzle-schema"
import { db } from "@/config/drizzle"
import { sql } from "drizzle-orm"

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

const createRentalQuery = db
  .insert(lockerRental)
  .values({
    id: sql.placeholder("id"),
    lockerId: sql`${sql.placeholder("lockerId")}`,
    renterId: sql`${sql.placeholder("studentId")}`,
    renterName: sql`${sql.placeholder("studentName")}`,
    courseAndSet: sql`${sql.placeholder("courseAndSet")}`,
    rentalStatus: sql`${sql.placeholder("rentalStatus")}`,
    paymentStatus: sql`${sql.placeholder("paymentStatus")}`,
    dateRented: sql`${sql.placeholder("dateRented")}`,
    dateDue: sql`${sql.placeholder("dateDue")}`,
  })
  .prepare()

const updateRentalQuery = db
  .update(lockerRental)
  .set({
    renterId: sql`${sql.placeholder("studentId")}`,
    renterName: sql`${sql.placeholder("studentName")}`,
    courseAndSet: sql`${sql.placeholder("courseAndSet")}`,
    dateRented: sql`${sql.placeholder("dateRented")}`,
    dateDue: sql`${sql.placeholder("dateDue")}`,
    paymentStatus: sql`${sql.placeholder("paymentStatus")}`,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  })
  .where(sql`${lockerRental.id} = ${sql.placeholder("id")}`)
  .prepare()

const deleteRentalQuery = db
  .delete(lockerRental)
  .where(sql`${lockerRental.id} = ${sql.placeholder("id")}`)
  .prepare()

export {
  getRentalByIdQuery,
  getRentalByLockerIdQuery,
  getRentalsByLockerIdQuery,
  createRentalQuery,
  updateRentalQuery,
  deleteRentalQuery,
}
