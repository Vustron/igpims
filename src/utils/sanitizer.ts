import DOMPurify from "isomorphic-dompurify"

import type { z } from "zod"

// data sanitizer
export const sanitizer = <T>(
  data: unknown,
  schema: z.ZodObject<z.ZodRawShape>,
): T => {
  const clean = DOMPurify
  // Sanitize each field of the object
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

  // Sanitize the data
  const sanitizedData = sanitizeObject(data)

  // Validate and parse the object
  const parsedData = schema.safeParse(sanitizedData)

  if (!parsedData.success) {
    throw new Error(JSON.stringify(parsedData.error.message))
  }

  return parsedData.data as T
}
