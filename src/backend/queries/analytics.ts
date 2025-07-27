import {
  expenseTransaction,
  fundRequest,
  igp,
  igpSupply,
  igpTransactions,
  locker,
  lockerRental,
  user,
  waterFunds,
  waterVendo,
} from "@/backend/db/schemas"
import { db } from "@/config/drizzle"
import { and, eq, isNotNull, or, sql } from "drizzle-orm"
import { getAssignedOfficers } from "../helpers/find-assigned-officers"

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
      totalQuantity: sql<number>`sum(${igpSupply.quantity})`.as(
        "totalQuantity",
      ),
      remainingQuantity:
        sql<number>`sum(${igpSupply.quantity} - ${igpSupply.quantitySold})`.as(
          "remainingQuantity",
        ),
      totalExpenses: sql<number>`sum(${igpSupply.expenses})`.as(
        "totalExpenses",
      ),
      netProfit:
        sql<number>`sum(${igpSupply.totalRevenue} - ${igpSupply.expenses})`.as(
          "netProfit",
        ),
    })
    .from(igp)
    .leftJoin(igpSupply, eq(igp.id, igpSupply.igpId))
    .where(eq(igp.status, "completed"))
    .groupBy(igp.id)
    .orderBy(igp.igpName)
    .execute()

  return igpData.map((igp) => ({
    id: igp.id,
    name: igp.igpName,
    revenue: igp.igpRevenue,
    expenses: igp.totalExpenses || 0,
    netProfit: igp.netProfit || 0,
    totalSold: igp.totalSold,
    costPerItem: igp.costPerItem,
    status: igp.status,
    createdAt: igp.createdAt,
    totalQuantity: igp.totalQuantity || 0,
    remainingQuantity: igp.remainingQuantity || 0,
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

export async function getKeyMetrics() {
  const [
    currentPeriodData,
    previousPeriodData,
    topIgpByRevenue,
    topIgpByQuantity,
    transactionCountData,
  ] = await Promise.all([
    db
      .select({
        currentIgpRevenue: sql<number>`COALESCE(SUM(${igp.igpRevenue}), 0)`,
        currentLockerRevenue: sql<number>`COALESCE(SUM(${locker.lockerRentalPrice}), 0)`,
        currentWaterRevenue: sql<number>`COALESCE(SUM(${waterFunds.waterFundsRevenue}), 0)`,
        currentWaterProfit: sql<number>`COALESCE(SUM(${waterFunds.waterFundsProfit}), 0)`,
      })
      .from(igp)
      .leftJoin(lockerRental, sql`1=1`)
      .leftJoin(locker, sql`${lockerRental.lockerId} = ${locker.id}`)
      .leftJoin(waterFunds, sql`1=1`)
      .where(
        sql`${igp.createdAt} >= datetime('now', '-30 days') 
        AND ${lockerRental.paymentStatus} = 'paid'`,
      )
      .execute()
      .then(
        (res) =>
          res[0] ?? {
            currentIgpRevenue: 0,
            currentLockerRevenue: 0,
            currentWaterRevenue: 0,
            currentWaterProfit: 0,
          },
      ),

    db
      .select({
        prevIgpRevenue: sql<number>`COALESCE(SUM(${igp.igpRevenue}), 0)`,
        prevLockerRevenue: sql<number>`COALESCE(SUM(${locker.lockerRentalPrice}), 0)`,
        prevWaterRevenue: sql<number>`COALESCE(SUM(${waterFunds.waterFundsRevenue}), 0)`,
        prevWaterProfit: sql<number>`COALESCE(SUM(${waterFunds.waterFundsProfit}), 0)`,
      })
      .from(igp)
      .leftJoin(lockerRental, sql`1=1`)
      .leftJoin(locker, sql`${lockerRental.lockerId} = ${locker.id}`)
      .leftJoin(waterFunds, sql`1=1`)
      .where(
        sql`${igp.createdAt} BETWEEN datetime('now', '-60 days') AND datetime('now', '-30 days')
        AND ${lockerRental.paymentStatus} = 'paid'`,
      )
      .execute()
      .then(
        (res) =>
          res[0] ?? {
            prevIgpRevenue: 0,
            prevLockerRevenue: 0,
            prevWaterRevenue: 0,
            prevWaterProfit: 0,
          },
      ),

    db
      .select({
        igpName: igp.igpName,
        igpType: igp.igpType,
        igpRevenue: sql<number>`SUM(${igp.igpRevenue})`,
      })
      .from(igp)
      .where(sql`${igp.createdAt} >= datetime('now', '-30 days')`)
      .groupBy(igp.id)
      .orderBy(sql`SUM(${igp.igpRevenue}) DESC`)
      .limit(1)
      .execute()
      .then((res) => res[0] ?? null),

    db
      .select({
        igpName: igp.igpName,
        igpType: igp.igpType,
        totalQuantity: sql<number>`SUM(${igp.totalSold})`,
      })
      .from(igp)
      .groupBy(igp.id)
      .orderBy(sql`SUM(${igp.totalSold}) DESC`)
      .limit(1)
      .execute()
      .then((res) => res[0] ?? null),

    db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(igp)
      .where(sql`${igp.createdAt} >= datetime('now', '-30 days')`)
      .execute()
      .then((res) => res[0]?.count ?? 0),
  ])

  const totalRevenueData = await db
    .select({
      totalRevenue: sql<number>`
        COALESCE(SUM(${igp.igpRevenue}), 0) + 
        COALESCE((SELECT SUM(${locker.lockerRentalPrice}) 
                 FROM ${lockerRental} 
                 LEFT JOIN ${locker} ON ${lockerRental.lockerId} = ${locker.id}
                 WHERE ${lockerRental.createdAt} >= datetime('now', '-30 days')
                 AND ${lockerRental.paymentStatus} = 'paid'), 0) +
        COALESCE(SUM(${waterFunds.waterFundsRevenue}), 0)
      `,
    })
    .from(igp)
    .leftJoin(waterFunds, sql`1=1`)
    .where(sql`${igp.createdAt} >= datetime('now', '-30 days')`)
    .execute()
    .then((res) => res[0]?.totalRevenue ?? 0)

  const currentTotalRevenue =
    currentPeriodData.currentIgpRevenue +
    currentPeriodData.currentLockerRevenue +
    currentPeriodData.currentWaterRevenue
  const currentTotalProfit =
    currentPeriodData.currentIgpRevenue +
    currentPeriodData.currentLockerRevenue +
    currentPeriodData.currentWaterProfit

  const prevTotalRevenue =
    previousPeriodData.prevIgpRevenue +
    previousPeriodData.prevLockerRevenue +
    previousPeriodData.prevWaterRevenue
  const prevTotalProfit =
    previousPeriodData.prevIgpRevenue +
    previousPeriodData.prevLockerRevenue +
    previousPeriodData.prevWaterProfit

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const salesGrowth = calculateGrowth(currentTotalRevenue, prevTotalRevenue)
  const profitGrowth = calculateGrowth(currentTotalProfit, prevTotalProfit)

  const topIgp = topIgpByRevenue
    ? {
        igpName: topIgpByRevenue.igpName,
        igpType: topIgpByRevenue.igpType,
        percentageOfTotal:
          totalRevenueData > 0
            ? (topIgpByRevenue.igpRevenue / totalRevenueData) * 100
            : 0,
        metric: "revenue" as const,
      }
    : topIgpByQuantity
      ? {
          igpName: topIgpByQuantity.igpName,
          igpType: topIgpByQuantity.igpType,
          percentageOfTotal: 0,
          metric: "quantity" as const,
        }
      : null

  return {
    salesGrowth,
    profitGrowth,
    topIgp,
    transactionCount: transactionCountData,
  }
}

export async function getIgpFinancialData() {
  const reportPeriod = new Date().getTime()

  const igps = await db.query.igp.findMany({
    with: {
      supplies: true,
      transactions: {
        with: {
          supply: true,
        },
      },
    },
  })

  const formattedIgps = igps.map((igpData) => {
    const revenue = igpData.transactions.reduce(
      (sum, txn) => sum + txn.quantity * (txn.supply?.unitPrice || 0),
      0,
    )

    const expenses = igpData.supplies.reduce(
      (sum, supply) => sum + supply.expenses,
      0,
    )

    const netProfit = revenue - expenses
    const profitMargin =
      revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0
    const totalTransactions = igpData.transactions.length
    const avgTransaction =
      totalTransactions > 0 ? Math.round(revenue / totalTransactions) : 0

    const transactions = [
      ...igpData.transactions.map((txn) => ({
        date: txn.dateBought.getTime(),
        description: `Purchase of ${igpData.igpName}`,
        amount: txn.quantity * (txn.supply?.unitPrice || 0),
        type: "Revenue" as const,
      })),
      ...igpData.supplies.map((supply) => ({
        date: supply.supplyDate.getTime(),
        description: "Supply Expense",
        amount: -supply.expenses,
        type: "Expense" as const,
      })),
    ]

    return {
      name: igpData.igpName,
      type: igpData.iconType === "service" ? "Service" : "Product",
      startDate: igpData.igpStartDate?.getTime() || 0,
      endDate: igpData.igpEndDate?.getTime() || 0,
      assignedOfficers: igpData.assignedOfficers || [],
      totalRevenue: revenue,
      totalExpenses: expenses,
      netProfit,
      totalTransactions,
      averageTransaction: avgTransaction,
      profitMargin,
      transactions,
    }
  })

  return {
    reportPeriod,
    dateGenerated: new Date().getTime(),
    igps: formattedIgps,
  }
}

export async function getDuePayments() {
  const currentDate = new Date()

  const allRentals = await db
    .select({
      id: lockerRental.id,
      lockerId: lockerRental.lockerId,
      renterId: lockerRental.renterId,
      renterName: lockerRental.renterName,
      courseAndSet: lockerRental.courseAndSet,
      rentalStatus: lockerRental.rentalStatus,
      paymentStatus: lockerRental.paymentStatus,
      dateDue: lockerRental.dateDue,
      renterEmail: lockerRental.renterEmail,
      lockerPrice: locker.lockerRentalPrice,
      lockerName: locker.lockerName,
    })
    .from(lockerRental)
    .leftJoin(locker, eq(lockerRental.lockerId, locker.id))
    .where(
      and(
        isNotNull(lockerRental.dateDue),
        or(
          eq(lockerRental.paymentStatus, "unpaid"),
          eq(lockerRental.paymentStatus, "pending"),
        ),
      ),
    )
    .all()

  const overdueStudents = []
  const dueStudents = []

  for (const rental of allRentals) {
    if (!rental.dateDue) continue

    const dueDate = new Date(rental.dateDue)

    if (Number.isNaN(dueDate.getTime())) {
      continue
    }

    const startOfCurrentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    )
    const startOfDueDate = new Date(
      dueDate.getFullYear(),
      dueDate.getMonth(),
      dueDate.getDate(),
    )

    const timeDifference =
      startOfDueDate.getTime() - startOfCurrentDate.getTime()
    const daysDifference = Math.round(timeDifference / (1000 * 60 * 60 * 24))

    const studentData = {
      studentId: rental.renterId,
      studentName: rental.renterName,
      courseAndSet: rental.courseAndSet,
      igpType: "Locker Rental",
      lockerId: rental.lockerName || rental.lockerId,
      amountDue: rental.lockerPrice || 0,
      dateDue: dueDate.getTime(),
      contactEmail: rental.renterEmail || "",
    }

    if (daysDifference < 0) {
      overdueStudents.push({
        ...studentData,
      })
    } else {
      dueStudents.push({
        ...studentData,
      })
    }
  }

  return {
    reportPeriod: currentDate.getTime(),
    dateGenerated: new Date().getTime(),
    overdueStudents,
    dueStudents,
  }
}

export async function getIgpStatus() {
  const currentYear = new Date().getFullYear()
  const reportPeriod = `Academic Year ${currentYear}-${currentYear + 1}`

  const allUsers = await db.select().from(user).all()
  const userMap = new Map(allUsers.map((u) => [u.id, u]))

  const activeIgps = await db
    .select({
      id: igp.id,
      name: igp.igpName,
      type: sql<string>`CASE WHEN ${igp.iconType} = 'service' THEN 'Service' ELSE 'Product' END`,
      description: igp.igpDescription,
      startDate: sql<number>`${igp.igpStartDate}`,
      assignedOfficers: igp.assignedOfficers,
      revenue: sql<number>`COALESCE(SUM(${igpTransactions.quantity} * ${igpSupply.unitPrice}), 0)`,
      status: sql<string>`CASE 
        WHEN ${igp.status} = 'completed' THEN 'Operational'
        WHEN ${igp.status} = 'in_progress' THEN 'Operational'
        ELSE 'Pending'
      END`,
    })
    .from(igp)
    .leftJoin(igpSupply, eq(igp.id, igpSupply.igpId))
    .leftJoin(igpTransactions, eq(igpSupply.id, igpTransactions.igpSupplyId))
    .where(
      and(
        isNotNull(igp.igpStartDate),
        or(eq(igp.status, "completed"), eq(igp.status, "in_progress")),
      ),
    )
    .groupBy(igp.id)
    .orderBy(igp.igpName)
    .all()

  const objectives = await db
    .select({
      id: igp.id,
      name: igp.igpName,
      type: sql<string>`CASE WHEN ${igp.iconType} = 'service' THEN 'Service' ELSE 'Product' END`,
      description: igp.igpDescription,
      dateCompleted: sql<number>`${igp.igpEndDate}`,
      igpRevenue: sql<number>`COALESCE(${igp.igpRevenue}, 0)`,
      progress: sql<number>`CASE
        WHEN ${igp.status} = 'pending' THEN 20
        WHEN ${igp.status} = 'approved' THEN 50
        WHEN ${igp.status} = 'in_review' THEN 75
        ELSE 0
      END`,
      status: sql<string>`CASE
        WHEN ${igp.status} = 'pending' THEN 'In Planning'
        WHEN ${igp.status} = 'approved' THEN 'In Development'
        WHEN ${igp.status} = 'in_review' THEN 'Ready to Launch'
        ELSE 'Pending'
      END`,
    })
    .from(igp)
    .where(
      and(
        isNotNull(igp.igpEndDate),
        or(
          eq(igp.status, "pending"),
          eq(igp.status, "approved"),
          eq(igp.status, "in_review"),
        ),
      ),
    )
    .orderBy(igp.igpName)
    .all()

  const forRepair = await db
    .select({
      id: igp.id,
      name: igp.igpName,
      type: sql<string>`CASE WHEN ${igp.iconType} = 'service' THEN 'Service' ELSE 'Product' END`,
      description: igp.igpDescription,
      issueDate: sql<string>`strftime('%Y-%m-%d', datetime(${igp.updatedAt}, 'unixepoch'))`,
      expectedRepair: sql<string>`strftime('%Y-%m-%d', datetime(${igp.igpEndDate}, 'unixepoch'))`,
      lastRevenue: sql<number>`COALESCE(SUM(${igpTransactions.quantity} * ${igpSupply.unitPrice}), 0)`,
      status: sql<string>`CASE
        WHEN ${igp.status} = 'rejected' THEN 'Design Revision'
        WHEN ${igp.igpType} = 'maintenance' THEN 'Under Maintenance'
        ELSE 'Equipment Repair'
      END`,
    })
    .from(igp)
    .leftJoin(igpSupply, eq(igp.id, igpSupply.igpId))
    .leftJoin(igpTransactions, eq(igpSupply.id, igpTransactions.igpSupplyId))
    .where(or(eq(igp.status, "rejected"), eq(igp.igpType, "maintenance")))
    .groupBy(igp.id)
    .orderBy(igp.igpName)
    .all()

  return {
    reportPeriod,
    dateGenerated: new Date().toLocaleDateString(),
    active: activeIgps.map((igp) => ({
      id: igp.id,
      name: igp.name,
      type: igp.type,
      description: igp.description || "",
      startDate: igp.startDate,
      assignedOfficers: getAssignedOfficers(igp.assignedOfficers, userMap),
      revenue: igp.revenue,
      status: igp.status,
    })),
    objectives: objectives.map((obj) => ({
      id: obj.id,
      name: obj.name,
      type: obj.type,
      description: obj.description || "",
      dateCompleted: obj.dateCompleted,
      igpRevenue: obj.igpRevenue,
      progress: obj.progress,
      status: obj.status,
    })),
    forRepair: forRepair.map((repair) => ({
      id: repair.id,
      name: repair.name,
      type: repair.type,
      description: repair.description || "",
      issueDate: repair.issueDate,
      expectedRepair: repair.expectedRepair,
      lastRevenue: repair.lastRevenue,
      status: repair.status,
    })),
  }
}
