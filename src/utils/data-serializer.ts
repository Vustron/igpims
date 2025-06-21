import superjson from "superjson"

export const dataSerializer = <T>(data: T): T => {
  const serializedData = superjson.serialize(data)
  return superjson.deserialize(serializedData) as T
}
