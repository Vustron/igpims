import { expenseTransaction, fundRequest } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function deleteExpenseTransaction(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const searchParams = request.nextUrl.searchParams
    const expenseId = searchParams.get("id")

    if (!expenseId) {
      return NextResponse.json(
        { error: "Expense Transaction ID is required" },
        { status: 400 },
      )
    }

    await db.transaction(async (tx) => {
      const expenseResult = await tx.query.expenseTransaction.findFirst({
        where: eq(expenseTransaction.id, expenseId),
      })

      if (!expenseResult) {
        throw new Error("Expense Transaction not found")
      }

      await tx
        .delete(expenseTransaction)
        .where(eq(expenseTransaction.id, expenseId))

      if (expenseResult.requestId && expenseResult.amount) {
        await tx
          .update(fundRequest)
          .set({
            utilizedFunds: sql`${fundRequest.utilizedFunds} - ${expenseResult.amount}`,
          })
          .where(eq(fundRequest.id, expenseResult.requestId))
      }

      await activityLogger({
        userId: currentSession.userId,
        action: `${currentSession.userName} has deleted an expense transaction: ${expenseResult.expenseName}`,
      })
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
