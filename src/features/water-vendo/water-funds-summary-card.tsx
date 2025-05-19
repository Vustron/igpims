"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cards"
import { ArrowUp, ArrowDown } from "lucide-react"

import { motion } from "framer-motion"

interface WaterFundsSummaryCardsProps {
  totalRevenue: number
  totalExpenses: number
  totalProfit: number
  asOfDate: string
  compareWithPrevious?: boolean
}

export const WaterFundsSummaryCards = ({
  totalRevenue,
  totalExpenses,
  totalProfit,
  asOfDate = "April 21, 2025",
  compareWithPrevious = false,
}: WaterFundsSummaryCardsProps) => {
  // Mock percentage changes from previous period (could be calculated from actual data)
  const revenueChange = 12.5
  const expensesChange = 8.2
  const profitChange = 18.7

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="font-bold text-2xl">
                  ₱ {totalRevenue.toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">
                  As of {asOfDate}
                </p>
              </div>
              {compareWithPrevious && (
                <div
                  className={`flex items-center font-medium text-xs ${revenueChange >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {revenueChange >= 0 ? (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(revenueChange)}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="font-bold text-2xl">
                  ₱ {totalExpenses.toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">
                  As of {asOfDate}
                </p>
              </div>
              {compareWithPrevious && (
                <div
                  className={`flex items-center font-medium text-xs ${expensesChange >= 0 ? "text-red-600" : "text-emerald-600"}`}
                >
                  {expensesChange >= 0 ? (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(expensesChange)}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Total Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <div className="font-bold text-2xl text-green-600">
                  ₱ {totalProfit.toFixed(2)}
                </div>
                <p className="text-muted-foreground text-xs">
                  As of {asOfDate}
                </p>
              </div>
              {compareWithPrevious && (
                <div
                  className={`flex items-center font-medium text-xs ${profitChange >= 0 ? "text-emerald-600" : "text-red-600"}`}
                >
                  {profitChange >= 0 ? (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {Math.abs(profitChange)}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
