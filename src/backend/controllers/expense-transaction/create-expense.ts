import { expenseTransaction } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import {
  findExpenseTransactionByIdQuery,
  findFundRequestByIdQuery,
} from "@/backend/queries/fund-request"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  CreateExpenseTransaction,
  createExpenseTransactionSchema,
} from "@/validation/expense-transaction"
import { eq, sql } from "drizzle-orm"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

export async function createExpenseTransaction(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const data = await requestJson<CreateExpenseTransaction>(request)
    const validationResult =
      await createExpenseTransactionSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const expenseData = validationResult.data

    const [fundRequestExist] = await findFundRequestByIdQuery.execute({
      id: expenseData.requestId,
    })

    if (!fundRequestExist) {
      return NextResponse.json(
        { error: "Fund request not found" },
        { status: 404 },
      )
    }

    const existingExpense = await db.query.expenseTransaction.findFirst({
      where: eq(expenseTransaction.expenseName, expenseData.expenseName),
    })

    if (existingExpense) {
      return NextResponse.json(
        { error: "Expense with this name already exists" },
        { status: 409 },
      )
    }

    const [insertResult] = await db
      .insert(expenseTransaction)
      .values({
        id: nanoid(15),
        requestId: expenseData.requestId,
        expenseName: expenseData.expenseName,
        amount: expenseData.amount,
        date: sql<number>`${expenseData.date}`,
        receipt: expenseData.receipt,
        status: expenseData.status,
        rejectionReason: expenseData.rejectionReason,
      })
      .returning()

    const [result] = await findExpenseTransactionByIdQuery.execute({
      id: insertResult?.id,
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
