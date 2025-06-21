"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badges"
import { DataTable } from "@/components/ui/tables"
import { cn } from "@/utils/cn"
import {
  exampleIgpManagementData,
  igpManagementColumn,
} from "./igp-management-column"

export const IgpManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredData = useMemo(() => {
    if (!selectedStatus) return exampleIgpManagementData
    return exampleIgpManagementData.filter(
      (item) => item.status === selectedStatus,
    )
  }, [selectedStatus])

  const revenueSummary = useMemo(() => {
    const totalRevenue = exampleIgpManagementData.reduce((sum, item) => {
      return sum + (item.price || 0) * item.quantity
    }, 0)

    const receivedRevenue = exampleIgpManagementData
      .filter((item) => item.status === "received")
      .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

    const pendingRevenue = exampleIgpManagementData
      .filter((item) => item.status === "pending")
      .reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

    const receivedPercentage =
      totalRevenue > 0 ? Math.round((receivedRevenue / totalRevenue) * 100) : 0

    const receivedCount = exampleIgpManagementData.filter(
      (item) => item.status === "received",
    ).length
    const pendingCount = exampleIgpManagementData.filter(
      (item) => item.status === "pending",
    ).length

    const latestTransaction = new Date(
      Math.max(...exampleIgpManagementData.map((item) => item.dateBought)),
    )

    const totalQuantitySold = exampleIgpManagementData.reduce(
      (sum, item) => sum + item.quantity,
      0,
    )

    const batchCounts = exampleIgpManagementData.reduce(
      (acc, item) => {
        acc[item.batch] = (acc[item.batch] || 0) + item.quantity
        return acc
      },
      {} as Record<string, number>,
    )

    const popularBatch = Object.entries(batchCounts).reduce(
      (max, [batch, count]) => (count > max.count ? { batch, count } : max),
      { batch: "", count: 0 },
    )

    return {
      totalRevenue,
      receivedRevenue,
      pendingRevenue,
      receivedPercentage,
      receivedCount,
      pendingCount,
      latestTransaction,
      totalQuantitySold,
      popularBatch,
    }
  }, [exampleIgpManagementData])

  const handleStatusFilterChange = (status: string | null) => {
    setSelectedStatus(status === selectedStatus ? null : status)
  }

  return (
    <div className="space-y-6">
      {/* Status Filter Pills */}
      <div className="flex gap-2">
        <Badge
          variant={!selectedStatus ? "subtle-info" : "outline"}
          className={cn(
            "cursor-pointer px-3 py-1",
            !selectedStatus && "bg-blue-100 text-blue-800",
          )}
          onClick={() => handleStatusFilterChange(null)}
        >
          All Transactions ({exampleIgpManagementData.length})
        </Badge>
        <Badge
          variant={selectedStatus === "received" ? "subtle-success" : "outline"}
          className={cn(
            "cursor-pointer px-3 py-1",
            selectedStatus === "received" && "bg-green-100 text-green-800",
          )}
          onClick={() => handleStatusFilterChange("received")}
        >
          Received ({revenueSummary.receivedCount})
        </Badge>
        <Badge
          variant={selectedStatus === "pending" ? "subtle-warning" : "outline"}
          className={cn(
            "cursor-pointer px-3 py-1",
            selectedStatus === "pending" && "bg-yellow-100 text-yellow-800",
          )}
          onClick={() => handleStatusFilterChange("pending")}
        >
          Pending ({revenueSummary.pendingCount})
        </Badge>
      </div>

      {/* Data Table */}
      <DataTable
        columns={igpManagementColumn}
        data={filteredData}
        placeholder="Search transactions..."
        isIgp
      />
    </div>
  )
}
