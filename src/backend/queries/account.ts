import { account } from "@/schemas/drizzle-schema"
import { eq, inArray, sql } from "drizzle-orm"
import { db } from "@/config/drizzle"

const findByAccountUserIdQuery = db
  .select()
  .from(account)
  .where(eq(account.userId, sql.placeholder("accountUserId")))
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
    updatedAt: sql`${sql.placeholder("updatedAt")}`,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const updateAccountSessionQuery = db
  .update(account)
  .set({
    accessToken: sql`${sql.placeholder("accessToken")}`,
    accessTokenExpiresAt: sql`${sql.placeholder("accessTokenExpiresAt")}`,
    updatedAt: sql`${sql.placeholder("updatedAt")}`,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const emptyAccountSessionQuery = db
  .update(account)
  .set({
    accessToken: null,
    accessTokenExpiresAt: null,
    updatedAt: sql`${sql.placeholder("updatedAt")}`,
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
    createdAt: sql.placeholder("accountCreatedAt"),
    updatedAt: sql.placeholder("accountUpdatedAt"),
  })
  .returning()
  .prepare()

const updateAccountTwoFactorSecretQuery = db
  .update(account)
  .set({
    twoFactorSecret: sql`${sql.placeholder("twoFactorSecret")}`,
    updatedAt: sql`${sql.placeholder("updatedAt")}`,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const emptyAccountTwoFactorSecretQuery = db
  .update(account)
  .set({
    twoFactorSecret: null,
    updatedAt: sql`${sql.placeholder("updatedAt")}`,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const updateAccountOtpSignInQuery = db
  .update(account)
  .set({
    otpSignIn: sql`${sql.placeholder("otpSignIn")}`,
    updatedAt: sql`${sql.placeholder("updatedAt")}`,
  })
  .where(eq(account.userId, sql.placeholder("userId")))
  .returning()
  .prepare()

const emptyAccountOtpSignInQuery = db
  .update(account)
  .set({
    otpSignIn: false,
    updatedAt: sql`${sql.placeholder("updatedAt")}`,
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
