import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findExpenseTransactionByIdQuery } from "@/backend/queries/fund-request"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { NextRequest, NextResponse } from "next/server"

export async function findExpenseTransactionById(
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

    const expenseTransactionData = await db.transaction(async (_tx) => {
      const transactionResult = await findExpenseTransactionByIdQuery.execute({
        id: id,
      })

      return transactionResult[0] || null
    })

    if (!expenseTransactionData) {
      return NextResponse.json(
        { error: "Expense Transaction not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(expenseTransactionData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
