"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useSignInOtpAuthenticator } from "@/backend/actions/user/sign-in-otp-auth"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  SignInOtpAuthenticatorPayload,
  signInOtpAuthenticatorSchema,
} from "@/validation/user"

interface SignInOtpAuthenticatorFormProps {
  userId: string
}

export const SignInOtpAuthenticatorForm = ({
  userId,
}: SignInOtpAuthenticatorFormProps) => {
  const signInOtpAuthenticator = useSignInOtpAuthenticator()

  const signInOTPFields: FieldConfig<SignInOtpAuthenticatorPayload>[] = [
    {
      name: "otp",
      type: "password",
      label: "OTP",
      placeholder: "Enter the otp from your authenticator app",
    },
  ]

  const form = useForm<SignInOtpAuthenticatorPayload>({
    resolver: zodResolver(signInOtpAuthenticatorSchema),
    defaultValues: {
      otp: "",
    },
  })

  const submitHandler = async (values: SignInOtpAuthenticatorPayload) => {
    await toast.promise(
      signInOtpAuthenticator.mutateAsync({
        ...values,
        userId,
      }),
      {
        loading: <span className="animate-pulse">Signing in...</span>,
        success: "User signed in successfully",
        error: (error: unknown) => catchError(error),
      },
    )
    form.reset()
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={submitHandler}
      fields={signInOTPFields}
      submitButtonTitle="Sign In"
      mutation={signInOtpAuthenticator}
      isSignIn
      submitButtonClassname="w-full bg-amber-300 text-black hover:bg-amber-400 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#222216] disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}
