import { NextRequest, NextResponse } from "next/server"
import { HttpMethod, routes } from "@/backend/routes/api-routes"
import { RequestHandlerConfig } from "@/interfaces/middleware"
import { catchError } from "@/utils/catch-error"

export const requestHandler = async (
  request: NextRequest,
  method: HttpMethod,
  config?: RequestHandlerConfig,
): Promise<NextResponse> => {
  try {
    if (config?.middleware?.enabled) {
      const middlewareResult = await config.middleware.handler(request)
      if (middlewareResult instanceof NextResponse) {
        return middlewareResult
      }
    }

    const pathname = new URL(request.url).pathname
    const route = routes[method].find((r) => r.path === pathname)

    if (route) {
      return await route.handler(request)
    }

    return NextResponse.json(
      { message: "Api route not found" },
      { status: 404 },
    )
  } catch (error) {
    return NextResponse.json({ error: catchError(error) }, { status: 500 })
  }
}
