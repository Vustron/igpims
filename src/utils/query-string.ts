// Construct query string utility
export function buildQueryString(
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  if (!params) return ""
  return `?${Object.entries(params)
    .map(
      ([ key, value ]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`,
    )
    .join("&")}`
}
