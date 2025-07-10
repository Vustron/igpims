import {
  fundRequest,
  locker,
  lockerRental,
  waterFunds,
} from "@/backend/db/schemas"
import { db } from "@/config/drizzle"
import { sql } from "drizzle-orm"

const insertFundRequestQuery = db
  .insert(fundRequest)
  .values({
    id: sql`${sql.placeholder("id")}`,
    purpose: sql`${sql.placeholder("purpose")}`,
    amount: sql`${sql.placeholder("amount")}`,
    status: sql`${sql.placeholder("status")}`,
    requestedBy: sql`${sql.placeholder("requestedBy")}`,
    requestorPosition: sql`${sql.placeholder("requestorPosition")}`,
    requestDate: sql`${sql.placeholder("requestDate")}`,
    dateNeeded: sql`${sql.placeholder("dateNeeded")}`,
  })
  .returning()
  .prepare()

export async function getTotalProfit() {
  const lockerRevenue = await db
    .select({
      totalLockerRevenue: sql<number>`
        COALESCE(SUM(${locker.lockerRentalPrice}), 0)`.as(
        "total_locker_revenue",
      ),
    })
    .from(lockerRental)
    .leftJoin(locker, sql`${lockerRental.lockerId} = ${locker.id}`)
    .where(sql`${lockerRental.paymentStatus} = 'paid'`)
    .execute()
    .then((res) => res[0]?.totalLockerRevenue ?? 0)

  const waterFundsData = await db
    .select({
      totalWaterRevenue: sql<number>`COALESCE(SUM(${waterFunds.waterFundsRevenue}), 0)`,
      totalWaterExpenses: sql<number>`COALESCE(SUM(${waterFunds.waterFundsExpenses}), 0)`,
      totalWaterProfit: sql<number>`COALESCE(SUM(${waterFunds.waterFundsProfit}), 0)`,
    })
    .from(waterFunds)
    .execute()
    .then(
      (res) =>
        res[0] ?? {
          totalWaterRevenue: 0,
          totalWaterExpenses: 0,
          totalWaterProfit: 0,
        },
    )

  return {
    totalLockerRevenue: lockerRevenue,
    ...waterFundsData,
    totalProfit:
      lockerRevenue +
      (waterFundsData.totalWaterProfit || 0) -
      waterFundsData.totalWaterExpenses,
  }
}

export { insertFundRequestQuery }
