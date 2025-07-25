import { duePayments } from "../controllers/analytics/due-payments"
import { getFinancialData } from "../controllers/analytics/get-financial-data"
import { findTotalProfit } from "../controllers/analytics/total-profit"
import { findExpenseTransactionById } from "../controllers/expense-transaction/find-by-id"
import { findManyExpenseTransaction } from "../controllers/expense-transaction/find-many"
import { findFundRequestById } from "../controllers/fund-request/find-by-id"
import { findManyFundRequest } from "../controllers/fund-request/find-many"
import { findIgpSupplyById } from "../controllers/igp-supply/find-by-id"
import { findManyIgpSupply } from "../controllers/igp-supply/find-many"
import { findIgpTransactionById } from "../controllers/igp-transactions/find-by-id"
import { findManyIgpTransactions } from "../controllers/igp-transactions/find-many"
import { findIgpById } from "../controllers/igp/find-by-id"
import { findManyIgp } from "../controllers/igp/find-many"
import { imageKitUploadAuth } from "../controllers/imagekit-api/upload-auth"
import { findInspectionById } from "../controllers/inspection/find-by-id"
import { findManyInspections } from "../controllers/inspection/find-many"
import { findManyRents } from "../controllers/locker-rental/find-many"
import { findRentById } from "../controllers/locker-rental/find-rent-by-id"
import { findLockerById } from "../controllers/locker/find-by-id"
import { findManyLockers } from "../controllers/locker/find-many"
import { findUserById } from "../controllers/user/find-by-id"
import { findManyUser } from "../controllers/user/find-many"
import { findManyRenterInfo } from "../controllers/user/find-many-renter-info"
import { generate2fa } from "../controllers/user/generate-2fa"
import { findViolationById } from "../controllers/violation/find-by-id"
import { findManyViolations } from "../controllers/violation/find-many"
import { findWaterFundById } from "../controllers/water-funds/find-by-id"
import { findManyWaterFunds } from "../controllers/water-funds/find-many"
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
  { path: "/api/v1/water-funds/find-many", handler: findManyWaterFunds },
  { path: "/api/v1/water-funds/find-by-id", handler: findWaterFundById },
  { path: "/api/v1/fund-requests/find-many", handler: findManyFundRequest },
  { path: "/api/v1/fund-requests/find-by-id", handler: findFundRequestById },
  {
    path: "/api/v1/expense-transactions/find-many",
    handler: findManyExpenseTransaction,
  },
  {
    path: "/api/v1/expense-transactions/find-by-id",
    handler: findExpenseTransactionById,
  },
  { path: "/api/v1/igps/find-many", handler: findManyIgp },
  { path: "/api/v1/igps/find-by-id", handler: findIgpById },
  { path: "/api/v1/imagekit-api/upload-auth", handler: imageKitUploadAuth },
  {
    path: "/api/v1/igp-transactions/find-many",
    handler: findManyIgpTransactions,
  },
  {
    path: "/api/v1/igp-transactions/find-by-id",
    handler: findIgpTransactionById,
  },
  {
    path: "/api/v1/igp-supplies/find-many",
    handler: findManyIgpSupply,
  },
  {
    path: "/api/v1/igp-supplies/find-by-id",
    handler: findIgpSupplyById,
  },
  {
    path: "/api/v1/analytics/find-total-profit",
    handler: findTotalProfit,
  },
  {
    path: "/api/v1/analytics/get-financial-data",
    handler: getFinancialData,
  },
  {
    path: "/api/v1/analytics/get-due-payments",
    handler: duePayments,
  },

  // Add more GET routes here
]
