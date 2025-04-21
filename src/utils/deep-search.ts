export const deepSearch = (obj: any, searchTerm: string): boolean => {
  if (!obj || typeof obj !== "object") return false

  return Object.values(obj).some((value) => {
    if (typeof value === "object") {
      return deepSearch(value, searchTerm)
    }
    if (typeof value === "string" || typeof value === "number") {
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    }
    return false
  })
}
