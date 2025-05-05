"use client"

import { RevenueAnalytics } from "@/features/dashboard/revenue-analytics"
import { DashboardCard } from "@/features/dashboard/dashboard-card"
import { SalesOverview } from "@/features/dashboard/sales-overview"
import { IgpActivity } from "@/features/dashboard/igp-activity"
import { IgpStatus } from "@/features/dashboard/igp-status"
import { IgpChart } from "@/features/dashboard/igp-chart"
import { GiDroplets } from "react-icons/gi"
import { GiClothes } from "react-icons/gi"
import { GiLockers } from "react-icons/gi"

export const DashboardClient = () => {
  const dashboardItems = [
    {
      id: "1",
      title: "Locker Rentals",
      amount: "₱6,500",
      metric: "52 Active Lockers",
      percentageChange: "+5.4%",
      trendDescription: "Per Semester Growth",
      icon: <GiLockers className="size-4 text-muted-foreground" />,
    },
    {
      id: "2",
      title: "Water Vendo",
      amount: "₱4,500",
      metric: "15 Active Machines",
      percentageChange: "+3.8%",
      trendDescription: "Weekly Growth",
      icon: <GiDroplets className="size-4 text-muted-foreground" />,
    },
    {
      id: "3",
      title: "Merchandise",
      amount: "₱5,300",
      metric: "3 Total Items",
      percentageChange: "+4.5%",
      trendDescription: "Monthly Growth",
      icon: <GiClothes className="size-4 text-muted-foreground" />,
    },
  ]
  return (
    <div className="p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard items={dashboardItems} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="md:col-span-3">
          <IgpChart />
        </div>
        <div className="md:col-span-2">
          <div className="mb-5">
            <IgpStatus />
          </div>
          <IgpActivity />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="md:col-span-2">
          <SalesOverview />
        </div>
        <div className="md:col-span-3">
          <RevenueAnalytics />
        </div>
      </div>
    </div>
  )
}
