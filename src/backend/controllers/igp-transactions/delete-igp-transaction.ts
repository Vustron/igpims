import { igp, igpSupply, igpTransactions } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
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
          supply: true,
        },
      })

      if (!existingTransaction) {
        throw new Error("Transaction not found")
      }

      if (!existingTransaction.igp) {
        throw new Error("Associated IGP not found")
      }

      if (!existingTransaction.supply) {
        throw new Error("Associated supply not found")
      }

      await tx
        .delete(igpTransactions)
        .where(eq(igpTransactions.id, transactionId))

      if (existingTransaction.quantity > 0) {
        const quantity = Number(existingTransaction.quantity)
        const costPerItem = Number(existingTransaction.igp.costPerItem)
        const wasReceived = existingTransaction.itemReceived === "received"

        await tx
          .update(igpSupply)
          .set({
            quantitySold: sql`${igpSupply.quantitySold} - ${quantity}`,
          })
          .where(eq(igpSupply.id, existingTransaction.igpSupplyId))

        if (wasReceived) {
          const receivedTransactions = await tx.query.igpTransactions.findMany({
            where: (transactions, { and, eq }) =>
              and(
                eq(transactions.igpId, existingTransaction.igpId),
                eq(transactions.itemReceived, "received"),
              ),
          })

          const totalRevenue = receivedTransactions.reduce(
            (sum, transaction) => {
              return sum + Number(transaction.quantity) * costPerItem
            },
            0,
          )

          const totalSold = receivedTransactions.reduce((sum, transaction) => {
            return sum + Number(transaction.quantity)
          }, 0)

          await tx
            .update(igp)
            .set({
              totalSold,
              igpRevenue: totalRevenue,
            })
            .where(eq(igp.id, existingTransaction.igpId))
        } else {
          await tx
            .update(igp)
            .set({
              totalSold: sql`${igp.totalSold} - ${quantity}`,
            })
            .where(eq(igp.id, existingTransaction.igpId))
        }
      }

      await activityLogger({
        userId: currentSession.userId,
        action: `${currentSession.userName} has deleted an igp transaction: ${existingTransaction.igp?.igpName}`,
      })
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
