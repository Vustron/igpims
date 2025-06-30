import { NextRequest, NextResponse } from "next/server"
import { requestHandler } from "@/backend/helpers/request-handler.ts"
import { appApiKey } from "@/backend/middlewares/app-api-key"

export async function GET(request: NextRequest): Promise<NextResponse> {
  return requestHandler(request, "GET", {
    middleware: appApiKey,
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return requestHandler(request, "POST", {
    middleware: appApiKey,
  })
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return requestHandler(request, "PATCH", {
    middleware: appApiKey,
  })
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return requestHandler(request, "DELETE", {
    middleware: appApiKey,
  })
}
