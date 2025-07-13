import { expenseTransaction, fundRequest } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findExpenseTransactionByIdQuery } from "@/backend/queries/fund-request"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  UpdateExpenseTransaction,
  updateExpenseTransactionSchema,
} from "@/validation/expense-transaction"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function updateExpenseTransaction(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Expense Transaction ID is required" },
        { status: 400 },
      )
    }

    const data = await requestJson<Partial<UpdateExpenseTransaction>>(request)
    const validationResult = await updateExpenseTransactionSchema
      .partial()
      .safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const updateData = validationResult.data

    await db.transaction(async (tx) => {
      const existingExpense = await tx
        .select()
        .from(expenseTransaction)
        .where(eq(expenseTransaction.id, id))
        .limit(1)

      if (!existingExpense.length) {
        throw new Error("Expense Transaction not found")
      }

      const updateValues: Partial<typeof expenseTransaction.$inferInsert> = {}
      let amountChanged = false
      let amountDifference = 0

      if (updateData.expenseName !== undefined)
        updateValues.expenseName = updateData.expenseName
      if (updateData.amount !== undefined) {
        amountChanged = true
        amountDifference = updateData.amount - existingExpense[0]?.amount!
        updateValues.amount = updateData.amount
      }
      if (updateData.date !== undefined) updateValues.date = updateData.date
      if (updateData.receipt !== undefined)
        updateValues.receipt = updateData.receipt
      if (updateData.status !== undefined) {
        updateValues.status = updateData.status

        if (updateData.status === "validated") {
          updateValues.validatedBy = currentSession.userId
          updateValues.validatedDate = new Date()
        } else if (
          updateData.status === "rejected" &&
          updateData.rejectionReason
        ) {
          updateValues.rejectionReason = updateData.rejectionReason
        }
      }
      if (updateData.rejectionReason !== undefined)
        updateValues.rejectionReason = updateData.rejectionReason

      if (Object.keys(updateValues).length > 0) {
        await tx
          .update(expenseTransaction)
          .set({
            ...updateValues,
            date: updateValues.date
              ? sql<number>`${updateValues.date}`
              : undefined,
            validatedDate: updateValues.validatedDate
              ? sql<number>`${updateValues.validatedDate}`
              : undefined,
            rejectionReason: updateValues.rejectionReason
              ? updateValues.rejectionReason
              : null,
          })
          .where(eq(expenseTransaction.id, id))

        if (amountChanged && existingExpense[0]?.requestId) {
          await tx
            .update(fundRequest)
            .set({
              utilizedFunds: sql`${fundRequest.utilizedFunds} + ${amountDifference}`,
            })
            .where(eq(fundRequest.id, existingExpense[0].requestId))
        }
      }
    })

    const [result] = await findExpenseTransactionByIdQuery.execute({
      id: id,
    })

    if (!result) {
      return NextResponse.json(
        { error: "Expense transaction not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
