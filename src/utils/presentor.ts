type DateToString<T> = {
  [P in keyof T]: T[P] extends Date
    ? string
    : T[P] extends object
      ? DateToString<T[P]>
      : T[P]
}

export function presentor<T>(data: T): DateToString<T> {
  if (!data) return data as any

  const convertedValues: any = { ...data }

  // Convert dates to ISO strings
  for (const key of Object.keys(convertedValues)) {
    const value = convertedValues[key]

    if (value instanceof Date) {
      convertedValues[key] = value.toISOString() as any
    } else if (value && typeof value === "object") {
      convertedValues[key] = presentor(value)
    }
  }

  return convertedValues as DateToString<T>
}
