import { igp, igpSupply, igpTransactions } from "@/backend/db/schemas"
import { activityLogger } from "@/backend/helpers/activity-logger"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findIgpByIdQuery } from "@/backend/queries/igp"
import { findIgpSupplyByIdWithIgpQuery } from "@/backend/queries/igp-supply"
import { findIgpTransactionByIdWithIgpQuery } from "@/backend/queries/igp-transaction"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  UpdateIgpTransactionPayload,
  updateIgpTransactionSchema,
} from "@/validation/igp-transaction"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function updateIgpTransaction(
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
        { error: "Transaction ID is required" },
        { status: 400 },
      )
    }

    const data =
      await requestJson<Partial<UpdateIgpTransactionPayload>>(request)

    if (data.dateBought !== undefined) {
      if (typeof data.dateBought === "number") {
        data.dateBought = new Date(data.dateBought)
      } else if (typeof data.dateBought === "string") {
        data.dateBought = new Date(data.dateBought)
      }
    }

    const validationResult = await updateIgpTransactionSchema
      .partial()
      .safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const [existingTransaction] =
      await findIgpTransactionByIdWithIgpQuery.execute({
        id,
      })

    if (!existingTransaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      )
    }

    const [igpData] = await findIgpByIdQuery.execute({
      id: existingTransaction.igpId,
    })

    if (!igpData) {
      return NextResponse.json(
        { error: "Associated IGP not found" },
        { status: 404 },
      )
    }

    const [supply] = await findIgpSupplyByIdWithIgpQuery.execute({
      id: existingTransaction.igpSupplyId,
    })

    if (!supply) {
      return NextResponse.json(
        { error: "Associated supply not found" },
        { status: 404 },
      )
    }

    const updatedTransaction = await db.transaction(async (tx) => {
      const updateValues: Partial<UpdateIgpTransactionPayload> = {}

      if (data.igpId !== undefined) updateValues.igpId = data.igpId
      if (data.purchaserName !== undefined)
        updateValues.purchaserName = data.purchaserName
      if (data.courseAndSet !== undefined)
        updateValues.courseAndSet = data.courseAndSet
      if (data.batch !== undefined) updateValues.batch = data.batch
      if (data.quantity !== undefined) updateValues.quantity = data.quantity
      if (data.dateBought !== undefined)
        updateValues.dateBought = data.dateBought
      if (data.itemReceived !== undefined)
        updateValues.itemReceived = data.itemReceived

      if (Object.keys(updateValues).length === 0) {
        return existingTransaction
      }

      const currentQuantity = Number(existingTransaction.quantity)
      const newQuantity =
        data.quantity !== undefined ? Number(data.quantity) : currentQuantity
      const quantityDiff = newQuantity - currentQuantity

      if (data.quantity !== undefined) {
        const availableQuantity =
          Number(supply.quantity) - Number(supply.quantitySold)
        if (quantityDiff > 0 && quantityDiff > availableQuantity) {
          throw new Error("Not enough items available in this supply")
        }
      }

      if (data.quantity !== undefined) {
        await tx
          .update(igpSupply)
          .set({
            quantitySold: sql`${igpSupply.quantitySold} + ${quantityDiff}`,
          })
          .where(eq(igpSupply.id, existingTransaction.igpSupplyId))
      }

      const [updated] = await tx
        .update(igpTransactions)
        .set(updateValues)
        .where(eq(igpTransactions.id, id))
        .returning()

      if (!updated) {
        throw new Error("Failed to update transaction")
      }

      const receivedTransactions = await tx.query.igpTransactions.findMany({
        where: (transactions, { and, eq }) =>
          and(
            eq(transactions.igpId, existingTransaction.igpId),
            eq(transactions.itemReceived, "received"),
          ),
      })

      const totalRevenue = receivedTransactions.reduce((sum, transaction) => {
        return sum + Number(transaction.quantity) * Number(igpData.costPerItem)
      }, 0)

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

      return updated
    })

    const [newTransactionData] =
      await findIgpTransactionByIdWithIgpQuery.execute({
        id: updatedTransaction?.id,
      })

    if (!newTransactionData) {
      return NextResponse.json(
        { error: "Transaction not found after update" },
        { status: 404 },
      )
    }

    await activityLogger({
      userId: currentSession.userId,
      action: `${currentSession.userName} has updated an igp transaction: ${existingTransaction.igp?.igpName}`,
    })

    return NextResponse.json(newTransactionData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
