import { updateRental } from "@/backend/controllers/locker-rental/update-rental"
import { updateViolation } from "../controllers/violation/update-violation"
import { updateLocker } from "@/backend/controllers/locker/update-locker"
import { updateUserInfo } from "@/backend/controllers/user/update-info"

import type { Route } from "@/backend/routes/api-routes"

export const patchRoutes: Route[] = [
  { path: "/api/v1/auth/update-info", handler: updateUserInfo },
  { path: "/api/v1/lockers/update-locker", handler: updateLocker },
  { path: "/api/v1/locker-rentals/update-rental", handler: updateRental },
  { path: "/api/v1/violations/update-violation", handler: updateViolation },
  // Add more PATCH routes here
]
