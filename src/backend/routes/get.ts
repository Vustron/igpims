import { findInspectionById } from "../controllers/inspection/find-by-id"
import { findManyInspections } from "../controllers/inspection/find-many"
import { findLockerById } from "../controllers/locker/find-by-id"
import { findManyLockers } from "../controllers/locker/find-many"
import { findManyRents } from "../controllers/locker-rental/find-many"
import { findRentById } from "../controllers/locker-rental/find-rent-by-id"
import { findUserById } from "../controllers/user/find-by-id"
import { findManyUser } from "../controllers/user/find-many"
import { findManyRenterInfo } from "../controllers/user/find-many-renter-info"
import { generate2fa } from "../controllers/user/generate-2fa"
import { findViolationById } from "../controllers/violation/find-by-id"
import { findManyViolations } from "../controllers/violation/find-many"
import { findWaterSupplyById } from "../controllers/water-supply/find-by-id"
import { findManyWaterSupply } from "../controllers/water-supply/find-many"
import { findManyWaterVendo } from "../controllers/water-vendo/find-many-water-vendo"
import { findWaterVendoById } from "../controllers/water-vendo/find-water-vendo-by-id"
import { Route } from "../routes/api-routes"

export const getRoutes: Route[] = [
  { path: "/api/v1/auth/find-by-id", handler: findUserById },
  { path: "/api/v1/auth/find-many", handler: findManyUser },
  { path: "/api/v1/auth/generate-2fa", handler: generate2fa },
  { path: "/api/v1/lockers/find-many", handler: findManyLockers },
  { path: "/api/v1/lockers/find-by-id", handler: findLockerById },
  { path: "/api/v1/locker-rentals/find-many", handler: findManyRents },
  { path: "/api/v1/locker-rentals/find-by-id", handler: findRentById },
  { path: "/api/v1/violations/find-many", handler: findManyViolations },
  { path: "/api/v1/violations/find-by-id", handler: findViolationById },
  { path: "/api/v1/inspections/find-by-id", handler: findInspectionById },
  { path: "/api/v1/inspections/find-many", handler: findManyInspections },
  { path: "/api/v1/users/find-many-renter-info", handler: findManyRenterInfo },
  { path: "/api/v1/water-vendos/find-many", handler: findManyWaterVendo },
  { path: "/api/v1/water-vendos/find-by-id", handler: findWaterVendoById },
  { path: "/api/v1/water-supplies/find-many", handler: findManyWaterSupply },
  { path: "/api/v1/water-supplies/find-by-id", handler: findWaterSupplyById },
  // Add more GET routes here
]
