"use client"

import { useFindTotalProfit } from "@/backend/actions/analytics/find-total-profit"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { GiClothes, GiDroplets, GiLockers } from "react-icons/gi"
import { DashboardCard } from "./dashboard-card"
import { DashboardSkeleton } from "./dashboard-skeleton"
import { IgpPerformance } from "./igp-performance"
import { RevenueAnalytics } from "./revenue-analytics"
import { SalesOverview } from "./sales-overview"

export const DashboardClient = () => {
  const pathname = usePathname()
  const fetchProfitLoss = pathname === "/"
  const { data, isLoading } = useFindTotalProfit({
    isEnabled: fetchProfitLoss,
  })

  if (isLoading) {
    return <DashboardSkeleton />
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const dashboardItems = [
    {
      id: "1",
      title: "Locker Rentals",
      amount: `₱${data?.data.totalLockerRevenue.toLocaleString() ?? "0"}`,
      metric: `${data?.data.activeLockersCount ?? 0} Active Lockers`,
      percentageChange: data?.data.activeLockersPercentageChange ?? "+0%",
      trendDescription: "Active Lockers",
      icon: <GiLockers className="h-6 w-6 text-indigo-500" />,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      id: "2",
      title: "Water Vendo",
      amount: `₱${data?.data.totalWaterRevenue.toLocaleString() ?? "0"}`,
      metric: `${data?.data.activeMachinesCount ?? 0} Active Machines`,
      percentageChange: data?.data.activeMachinesPercentageChange ?? "+0%",
      trendDescription: "Active Machines",
      icon: <GiDroplets className="h-6 w-6 text-blue-500" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      id: "3",
      title: "Other IGPs",
      amount: `₱${data?.data.totalIgpRevenue.toLocaleString() ?? "0"}`,
      metric: `${data?.data.totalIgpSold ?? 0} Total Items`,
      percentageChange: data?.data.igpPercentageChange ?? "+0%",
      trendDescription: "Revenue",
      icon: <GiClothes className="h-6 w-6 text-emerald-500" />,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
  ]

  return (
    <div className="p-5">
      <motion.div variants={itemVariants}>
        <DashboardCard items={dashboardItems} />
      </motion.div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="md:col-span-3">
          <IgpPerformance profitData={data} />
        </div>
        <div className="md:col-span-2">
          <div className="mb-2">
            <RevenueAnalytics analyticsData={data} />
          </div>
          <div className="mb-2">
            <SalesOverview analyticsData={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
