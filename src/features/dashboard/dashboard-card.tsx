"use client"

import { Card } from "@/components/ui/cards"
import { motion } from "framer-motion"
import { TrendingDown, TrendingUp } from "lucide-react"

interface DashboardCardItemProps {
  id: string
  title: string
  amount: string
  metric?: string
  percentageChange: string
  trendDescription?: string
  icon?: React.ReactNode
  bgColor?: string
  textColor?: string
}

interface DashboardCardProps {
  items: DashboardCardItemProps[]
}

export const DashboardCard = ({ items }: DashboardCardProps) => {
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  } as const

  return (
    <Card className="group relative w-full overflow-hidden">
      <motion.div
        className="relative z-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {items.map((item, index) => {
          const isPositive =
            item.percentageChange.startsWith("+") ||
            item.percentageChange.startsWith("0")

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="group/item relative overflow-hidden rounded-xl p-5 backdrop-blur-sm transition-all duration-300 hover:border-slate-500/70 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:border-slate-400/70"
            >
              {/* Animated background pattern - different for light/dark */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
              </div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {item.title}
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-slate-300 dark:from-slate-600 to-transparent" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      {item.amount}
                    </h3>
                  </div>

                  {item.icon && (
                    <div className="relative">
                      <div
                        className={`rounded-xl ${item.bgColor} p-3 backdrop-blur-sm border border-slate-200/50 dark:border-white/10`}
                      >
                        <div className="relative z-10">{item.icon}</div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-sm group-hover/item:opacity-100 opacity-0 transition-opacity duration-300" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Performance indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm border ${
                          isPositive
                            ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                            : "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {item.percentageChange}
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-500 font-mono">
                      {item.trendDescription}
                    </span>
                  </div>

                  {/* Progress bar visualization */}
                  <div className="space-y-2">
                    <div className="h-1 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(Math.abs(Number.parseFloat(item.percentageChange)), 100)}%`,
                        }}
                        transition={{ delay: index * 0.2, duration: 1 }}
                      />
                    </div>
                    {item.metric && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {item.metric}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Scan line animation */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1 left-0 h-px w-full bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse opacity-20" />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </Card>
  )
}
