"use client"

import { motion } from "framer-motion"
import {
  Activity,
  DeleteIcon,
  DropletIcon,
  EditIcon,
  MoreVertical,
  Power,
  Settings,
} from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
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
import { useDeleteWaterVendo } from "@/backend/actions/water-vendo/delete-water-vendo"
import { useConfirm } from "@/hooks/use-confirm"
import { useDialog } from "@/hooks/use-dialog"
import { catchError } from "@/utils/catch-error"

interface WaterVendoCardProps {
  id: string
  location: string
  gallonsUsed: number
  vendoStatus: "operational" | "maintenance" | "out-of-service" | "offline"
  waterRefillStatus: "full" | "medium" | "low" | "empty"
  createdAt: Date
  updatedAt: Date
}

export const WaterVendoCard = ({
  id,
  location,
  gallonsUsed,
  vendoStatus,
  waterRefillStatus,
  createdAt,
  updatedAt,
}: WaterVendoCardProps) => {
  const [isHovered, setIsHovered] = useState(false)
  const { onOpen } = useDialog()
  const confirm = useConfirm()
  const deleteWaterVendo = useDeleteWaterVendo(id)

  const handleDelete = async () => {
    const confirmed = confirm(
      "Delete Water Vendo",
      "Are you sure you want to delete this water vendo? This action cannot be undone.",
    )

    if (await confirmed) {
      await toast.promise(deleteWaterVendo.mutateAsync(), {
        loading: <span className="animate-pulse">Deleting water vendo...</span>,
        success: "Water vendo deleted",
        error: (error: unknown) => catchError(error),
      })
    }
  }

  const getVendoStatusDetails = () => {
    switch (vendoStatus) {
      case "operational":
        return {
          color: "text-emerald-500 bg-emerald-50",
          text: "Operational",
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
      case "out-of-service":
        return {
          color: "text-slate-500 bg-slate-50",
          text: "Out of Service",
          icon: <Activity className="h-3.5 w-3.5" />,
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
    switch (waterRefillStatus) {
      case "full":
        return {
          color: "text-emerald-500 bg-emerald-50",
          text: "Full",
          progressColor: "bg-emerald-500",
          level: 90,
        }
      case "medium":
        return {
          color: "text-blue-500 bg-blue-50",
          text: "Medium",
          progressColor: "bg-blue-500",
          level: 60,
        }
      case "low":
        return {
          color: "text-amber-500 bg-amber-50",
          text: "Low",
          progressColor: "bg-amber-500",
          level: 30,
        }
      case "empty":
        return {
          color: "text-red-500 bg-red-50",
          text: "Empty",
          progressColor: "bg-red-500",
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
                <DropletIcon className="mr-2 h-5 w-5 text-blue-600" />
                {location}
              </span>
            </CardTitle>
            <CardDescription className="mt-1 flex items-center">
              <span className="max-w-[200px] truncate text-xs">{id}</span>
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
              <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-xs"
                onClick={() =>
                  onOpen("editWaterVendo", {
                    waterVendo: {
                      id,
                      waterVendoLocation: location,
                      gallonsUsed,
                      vendoStatus,
                      waterRefillStatus,
                      createdAt,
                      updatedAt,
                    },
                  })
                }
              >
                <EditIcon className="mr-2 h-3.5 w-3.5" />
                Edit water vendo
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-xs"
                onClick={handleDelete}
              >
                <DeleteIcon className="mr-2 h-3.5 w-3.5" />
                Delete water vendo
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
        </CardFooter>
      </Card>
    </motion.div>
  )
}
