import { Route } from "@/backend/routes/api-routes"
import { updateInspection } from "../controllers/inspection/update-inspection"
import { updateLocker } from "../controllers/locker/update-locker"
import { updateRental } from "../controllers/locker-rental/update-rental"
import { updateUserInfo } from "../controllers/user/update-info"
import { updateViolation } from "../controllers/violation/update-violation"
import { updateWaterVendo } from "../controllers/water-vendo/update-water-vendo"

export const patchRoutes: Route[] = [
  { path: "/api/v1/auth/update-info", handler: updateUserInfo },
  { path: "/api/v1/lockers/update-locker", handler: updateLocker },
  { path: "/api/v1/locker-rentals/update-rental", handler: updateRental },
  { path: "/api/v1/violations/update-violation", handler: updateViolation },
  { path: "/api/v1/inspections/update-inspection", handler: updateInspection },
  {
    path: "/api/v1/water-vendos/update-water-vendo",
    handler: updateWaterVendo,
  },
  // Add more PATCH routes here
]
