"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { GiClothes, GiDroplets, GiLockers } from "react-icons/gi"

const DashboardCard = dynamic(
  () => import("./dashboard-card").then((mod) => mod.DashboardCard),
  {
    loading: () => (
      <div className="h-[200px] animate-pulse rounded-lg bg-muted/50" />
    ),
    ssr: false,
  },
)

const IgpPerformance = dynamic(
  () => import("./igp-performance").then((mod) => mod.IgpPerformance),
  {
    loading: () => (
      <div className="h-[400px] animate-pulse rounded-lg bg-muted/50" />
    ),
    ssr: false,
  },
)

const RevenueAnalytics = dynamic(
  () => import("./revenue-analytics").then((mod) => mod.RevenueAnalytics),
  {
    loading: () => (
      <div className="h-[200px] animate-pulse rounded-lg bg-muted/50" />
    ),
    ssr: false,
  },
)

const SalesOverview = dynamic(
  () => import("./sales-overview").then((mod) => mod.SalesOverview),
  {
    loading: () => (
      <div className="h-[200px] animate-pulse rounded-lg bg-muted/50" />
    ),
    ssr: false,
  },
)

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
        <Suspense
          fallback={[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-[200px] animate-pulse rounded-lg bg-muted/50"
            />
          ))}
        >
          <DashboardCard items={dashboardItems} />
        </Suspense>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="md:col-span-3">
          <Suspense
            fallback={
              <div className="h-[400px] animate-pulse rounded-lg bg-muted/50" />
            }
          >
            <IgpPerformance />
          </Suspense>
        </div>
        <div className="md:col-span-2">
          <div className="mb-2">
            <Suspense
              fallback={
                <div className="h-[200px] animate-pulse rounded-lg bg-muted/50" />
              }
            >
              <RevenueAnalytics />
            </Suspense>
          </div>
          <div className="mb-2">
            <Suspense
              fallback={
                <div className="h-[200px] animate-pulse rounded-lg bg-muted/50" />
              }
            >
              <SalesOverview />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
