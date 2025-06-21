import { and, eq, sql } from "drizzle-orm"
import { otpToken, resetToken, verificationToken } from "@/backend/db/schemas"
import { db } from "@/config/drizzle"

const findResetPasswordTokenQuery = db
  .select()
  .from(resetToken)
  .where(eq(resetToken.token, sql.placeholder("token")))
  .prepare()

const findVerifyEmailTokenQuery = db
  .select()
  .from(verificationToken)
  .where(eq(verificationToken.token, sql.placeholder("token")))
  .prepare()

const deleteResetPasswordTokenQuery = db
  .delete(resetToken)
  .where(eq(resetToken.token, sql.placeholder("token")))
  .returning()
  .prepare()

const deleteVerifyEmailTokenQuery = db
  .delete(verificationToken)
  .where(eq(verificationToken.token, sql.placeholder("token")))
  .returning()
  .prepare()

const insertResetTokenQuery = db
  .insert(resetToken)
  .values({
    id: sql.placeholder("id"),
    token: sql.placeholder("token"),
    email: sql.placeholder("email"),
    expires: sql.placeholder("expires"),
    createdAt: sql.placeholder("createdAt"),
    updatedAt: sql.placeholder("updatedAt"),
    userId: sql.placeholder("userId"),
  })
  .returning()
  .prepare()

const insertVerificationTokenQuery = db
  .insert(verificationToken)
  .values({
    id: sql.placeholder("id"),
    token: sql.placeholder("token"),
    email: sql.placeholder("email"),
    expires: sql.placeholder("expires"),
    createdAt: sql.placeholder("createdAt"),
    updatedAt: sql.placeholder("updatedAt"),
    userId: sql.placeholder("userId"),
  })
  .returning()
  .prepare()

const findOtpTokenQuery = db
  .select()
  .from(otpToken)
  .where(eq(otpToken.otp, sql.placeholder("otp")))
  .prepare()

const insertOtpTokenQuery = db
  .insert(otpToken)
  .values({
    id: sql.placeholder("id"),
    userId: sql.placeholder("userId"),
    email: sql.placeholder("email"),
    otp: sql.placeholder("otp"),
    createdAt: sql.placeholder("createdAt"),
  })
  .returning()
  .prepare()

const deleteOtpTokenQuery = db
  .delete(otpToken)
  .where(
    and(
      eq(otpToken.email, sql.placeholder("email")),
      eq(otpToken.userId, sql.placeholder("userId")),
    ),
  )
  .returning()
  .prepare()
export {
  findResetPasswordTokenQuery,
  deleteResetPasswordTokenQuery,
  insertResetTokenQuery,
  insertVerificationTokenQuery,
  findVerifyEmailTokenQuery,
  deleteVerifyEmailTokenQuery,
  findOtpTokenQuery,
  insertOtpTokenQuery,
  deleteOtpTokenQuery,
}
