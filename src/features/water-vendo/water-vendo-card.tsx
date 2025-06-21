"use client"

import { motion } from "framer-motion"
import {
  Activity,
  ChevronRight,
  DropletIcon,
  MapPinIcon,
  MoreVertical,
  Power,
  RefreshCw,
  Settings,
} from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/cards"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"

interface WaterVendoCardProps {
  id: string
  location: string
  gallonsUsed: number
  vendoStatus: "online" | "offline" | "maintenance"
  refillStatus: "full" | "low" | "critical" | "empty"
}

export const exampleWaterVendos: WaterVendoCardProps[] = [
  {
    id: "WV-2023-001",
    location: "AB Building, 2nd Floor",
    gallonsUsed: 75,
    vendoStatus: "online",
    refillStatus: "low",
  },
  {
    id: "WV-2023-002",
    location: "College of Engineering, Ground Floor",
    gallonsUsed: 30,
    vendoStatus: "online",
    refillStatus: "full",
  },
  {
    id: "WV-2023-003",
    location: "Main Canteen, Entrance",
    gallonsUsed: 95,
    vendoStatus: "online",
    refillStatus: "critical",
  },
  {
    id: "WV-2023-004",
    location: "Library Building, 1st Floor",
    gallonsUsed: 100,
    vendoStatus: "offline",
    refillStatus: "empty",
  },
  {
    id: "WV-2023-005",
    location: "College of Science, 3rd Floor",
    gallonsUsed: 45,
    vendoStatus: "maintenance",
    refillStatus: "low",
  },
  {
    id: "WV-2023-006",
    location: "Student Center, Near Entrance",
    gallonsUsed: 10,
    vendoStatus: "online",
    refillStatus: "full",
  },
]

export const WaterVendoCard = ({
  id,
  location,
  gallonsUsed,
  vendoStatus,
  refillStatus,
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
          level: 90,
        }
      case "low":
        return {
          color: "text-amber-500 bg-amber-50",
          text: "Low",
          progressColor: "bg-amber-500",
          level: 40,
        }
      case "critical":
        return {
          color: "text-red-500 bg-red-50",
          text: "Critical",
          progressColor: "bg-red-500",
          level: 15,
        }
      case "empty":
        return {
          color: "text-slate-500 bg-slate-50",
          text: "Empty",
          progressColor: "bg-slate-500",
          level: 0,
        }
      default:
        return {
          color: "text-slate-500 bg-slate-50",
          text: "Unknown",
          progressColor: "bg-slate-500",
          level: 50,
        }
    }
  }

  const vendoStatusDetails = getVendoStatusDetails()
  const refillStatusDetails = getRefillStatusDetails()

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
            {/* Usage info */}
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs">Used</span>
              <span className="mt-1 font-semibold text-sm">
                {gallonsUsed} gallons
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
