"use client"

import {
  ShieldX,
  Wallet,
  ShieldCheck,
  WalletCards,
  ShieldAlert,
  CircleDashed,
  AlertTriangle,
  ShieldQuestion,
  TimerReset,
  CreditCard,
} from "lucide-react"

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return (
        <ShieldCheck className="size-4 text-emerald-500" aria-hidden="true" />
      )
    case "expired":
      return <ShieldAlert className="size-4 text-red-500" aria-hidden="true" />
    case "cancelled":
      return <ShieldX className="size-4 text-slate-500" aria-hidden="true" />
    case "pending":
      return (
        <ShieldQuestion className="size-4 text-amber-500" aria-hidden="true" />
      )
    default:
      return (
        <CircleDashed className="size-4 text-slate-500" aria-hidden="true" />
      )
  }
}

export const getPaymentIcon = (status: string) => {
  switch (status) {
    case "paid":
      return <Wallet className="size-4 text-emerald-500" aria-hidden="true" />
    case "pending":
      return <TimerReset className="size-4 text-amber-500" aria-hidden="true" />
    case "partial":
      return <WalletCards className="size-4 text-blue-500" aria-hidden="true" />
    case "overdue":
      return (
        <AlertTriangle className="size-4 text-red-500" aria-hidden="true" />
      )
    default:
      return <CreditCard className="size-4 text-slate-500" aria-hidden="true" />
  }
}

export const getStatusDescription = (status: string) => {
  switch (status) {
    case "active":
      return "Locker rental is currently active"
    case "expired":
      return "Rental period has ended"
    case "cancelled":
      return "Rental was cancelled"
    case "pending":
      return "Waiting for approval"
    default:
      return "Status unknown"
  }
}

export const getPaymentDescription = (status: string) => {
  switch (status) {
    case "paid":
      return "Full payment received"
    case "pending":
      return "Payment not yet received"
    case "partial":
      return "Partial payment made"
    case "overdue":
      return "Payment is past due"
    default:
      return "Payment status unknown"
  }
}
