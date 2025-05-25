export const getRentalStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "expired":
      return "bg-red-100 text-red-800 border-red-200"
    case "cancelled":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 border-green-200"
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "partial":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "overdue":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}
