import { eq, sql } from "drizzle-orm"
import { inspection, violation } from "@/backend/db/schemas"
import { db } from "@/config/drizzle"

const findInspectionByIdQuery = db
  .select({
    id: inspection.id,
    dateOfInspection: inspection.dateOfInspection,
    dateSet: inspection.dateSet,
    violators: inspection.violators,
    totalFines: inspection.totalFines,
    createdAt: inspection.createdAt,
    updatedAt: inspection.updatedAt,
    violatorDetails: sql<string>`(
      SELECT json_group_array(
        json_object(
          'id', ${violation.id},
          'name', ${violation.studentName}
        )
      )
      FROM ${violation}
      WHERE json_each(${inspection.violators}) LIKE '%' || ${violation.id} || '%'
      AND ${inspection.id} = ${sql.placeholder("id")}
    )`.as("violator_details"),
  })
  .from(inspection)
  .where(eq(inspection.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

const insertInspectionQuery = db
  .insert(inspection)
  .values({
    id: sql.placeholder("id"),
    dateOfInspection: sql.placeholder("dateOfInspection"),
    dateSet: sql.placeholder("dateSet"),
    violators: sql.placeholder("violators"),
    totalFines: sql.placeholder("totalFines"),
    createdAt: sql`CURRENT_TIMESTAMP`,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  })
  .returning()
  .prepare()

const updateInspectionQuery = db
  .update(inspection)
  .set({
    dateOfInspection: sql`${sql.placeholder("dateOfInspection")}`,
    dateSet: sql`${sql.placeholder("dateSet")}`,
    violators: sql`${sql.placeholder("violators")}`,
    totalFines: sql`${sql.placeholder("totalFines")}`,
    updatedAt: sql`CURRENT_TIMESTAMP`,
  })
  .where(eq(inspection.id, sql.placeholder("id")))
  .returning()
  .prepare()

const deleteInspectionQuery = db
  .delete(inspection)
  .where(eq(inspection.id, sql.placeholder("id")))
  .returning()
  .prepare()

const countInspectionsQuery = db
  .select({ count: sql<number>`count(*)` })
  .from(inspection)
  .prepare()

export {
  findInspectionByIdQuery,
  insertInspectionQuery,
  updateInspectionQuery,
  deleteInspectionQuery,
  countInspectionsQuery,
}
