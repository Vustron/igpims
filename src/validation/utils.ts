import { z } from "zod"

export const requiredString = z.string().trim().min(1, "Required")

export const passwordValidator = (password: string) => {
  let score = 0
  if (password.length >= 12) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++
  return score >= 4
}
