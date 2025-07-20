"use client"

import { useFindTotalProfit } from "@/backend/actions/analytics/find-total-profit"
import { GiClothes, GiDroplets, GiLockers } from "react-icons/gi"
import { DashboardCard } from "./dashboard-card"
import { IgpPerformance } from "./igp-performance"
import { RevenueAnalytics } from "./revenue-analytics"
import { SalesOverview } from "./sales-overview"

export const DashboardClient = () => {
  const { data, isLoading } = useFindTotalProfit()

  const dashboardItems = [
    {
      id: "1",
      title: "Locker Rentals",
      amount: `₱${data?.data.totalLockerRevenue.toLocaleString() ?? "0"}`,
      metric: `${data?.data.activeLockersCount ?? 0} Active Lockers`,
      percentageChange: data?.data.activeLockersPercentageChange ?? "+0%",
      trendDescription: "Active Lockers",
      icon: <GiLockers className="size-8 text-muted-foreground" />,
    },
    {
      id: "2",
      title: "Water Vendo",
      amount: `₱${data?.data.totalWaterRevenue.toLocaleString() ?? "0"}`,
      metric: `${data?.data.activeMachinesCount ?? 0} Active Machines`,
      percentageChange: data?.data.activeMachinesPercentageChange ?? "+0%",
      trendDescription: "Active Machines",
      icon: <GiDroplets className="size-8 text-muted-foreground" />,
    },
    {
      id: "3",
      title: "Other IGPs",
      amount: `₱${data?.data.totalIgpRevenue.toLocaleString() ?? "0"}`,
      metric: `${data?.data.totalIgpSold ?? 0} Total Items`,
      percentageChange: data?.data.igpPercentageChange ?? "+0%",
      trendDescription: "Revenue",
      icon: <GiClothes className="size-8 text-muted-foreground" />,
    },
  ]

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard items={dashboardItems} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="md:col-span-3">
          <IgpPerformance profitData={data} isLoading={isLoading} />
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
