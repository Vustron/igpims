import { createNotification } from "@/backend/helpers/notification-controller"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { findIgpByIdQuery, insertIgpQuery } from "@/backend/queries/igp"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { CreateIgpPayload, createIgpSchema } from "@/validation/igp"
import { nanoid } from "nanoid"
import { NextRequest, NextResponse } from "next/server"

export async function createIgp(
  request: NextRequest,
): Promise<NextResponse<unknown>> {
  try {
    const rateLimitCheck = await httpRequestLimit(request)
    if (rateLimitCheck instanceof NextResponse) return rateLimitCheck

    const currentSession = await checkAuth()
    if (currentSession instanceof NextResponse) return currentSession

    const data = await requestJson<Omit<CreateIgpPayload, "id">>(request)
    const validationResult = await createIgpSchema.safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    const igpData = validationResult.data

    const insertIgp = await db.transaction(async (_tx) => {
      return await insertIgpQuery.execute({
        id: nanoid(15),
        igpName: igpData.igpName,
        igpDescription: igpData.igpDescription,
        igpType: igpData.igpType,
        iconType: igpData.iconType,
        semesterAndAcademicYear: igpData.semesterAndAcademicYear,
        totalSold: 0,
        igpRevenue: 0,
        igpStartDate: igpData.igpStartDate,
        igpEndDate: igpData.igpEndDate,
        itemsToSell: igpData.itemsToSell,
        requestDate: igpData.requestDate,
        igpDateNeeded: igpData.igpDateNeeded,
        assignedOfficers: JSON.stringify(igpData.assignedOfficers),
        costPerItem: igpData.costPerItem,
        projectLead: igpData.projectLead,
        position: igpData.position,
      })
    })

    const [igp] = await findIgpByIdQuery.execute({
      id: insertIgp[0]?.id,
    })

    await createNotification({
      id: nanoid(15),
      type: "igp",
      requestId: igp?.id!,
      title: `New IGP Created: ${igpData.igpName}`,
      description: `A new IGP "${igpData.igpName}" has been created and is pending review.`,
      action: "created",
      actorId: currentSession.userId,
      recipientId: igp?.projectLead!,
      details: `${igpData.igpType} | ${igpData.semesterAndAcademicYear}`,
    })

    return NextResponse.json(igp, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
