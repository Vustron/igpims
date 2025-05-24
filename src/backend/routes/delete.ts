import { deleteLockerById } from "@/backend/controllers/locker/delete-by-id"
import { deleteUserById } from "@/backend/controllers/user/delete-by-id"

import type { Route } from "@/backend/routes/api-routes"

export const deleteRoutes: Route[] = [
  { path: "/api/v1/auth/delete-user-by-id", handler: deleteUserById },
  { path: "/api/v1/lockers/delete-locker-by-id", handler: deleteLockerById },
  // Add more DELETE routes here
]
