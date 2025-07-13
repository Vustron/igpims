import {
  expenseTransaction,
  fundRequest,
  locker,
  lockerRental,
  user,
  waterFunds,
} from "@/backend/db/schemas"
import { db } from "@/config/drizzle"
import { eq, sql } from "drizzle-orm"

const insertFundRequestQuery = db
  .insert(fundRequest)
  .values({
    id: sql`${sql.placeholder("id")}`,
    purpose: sql`${sql.placeholder("purpose")}`,
    amount: sql`${sql.placeholder("amount")}`,
    status: sql`${sql.placeholder("status")}`,
    currentStep: sql`${sql.placeholder("currentStep")}`,
    requestDate: sql`${sql.placeholder("requestDate")}`,
    dateNeeded: sql`${sql.placeholder("dateNeeded")}`,
    requestor: sql`${sql.placeholder("requestor")}`,
    requestorPosition: sql`${sql.placeholder("requestorPosition")}`,
    isRejected: sql`${sql.placeholder("isRejected")}`,
    rejectionStep: sql`${sql.placeholder("rejectionStep")}`,
  })
  .returning()
  .prepare()

const findFundRequestByIdQuery = db
  .select({
    id: fundRequest.id,
    purpose: fundRequest.purpose,
    amount: fundRequest.amount,
    utilizedFunds: fundRequest.utilizedFunds,
    allocatedFunds: fundRequest.allocatedFunds,
    status: fundRequest.status,
    currentStep: fundRequest.currentStep,
    requestor: fundRequest.requestor,
    requestorPosition: fundRequest.requestorPosition,
    requestDate: sql<number>`${fundRequest.requestDate}`,
    dateNeeded: sql<number>`${fundRequest.dateNeeded}`,
    isRejected: fundRequest.isRejected,
    rejectionStep: fundRequest.rejectionStep,
    rejectionReason: fundRequest.rejectionReason,
    notes: fundRequest.notes,
    reviewerComments: fundRequest.reviewerComments,
    disbursementDate: sql<number>`${fundRequest.disbursementDate}`,
    receiptDate: sql<number>`${fundRequest.receiptDate}`,
    validationDate: sql<number>`${fundRequest.validationDate}`,
    receipts: fundRequest.receipts,
    approvedBy: fundRequest.approvedBy,
    createdAt: sql<number>`${fundRequest.createdAt}`,
    updatedAt: sql<number>`${fundRequest.updatedAt}`,
    requestorData: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      emailVerified: user.emailVerified,
      sessionExpired: user.sessionExpired,
      createdAt: sql<number>`${user.createdAt}`,
      updatedAt: sql<number>`${user.updatedAt}`,
    },
    expenseTransactions: sql<
      Array<{
        id: string
        requestId: string
        expenseName: string
        amount: number
        date: number
        receipt: string | null
        status: "pending" | "validated" | "rejected"
        validatedBy: string | null
        validatedDate: number | null
        rejectionReason: string | null
        createdAt: number
        updatedAt: number
      }>
    >`
      (SELECT json_group_array(
        json_object(
          'id', ${expenseTransaction.id},
          'requestId', ${expenseTransaction.requestId},
          'expenseName', ${expenseTransaction.expenseName},
          'amount', ${expenseTransaction.amount},
          'date', ${expenseTransaction.date},
          'receipt', ${expenseTransaction.receipt},
          'status', ${expenseTransaction.status},
          'validatedBy', ${expenseTransaction.validatedBy},
          'validatedDate', ${expenseTransaction.validatedDate},
          'rejectionReason', ${expenseTransaction.rejectionReason},
          'createdAt', ${expenseTransaction.createdAt},
          'updatedAt', ${expenseTransaction.updatedAt}
        )
      ) FROM ${expenseTransaction} 
      WHERE ${expenseTransaction.requestId} = ${fundRequest.id})`.as(
      "expenseTransactions",
    ),
  })
  .from(fundRequest)
  .leftJoin(user, eq(fundRequest.requestor, user.id))
  .where(eq(fundRequest.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

export async function getTotalProfit() {
  const lockerRevenue = await db
    .select({
      totalLockerRevenue: sql<number>`
          COALESCE(SUM(${locker.lockerRentalPrice}), 0)`.as(
        "total_locker_revenue",
      ),
    })
    .from(lockerRental)
    .leftJoin(locker, sql`${lockerRental.lockerId} = ${locker.id}`)
    .where(sql`${lockerRental.paymentStatus} = 'paid'`)
    .execute()
    .then((res) => res[0]?.totalLockerRevenue ?? 0)

  const waterFundsData = await db
    .select({
      totalWaterRevenue: sql<number>`COALESCE(SUM(${waterFunds.waterFundsRevenue}), 0)`,
      totalWaterExpenses: sql<number>`COALESCE(SUM(${waterFunds.waterFundsExpenses}), 0)`,
      totalWaterProfit: sql<number>`COALESCE(SUM(${waterFunds.waterFundsProfit}), 0)`,
    })
    .from(waterFunds)
    .execute()
    .then(
      (res) =>
        res[0] ?? {
          totalWaterRevenue: 0,
          totalWaterExpenses: 0,
          totalWaterProfit: 0,
        },
    )

  const totalExpenses = await db
    .select({
      totalExpenseAmount: sql<number>`COALESCE(SUM(${expenseTransaction.amount}), 0)`,
    })
    .from(expenseTransaction)
    .execute()
    .then((res) => res[0]?.totalExpenseAmount ?? 0)

  const fundRequestsData = await db
    .select({
      totalAllocatedFunds: sql<number>`COALESCE(SUM(${fundRequest.allocatedFunds}), 0)`,
      totalUtilizedFunds: sql<number>`COALESCE(SUM(${fundRequest.utilizedFunds}), 0)`,
    })
    .from(fundRequest)
    .execute()
    .then(
      (res) =>
        res[0] ?? {
          totalAllocatedFunds: 0,
          totalUtilizedFunds: 0,
        },
    )

  const totalRevenue = lockerRevenue + (waterFundsData.totalWaterRevenue || 0)
  const totalExpenseAmount =
    (waterFundsData.totalWaterExpenses || 0) +
    (fundRequestsData.totalUtilizedFunds || 0)
  const netProfit = totalRevenue - totalExpenseAmount

  return {
    totalLockerRevenue: lockerRevenue,
    totalWaterRevenue: waterFundsData.totalWaterRevenue,
    totalWaterExpenses: waterFundsData.totalWaterExpenses,
    totalExpenseTransactions: totalExpenses,
    totalFundsUtilized: fundRequestsData.totalUtilizedFunds,
    totalFundRequests: fundRequestsData.totalAllocatedFunds,
    totalRevenue,
    totalExpenses: totalExpenseAmount,
    netProfit,
    totalWaterProfit: waterFundsData.totalWaterProfit,
  }
}

const insertExpenseTransactionQuery = db
  .insert(expenseTransaction)
  .values({
    id: sql`${sql.placeholder("id")}`,
    requestId: sql`${sql.placeholder("requestId")}`,
    expenseName: sql`${sql.placeholder("expenseName")}`,
    amount: sql`${sql.placeholder("amount")}`,
    date: sql`${sql.placeholder("date")}`,
    receipt: sql`${sql.placeholder("receipt")}`,
    status: sql`${sql.placeholder("status")}`,
    rejectionReason: sql`${sql.placeholder("rejectionReason")}`,
  })
  .returning()
  .prepare()

const findExpenseTransactionByIdQuery = db
  .select({
    id: expenseTransaction.id,
    requestId: expenseTransaction.requestId,
    expenseName: expenseTransaction.expenseName,
    amount: expenseTransaction.amount,
    date: sql<number>`${expenseTransaction.date}`,
    receipt: expenseTransaction.receipt,
    status: expenseTransaction.status,
    validatedBy: expenseTransaction.validatedBy,
    validatedDate: sql<number>`${expenseTransaction.validatedDate}`,
    rejectionReason: expenseTransaction.rejectionReason,
    createdAt: sql<number>`${expenseTransaction.createdAt}`,
    updatedAt: sql<number>`${expenseTransaction.updatedAt}`,
  })
  .from(expenseTransaction)
  .where(eq(expenseTransaction.id, sql.placeholder("id")))
  .limit(1)
  .prepare()

export {
  insertFundRequestQuery,
  findFundRequestByIdQuery,
  insertExpenseTransactionQuery,
  findExpenseTransactionByIdQuery,
}
