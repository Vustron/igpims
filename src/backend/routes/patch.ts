import { updateUserInfo } from "@/backend/controllers/user/update-info"

import type { Route } from "@/backend/routes/api-routes"

export const patchRoutes: Route[] = [
  { path: "/api/v1/auth/update-info", handler: updateUserInfo },
  // Add more PATCH routes here
]
