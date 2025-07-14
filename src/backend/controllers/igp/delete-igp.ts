import { igp, igpSupply, igpTransactions } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function deleteIgp(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const searchParams = request.nextUrl.searchParams
    const igpId = searchParams.get("id")

    if (!igpId) {
      return NextResponse.json({ error: "IGP ID is required" }, { status: 400 })
    }

    await db.transaction(async (tx) => {
      const igpResult = await tx.query.igp.findFirst({
        where: eq(igp.id, igpId),
      })

      if (!igpResult) {
        throw new Error("IGP not found")
      }

      await Promise.all([
        tx.delete(igpTransactions).where(eq(igpTransactions.igpId, igpId)),
        tx.delete(igpSupply).where(eq(igpSupply.igpId, igpId)),
        tx.delete(igp).where(eq(igp.id, igpId)),
      ])
    })

    return NextResponse.json({ status: 201 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
