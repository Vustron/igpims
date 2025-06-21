import DOMPurify from "isomorphic-dompurify"
import { z } from "zod"

export const sanitizer = <T>(
  data: unknown,
  schema: z.ZodObject<z.ZodRawShape>,
): T => {
  const clean = DOMPurify
  const sanitizeObject = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) return obj

    switch (typeof obj) {
      case "string":
        return clean.sanitize(obj)
      case "object":
        if (Array.isArray(obj)) {
          return obj.map((item) => sanitizeObject(item))
        }
        return Object.keys(obj).reduce(
          (acc, key) => {
            acc[key] = sanitizeObject((obj as Record<string, unknown>)[key])
            return acc
          },
          {} as Record<string, unknown>,
        )
      default:
        return obj
    }
  }

  const sanitizedData = sanitizeObject(data)

  const parsedData = schema.safeParse(sanitizedData)

  if (!parsedData.success) {
    throw new Error(JSON.stringify(parsedData.error.message))
  }

  return parsedData.data as T
}
