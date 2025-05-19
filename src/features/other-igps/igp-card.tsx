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
} from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/cards"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"

import { motion } from "framer-motion"
import { cn } from "@/utils/cn"
// import Link from "next/link"

import {
  GiCupcake,
  GiClothes,
  GiCoffeeCup,
  GiBookshelf,
  GiPaintBrush,
  GiMicroscope,
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
  type: "temporary" | "permanent"
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
  totalSold: number
  revenue: number
  href?: string
}

export function IgpCard({
  // id,
  name,
  description,
  type,
  iconType = "store",
  totalSold,
  revenue,
  // href = `/igps/${id}`,
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
  }

  const Icon = icons[iconType]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden border-slate-200 transition-all hover:border-slate-300 hover:shadow-md">
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "rounded-md p-2",
                  type === "permanent" ? "bg-emerald-100" : "bg-amber-100",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    type === "permanent"
                      ? "text-emerald-700"
                      : "text-amber-700",
                  )}
                />
              </div>
              <div>
                <h3 className="font-medium text-slate-900 text-sm">{name}</h3>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "px-1.5 py-0 font-medium text-[10px]",
                      type === "permanent"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-amber-200 bg-amber-50 text-amber-700",
                    )}
                  >
                    <motion.span
                      className="flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {type === "permanent" ? (
                        <CheckCircle className="h-2.5 w-2.5" />
                      ) : (
                        <Clock className="h-2.5 w-2.5" />
                      )}
                      {type === "permanent" ? "Permanent" : "Temporary"}
                    </motion.span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <p className="line-clamp-2 text-slate-600 text-xs">{description}</p>

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
        </CardContent>

        <CardFooter className="border-t bg-slate-50 p-4">
          {/* <Link href={href} className="w-full"> */}
          <Button
            variant="outline"
            className="w-full border-slate-300 bg-white hover:bg-slate-100"
          >
            <span className="mr-1">View Details</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          {/* </Link> */}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
