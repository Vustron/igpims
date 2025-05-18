"use client"

import {
  Zap,
  Power,
  Settings,
  Activity,
  RefreshCw,
  MapPinIcon,
  DropletIcon,
  ChevronRight,
  MoreVertical,
} from "lucide-react"

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from "@/components/ui/cards"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdowns"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"

import { motion } from "framer-motion"
import { cn } from "@/utils/cn"

import { useState } from "react"

interface WaterVendoCardProps {
  id: string
  location: string
  gallonsUsed: number
  gallonsTotal: number
  vendoStatus: "online" | "offline" | "maintenance"
  refillStatus: "full" | "low" | "critical" | "empty"
  lastRefilled?: Date
  powerUsage?: number
}

export const exampleWaterVendos: WaterVendoCardProps[] = [
  {
    id: "WV-2023-001",
    location: "AB Building, 2nd Floor",
    gallonsUsed: 75,
    gallonsTotal: 100,
    vendoStatus: "online",
    refillStatus: "low",
    lastRefilled: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    powerUsage: 0.75,
  },
  {
    id: "WV-2023-002",
    location: "College of Engineering, Ground Floor",
    gallonsUsed: 30,
    gallonsTotal: 100,
    vendoStatus: "online",
    refillStatus: "full",
    lastRefilled: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    powerUsage: 0.82,
  },
  {
    id: "WV-2023-003",
    location: "Main Canteen, Entrance",
    gallonsUsed: 95,
    gallonsTotal: 100,
    vendoStatus: "online",
    refillStatus: "critical",
    lastRefilled: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    powerUsage: 0.91,
  },
  {
    id: "WV-2023-004",
    location: "Library Building, 1st Floor",
    gallonsUsed: 100,
    gallonsTotal: 100,
    vendoStatus: "offline",
    refillStatus: "empty",
    lastRefilled: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    powerUsage: 0.0,
  },
  {
    id: "WV-2023-005",
    location: "College of Science, 3rd Floor",
    gallonsUsed: 45,
    gallonsTotal: 100,
    vendoStatus: "maintenance",
    refillStatus: "low",
    lastRefilled: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    powerUsage: 0.35,
  },
  {
    id: "WV-2023-006",
    location: "Student Center, Near Entrance",
    gallonsUsed: 10,
    gallonsTotal: 100,
    vendoStatus: "online",
    refillStatus: "full",
    lastRefilled: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    powerUsage: 0.68,
  },
]

export const WaterVendoCard = ({
  id,
  location,
  gallonsUsed,
  gallonsTotal,
  vendoStatus,
  refillStatus,
  lastRefilled,
  powerUsage,
}: Partial<WaterVendoCardProps>) => {
  const [isHovered, setIsHovered] = useState(false)

  const getVendoStatusDetails = () => {
    switch (vendoStatus) {
      case "online":
        return {
          color: "text-emerald-500 bg-emerald-50",
          text: "Online",
          icon: <Power className="h-3.5 w-3.5" />,
        }
      case "offline":
        return {
          color: "text-red-500 bg-red-50",
          text: "Offline",
          icon: <Power className="h-3.5 w-3.5" />,
        }
      case "maintenance":
        return {
          color: "text-amber-500 bg-amber-50",
          text: "Maintenance",
          icon: <Settings className="h-3.5 w-3.5" />,
        }
      default:
        return {
          color: "text-slate-500 bg-slate-50",
          text: "Unknown",
          icon: <Activity className="h-3.5 w-3.5" />,
        }
    }
  }

  const getRefillStatusDetails = () => {
    switch (refillStatus) {
      case "full":
        return {
          color: "text-emerald-500 bg-emerald-50",
          text: "Full",
          progressColor: "bg-emerald-500",
        }
      case "low":
        return {
          color: "text-amber-500 bg-amber-50",
          text: "Low",
          progressColor: "bg-amber-500",
        }
      case "critical":
        return {
          color: "text-red-500 bg-red-50",
          text: "Critical",
          progressColor: "bg-red-500",
        }
      case "empty":
        return {
          color: "text-slate-500 bg-slate-50",
          text: "Empty",
          progressColor: "bg-slate-500",
        }
      default:
        return {
          color: "text-slate-500 bg-slate-50",
          text: "Unknown",
          progressColor: "bg-slate-500",
        }
    }
  }

  const waterLevel = Math.round(
    ((gallonsUsed ?? 0) / (gallonsTotal ?? 1)) * 100,
  )
  const vendoStatusDetails = getVendoStatusDetails()
  const refillStatusDetails = getRefillStatusDetails()

  // Format last refilled date to "3 days ago" format
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffDays > 0) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
    }

    if (diffHours > 0) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
    }

    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card
        className={`h-full overflow-hidden transition-all duration-300 ${isHovered ? "border-blue-500/50" : ""}`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex flex-col">
            <CardTitle className="font-bold text-lg">
              <span className="flex items-center">
                <DropletIcon className="mr-2 h-5 w-5 text-blue-500" />
                {id}
              </span>
            </CardTitle>
            <CardDescription className="mt-1 flex items-center">
              <MapPinIcon className="mr-1 h-3.5 w-3.5 text-slate-400" />
              <span className="max-w-[200px] truncate text-xs">{location}</span>
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel className="text-xs">
                Vendo Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-xs">
                <Activity className="mr-2 h-3.5 w-3.5" />
                View Usage Analytics
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs">
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Record Water Refill
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs">
                <Settings className="mr-2 h-3.5 w-3.5" />
                Maintenance Options
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600 text-xs">
                <Power className="mr-2 h-3.5 w-3.5" />
                {vendoStatus === "online"
                  ? "Turn Off Machine"
                  : "Turn On Machine"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        <CardContent className="pb-0">
          <div className="flex flex-col space-y-4">
            {/* Water level indicator */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="font-medium text-xs">Water Level</span>
                <span className="text-muted-foreground text-xs">
                  {waterLevel}%
                </span>
              </div>
              <Progress
                value={waterLevel}
                max={100}
                className={cn(`h-2 ${refillStatusDetails.progressColor}`)}
              />
            </div>

            {/* Usage info and last refilled */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">Used</span>
                <span className="mt-1 font-semibold text-sm">
                  {gallonsUsed} / {gallonsTotal} gal
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs">
                  Last Refilled
                </span>
                <span className="mt-1 font-semibold text-sm">
                  {formatRelativeTime(lastRefilled ?? new Date())}
                </span>
              </div>
            </div>

            {/* Power usage */}
            <div className="flex items-center">
              <Zap className="mr-1 h-4 w-4 text-amber-500" />
              <span className="text-xs">
                Power usage: <strong>{powerUsage} kWh</strong>
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-auto flex items-center justify-between pt-4 pb-3">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={`flex items-center px-2 py-1 text-xs ${vendoStatusDetails.color}`}
            >
              {vendoStatusDetails.icon}
              <span className="ml-1">{vendoStatusDetails.text}</span>
            </Badge>
            <Badge
              variant="outline"
              className={`flex items-center px-2 py-1 text-xs ${refillStatusDetails.color}`}
            >
              <DropletIcon className="h-3.5 w-3.5" />
              <span className="ml-1">{refillStatusDetails.text}</span>
            </Badge>
          </div>

          <motion.div
            animate={{ x: isHovered ? 0 : 5, opacity: isHovered ? 1 : 0.7 }}
            transition={{ duration: 0.2 }}
          >
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
