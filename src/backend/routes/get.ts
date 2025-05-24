import { findManyRents } from "@/backend/controllers/locker-rental/find-many"
import { findManyLockers } from "@/backend/controllers/locker/find-many"
import { findLockerById } from "@/backend/controllers/locker/find-by-id"
import { generate2fa } from "@/backend/controllers/user/generate-2fa"
import { findUserById } from "@/backend/controllers/user/find-by-id"
import { findManyUser } from "@/backend/controllers/user/find-many"

import type { Route } from "@/backend/routes/api-routes"

export const getRoutes: Route[] = [
  { path: "/api/v1/auth/find-by-id", handler: findUserById },
  { path: "/api/v1/auth/find-many", handler: findManyUser },
  { path: "/api/v1/auth/generate-2fa", handler: generate2fa },
  { path: "/api/v1/lockers/find-many", handler: findManyLockers },
  { path: "/api/v1/lockers/find-by-id", handler: findLockerById },
  { path: "/api/v1/locker-rentals/find-many", handler: findManyRents },
  // Add more GET routes here
]
