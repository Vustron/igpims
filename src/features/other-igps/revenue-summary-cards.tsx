"use client"

import { BarChart3, Receipt, Package, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/cards"
import { motion } from "framer-motion"

interface RevenueSummaryProps {
  totalRevenue: number
  receivedRevenue: number
  pendingRevenue: number
  receivedPercentage: number
  receivedCount: number
  pendingCount: number
  latestTransaction: Date
  totalQuantitySold: number
  popularBatch: {
    batch: string
    count: number
  }
  totalTransactions: number
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export const TotalRevenueCard = ({
  totalRevenue,
  totalTransactions,
}: Pick<RevenueSummaryProps, "totalRevenue" | "totalTransactions">) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Revenue</p>
              <h3 className="mt-1 font-bold text-2xl">
                {formatCurrency(totalRevenue)}
              </h3>
              <p className="mt-1 text-muted-foreground text-xs">
                From {totalTransactions} transactions
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const CollectionRateCard = ({
  receivedRevenue,
  pendingRevenue,
}: Pick<RevenueSummaryProps, "receivedRevenue" | "pendingRevenue">) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-muted-foreground text-sm">Collection Rate</p>
              </div>
              <h3 className="mt-1 font-bold text-2xl">
                {formatCurrency(receivedRevenue)}
              </h3>
              <p className="mt-1 text-muted-foreground text-xs">
                Pending: {formatCurrency(pendingRevenue)}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-2">
              <Receipt className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const ItemsSoldCard = ({
  totalQuantitySold,
  popularBatch,
}: Pick<RevenueSummaryProps, "totalQuantitySold" | "popularBatch">) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Items Sold</p>
              <h3 className="mt-1 font-bold text-2xl">
                {totalQuantitySold.toLocaleString()}
              </h3>
              <p className="mt-1 text-muted-foreground text-xs">
                Popular: {popularBatch.batch}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-2">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const TransactionStatusCard = ({
  receivedCount,
  totalTransactions,
  latestTransaction,
}: Pick<
  RevenueSummaryProps,
  "receivedCount" | "totalTransactions" | "latestTransaction"
>) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm">
                Transaction Status
              </p>
              <h3 className="mt-1 font-bold text-2xl">
                {receivedCount}
                <span className="font-normal text-muted-foreground text-sm">
                  /{totalTransactions} Received
                </span>
              </h3>
              <p className="mt-1 text-muted-foreground text-xs">
                Latest: {formatDate(latestTransaction)}
              </p>
            </div>
            <div className="rounded-full bg-amber-100 p-2">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
