import { env } from "@/config/env"

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin
  if (env.NEXT_PUBLIC_APP_URL) return `https://${env.NEXT_PUBLIC_APP_URL}`
  return "http://localhost:3000"
}
