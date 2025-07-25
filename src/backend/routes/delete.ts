import { deleteExpenseTransaction } from "../controllers/expense-transaction/delete-expense"
import { deleteFundRequest } from "../controllers/fund-request/delete-fund-request"
import { deleteIgpSupply } from "../controllers/igp-supply/delete-igp-supply"
import { deleteIgpTransaction } from "../controllers/igp-transactions/delete-igp-transaction"
import { deleteIgp } from "../controllers/igp/delete-igp"
import { deleteInspection } from "../controllers/inspection/delete-inspection"
import { deleteRentById } from "../controllers/locker-rental/delete-rent"
import { deleteLockerById } from "../controllers/locker/delete-by-id"
import { deleteUserById } from "../controllers/user/delete-by-id"
import { deleteViolation } from "../controllers/violation/delete-violation"
import { deleteWaterFund } from "../controllers/water-funds/delete-fund"
import { deleteWaterSupply } from "../controllers/water-supply/delete-water-supply"
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
  {
    path: "/api/v1/water-supplies/delete-water-supply",
    handler: deleteWaterSupply,
  },
  { path: "/api/v1/water-funds/delete-water-fund", handler: deleteWaterFund },
  {
    path: "/api/v1/fund-requests/delete-fund-request",
    handler: deleteFundRequest,
  },
  {
    path: "/api/v1/expense-transactions/delete-expense",
    handler: deleteExpenseTransaction,
  },
  { path: "/api/v1/igps/delete-igp", handler: deleteIgp },
  {
    path: "/api/v1/igp-transactions/delete-igp-transaction",
    handler: deleteIgpTransaction,
  },
  {
    path: "/api/v1/igp-supplies/delete-igp-supply",
    handler: deleteIgpSupply,
  },
  // Add more DELETE routes here
]
