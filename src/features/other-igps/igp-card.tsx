"use client"

import {
  Car,
  Tag,
  Clock,
  Store,
  Laptop,
  Camera,
  Package,
  Printer,
  BarChart2,
  Briefcase,
  HeartPulse,
  CreditCard,
  CheckCircle,
  ChevronRight,
  AlertTriangle,
  Wrench,
} from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/cards"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"

import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
import Link from "next/link"

import {
  GiCupcake,
  GiClothes,
  GiCoffeeCup,
  GiBookshelf,
  GiPaintBrush,
  GiMicroscope,
  GiShirtButton,
  GiSewingNeedle,
  GiMusicalNotes,
  GiVendingMachine,
} from "react-icons/gi"
import {
  MdOutlineEventAvailable,
  MdOutlineSportsBasketball,
} from "react-icons/md"
import { FaChalkboardTeacher } from "react-icons/fa"
import { IoFastFoodOutline } from "react-icons/io5"
import { BsTicketPerforated } from "react-icons/bs"
import { BiDonateHeart } from "react-icons/bi"
import { LuNewspaper } from "react-icons/lu"
import { TbPlant } from "react-icons/tb"

export interface IgpCardProps {
  id: string
  name: string
  description: string
  type: "temporary" | "permanent" | "maintenance"
  iconType?:
    | "store"
    | "card"
    | "tag"
    | "package"
    | "shirt"
    | "food"
    | "coffee"
    | "bakery"
    | "event"
    | "book"
    | "tech"
    | "education"
    | "service"
    | "craft"
    | "sports"
    | "ticket"
    | "research"
    | "printing"
    | "media"
    | "farm"
    | "vendo"
    | "music"
    | "health"
    | "donation"
    | "art"
    | "rental"
    | "newspaper"
    | "pin"
  totalSold: number
  revenue: number
  href?: string
  maintenanceDate?: Date
}

export function IgpCard({
  // id,
  name,
  description,
  type,
  iconType = "store",
  totalSold,
  revenue,
  maintenanceDate,
  href = `/other-igps/${name}`,
}: IgpCardProps) {
  const icons = {
    store: Store,
    card: CreditCard,
    tag: Tag,
    package: Package,
    shirt: GiClothes,
    food: IoFastFoodOutline,
    coffee: GiCoffeeCup,
    bakery: GiCupcake,
    event: MdOutlineEventAvailable,
    book: GiBookshelf,
    tech: Laptop,
    education: FaChalkboardTeacher,
    service: Briefcase,
    craft: GiSewingNeedle,
    sports: MdOutlineSportsBasketball,
    ticket: BsTicketPerforated,
    research: GiMicroscope,
    printing: Printer,
    media: Camera,
    farm: TbPlant,
    vendo: GiVendingMachine,
    music: GiMusicalNotes,
    health: HeartPulse,
    donation: BiDonateHeart,
    art: GiPaintBrush,
    rental: Car,
    newspaper: LuNewspaper,
    pin: GiShirtButton,
  }

  const Icon = icons[iconType]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusStyles = () => {
    switch (type) {
      case "permanent":
        return {
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-700",
          badgeBorder: "border-emerald-200",
          badgeBg: "bg-emerald-50",
          badgeText: "text-emerald-700",
          statusIcon: CheckCircle,
          statusText: "Permanent",
          cardBorder: "border-slate-200",
        }
      case "maintenance":
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-700",
          badgeBorder: "border-red-200",
          badgeBg: "bg-red-50",
          badgeText: "text-red-700",
          statusIcon: Wrench,
          statusText: "Maintenance",
          cardBorder: "border-red-200",
          cardOverlay: true,
        }
      default:
        return {
          iconBg: "bg-amber-100",
          iconColor: "text-amber-700",
          badgeBorder: "border-amber-200",
          badgeBg: "bg-amber-50",
          badgeText: "text-amber-700",
          statusIcon: Clock,
          statusText: "Temporary",
          cardBorder: "border-slate-200",
        }
    }
  }

  const statusStyles = getStatusStyles()
  const StatusIcon = statusStyles.statusIcon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="relative h-full"
    >
      <Card
        className={cn(
          "flex h-full flex-col overflow-hidden transition-all hover:shadow-md",
          statusStyles.cardBorder,
          type === "maintenance"
            ? "hover:border-red-300"
            : "hover:border-slate-300",
        )}
      >
        {type === "maintenance" && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-blue-red/5 to-blue-red/10" />
        )}

        <CardContent className="relative flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("rounded-md p-2", statusStyles.iconBg)}>
                <Icon className={cn("h-5 w-5", statusStyles.iconColor)} />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 text-sm">{name}</h3>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-1.5 py-0 font-medium text-[10px]",
                      statusStyles.badgeBorder,
                      statusStyles.badgeBg,
                      statusStyles.badgeText,
                    )}
                  >
                    <motion.span
                      className="flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <StatusIcon className="h-2.5 w-2.5" />
                      {statusStyles.statusText}
                    </motion.span>
                  </Badge>

                  {type === "maintenance" && maintenanceDate && (
                    <span className="ml-1.5 text-[10px] text-red-600">
                      Until {maintenanceDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="line-clamp-2 text-slate-600 text-xs">{description}</p>

          {type === "maintenance" ? (
            <div className="flex items-center gap-2 rounded-md border border-red-100 bg-red-50 px-3 py-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-red-700 text-xs">
                This IGP is currently unavailable due to maintenance work.
              </p>
            </div>
          ) : (
            <div className="mt-auto grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-slate-500 text-xs">Total Sold</p>
                <div className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-slate-400" />
                  <p className="font-semibold text-sm">
                    {totalSold.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-slate-500 text-xs">Revenue</p>
                <div className="flex items-center gap-1.5">
                  <BarChart2 className="h-3.5 w-3.5 text-slate-400" />
                  <p className="font-semibold text-sm">
                    {formatCurrency(revenue)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter
          className={cn(
            "border-t p-4",
            type === "maintenance" ? "bg-red-50" : "bg-slate-50",
          )}
        >
          <Link href={href} className="w-full">
            <Button
              variant="outline"
              className={cn(
                "w-full bg-white",
                type === "maintenance"
                  ? "border-red-300 hover:bg-red-50"
                  : "border-slate-300 hover:bg-slate-100",
              )}
            >
              <span className="mr-1">
                {type === "maintenance"
                  ? "View Maintenance Details"
                  : "View Details"}
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
