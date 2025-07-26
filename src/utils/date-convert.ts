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

const normalizeTimestampToMillis = (value: number): number => {
  const str = value.toString()
  const length = str.length

  // Handle negative timestamps (BC dates)
  if (value < 0) {
    const absValue = Math.abs(value)
    const absStr = absValue.toString()
    const absLength = absStr.length

    if (absLength <= 10) return value * 1000
    if (absLength <= 13) return value
    if (absLength <= 16) return Math.floor(value / 1000)
    return Math.floor(value / 1000000)
  }

  // Handle positive timestamps
  if (length <= 10) return value * 1000 // Seconds to milliseconds
  if (length <= 13) return value // Already milliseconds
  if (length <= 16) return Math.floor(value / 1000) // Microseconds to milliseconds
  return Math.floor(value / 1000000) // Nanoseconds to milliseconds
}

/**
 * Safely formats a timestamp into a date string
 * @param timestamp Can be in seconds, milliseconds, microseconds, or nanoseconds
 */
export const formatDateFromTimestamp = (timestamp: any) => {
  try {
    const millis = normalizeTimestampToMillis(timestamp)
    const date = new Date(millis)

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

export const convertTimestampToDate = (timestamp: number | Date): Date => {
  // If it's already a Date object, return it
  if (timestamp instanceof Date) return timestamp

  const str = timestamp.toString()

  // Handle Unix timestamps (seconds since epoch)
  if (str.length <= 10) return new Date(timestamp * 1000)

  // Handle milliseconds since epoch
  return new Date(timestamp)
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const calculateDayDifference = (
  dateDue: number,
  dateGenerated: number,
) => {
  const differenceInMs = dateDue - dateGenerated
  return Math.ceil(differenceInMs / (1000 * 60 * 60 * 24))
}
