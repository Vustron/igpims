import { deleteManyUserById } from "@/backend/controllers/user/delete-many-by-id"
import { resetUserPassword } from "@/backend/controllers/user/reset-password"
import { signInOtpEmail } from "@/backend/controllers/user/sign-in-otp-email"
import { sendVerifyLink } from "@/backend/controllers/user/send-verify-link"
import { createRent } from "@/backend/controllers/locker-rental/create-rent"
import { signInOtpAuth } from "@/backend/controllers/user/sign-in-otp-auth"
import { sendResetLink } from "@/backend/controllers/user/send-reset-link"
import { verifyUserEmail } from "@/backend/controllers/user/verify-email"
import { createLocker } from "@/backend/controllers/locker/create-locker"
import { signOutUser } from "@/backend/controllers/user/sign-out"
import { signInUser } from "@/backend/controllers/user/sign-in"
import { signUpUser } from "@/backend/controllers/user/sign-up"

import type { Route } from "@/backend/routes/api-routes"

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
  // Add more POST routes here
]
