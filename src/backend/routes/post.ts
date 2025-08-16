import { checkPaymentStatusCronJob } from "../controllers/cron-jobs/check-payment-status"
import { flushCacheCronJob } from "../controllers/cron-jobs/flush-cache"
import { sendRentLockerConfirm } from "../controllers/email/send-rent-locker-confirm.ts"
import { createExpenseTransaction } from "../controllers/expense-transaction/create-expense"
import { createFundRequest } from "../controllers/fund-request/create-fund-request"
import { createIgp } from "../controllers/igp/create-igp"
import { createIgpSupply } from "../controllers/igp-supply/create-igp-supply"
import { createIgpTransaction } from "../controllers/igp-transactions/create-igp-transaction"
import { createInspection } from "../controllers/inspection/create-inspection"
import { createLocker } from "../controllers/locker/create-locker"
import { createRent } from "../controllers/locker-rental/create-rent"
import { deleteManyUserById } from "../controllers/user/delete-many-by-id"
import { resetUserPassword } from "../controllers/user/reset-password"
import { sendResetLink } from "../controllers/user/send-reset-link"
import { sendVerifyLink } from "../controllers/user/send-verify-link"
import { signInUser } from "../controllers/user/sign-in"
import { signInOtpAuth } from "../controllers/user/sign-in-otp-auth"
import { signInOtpEmail } from "../controllers/user/sign-in-otp-email"
import { signOutUser } from "../controllers/user/sign-out"
import { signUpUser } from "../controllers/user/sign-up"
import { verifyUserEmail } from "../controllers/user/verify-email"
import { createViolation } from "../controllers/violation/create-violation"
import { createWaterFund } from "../controllers/water-funds/create-fund"
import { createWaterSupply } from "../controllers/water-supply/create-water-supply"
import { createWaterVendo } from "../controllers/water-vendo/create-water-vendo"
import { Route } from "../routes/api-routes"

export const postRoutes: Route[] = [
  { path: "/api/v1/auth/sign-up", handler: signUpUser },
  { path: "/api/v1/auth/sign-in", handler: signInUser },
  { path: "/api/v1/auth/sign-out", handler: signOutUser },
  { path: "/api/v1/auth/send-verify-link", handler: sendVerifyLink },
  { path: "/api/v1/auth/verify-email", handler: verifyUserEmail },
  { path: "/api/v1/auth/send-reset-link", handler: sendResetLink },
  { path: "/api/v1/auth/reset-password", handler: resetUserPassword },
  { path: "/api/v1/auth/delete-many-user-by-id", handler: deleteManyUserById },
  { path: "/api/v1/auth/sign-in-otp-email", handler: signInOtpEmail },
  { path: "/api/v1/auth/sign-in-otp-authenticator", handler: signInOtpAuth },
  { path: "/api/v1/lockers/create-locker", handler: createLocker },
  { path: "/api/v1/locker-rentals/create-rent", handler: createRent },
  { path: "/api/v1/violations/create-violation", handler: createViolation },
  { path: "/api/v1/inspections/create-inspection", handler: createInspection },
  {
    path: "/api/v1/email/send-rent-locker-confirm",
    handler: sendRentLockerConfirm,
  },
  {
    path: "/api/v1/water-vendos/create-water-vendo",
    handler: createWaterVendo,
  },
  {
    path: "/api/v1/water-supplies/create-water-supply",
    handler: createWaterSupply,
  },
  { path: "/api/v1/water-funds/create-water-fund", handler: createWaterFund },
  {
    path: "/api/v1/fund-requests/create-fund-request",
    handler: createFundRequest,
  },
  {
    path: "/api/v1/expense-transactions/create-expense",
    handler: createExpenseTransaction,
  },
  { path: "/api/v1/igps/create-igp", handler: createIgp },
  {
    path: "/api/v1/igp-transactions/create-igp-transaction",
    handler: createIgpTransaction,
  },
  {
    path: "/api/v1/igp-supplies/create-igp-supply",
    handler: createIgpSupply,
  },
  {
    path: "/api/v1/cron-jobs/flush-cache",
    handler: flushCacheCronJob,
  },
  {
    path: "/api/v1/cron-jobs/check-payment-status",
    handler: checkPaymentStatusCronJob,
  },
  // Add more POST routes here
]
