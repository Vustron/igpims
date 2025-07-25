import { Route } from "@/backend/routes/api-routes"
import { updateExpenseTransaction } from "../controllers/expense-transaction/update-expense"
import { updateFundRequest } from "../controllers/fund-request/update-fund-request"
import { updateIgpSupply } from "../controllers/igp-supply/update-igp-supply"
import { updateIgpTransaction } from "../controllers/igp-transactions/update-igp-transaction"
import { updateIgp } from "../controllers/igp/update-igp"
import { updateInspection } from "../controllers/inspection/update-inspection"
import { updateRental } from "../controllers/locker-rental/update-rental"
import { updateLocker } from "../controllers/locker/update-locker"
import { updateUserInfo } from "../controllers/user/update-info"
import { updateViolation } from "../controllers/violation/update-violation"
import { updateWaterFund } from "../controllers/water-funds/update-fund"
import { updateWaterSupply } from "../controllers/water-supply/update-water-supply"
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
  {
    path: "/api/v1/water-supplies/update-water-supply",
    handler: updateWaterSupply,
  },
  { path: "/api/v1/water-funds/update-water-fund", handler: updateWaterFund },
  {
    path: "/api/v1/fund-requests/update-fund-request",
    handler: updateFundRequest,
  },
  {
    path: "/api/v1/expense-transactions/update-expense",
    handler: updateExpenseTransaction,
  },
  { path: "/api/v1/igps/update-igp", handler: updateIgp },
  {
    path: "/api/v1/igp-transactions/update-igp-transaction",
    handler: updateIgpTransaction,
  },
  {
    path: "/api/v1/igp-supplies/update-igp-supply",
    handler: updateIgpSupply,
  },
  // Add more PATCH routes here
]
