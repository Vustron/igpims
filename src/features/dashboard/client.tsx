"use client"

import { GiClothes, GiDroplets, GiLockers } from "react-icons/gi"
import { DashboardCard } from "./dashboard-card"
import { IgpPerformance } from "./igp-performance"
import { RevenueAnalytics } from "./revenue-analytics"
import { SalesOverview } from "./sales-overview"

export const DashboardClient = () => {
  const dashboardItems = [
    {
      id: "1",
      title: "Locker Rentals",
      amount: "₱6,500",
      metric: "52 Active Lockers",
      percentageChange: "+5.4%",
      trendDescription: "Per Semester Growth",
      icon: <GiLockers className="size-8 text-muted-foreground" />,
    },
    {
      id: "2",
      title: "Water Vendo",

      amount: "₱4,500",
      metric: "4 Active Machines",
      percentageChange: "+3.8%",
      trendDescription: "Weekly Growth",
      icon: <GiDroplets className="size-8 text-muted-foreground" />,
    },
    {
      id: "3",
      title: "Other IGPs",
      amount: "₱5,300",
      metric: "3 Total Items",
      percentageChange: "+4.5%",
      trendDescription: "Monthly Growth",
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
          <IgpPerformance />
        </div>
        <div className="md:col-span-2">
          <div className="mb-2">
            <RevenueAnalytics />
          </div>
          <div className="mb-2">
            <SalesOverview />
          </div>
        </div>
      </div>
    </div>
  )
}
