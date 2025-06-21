import { NextRequest, NextResponse } from "next/server"
import { HttpMethod, routes } from "@/backend/routes/api-routes"
import { catchError } from "@/utils/catch-error"

export const requestHandler = async (
  request: NextRequest,
  method: HttpMethod,
): Promise<NextResponse> => {
  try {
    const pathname = new URL(request.url).pathname
    const route = routes[method].find((r) => r.path === pathname)

    if (route) {
      return await route.handler(request)
    }

    return NextResponse.json("Api route not found", { status: 404 })
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
