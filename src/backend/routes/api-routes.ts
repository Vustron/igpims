import { NextRequest, NextResponse } from "next/server"
import { deleteRoutes } from "@/backend/routes/delete"
import { getRoutes } from "@/backend/routes/get"
import { patchRoutes } from "@/backend/routes/patch"
import { postRoutes } from "@/backend/routes/post"

export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE"

export interface Route {
  path: string
  handler: (request: NextRequest) => Promise<NextResponse>
}

export const routes: Record<HttpMethod, Route[]> = {
  GET: getRoutes,
  POST: postRoutes,
  PATCH: patchRoutes,
  DELETE: deleteRoutes,
}
