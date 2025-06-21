"use client"

import {
  Calendar,
  Clock,
  CreditCard,
  ShieldCheck,
  Tag,
  User,
  Wallet,
} from "lucide-react"

export const createColumnHeader = (icon: React.ReactNode, text: string) => {
  return () => (
    <div className="flex items-center gap-1">
      {icon}
      <span>{text}</span>
    </div>
  )
}

export const columnHeaders = {
  renter: createColumnHeader(<User className="size-3.5" />, "Renter"),
  course: createColumnHeader(<Tag className="size-3.5" />, "Course"),
  status: createColumnHeader(<ShieldCheck className="size-3.5" />, "Status"),
  payment: createColumnHeader(<Wallet className="size-3.5" />, "Payment"),
  rental: createColumnHeader(<Calendar className="size-3.5" />, "Rental"),
  due: createColumnHeader(<Clock className="size-3.5" />, "Due"),
  amount: () => (
    <div className="flex items-center justify-end gap-1">
      <CreditCard className="size-3.5" />
      <span>Amount</span>
    </div>
  ),
}
