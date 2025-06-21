"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useSignInOTPEmail } from "@/backend/actions/user/sign-in-otp-email"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import { SignInOtpEmailPayload, signInOtpEmailSchema } from "@/validation/user"

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
      submitButtonClassname="w-full bg-amber-300 text-black hover:bg-amber-400 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#222216] disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}
