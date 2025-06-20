import { eq, like, and, or, between, sql } from "drizzle-orm"
import { violation } from "@/backend/db/schemas"
import { db } from "@/config/drizzle"

const findViolationByIdQuery = db
  .select({
    id: violation.id,
    studentId: violation.studentId,
    studentName: violation.studentName,
    violations: violation.violations,
    violationType: violation.violationType,
    dateOfInspection: violation.dateOfInspection,
    dateReported: violation.dateReported,
    totalFine: violation.totalFine,
    amountPaid: violation.amountPaid,
    fineStatus: violation.fineStatus,
    lockerId: violation.lockerId,
    description: violation.description,
    reportedBy: violation.reportedBy,
    evidence: violation.evidence,
    resolutionNotes: violation.resolutionNotes,
  })
  .from(violation)
  .where(eq(violation.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

const findManyViolationsQuery = db
  .select({
    id: violation.id,
    studentId: violation.studentId,
    studentName: violation.studentName,
    violations: violation.violations,
    violationType: violation.violationType,
    dateOfInspection: violation.dateOfInspection,
    dateReported: violation.dateReported,
    totalFine: violation.totalFine,
    amountPaid: violation.amountPaid,
    fineStatus: violation.fineStatus,
    lockerId: violation.lockerId,
    description: violation.description,
    reportedBy: violation.reportedBy,
    evidence: violation.evidence,
    resolutionNotes: violation.resolutionNotes,
  })
  .from(violation)
  .where(
    and(
      sql.placeholder("search")
        ? or(
            like(violation.studentName, sql.placeholder("search")),
            like(violation.studentId, sql.placeholder("search")),
            like(violation.violations, sql.placeholder("search")),
          )
        : undefined,
      sql.placeholder("violationType")
        ? eq(violation.violationType, sql.placeholder("violationType"))
        : undefined,
      sql.placeholder("fineStatus")
        ? eq(violation.fineStatus, sql.placeholder("fineStatus"))
        : undefined,
      sql.placeholder("fromDate") && sql.placeholder("toDate")
        ? between(
            violation.dateReported,
            sql.placeholder("fromDate"),
            sql.placeholder("toDate"),
          )
        : undefined,
    ),
  )
  .orderBy(violation.dateReported)
  .limit(sql.placeholder("limit"))
  .offset(sql.placeholder("offset"))
  .prepare()

const insertViolationQuery = db
  .insert(violation)
  .values({
    studentId: sql.placeholder("studentId"),
    studentName: sql.placeholder("studentName"),
    violations: sql.placeholder("violations"),
    violationType: sql.placeholder("violationType"),
    dateOfInspection: sql.placeholder("dateOfInspection"),
    dateReported: sql.placeholder("dateReported"),
    totalFine: sql.placeholder("totalFine"),
    amountPaid: sql.placeholder("amountPaid"),
    fineStatus: sql.placeholder("fineStatus"),
    lockerId: sql.placeholder("lockerId"),
    description: sql.placeholder("description"),
    reportedBy: sql.placeholder("reportedBy"),
    evidence: sql.placeholder("evidence"),
    resolutionNotes: sql.placeholder("resolutionNotes"),
  })
  .returning()
  .prepare()

const updateViolationQuery = db
  .update(violation)
  .set({
    studentId: sql`${sql.placeholder("studentId")}`,
    studentName: sql`${sql.placeholder("studentName")}`,
    violations: sql`${sql.placeholder("violations")}`,
    violationType: sql`${sql.placeholder("violationType")}`,
    dateOfInspection: sql`${sql.placeholder("dateOfInspection")}`,
    dateReported: sql`${sql.placeholder("dateReported")}`,
    totalFine: sql`${sql.placeholder("totalFine")}`,
    amountPaid: sql`${sql.placeholder("amountPaid")}`,
    fineStatus: sql`${sql.placeholder("fineStatus")}`,
    lockerId: sql`${sql.placeholder("lockerId")}`,
    description: sql`${sql.placeholder("description")}`,
    reportedBy: sql`${sql.placeholder("reportedBy")}`,
    evidence: sql`${sql.placeholder("evidence")}`,
    resolutionNotes: sql`${sql.placeholder("resolutionNotes")}`,
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
  findManyViolationsQuery,
  insertViolationQuery,
  updateViolationQuery,
  deleteViolationQuery,
}
