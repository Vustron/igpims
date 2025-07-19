import { igp, igpTransactions } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function deleteIgpTransaction(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const transactionId = request.nextUrl.searchParams.get("id")
    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 },
      )
    }

    await db.transaction(async (tx) => {
      const [existingTransaction] = await tx.query.igpTransactions.findMany({
        where: eq(igpTransactions.id, transactionId),
        with: {
          igp: true,
        },
      })

      if (!existingTransaction) {
        throw new Error("Transaction not found")
      }

      if (!existingTransaction.igp) {
        throw new Error("Associated IGP not found")
      }

      await tx
        .delete(igpTransactions)
        .where(eq(igpTransactions.id, transactionId))

      if (existingTransaction.quantity > 0) {
        await tx
          .update(igp)
          .set({
            totalSold: sql`${existingTransaction.igp.totalSold} - ${existingTransaction.quantity}`,
            igpRevenue: sql`${existingTransaction.igp.igpRevenue} - (${existingTransaction.quantity} * ${existingTransaction.igp.costPerItem})`,
          })
          .where(eq(igp.id, existingTransaction.igpId))
      }
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
