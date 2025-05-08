import { format } from "date-fns/format"

export const formatDate = (timestamp: number) => {
  try {
    return format(new Date(timestamp), "PPP")
  } catch (error) {
    return "Invalid date"
  }
}

export const getRentalStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-500 hover:bg-emerald-600"
    case "expired":
      return "bg-red-500 hover:bg-red-600"
    case "cancelled":
      return "bg-slate-500 hover:bg-slate-600"
    case "pending":
      return "bg-amber-500 hover:bg-amber-600"
    default:
      return "bg-slate-500 hover:bg-slate-600"
  }
}

export const getPaymentStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "bg-emerald-500 hover:bg-emerald-600"
    case "pending":
      return "bg-amber-500 hover:bg-amber-600"
    case "partial":
      return "bg-blue-500 hover:bg-blue-600"
    case "overdue":
      return "bg-red-500 hover:bg-red-600"
    default:
      return "bg-slate-500 hover:bg-slate-600"
  }
}

export const getRemainingDays = (dueDate: number) => {
  const today = new Date()
  const due = new Date(dueDate)
  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
