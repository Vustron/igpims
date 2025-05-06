// change color badge function
export const getPercentageChangeColor = (percentageChange: string) => {
  const value = Number.parseFloat(percentageChange)
  return value >= 0
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400"
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "from-emerald-500 to-emerald-600"
    case "under_maintenance":
      return "from-red-500 to-red-600"
    default:
      return "from-slate-400 to-slate-500"
  }
}

export function getStatusIndicator(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-300"
    case "under_maintenance":
      return "bg-yellow-300"
    default:
      return "bg-red-400"
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case "active":
      return "Available"
    case "under_maintenance":
      return "Maintenance"
    default:
      return "In use"
  }
}
