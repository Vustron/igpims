import { passwordValidator } from "@/schemas/utils"
import { z } from "zod"

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Characters should not exceed 50"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(50, "Characters should not exceed 50"),
  password: z
    .string()
    .trim()
    .min(12, "Password must be at least 12 characters")
    .max(50, "Characters should not exceed 50")
    .refine(passwordValidator, {
      message:
        "Password must be strong (include uppercase, lowercase, number, symbol, and be at least 12 characters)",
    }),
  providerType: z.string().trim().default("credentials"),
})

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(50, "Characters should not exceed 50"),
  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .max(50, "Characters should not exceed 50"),
})

export const findUserByIdSchema = z.object({
  id: z.string().min(1, "User ID is required"),
})

export const findUserByIdResponseSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.number(),
  updatedAt: z.number(),
})

export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(50, "Characters should not exceed 50")
    .optional(),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(50, "Characters should not exceed 50")
    .optional(),
  image: z.any(),
  currentPassword: z
    .string()
    .trim()
    .max(50, "Characters should not exceed 50")
    .nullable()
    .optional(),
  newPassword: z
    .string()
    .trim()
    .max(50, "Characters should not exceed 50")
    .nullable()
    .optional()
    .superRefine((val, ctx) => {
      if (val && !passwordValidator(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Password must be strong (include uppercase, lowercase, number, symbol, and be at least 12 characters)",
        })
      }
    }),
  otpSignIn: z.boolean().optional(),
})

export const sendEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(50, "Characters should not exceed 50"),
})

export const emailVerificationSchema = z.object({
  token: z
    .string()
    .min(1, "Token is required")
    .max(50, "Characters should not exceed 50"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(50, "Characters should not exceed 50"),
})

export const resetPasswordSchema = z.object({
  token: z
    .string()
    .min(1, "Token is required")
    .max(50, "Characters should not exceed 50"),
  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .min(1, "Email is required")
    .max(50, "Characters should not exceed 50"),
  newPassword: z
    .string()
    .trim()
    .min(12, "Password must be at least 12 characters")
    .max(50, "Characters should not exceed 50")
    .refine(passwordValidator, {
      message:
        "Password must be strong (include uppercase, lowercase, number, symbol, and be at least 12 characters)",
    }),
})

export const deleteManyUserByIdSchema = z.object({
  userIds: z.array(z.string().min(1)),
})

export const signInOtpEmailSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "OTP is required")
    .max(6, "Characters should not exceed 6"),
})

export const presentedSession = z.object({
  id: z.string(),
  token: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  expiresAt: z.string(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
})

export const signInOtpAuthenticatorSchema = z.object({
  otp: z
    .string()
    .trim()
    .min(1, "OTP is required")
    .max(6, "Characters should not exceed 6"),
  userId: z
    .string()
    .min(1, "User ID is required")
    .max(50, "Characters should not exceed 50")
    .optional(),
})

export type SignUpPayload = z.infer<typeof signUpSchema>
export type SignInPayload = z.infer<typeof signInSchema>
export type FindAccountByIdPayload = z.infer<typeof findUserByIdSchema>
export type FindAccountByIdResponse = z.infer<typeof findUserByIdResponseSchema>
export type UpdateUserPayload = z.infer<typeof updateUserSchema>
export type SendEmailPayload = z.infer<typeof sendEmailSchema>
export type VerifyEmailPayload = z.infer<typeof emailVerificationSchema>
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>
export type DeleteManyUserByIdPayload = z.infer<typeof deleteManyUserByIdSchema>
export type SignInOtpEmailPayload = z.infer<typeof signInOtpEmailSchema>
export type PresentedSession = z.infer<typeof presentedSession>
export type SignInOtpAuthenticatorPayload = z.infer<
  typeof signInOtpAuthenticatorSchema
>
