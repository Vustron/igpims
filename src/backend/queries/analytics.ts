import {
  expenseTransaction,
  fundRequest,
  igp,
  locker,
  lockerRental,
  waterFunds,
  waterVendo,
} from "@/backend/db/schemas"
import { db } from "@/config/drizzle"
import { sql } from "drizzle-orm"

export async function getMonthlyRevenueData() {
  const currentYear = new Date().getFullYear()

  const igpMonthlyData = await db
    .select({
      month: sql<number>`strftime('%m', datetime(${igp.createdAt}, 'unixepoch')) as month`,
      revenue: sql<number>`SUM(${igp.igpRevenue})`,
    })
    .from(igp)
    .where(
      sql`strftime('%Y', datetime(${igp.createdAt}, 'unixepoch')) = ${currentYear.toString()}`,
    )
    .groupBy(sql`month`)
    .execute()

  const lockerMonthlyData = await db
    .select({
      month: sql<number>`strftime('%m', datetime(${lockerRental.createdAt}, 'unixepoch')) as month`,
      revenue: sql<number>`SUM(${locker.lockerRentalPrice})`,
    })
    .from(lockerRental)
    .leftJoin(locker, sql`${lockerRental.lockerId} = ${locker.id}`)
    .where(
      sql`strftime('%Y', datetime(${lockerRental.createdAt}, 'unixepoch')) = ${currentYear.toString()} 
      AND ${lockerRental.paymentStatus} = 'paid'`,
    )
    .groupBy(sql`month`)
    .execute()

  const waterMonthlyData = await db
    .select({
      month: sql<number>`strftime('%m', datetime(${waterFunds.createdAt}, 'unixepoch')) as month`,
      revenue: sql<number>`SUM(${waterFunds.waterFundsProfit})`,
    })
    .from(waterFunds)
    .where(
      sql`strftime('%Y', datetime(${waterFunds.createdAt}, 'unixepoch')) = ${currentYear.toString()}`,
    )
    .groupBy(sql`month`)
    .execute()

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ]

  const result = months.map((monthName, index) => {
    const monthNumber = (index + 1).toString().padStart(2, "0")

    const igpMonth = igpMonthlyData.find(
      (m) => m.month.toString().padStart(2, "0") === monthNumber,
    )
    const lockerMonth = lockerMonthlyData.find(
      (m) => m.month.toString().padStart(2, "0") === monthNumber,
    )
    const waterMonth = waterMonthlyData.find(
      (m) => m.month.toString().padStart(2, "0") === monthNumber,
    )

    return {
      month: monthName,
      igpRevenue: igpMonth?.revenue || 0,
      lockerRentals: lockerMonth?.revenue || 0,
      waterVendo: waterMonth?.revenue || 0,
    }
  })

  return result
}

export async function getAllIgpRevenue() {
  const igpData = await db
    .select({
      id: igp.id,
      igpName: igp.igpName,
      igpRevenue: igp.igpRevenue,
      totalSold: igp.totalSold,
      costPerItem: igp.costPerItem,
      status: igp.status,
      createdAt: sql<number>`${igp.createdAt}`,
    })
    .from(igp)
    .orderBy(igp.igpName)
    .execute()

  return igpData.map((igp) => ({
    id: igp.id,
    name: igp.igpName,
    revenue: igp.igpRevenue,
    totalSold: igp.totalSold,
    costPerItem: igp.costPerItem,
    status: igp.status,
    createdAt: igp.createdAt,
  }))
}

export async function getTotalProfit() {
  const [
    igpRevenueData,
    lockerRevenue,
    waterFundsData,
    totalExpenses,
    fundRequestsData,
    activeLockersCount,
    activeMachinesCount,
    previousPeriodData,
  ] = await Promise.all([
    db
      .select({
        totalIgpRevenue: sql<number>`COALESCE(SUM(${igp.igpRevenue}), 0)`,
        totalIgpSold: sql<number>`COALESCE(SUM(${igp.totalSold}), 0)`,
      })
      .from(igp)
      .execute()
      .then((res) => res[0] ?? { totalIgpRevenue: 0, totalIgpSold: 0 }),

    db
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
      .then((res) => res[0]?.totalLockerRevenue ?? 0),

    db
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
      ),

    db
      .select({
        totalExpenseAmount: sql<number>`COALESCE(SUM(${expenseTransaction.amount}), 0)`,
      })
      .from(expenseTransaction)
      .execute()
      .then((res) => res[0]?.totalExpenseAmount ?? 0),

    db
      .select({
        totalAllocatedFunds: sql<number>`COALESCE(SUM(${fundRequest.allocatedFunds}), 0)`,
        totalUtilizedFunds: sql<number>`COALESCE(SUM(${fundRequest.utilizedFunds}), 0)`,
      })
      .from(fundRequest)
      .execute()
      .then(
        (res) =>
          res[0] ?? {
            totalAllocatedFunds: 0,
            totalUtilizedFunds: 0,
          },
      ),
    db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(lockerRental)
      .where(
        sql`${lockerRental.rentalStatus} IN ('active', 'reserved') AND ${lockerRental.paymentStatus} = 'paid'`,
      )
      .execute()
      .then((res) => res[0]?.count ?? 0),
    db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(waterVendo)
      .where(sql`${waterVendo.vendoStatus} = 'operational'`)
      .execute()
      .then((res) => res[0]?.count ?? 0),
    db
      .select({
        prevIgpRevenue: sql<number>`COALESCE(SUM(${igp.igpRevenue}), 0)`,
        prevLockerRevenue: sql<number>`
        COALESCE(SUM(${locker.lockerRentalPrice}), 0)`,
        prevWaterRevenue: sql<number>`COALESCE(SUM(${waterFunds.waterFundsRevenue}), 0)`,
        prevActiveLockers: sql<number>`(
        SELECT COUNT(*) FROM ${lockerRental} 
        WHERE ${lockerRental.rentalStatus} IN ('active', 'reserved') 
        AND ${lockerRental.paymentStatus} = 'paid'
        AND ${lockerRental.createdAt} >= datetime('now', '-30 days')
      )`,
        prevActiveMachines: sql<number>`(
        SELECT COUNT(*) FROM ${waterVendo} 
        WHERE ${waterVendo.vendoStatus} = 'operational'
        AND ${waterVendo.createdAt} >= datetime('now', '-30 days')
      )`,
      })
      .from(igp)
      .leftJoin(lockerRental, sql`1=1`)
      .leftJoin(locker, sql`${lockerRental.lockerId} = ${locker.id}`)
      .leftJoin(waterFunds, sql`1=1`)
      .where(sql`${igp.createdAt} >= datetime('now', '-30 days')`)
      .execute()
      .then(
        (res) =>
          res[0] ?? {
            prevIgpRevenue: 0,
            prevLockerRevenue: 0,
            prevWaterRevenue: 0,
            prevActiveLockers: 0,
            prevActiveMachines: 0,
          },
      ),
  ])

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%"
    const change = ((current - previous) / previous) * 100
    return `${change >= 0 ? "+" : ""}${Math.round(change)}%`
  }

  const igpPercentageChange = calculatePercentageChange(
    igpRevenueData.totalIgpRevenue,
    previousPeriodData.prevIgpRevenue,
  )
  const lockerPercentageChange = calculatePercentageChange(
    lockerRevenue,
    previousPeriodData.prevLockerRevenue,
  )
  const waterPercentageChange = calculatePercentageChange(
    waterFundsData.totalWaterRevenue,
    previousPeriodData.prevWaterRevenue,
  )
  const activeLockersPercentageChange = calculatePercentageChange(
    activeLockersCount,
    previousPeriodData.prevActiveLockers,
  )
  const activeMachinesPercentageChange = calculatePercentageChange(
    activeMachinesCount,
    previousPeriodData.prevActiveMachines,
  )

  const totalRevenue =
    igpRevenueData.totalIgpRevenue +
    lockerRevenue +
    waterFundsData.totalWaterRevenue

  const totalExpenseAmount =
    waterFundsData.totalWaterExpenses + fundRequestsData.totalUtilizedFunds

  const netProfit = totalRevenue - totalExpenseAmount

  return {
    totalIgpRevenue: igpRevenueData.totalIgpRevenue,
    totalIgpSold: igpRevenueData.totalIgpSold,
    totalLockerRevenue: lockerRevenue,
    totalWaterRevenue: waterFundsData.totalWaterRevenue,
    totalWaterExpenses: waterFundsData.totalWaterExpenses,
    totalExpenseTransactions: totalExpenses,
    totalFundsUtilized: fundRequestsData.totalUtilizedFunds,
    totalFundRequests: fundRequestsData.totalAllocatedFunds,
    totalRevenue,
    totalExpenses: totalExpenseAmount,
    netProfit,
    totalWaterProfit: waterFundsData.totalWaterProfit,
    activeLockersCount,
    activeMachinesCount,
    igpPercentageChange,
    lockerPercentageChange,
    waterPercentageChange,
    activeLockersPercentageChange,
    activeMachinesPercentageChange,
  }
}
