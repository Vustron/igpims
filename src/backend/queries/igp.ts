import { db } from "@/config/drizzle"
import { eq, sql } from "drizzle-orm"
import { igp, igpSupply, igpTransactions, user } from "../db/schemas"

const insertIgpQuery = db
  .insert(igp)
  .values({
    id: sql`${sql.placeholder("id")}`,
    igpName: sql`${sql.placeholder("igpName")}`,
    igpDescription: sql`${sql.placeholder("igpDescription")}`,
    igpType: sql`${sql.placeholder("igpType")}`,
    iconType: sql`${sql.placeholder("iconType")}`,
    semesterAndAcademicYear: sql`${sql.placeholder("semesterAndAcademicYear")}`,
    totalSold: sql`${sql.placeholder("totalSold")}`,
    igpRevenue: sql`${sql.placeholder("igpRevenue")}`,
    igpStartDate: sql`${sql.placeholder("igpStartDate")}`,
    igpEndDate: sql`${sql.placeholder("igpEndDate")}`,
    requestDate: sql`${sql.placeholder("requestDate")}`,
    igpDateNeeded: sql`${sql.placeholder("igpDateNeeded")}`,
    itemsToSell: sql`${sql.placeholder("itemsToSell")}`,
    assignedOfficers: sql`${sql.placeholder("assignedOfficers")}`,
    costPerItem: sql`${sql.placeholder("costPerItem")}`,
    projectLead: sql`${sql.placeholder("projectLead")}`,
    position: sql`${sql.placeholder("position")}`,
  })
  .returning()
  .prepare()

const findIgpByIdQuery = db
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
    costPerItem: igp.costPerItem,
    projectLead: igp.projectLead,
    position: igp.position,
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
    transactions: sql<
      Array<{
        id: string
        igpId: string
        purchaserName: string
        courseAndSet: string
        batch: number
        quantity: number
        dateBought: number
        itemReceived: "pending" | "received" | "cancelled"
        createdAt: number
        updatedAt: number
      }>
    >`
      (SELECT json_group_array(
        json_object(
          'id', ${igpTransactions.id},
          'igpId', ${igpTransactions.igpId},
          'purchaserName', ${igpTransactions.purchaserName},
          'courseAndSet', ${igpTransactions.courseAndSet},
          'batch', ${igpTransactions.batch},
          'quantity', ${igpTransactions.quantity},
          'dateBought', ${igpTransactions.dateBought},
          'itemReceived', ${igpTransactions.itemReceived},
          'createdAt', ${igpTransactions.createdAt},
          'updatedAt', ${igpTransactions.updatedAt}
        )
      ) FROM ${igpTransactions} 
      WHERE ${igpTransactions.igpId} = ${igp.id})`.as("transactions"),
    supplies: sql<
      Array<{
        id: string
        igpId: string
        supplyDate: number
        quantitySold: number
        unitPrice: number
        totalRevenue: number
        createdAt: number
        updatedAt: number
      }>
    >`
      (SELECT json_group_array(
        json_object(
          'id', ${igpSupply.id},
          'igpId', ${igpSupply.igpId},
          'supplyDate', ${igpSupply.supplyDate},
          'quantitySold', ${igpSupply.quantitySold},
          'unitPrice', ${igpSupply.unitPrice},
          'totalRevenue', ${igpSupply.totalRevenue},
          'createdAt', ${igpSupply.createdAt},
          'updatedAt', ${igpSupply.updatedAt}
        )
      ) FROM ${igpSupply} 
      WHERE ${igpSupply.igpId} = ${igp.id})`.as("supplies"),
  })
  .from(igp)
  .leftJoin(user, eq(igp.projectLead, user.id))
  .where(eq(igp.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

const updateIgpQuery = db
  .update(igp)
  .set({
    igpName: sql`${sql.placeholder("igpName")}`,
    igpDescription: sql`${sql.placeholder("igpDescription")}`,
    igpType: sql`${sql.placeholder("igpType")}`,
    iconType: sql`${sql.placeholder("iconType")}`,
    semesterAndAcademicYear: sql`${sql.placeholder("semesterAndAcademicYear")}`,
    totalSold: sql`${sql.placeholder("totalSold")}`,
    igpRevenue: sql`${sql.placeholder("igpRevenue")}`,
    igpStartDate: sql`${sql.placeholder("igpStartDate")}`,
    igpEndDate: sql`${sql.placeholder("igpEndDate")}`,
    itemsToSell: sql`${sql.placeholder("itemsToSell")}`,
    assignedOfficers: sql`${sql.placeholder("assignedOfficers")}`,
    costPerItem: sql`${sql.placeholder("costPerItem")}`,
    projectLead: sql`${sql.placeholder("projectLead")}`,
    position: sql`${sql.placeholder("position")}`,
    status: sql`${sql.placeholder("status")}`,
    currentStep: sql`${sql.placeholder("currentStep")}`,
    requestDate: sql`${sql.placeholder("requestDate")}`,
    igpDateNeeded: sql`${sql.placeholder("igpDateNeeded")}`,
    isRejected: sql`${sql.placeholder("isRejected")}`,
    rejectionStep: sql`${sql.placeholder("rejectionStep")}`,
    rejectionReason: sql`${sql.placeholder("rejectionReason")}`,
    notes: sql`${sql.placeholder("notes")}`,
    reviewerComments: sql`${sql.placeholder("reviewerComments")}`,
    projectDocument: sql`${sql.placeholder("projectDocument")}`,
    resolutionDocument: sql`${sql.placeholder("resolutionDocument")}`,
    submissionDate: sql`${sql.placeholder("submissionDate")}`,
    approvalDate: sql`${sql.placeholder("approvalDate")}`,
  })
  .where(eq(igp.id, sql.placeholder("id")))
  .returning()
  .prepare()

export { insertIgpQuery, findIgpByIdQuery, updateIgpQuery }
