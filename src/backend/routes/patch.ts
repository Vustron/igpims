import { Route } from "@/backend/routes/api-routes"
import { updateLocker } from "../controllers/locker/update-locker"
import { updateRental } from "../controllers/locker-rental/update-rental"
import { updateUserInfo } from "../controllers/user/update-info"
import { updateViolation } from "../controllers/violation/update-violation"

export const patchRoutes: Route[] = [
  { path: "/api/v1/auth/update-info", handler: updateUserInfo },
  { path: "/api/v1/lockers/update-locker", handler: updateLocker },
  { path: "/api/v1/locker-rentals/update-rental", handler: updateRental },
  { path: "/api/v1/violations/update-violation", handler: updateViolation },
  // Add more PATCH routes here
]
