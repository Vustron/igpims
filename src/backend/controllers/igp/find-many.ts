import { igp, user } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { and, eq, like, or, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function findManyIgp(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page")) || 1
    const limit = Number(url.searchParams.get("limit")) || 10
    const offset = (page - 1) * limit
    const search = url.searchParams.get("search") || ""
    const igpType = url.searchParams.get("type") || undefined
    const semester = url.searchParams.get("semester") || undefined
    const startDate = url.searchParams.get("startDate") || undefined
    const endDate = url.searchParams.get("endDate") || undefined
    const status = url.searchParams.get("status") || undefined

    const whereConditions: any[] = []

    if (search) {
      whereConditions.push(
        or(
          like(igp.id, `%${search}%`),
          like(igp.igpName, `%${search}%`),
          like(user.name, `%${search}%`),
        ),
      )
    }

    if (igpType) {
      whereConditions.push(
        eq(igp.igpType, igpType as "permanent" | "temporary" | "maintenance"),
      )
    }

    if (semester) {
      whereConditions.push(like(igp.semesterAndAcademicYear, `%${semester}%`))
    }

    if (startDate) {
      const startDateObj = new Date(startDate)
      startDateObj.setUTCHours(0, 0, 0, 0)
      whereConditions.push(
        sql`${igp.igpStartDate} >= ${Math.floor(startDateObj.getTime())}`,
      )
    }

    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setUTCHours(23, 59, 59, 999)
      whereConditions.push(
        sql`${igp.igpStartDate} <= ${Math.floor(endDateObj.getTime())}`,
      )
    }

    if (status) {
      whereConditions.push(
        eq(
          igp.status,
          status as
            | "pending"
            | "in_review"
            | "checking"
            | "approved"
            | "in_progress"
            | "completed"
            | "rejected",
        ),
      )
    }

    const query = db
      .select({
        id: igp.id,
        igpName: igp.igpName,
        igpDescription: igp.igpDescription,
        igpType: igp.igpType,
        iconType: igp.iconType,
        semesterAndAcademicYear: igp.semesterAndAcademicYear,
        totalSold: igp.totalSold,
        igpRevenue: igp.igpRevenue,
        igpStartDate: sql<number>`${igp.igpStartDate}`,
        igpEndDate: sql<number>`${igp.igpEndDate}`,
        igpDateNeeded: sql<number>`${igp.igpDateNeeded}`,
        itemsToSell: igp.itemsToSell,
        assignedOfficers: igp.assignedOfficers,
        estimatedQuantities: igp.estimatedQuantities,
        budget: igp.budget,
        costPerItem: igp.costPerItem,
        projectLead: igp.projectLead,
        department: igp.department,
        position: igp.position,
        typeOfTransaction: igp.typeOfTransaction,
        // Add status-related fields
        status: igp.status,
        currentStep: igp.currentStep,
        requestDate: sql<number>`${igp.requestDate}`,
        dateNeeded: sql<number>`${igp.dateNeeded}`,
        isRejected: igp.isRejected,
        rejectionStep: igp.rejectionStep,
        rejectionReason: igp.rejectionReason,
        notes: igp.notes,
        reviewerComments: igp.reviewerComments,
        projectDocument: igp.projectDocument,
        resolutionDocument: igp.resolutionDocument,
        submissionDate: sql<number>`${igp.submissionDate}`,
        approvalDate: sql<number>`${igp.approvalDate}`,
        createdAt: sql<number>`${igp.createdAt}`,
        updatedAt: sql<number>`${igp.updatedAt}`,
        projectLeadData: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        },
      })
      .from(igp)
      .leftJoin(user, eq(igp.projectLead, user.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

    const igpData = await query
      .orderBy(sql`${igp.igpStartDate} DESC`)
      .limit(limit)
      .offset(offset)

    const countWhereConditions: any[] = []

    if (search) {
      countWhereConditions.push(
        or(
          like(igp.id, `%${search}%`),
          like(igp.igpName, `%${search}%`),
          like(user.name, `%${search}%`),
        ),
      )
    }

    if (igpType) {
      countWhereConditions.push(
        eq(igp.igpType, igpType as "permanent" | "temporary" | "maintenance"),
      )
    }

    if (semester) {
      countWhereConditions.push(
        like(igp.semesterAndAcademicYear, `%${semester}%`),
      )
    }

    if (startDate) {
      const startDateObj = new Date(startDate)
      startDateObj.setUTCHours(0, 0, 0, 0)
      countWhereConditions.push(
        sql`${igp.igpStartDate} >= ${Math.floor(startDateObj.getTime())}`,
      )
    }

    if (endDate) {
      const endDateObj = new Date(endDate)
      endDateObj.setUTCHours(23, 59, 59, 999)
      countWhereConditions.push(
        sql`${igp.igpStartDate} <= ${Math.floor(endDateObj.getTime())}`,
      )
    }

    if (status) {
      countWhereConditions.push(
        eq(
          igp.status,
          status as
            | "pending"
            | "in_review"
            | "checking"
            | "approved"
            | "in_progress"
            | "completed"
            | "rejected",
        ),
      )
    }

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(igp)
      .leftJoin(user, eq(igp.projectLead, user.id))
      .where(
        countWhereConditions.length > 0
          ? and(...countWhereConditions)
          : undefined,
      )

    const countResult = await countQuery
    const totalItems = countResult[0]?.count || 0
    const totalPages = Math.ceil(totalItems / limit)

    return NextResponse.json(
      {
        data: igpData,
        meta: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
