export const extractIdFromImageKitUrl = (url: string): any => {
  try {
    const parsedUrl = new URL(url)
    const filename = parsedUrl.pathname.split("/").pop()
    if (!filename) return null

    const match = filename.match(
      /^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/,
    )

    return match && typeof match[1] === "string" ? match[1] : null
  } catch {
    return null
  }
}
