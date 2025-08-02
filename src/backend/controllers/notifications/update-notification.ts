import { notification } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import {
  UpdateNotificationPayload,
  updateNotificationSchema,
} from "@/validation/notification"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function updateNotification(
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
        { error: "Notification ID is required" },
        { status: 400 },
      )
    }

    const data = await requestJson<UpdateNotificationPayload>(request)
    const validationResult = await updateNotificationSchema
      .partial()
      .safeParseAsync(data)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues },
        { status: 400 },
      )
    }

    await db.transaction(async (tx) => {
      const exists = await tx
        .select({ id: notification.id })
        .from(notification)
        .where(eq(notification.id, id))
        .limit(1)

      if (!exists.length) throw new Error("Notification not found")

      const updateValues: { status?: string[] } = {}

      if (validationResult.data.status !== undefined) {
        const statusArray = Array.isArray(validationResult.data.status)
          ? validationResult.data.status.filter((s) => typeof s === "string")
          : typeof validationResult.data.status === "string"
            ? [validationResult.data.status]
            : []

        updateValues.status = statusArray
      }

      if (updateValues.status) {
        await tx
          .update(notification)
          .set(updateValues)
          .where(eq(notification.id, id))
      }
    })

    const [result] = await db
      .select({
        id: notification.id,
        type: notification.type,
        requestId: notification.type,
        title: notification.title,
        description: notification.description,
        status: notification.status,
        action: notification.action,
        actor: notification.actor,
        details: notification.details,
        createdAt: sql<number>`${notification.createdAt}`,
        updatedAt: sql<number>`${notification.updatedAt}`,
      })
      .from(notification)
      .where(eq(notification.id, id))
      .limit(1)

    if (!result) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 },
      )
    }

    let statusArray: string[] = []
    if (typeof result.status === "string") {
      try {
        statusArray = result.status ? JSON.parse(result.status) : []
        if (!Array.isArray(statusArray)) {
          statusArray = []
        }
      } catch (e) {
        statusArray = []
      }
    } else if (Array.isArray(result.status)) {
      statusArray = result.status
    } else {
      statusArray = []
    }

    return NextResponse.json(
      {
        ...result,
        status: statusArray.filter((s) => typeof s === "string"),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Update notification error:", error)
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
