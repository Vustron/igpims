import { igp } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import {
  findIgpByIdQuery,
  findIgpTransactionByIdQuery,
  insertIgpTransactionQuery,
} from "@/backend/queries/igp"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  CreateIgpTransactionPayload,
  createIgpTransactionSchema,
} from "@/validation/igp-transaction"
import { eq, sql } from "drizzle-orm"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

export async function createIgpTransaction(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const data = await requestJson<CreateIgpTransactionPayload>(request)
    const validationResult =
      await createIgpTransactionSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const transactionData = validationResult.data

    const [existingIgp] = await findIgpByIdQuery.execute({
      id: transactionData.igpId,
    })

    if (!existingIgp) {
      return NextResponse.json({ error: "IGP not found" }, { status: 404 })
    }

    const newTransaction = await db.transaction(async (tx) => {
      const [insertedTransaction] = await insertIgpTransactionQuery.execute({
        id: nanoid(15),
        igpId: transactionData.igpId,
        purchaserName: transactionData.purchaserName,
        courseAndSet: transactionData.courseAndSet,
        batch: transactionData.batch,
        quantity: transactionData.quantity,
        dateBought: transactionData.dateBought,
        itemReceived: transactionData.itemReceived,
      })

      await tx
        .update(igp)
        .set({
          totalSold: sql`${existingIgp.totalSold} + ${transactionData.quantity}`,
          igpRevenue: sql`${existingIgp.igpRevenue} + (${transactionData.quantity} * ${existingIgp.costPerItem})`,
        })
        .where(eq(igp.id, transactionData.igpId))
        .execute()

      return insertedTransaction
    })

    const [newTransactionData] = await findIgpTransactionByIdQuery.execute({
      id: newTransaction?.id,
    })

    if (!newTransactionData) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(newTransactionData, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
