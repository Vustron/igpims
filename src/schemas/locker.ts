import { z } from "zod"

export const lockerSchema = z.object({
  lockerStatus: z
    .enum([
      "available",
      "occupied",
      "reserved",
      "maintenance",
      "out-of-service",
    ])
    .describe("Whether the locker is currently available for rental")
    .optional(),
  lockerType: z
    .enum(["small", "medium", "large", "extra-large"])
    .describe("Size/type of the locker")
    .optional(),
  lockerName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Characters should not exceed 50")
    .optional(),
  lockerLocation: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(50, "Characters should not exceed 50"),
  lockerRentalPrice: z
    .number()
    .min(1, "Rental price must be a positive number")
    .max(1000, "Rental price must be less than 1000")
    .optional(),
})

export type Locker = z.infer<typeof lockerSchema>
