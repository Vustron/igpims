import { notification } from "@/backend/db/schemas"
import { checkAuth } from "@/backend/middlewares/check-auth"
import { httpRequestLimit } from "@/backend/middlewares/http-request-limit"
import { db } from "@/config/drizzle"
import { catchError } from "@/utils/catch-error"
import { requestJson } from "@/utils/request-json"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

interface UpdateNotification {
  status?: "unread" | "read"
  details?: string
}

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

    const data = await requestJson<Partial<UpdateNotification>>(request)

    const allowedFields = ["status", "details"]
    const updateData: Partial<UpdateNotification> = {}

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key)) {
        if (key === "status" && (value === "unread" || value === "read")) {
          updateData.status = value
        } else if (
          key === "details" &&
          typeof value === "object" &&
          value !== null
        ) {
          updateData.details = value as string
        }
      }
    }

    if (updateData.status && !["unread", "read"].includes(updateData.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 },
      )
    }

    await db.transaction(async (tx) => {
      const existingNotification = await tx
        .select()
        .from(notification)
        .where(eq(notification.id, id))
        .limit(1)

      if (!existingNotification.length) {
        throw new Error("Notification not found")
      }

      const updateValues: Partial<typeof notification.$inferInsert> = {}

      if (updateData.status !== undefined) {
        updateValues.status = updateData.status
      }

      if (updateData.details !== undefined) {
        updateValues.details = updateData.details
      }

      if (Object.keys(updateValues).length > 0) {
        await tx
          .update(notification)
          .set(updateValues)
          .where(eq(notification.id, id))
      }
    })

    const [result] = await db
      .select()
      .from(notification)
      .where(eq(notification.id, id))
      .limit(1)

    if (!result) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 },
      )
    }

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
