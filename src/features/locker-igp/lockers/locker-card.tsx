"use client"

import { Badge } from "@/components/ui/badges"
import { Card, CardContent } from "@/components/ui/cards"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltips"
import { cn } from "@/utils/cn"
import { Locker } from "@/validation/locker"
import { AnimatePresence, motion } from "framer-motion"
import { Lock, MapPin, Unlock, Wrench } from "lucide-react"
import { useRouter } from "next-nprogress-bar"

interface LockerCardProps {
  id: string
  locker: Locker
  index: number
  isSelected: boolean
  onSelect: () => void
  compact: boolean
}

export const LockerCard: React.FC<LockerCardProps> = ({
  id,
  locker,
  index,
  isSelected,
  onSelect,
}) => {
  const getUiStatus = (apiStatus: string | undefined) => {
    if (!apiStatus) return "active"

    switch (apiStatus) {
      case "available":
        return "active"
      case "occupied":
      case "reserved":
        return "inactive"
      case "maintenance":
      case "out-of-service":
        return "under_maintenance"
      default:
        return "inactive"
    }
  }

  const uiStatus = getUiStatus(locker.lockerStatus)
  const isDisabled =
    locker.lockerStatus === "maintenance" ||
    locker.lockerStatus === "out-of-service"
  const router = useRouter()

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          badge: "bg-emerald-500 text-white",
          icon: Unlock,
          iconColor: "text-emerald-500",
          border: "border-emerald-200/50",
          bg: "bg-gradient-to-br from-emerald-50 to-green-50",
          shadow: "shadow-emerald-100",
          glow: "shadow-emerald-200/30",
        }
      case "inactive":
        return {
          badge: "bg-red-500 text-white",
          icon: Lock,
          iconColor: "text-red-500",
          border: "border-red-200/50",
          bg: "bg-gradient-to-br from-red-50 to-pink-50",
          shadow: "shadow-red-100",
          glow: "shadow-red-200/30",
        }
      case "under_maintenance":
        return {
          badge: "bg-amber-500 text-white",
          icon: Wrench,
          iconColor: "text-amber-500",
          border: "border-amber-200/50",
          bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
          shadow: "shadow-amber-100",
          glow: "shadow-amber-200/30",
        }
      default:
        return {
          badge: "bg-gray-500 text-white",
          icon: Lock,
          iconColor: "text-gray-500",
          border: "border-gray-200/50",
          bg: "bg-gradient-to-br from-gray-50 to-slate-50",
          shadow: "shadow-gray-100",
          glow: "shadow-gray-200/30",
        }
    }
  }

  const statusConfig = getStatusConfig(uiStatus)
  const StatusIcon = statusConfig.icon

  // Get size variant for locker type
  const getSizeVariant = (type: string) => {
    switch (type) {
      case "small":
        return "text-blue-600 bg-blue-100"
      case "medium":
        return "text-purple-600 bg-purple-100"
      case "large":
        return "text-orange-600 bg-orange-100"
      case "extra-large":
        return "text-pink-600 bg-pink-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{
          y: -4,
          scale: 1.02,
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="relative group"
        onClick={() => {
          if (!isDisabled) {
            router.push(`/locker-rental/${id}`)
            onSelect()
          }
        }}
      >
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-300 cursor-pointer backdrop-blur-sm",
            "w-full aspect-[3/4] min-w-[120px] max-w-[180px]",
            "sm:min-w-[140px] sm:max-w-[200px]",
            "md:min-w-[160px] md:max-w-[220px]",
            statusConfig.bg,
            statusConfig.border,
            "border-2",
            isSelected && "ring-4 ring-blue-400/50 ring-offset-2",
            isDisabled && "cursor-not-allowed opacity-70",
            !isDisabled &&
              `hover:${statusConfig.shadow} hover:shadow-lg group-hover:${statusConfig.glow}`,
          )}
        >
          {/* Status Badge - Top */}
          <div className="absolute top-3 left-3 z-10">
            <Badge
              className={cn(
                "text-xs font-semibold px-2 py-1 rounded-full shadow-sm",
                statusConfig.badge,
              )}
            >
              {locker.lockerStatus === "available"
                ? "Available"
                : locker.lockerStatus === "occupied"
                  ? "Occupied"
                  : locker.lockerStatus === "maintenance"
                    ? "Maintenance"
                    : locker.lockerStatus}
            </Badge>
          </div>

          {/* Status Icon - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <div
              className={cn(
                "p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm",
                "group-hover:bg-white group-hover:shadow-md transition-all duration-200",
              )}
            >
              <StatusIcon className={cn("h-4 w-4", statusConfig.iconColor)} />
            </div>
          </div>

          <CardContent className="p-4 h-full flex flex-col justify-between">
            {/* Main Content */}
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {/* Locker Name */}
              <div className="text-center">
                <h3 className="mt-6 text-lg sm:text-xl font-bold text-gray-800 tracking-tight">
                  {locker.lockerName}
                </h3>

                {/* Locker Type */}
                <div className="mt-2 flex justify-center">
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                      getSizeVariant(locker.lockerType || "small"),
                    )}
                  >
                    {locker.lockerType === "small"
                      ? "Small"
                      : locker.lockerType === "medium"
                        ? "Medium"
                        : locker.lockerType === "large"
                          ? "Large"
                          : locker.lockerType === "extra-large"
                            ? "X-Large"
                            : locker.lockerType}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4 flex-shrink-0" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-medium truncate max-w-[120px] cursor-help">
                      {locker.lockerLocation?.split("-")[0]?.trim() ||
                        locker.lockerLocation}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{locker.lockerLocation}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Price - Bottom */}
            {locker.lockerRentalPrice > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200/50">
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-xl sm:text-2xl font-bold text-gray-800">
                      ₱{locker.lockerRentalPrice}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Maintenance Overlay */}
          {isDisabled && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-10">
              <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-gray-700">
                    Under Maintenance
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Hover Glow Effect */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
              "bg-gradient-to-t from-transparent via-white/5 to-white/10",
            )}
          />
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
