import { eq, sql } from "drizzle-orm"
import { violation } from "@/backend/db/schemas"
import { db } from "@/config/drizzle"

const findViolationByIdQuery = db
  .select({
    id: violation.id,
    lockerId: violation.lockerId,
    inspectionId: violation.inspectionId,
    studentName: violation.studentName,
    violations: violation.violations,
    dateOfInspection: violation.dateOfInspection,
    datePaid: violation.datePaid,
    totalFine: violation.totalFine,
    fineStatus: violation.fineStatus,
    createdAt: violation.createdAt,
    updatedAt: violation.updatedAt,
  })
  .from(violation)
  .where(eq(violation.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

const insertViolationQuery = db
  .insert(violation)
  .values({
    id: sql`${sql.placeholder("id")}`,
    lockerId: sql`${sql.placeholder("lockerId")}`,
    inspectionId: sql`${sql.placeholder("inspectionId")}`,
    studentName: sql`${sql.placeholder("studentName")}`,
    violations: sql`${sql.placeholder("violations")}`,
    dateOfInspection: sql`${sql.placeholder("dateOfInspection")}`,
    datePaid: sql`${sql.placeholder("datePaid")}`,
    totalFine: sql`${sql.placeholder("totalFine")}`,
    fineStatus: sql`${sql.placeholder("fineStatus")}`,
  })
  .returning()
  .prepare()

const updateViolationQuery = db
  .update(violation)
  .set({
    lockerId: sql`${sql.placeholder("lockerId")}`,
    inspectionId: sql`${sql.placeholder("inspectionId")}`,
    studentName: sql`${sql.placeholder("studentName")}`,
    violations: sql`${sql.placeholder("violations")}`,
    dateOfInspection: sql`${sql.placeholder("dateOfInspection")}`,
    datePaid: sql`${sql.placeholder("datePaid")}`,
    totalFine: sql`${sql.placeholder("totalFine")}`,
    fineStatus: sql`${sql.placeholder("fineStatus")}`,
  })
  .where(eq(violation.id, sql.placeholder("id")))
  .returning()
  .prepare()

const deleteViolationQuery = db
  .delete(violation)
  .where(eq(violation.id, sql.placeholder("id")))
  .returning()
  .prepare()

export {
  findViolationByIdQuery,
  insertViolationQuery,
  updateViolationQuery,
  deleteViolationQuery,
}
