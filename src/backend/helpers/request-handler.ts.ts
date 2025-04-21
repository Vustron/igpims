import { routes } from "@/backend/routes/api-routes"
import { catchError } from "@/utils/catch-error"
import { NextResponse } from "next/server"

import type { HttpMethod } from "@/backend/routes/api-routes"
import type { NextRequest } from "next/server"

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
