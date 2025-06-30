import { deleteInspection } from "../controllers/inspection/delete-inspection"
import { deleteLockerById } from "../controllers/locker/delete-by-id"
import { deleteRentById } from "../controllers/locker-rental/delete-rent"
import { deleteUserById } from "../controllers/user/delete-by-id"
import { deleteViolation } from "../controllers/violation/delete-violation"
import { deleteWaterVendo } from "../controllers/water-vendo/delete-water-vendo"
import { Route } from "../routes/api-routes"

export const deleteRoutes: Route[] = [
  { path: "/api/v1/auth/delete-user-by-id", handler: deleteUserById },
  { path: "/api/v1/lockers/delete-locker-by-id", handler: deleteLockerById },
  { path: "/api/v1/locker-rentals/delete-rent-by-id", handler: deleteRentById },
  { path: "/api/v1/violations/delete-violation", handler: deleteViolation },
  { path: "/api/v1/inspections/delete-inspection", handler: deleteInspection },
  {
    path: "/api/v1/water-vendos/delete-water-vendo",
    handler: deleteWaterVendo,
  },
  // Add more DELETE routes here
]
