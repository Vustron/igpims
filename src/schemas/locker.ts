import { z } from "zod"

const rentalSchema = z.object({
  id: z.string().optional(),
  lockerId: z.string().optional(),
  renterId: z.string().optional(),
  renterName: z.string().optional(),
  courseAndSet: z.string().optional(),
  renterEmail: z.string().optional(),
  rentalStatus: z
    .enum(["active", "pending", "expired", "cancelled"])
    .optional(),
  paymentStatus: z.enum(["paid", "pending", "partial", "overdue"]).optional(),
  dateRented: z.number().optional(),
  dateDue: z.number().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
})

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
  lockerRentalPrice: z.any().optional(),
  rental: rentalSchema.nullable().optional(),
  rentalHistory: z.array(rentalSchema).optional(),
})

export const lockerConfigSchema = z.object({
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
  lockerRentalPrice: z.any().optional(),
  rentalId: z.string().optional(),
  lockerId: z.string().optional(),
  renterId: z.string().optional(),
  renterName: z.string().optional(),
  courseAndSet: z.string().optional(),
  renterEmail: z.string().optional(),
  rentalStatus: z
    .enum(["active", "pending", "expired", "cancelled"])
    .optional(),
  paymentStatus: z.enum(["paid", "pending", "partial", "overdue"]).optional(),
  dateRented: z.any().optional(),
  dateDue: z.any().optional(),
})

export type Locker = z.infer<typeof lockerSchema>
export type RentalInfo = z.infer<typeof rentalSchema>
export type LockerConfig = z.infer<typeof lockerConfigSchema>
