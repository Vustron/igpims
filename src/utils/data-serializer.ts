import superjson from "superjson"

export const dataSerializer = <T>(data: T): T => {
  if (typeof window === "undefined") {
    return data
  }

  const serializedData = superjson.serialize(data)
  return superjson.deserialize(serializedData) as T
}
