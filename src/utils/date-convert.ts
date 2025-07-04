export const toTimestamp = (date: any): number => {
  if (date instanceof Date) {
    return date.getTime()
  }
  if (typeof date === "string") {
    return new Date(date).getTime()
  }
  if (typeof date === "number") {
    return date
  }
  return Date.now()
}

export const formatDateFromTimestamp = (timestamp: number) => {
  try {
    const date = new Date(timestamp / 1000)
    if (Number.isNaN(date.getTime())) {
      return "Invalid Date"
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).format(date)
  } catch (error) {
    return "Invalid Date"
  }
}

export const convertDateToEpoch = (date: any) => {
  if (!date) return null
  if (date instanceof Date) return date.getTime()
  if (typeof date === "string") return new Date(date).getTime()
  return date
}

export function convertDatesToTimestamps(obj: any): any {
  if (obj instanceof Date) {
    return obj.getTime()
  }

  if (Array.isArray(obj)) {
    return obj.map(convertDatesToTimestamps)
  }

  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertDatesToTimestamps(value),
      ]),
    )
  }

  return obj
}
