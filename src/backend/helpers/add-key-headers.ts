import { env } from "@/config/env"
import { hashSync } from "bcrypt-ts"

export const addKeyHeaders = <T>(options?: T) => {
  const rawAppApiKey = env.NEXT_PUBLIC_APP_API_KEY

  if (!rawAppApiKey) {
    throw new Error("Empty api key")
  }

  const encryptedAppApiKey = hashSync(rawAppApiKey, 10)

  if (!options) {
    return {
      headers: {
        "X-App-API-Key": encryptedAppApiKey,
      },
    }
  }

  const optionsWithHeaders = options as any

  if (!optionsWithHeaders.headers) {
    optionsWithHeaders.headers = {}
  }

  if (!optionsWithHeaders.headers["X-App-API-Key"]) {
    optionsWithHeaders.headers["X-App-API-Key"] = encryptedAppApiKey
  }

  return optionsWithHeaders
}
