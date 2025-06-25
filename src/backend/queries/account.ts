import { eq, inArray, sql } from "drizzle-orm"
import { db } from "@/config/drizzle"
import { account } from "../db/schemas"

const findByAccountUserIdQuery = db
  .select({
    id: account.id,
    userId: account.userId,
    providerType: account.providerType,
    twoFactorSecret: account.twoFactorSecret,
    accessToken: account.accessToken,
    accessTokenExpiresAt: account.accessTokenExpiresAt,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
    otpSignIn: account.otpSignIn,
    salt: account.salt,
    accountId: account.accountId,
    password: account.password,
  })
  .from(account)
  .where(eq(account.userId, sql.placeholder("accountUserId")))
  .limit(1)
  .prepare()

const deleteByUserIdQuery = db
  .delete(account)
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const deleteByArrayUserIdsQuery = db
  .delete(account)
  .where(inArray(account.userId, sql.placeholder("userIds")))
  .returning()
  .prepare()

const updateAccountPasswordQuery = db
  .update(account)
  .set({
    password: sql`${sql.placeholder("password")}`,
    salt: sql`${sql.placeholder("salt")}`,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const updateAccountSessionQuery = db
  .update(account)
  .set({
    accessToken: sql`${sql.placeholder("accessToken")}`,
    accessTokenExpiresAt: sql`${sql.placeholder("accessTokenExpiresAt")}`,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const emptyAccountSessionQuery = db
  .update(account)
  .set({
    accessToken: null,
    accessTokenExpiresAt: null,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const insertAccountQuery = db
  .insert(account)
  .values({
    id: sql.placeholder("accountId"),
    accountId: sql.placeholder("accountIdValue"),
    userId: sql.placeholder("userIdFk"),
    providerType: sql.placeholder("providerType"),
    password: sql.placeholder("password"),
    salt: sql.placeholder("salt"),
    otpSignIn: sql.placeholder("otpSignIn"),
  })
  .returning()
  .prepare()

const updateAccountTwoFactorSecretQuery = db
  .update(account)
  .set({
    twoFactorSecret: sql`${sql.placeholder("twoFactorSecret")}`,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const emptyAccountTwoFactorSecretQuery = db
  .update(account)
  .set({
    twoFactorSecret: null,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const updateAccountOtpSignInQuery = db
  .update(account)
  .set({
    otpSignIn: sql`${sql.placeholder("otpSignIn")}`,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const emptyAccountOtpSignInQuery = db
  .update(account)
  .set({
    otpSignIn: false,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

export {
  deleteByUserIdQuery,
  deleteByArrayUserIdsQuery,
  updateAccountPasswordQuery,
  updateAccountSessionQuery,
  emptyAccountSessionQuery,
  insertAccountQuery,
  findByAccountUserIdQuery,
  updateAccountTwoFactorSecretQuery,
  emptyAccountTwoFactorSecretQuery,
  updateAccountOtpSignInQuery,
  emptyAccountOtpSignInQuery,
}
