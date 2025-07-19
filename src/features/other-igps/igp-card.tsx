"use client"

import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Card, CardContent, CardFooter } from "@/components/ui/cards"
import { cn } from "@/utils/cn"
import { formatDateFromTimestamp } from "@/utils/date-convert"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  BarChart2,
  Briefcase,
  Camera,
  Car,
  CheckCircle,
  ChevronRight,
  Clock,
  CreditCard,
  HeartPulse,
  Laptop,
  Package,
  Printer,
  Store,
  Tag,
} from "lucide-react"
import Link from "next/link"
import { BiDonateHeart } from "react-icons/bi"
import { BsTicketPerforated } from "react-icons/bs"
import { FaChalkboardTeacher } from "react-icons/fa"
import {
  GiBookshelf,
  GiClothes,
  GiCoffeeCup,
  GiCupcake,
  GiMicroscope,
  GiMusicalNotes,
  GiPaintBrush,
  GiSewingNeedle,
  GiShirtButton,
  GiVendingMachine,
} from "react-icons/gi"
import { IoFastFoodOutline } from "react-icons/io5"
import { LuNewspaper } from "react-icons/lu"
import {
  MdOutlineEventAvailable,
  MdOutlineSportsBasketball,
} from "react-icons/md"
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
  maintenanceDate?: number
  status?:
    | "pending"
    | "in_review"
    | "checking"
    | "approved"
    | "in_progress"
    | "completed"
    | "rejected"
}

// Add type icons mapping
const typeIcons = {
  permanent: {
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  temporary: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  maintenance: {
    icon: Printer,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
}

const iconColorMap = {
  store: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    accent: "from-blue-50 to-blue-100",
  },
  card: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    accent: "from-purple-50 to-purple-100",
  },
  tag: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    accent: "from-pink-50 to-pink-100",
  },
  package: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    accent: "from-amber-50 to-amber-100",
  },
  shirt: {
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    accent: "from-indigo-50 to-indigo-100",
  },
  food: {
    bg: "bg-red-100",
    text: "text-red-600",
    accent: "from-red-50 to-red-100",
  },
  coffee: {
    bg: "bg-brown-100",
    text: "text-brown-600",
    accent: "from-brown-50 to-brown-100",
  },
  bakery: {
    bg: "bg-rose-100",
    text: "text-rose-600",
    accent: "from-rose-50 to-rose-100",
  },
  event: {
    bg: "bg-teal-100",
    text: "text-teal-600",
    accent: "from-teal-50 to-teal-100",
  },
  book: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    accent: "from-emerald-50 to-emerald-100",
  },
  tech: {
    bg: "bg-cyan-100",
    text: "text-cyan-600",
    accent: "from-cyan-50 to-cyan-100",
  },
  education: {
    bg: "bg-violet-100",
    text: "text-violet-600",
    accent: "from-violet-50 to-violet-100",
  },
  service: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    accent: "from-gray-50 to-gray-100",
  },
  craft: {
    bg: "bg-fuchsia-100",
    text: "text-fuchsia-600",
    accent: "from-fuchsia-50 to-fuchsia-100",
  },
  sports: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    accent: "from-orange-50 to-orange-100",
  },
  ticket: {
    bg: "bg-yellow-100",
    text: "text-yellow-600",
    accent: "from-yellow-50 to-yellow-100",
  },
  research: {
    bg: "bg-lime-100",
    text: "text-lime-600",
    accent: "from-lime-50 to-lime-100",
  },
  printing: {
    bg: "bg-sky-100",
    text: "text-sky-600",
    accent: "from-sky-50 to-sky-100",
  },
  media: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    accent: "from-amber-50 to-amber-100",
  },
  farm: {
    bg: "bg-green-100",
    text: "text-green-600",
    accent: "from-green-50 to-green-100",
  },
  vendo: {
    bg: "bg-red-100",
    text: "text-red-600",
    accent: "from-red-50 to-red-100",
  },
  music: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    accent: "from-purple-50 to-purple-100",
  },
  health: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    accent: "from-pink-50 to-pink-100",
  },
  donation: {
    bg: "bg-rose-100",
    text: "text-rose-600",
    accent: "from-rose-50 to-rose-100",
  },
  art: {
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    accent: "from-indigo-50 to-indigo-100",
  },
  rental: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    accent: "from-blue-50 to-blue-100",
  },
  newspaper: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    accent: "from-gray-50 to-gray-100",
  },
  pin: {
    bg: "bg-red-100",
    text: "text-red-600",
    accent: "from-red-50 to-red-100",
  },
}

export function IgpCard({
  name,
  description,
  type,
  iconType = "store",
  totalSold,
  revenue,
  maintenanceDate,
  href = `/other-igps/${name}`,
  status,
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

  const Icon = icons[iconType] || Store
  const iconColors = iconColorMap[iconType] || iconColorMap.store
  const TypeIcon = typeIcons[type].icon
  const typeIconColor = typeIcons[type].color
  const typeIconBg = typeIcons[type].bg

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getStatusStyles = () => {
    switch (status) {
      case "rejected":
        return {
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          badgeBg: "bg-red-50",
          badgeText: "text-red-700",
          borderColor: "border-red-200",
          statusIcon: AlertTriangle,
          statusText: "Rejected",
          cardBg: "bg-gradient-to-br from-red-50/70 to-red-100/30",
          progressColor: "bg-red-500",
        }
      case "in_progress":
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          badgeBg: "bg-blue-50",
          badgeText: "text-blue-700",
          borderColor: "border-blue-200",
          statusIcon: Clock,
          statusText: "In Progress",
          cardBg: "bg-gradient-to-br from-blue-50/70 to-blue-100/30",
          progressColor: "bg-blue-500",
        }
      case "completed":
        return {
          iconBg: iconColors.bg,
          iconColor: iconColors.text,
          badgeBg: "bg-emerald-50",
          badgeText: "text-emerald-700",
          borderColor: "border-emerald-200",
          statusIcon: CheckCircle,
          statusText: "Completed",
          cardBg: `bg-gradient-to-br ${iconColors.accent}`,
          progressColor: "bg-emerald-500",
        }
      default:
        return {
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          badgeBg: "bg-blue-50",
          badgeText: "text-blue-700",
          borderColor: "border-blue-200",
          statusIcon: Clock,
          statusText: "Pending",
          cardBg: "bg-gradient-to-br from-blue-50/70 to-blue-100/30",
          progressColor: "bg-blue-500",
        }
    }
  }

  const statusStyles = getStatusStyles()
  const projectStatusLink = status !== "completed" ? "/project-approval" : href

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        y: -5,
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
      className="relative h-full"
    >
      <Card
        className={cn(
          "group flex h-full flex-col overflow-hidden border transition-all hover:shadow-lg",
          statusStyles.borderColor,
          statusStyles.cardBg,
          "relative isolate",
        )}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-10 group-hover:opacity-20 transition-opacity">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20" />
          <div className="absolute -left-5 -bottom-5 h-20 w-20 rounded-full bg-white/20" />
        </div>

        <CardContent className="relative flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-xl p-3 shadow-sm transition-all group-hover:shadow-md",
                  statusStyles.iconBg,
                  "group-hover:scale-105",
                )}
              >
                <Icon className={cn("h-5 w-5", statusStyles.iconColor)} />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 text-sm group-hover:text-slate-800 transition-colors">
                  {name}
                </h3>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-2 py-0.5 font-medium text-xs shadow-sm",
                      typeIconBg,
                      typeIconColor,
                      "group-hover:shadow-md transition-shadow",
                    )}
                  >
                    <motion.span
                      className="flex items-center gap-1.5 capitalize"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <TypeIcon className="h-3 w-3" />
                      {type}
                    </motion.span>
                  </Badge>

                  {type === "maintenance" &&
                    maintenanceDate &&
                    status !== "completed" && (
                      <span className="ml-1.5 text-xs text-blue-600">
                        Until {formatDateFromTimestamp(maintenanceDate)}
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>

          <p className="line-clamp-2 text-slate-600 text-xs group-hover:text-slate-700 transition-colors">
            {description}
          </p>

          {status === "rejected" ? (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <p className="text-red-700 text-xs">
                This IGP has been rejected.
              </p>
            </div>
          ) : status === "completed" ? (
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
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-2 backdrop-blur-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <p className="text-blue-700 text-xs">
                {status === "in_progress"
                  ? "Implementation in progress"
                  : "Pending approval"}
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter
          className={cn(
            "border-t p-4 backdrop-blur-sm",
            status === "completed"
              ? "bg-white/70 hover:bg-white/90"
              : "bg-white/50 hover:bg-white/70",
            "transition-colors",
          )}
        >
          <Link href={projectStatusLink} className="w-full">
            <Button
              variant="outline"
              className={cn(
                "w-full bg-white/90 hover:bg-white",
                status === "completed"
                  ? "border-slate-300 hover:border-slate-400"
                  : "border-blue-300 hover:border-blue-400",
                "shadow-sm hover:shadow-md transition-all",
              )}
            >
              <span className="mr-1">
                {status === "completed" ? "View Details" : "View Request"}
              </span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
