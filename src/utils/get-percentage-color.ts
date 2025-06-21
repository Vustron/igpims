export const getPercentageChangeColor = (percentageChange: string) => {
  const value = Number.parseFloat(percentageChange)
  return value >= 0
    ? "text-green-600 dark:text-green-400"
    : "text-red-600 dark:text-red-400"
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

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "active":
      return "Available"
    case "inactive":
      return "In Use"
    case "under_maintenance":
      return "Maintenance"
    default:
      return "All"
  }
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-emerald-500 hover:bg-emerald-600"
    case "inactive":
      return "bg-yellow-500 hover:bg-yellow-600"
    case "under_maintenance":
      return "bg-red-500 hover:bg-red-600"
    default:
      return "bg-blue-500 hover:bg-blue-600"
  }
}
