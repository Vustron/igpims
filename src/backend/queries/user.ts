import { account, user } from "@/backend/db/schemas"
import { eq, inArray, sql, ne, and } from "drizzle-orm"
import { db } from "@/config/drizzle"

const findByUserIdQuery = db
  .select()
  .from(user)
  .where(eq(user.id, sql.placeholder("userId")))
  .prepare()

const deleteByUserIdQuery = db
  .delete(user)
  .where(eq(user.id, sql.placeholder("userId")))
  .returning()
  .prepare()

const findManyByUserIdsQuery = db
  .select()
  .from(user)
  .where(inArray(user.id, sql.placeholder("userIds")))
  .prepare()

const deleteByArrayUserIds = db
  .delete(user)
  .where(inArray(user.id, sql.placeholder("userIds")))
  .returning()
  .prepare()

const FindManyButExcludeCurrentUserQuery = db
  .select()
  .from(user)
  .where(ne(user.id, sql.placeholder("userId")))
  .prepare()

const findByEmailQuery = db
  .select()
  .from(user)
  .where(eq(user.email, sql.placeholder("email")))
  .prepare()

const findByMatchingCredentialsQuery = db
  .select({
    user: user,
    accounts: account,
  })
  .from(user)
  .leftJoin(account, eq(user.id, account.userId))
  .where(
    and(
      eq(user.email, sql.placeholder("email")),
      eq(account.providerType, "credentials"),
    ),
  )
  .prepare()

const insertUserQuery = db
  .insert(user)
  .values({
    id: sql.placeholder("userId"),
    name: sql.placeholder("name"),
    email: sql.placeholder("email"),
    emailVerified: sql.placeholder("emailVerified"),
    sessionExpired: sql`0`,
    role: sql.placeholder("role"),
    createdAt: sql.placeholder("userCreatedAt"),
    updatedAt: sql.placeholder("userUpdatedAt"),
  })
  .returning()
  .prepare()

const updateUserQuery = db
  .update(user)
  .set({
    name: sql`${sql.placeholder("name")}`,
    email: sql`${sql.placeholder("email")}`,
    image: sql`${sql.placeholder("image")}`,
    emailVerified: sql`${sql.placeholder("emailVerified")}`,
    updatedAt: sql`${sql.placeholder("updatedAt")}`,
  })
  .where(eq(user.id, sql.placeholder("updateUserId")))
  .returning()
  .prepare()

const verifyUserEmailQuery = db
  .update(user)
  .set({
    emailVerified: sql`${sql.placeholder("emailVerified")}`,
    updatedAt: sql`${sql.placeholder("updatedAt")}`,
  })
  .where(eq(user.id, sql.placeholder("userId")))
  .returning()
  .prepare()

const updateUserSessionExpiredQuery = db
  .update(user)
  .set({
    sessionExpired: sql`${sql.placeholder("sessionExpired")}`,
    updatedAt: sql`${sql.placeholder("updatedAt")}`,
  })
  .where(eq(user.id, sql.placeholder("userId")))
  .returning()
  .prepare()

export {
  findByUserIdQuery,
  findManyByUserIdsQuery,
  deleteByUserIdQuery,
  deleteByArrayUserIds,
  FindManyButExcludeCurrentUserQuery,
  findByEmailQuery,
  findByMatchingCredentialsQuery,
  insertUserQuery,
  updateUserQuery,
  verifyUserEmailQuery,
  updateUserSessionExpiredQuery,
}
