"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  Banknote,
  CalendarDays,
  Droplet,
  GlassWaterIcon,
  Hash,
  LucideIcon,
  Store,
  Timer,
} from "lucide-react"
import { Badge } from "@/components/ui/badges"
import { DateCell } from "@/features/locker-igp/violations/column-helpers"
import { WaterSupplyWithVendoLocation } from "@/backend/actions/water-supply/find-by-id"
import { cn } from "@/utils/cn"
import { Actions } from "./actions"

const HeaderWithIcon = ({
  icon: Icon,
  label,
}: {
  icon?: LucideIcon
  label: string
}) => (
  <div className="ml-2 flex items-center gap-2">
    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    <span className="font-medium">{label}</span>
  </div>
)

export const waterSupplyListColumn: ColumnDef<WaterSupplyWithVendoLocation>[] =
  [
    {
      accessorKey: "id",
      header: () => <HeaderWithIcon icon={Hash} label="Supply ID" />,
      cell: ({ row }) => (
        <div className="ml-2 w-[80px] truncate sm:w-auto">
          <span className="font-medium font-mono">{row.getValue("id")}</span>
        </div>
      ),
    },
    {
      accessorKey: "supplyDate",
      header: () => <HeaderWithIcon icon={CalendarDays} label="Supply Date" />,
      cell: ({ row }) => {
        const timestamp = row.getValue("supplyDate") as number
        return <DateCell value={timestamp} />
      },
    },
    {
      accessorKey: "vendoLocation",
      header: () => <HeaderWithIcon icon={Store} label="Location" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 shrink-0 text-purple-500" />
          <span className="max-w-[150px] truncate sm:max-w-[200px]">
            {row.getValue("vendoLocation")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "suppliedGallons",
      header: () => <HeaderWithIcon icon={Droplet} label="Supplied" />,
      cell: ({ row }) => {
        const amount = Number.parseInt(row.getValue("suppliedGallons"))
        return (
          <div className="flex items-center gap-2">
            <Droplet className="h-4 w-4 shrink-0 text-blue-500" />
            <Badge variant="outline" className="whitespace-nowrap font-medium">
              {amount.toLocaleString()} gal
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "expenses",
      header: () => <HeaderWithIcon icon={Banknote} label="Expenses" />,
      cell: ({ row }) => {
        const amount = Number.parseInt(row.getValue("expenses"))
        const formatted = new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
        }).format(amount)
        return (
          <div className="flex items-center justify-end gap-2 sm:justify-start">
            <Banknote className="h-4 w-4 shrink-0 text-green-500" />
            <Badge
              variant="secondary"
              className="whitespace-nowrap font-medium"
            >
              {formatted}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: "usedGallons",
      header: () => <HeaderWithIcon icon={GlassWaterIcon} label="Used" />,
      cell: ({ row }) => {
        const used = Number.parseInt(row.getValue("usedGallons"))
        const supplied = Number.parseInt(row.getValue("suppliedGallons"))
        const percentage = Math.round((used / supplied) * 100) || 0
        const colorClass = cn("transition-colors", {
          "text-red-500": percentage > 75,
          "text-yellow-500": percentage <= 75 && percentage > 25,
          "text-green-500": percentage <= 25,
        })

        return (
          <div className="flex items-center gap-2">
            <GlassWaterIcon className={cn("h-4 w-4 shrink-0", colorClass)} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="whitespace-nowrap text-sm sm:text-base">
                {used.toLocaleString()} gal
              </span>
              <Badge
                variant="outline"
                className={cn("hidden text-xs sm:inline-flex", colorClass)}
              >
                {percentage}%
              </Badge>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "remainingGallons",
      header: () => <HeaderWithIcon icon={Timer} label="Remaining" />,
      cell: ({ row }) => {
        const remaining = Number.parseInt(row.getValue("remainingGallons"))
        const supplied = Number.parseInt(row.getValue("suppliedGallons"))
        const percentage = Math.round((remaining / supplied) * 100) || 0
        const colorClass = cn("transition-colors", {
          "text-red-500": percentage < 25,
          "text-yellow-500": percentage >= 25 && percentage < 75,
          "text-green-500": percentage >= 75,
        })

        return (
          <div className="flex items-center gap-2">
            <Timer className={cn("h-4 w-4 shrink-0", colorClass)} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="whitespace-nowrap text-sm sm:text-base">
                {remaining.toLocaleString()} gal
              </span>
              <Badge
                variant="outline"
                className={cn("hidden text-xs sm:inline-flex", colorClass)}
              >
                {percentage}%
              </Badge>
            </div>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <HeaderWithIcon label="Actions" />,
      cell: ({ row }) => <Actions supply={row.original} />,
    },
  ]
