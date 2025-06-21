import { NextRequest, NextResponse } from "next/server"
import { requestHandler } from "@/backend/helpers/request-handler.ts"

export async function GET(request: NextRequest): Promise<NextResponse> {
  return requestHandler(request, "GET")
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  return requestHandler(request, "POST")
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  return requestHandler(request, "PATCH")
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  return requestHandler(request, "DELETE")
}
