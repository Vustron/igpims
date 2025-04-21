"use client"

import { DynamicForm } from "@/components/ui/forms"

import { zodResolver } from "@hookform/resolvers/zod"
import { signInOtpEmailSchema } from "@/schemas/user"
import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"

import { useSignInOTPEmail } from "@/backend/actions/user/sign-in-otp-email"
import { useForm } from "react-hook-form"

import type { SignInOtpEmailPayload } from "@/schemas/user"
import type { FieldConfig } from "@/interfaces/form"

export const SignInOTPEmailForm = () => {
  const signInOTPEmail = useSignInOTPEmail()

  const signInOTPFields: FieldConfig<SignInOtpEmailPayload>[] = [
    {
      name: "otp",
      type: "password",
      label: "OTP",
      placeholder: "Enter the otp sent to your email",
    },
  ]

  const form = useForm<SignInOtpEmailPayload>({
    resolver: zodResolver(signInOtpEmailSchema),
    defaultValues: {
      otp: "",
    },
  })

  const submitHandler = async (values: SignInOtpEmailPayload) => {
    await toast.promise(signInOTPEmail.mutateAsync(values), {
      loading: <span className="animate-pulse">Signing in...</span>,
      success: "User signed in successfully",
      error: (error: unknown) => catchError(error),
    })
    form.reset()
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={submitHandler}
      fields={signInOTPFields}
      submitButtonTitle="Sign In"
      mutation={signInOTPEmail}
      isSignIn
    />
  )
}
