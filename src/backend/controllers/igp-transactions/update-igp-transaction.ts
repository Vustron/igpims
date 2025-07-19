import { igp, igpTransactions } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import {
  findIgpByIdQuery,
  findIgpTransactionByIdQuery,
} from "@/backend/queries/igp"
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

    const [existingTransaction] = await findIgpTransactionByIdQuery.execute({
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

      const [updated] = await tx
        .update(igpTransactions)
        .set(updateValues)
        .where(eq(igpTransactions.id, id))
        .returning()

      if (!updated) {
        throw new Error("Failed to update transaction")
      }

      if (
        data.itemReceived === "received" &&
        existingTransaction.itemReceived !== "received"
      ) {
        const quantityToAdd =
          data.quantity !== undefined
            ? data.quantity
            : existingTransaction.quantity

        await tx
          .update(igp)
          .set({
            totalSold: sql`${igpData.totalSold} + ${quantityToAdd}`,
            igpRevenue: sql`${igpData.igpRevenue} + (${quantityToAdd} * ${igpData.costPerItem})`,
          })
          .where(eq(igp.id, existingTransaction.igpId))
      } else if (
        data.quantity !== undefined &&
        existingTransaction.itemReceived === "received"
      ) {
        const quantityDiff = data.quantity - existingTransaction.quantity
        await tx
          .update(igp)
          .set({
            totalSold: sql`${igpData.totalSold} + ${quantityDiff}`,
            igpRevenue: sql`${igpData.igpRevenue} + (${quantityDiff} * ${igpData.costPerItem})`,
          })
          .where(eq(igp.id, existingTransaction.igpId))
      }

      return updated
    })

    const [newTransactionData] = await findIgpTransactionByIdQuery.execute({
      id: updatedTransaction?.id,
    })

    if (!newTransactionData) {
      return NextResponse.json(
        { error: "Transaction not found after update" },
        { status: 404 },
      )
    }

    return NextResponse.json(newTransactionData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
