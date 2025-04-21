import { deleteUserById } from "@/backend/controllers/user/delete-by-id"

import type { Route } from "@/backend/routes/api-routes"

export const deleteRoutes: Route[] = [
  { path: "/api/v1/auth/delete-user-by-id", handler: deleteUserById },
  // Add more DELETE routes here
]
