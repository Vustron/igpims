"use client"

import { DynamicForm } from "@/components/ui/forms"

import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema } from "@/validation/user"
import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"

import { useResetPassword } from "@/backend/actions/user/reset-password"
import { useForm } from "react-hook-form"

import type { ResetPasswordPayload } from "@/validation/user"
import type { FieldConfig } from "@/interfaces/form"

interface ResetPasswordFormProps {
  onSuccess?: () => void
  disabled?: boolean
  token: string
  email: string
}

export const ResetPasswordForm = ({
  onSuccess,
  disabled,
  token,
  email,
}: ResetPasswordFormProps) => {
  const resetPassword = useResetPassword()

  const resetFields: FieldConfig<ResetPasswordPayload>[] = [
    {
      name: "newPassword",
      type: "password",
      label: "New Password",
      placeholder: "Enter your new password",
    },
  ]

  const form = useForm<ResetPasswordPayload>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      token: token,
      newPassword: "",
    },
  })

  const submitHandler = async (values: ResetPasswordPayload) => {
    await toast.promise(resetPassword.mutateAsync(values), {
      loading: <span className="animate-pulse">Resetting password...</span>,
      success: "Password resetted, you can now sign in",
      error: (error: unknown) => catchError(error),
    })
    form.reset()
    onSuccess?.()
  }

  return disabled ? null : (
    <DynamicForm
      form={form}
      onSubmit={submitHandler}
      fields={resetFields}
      submitButtonTitle="Reset Password"
      disabled={disabled}
      mutation={resetPassword}
      isSignIn
      submitButtonClassname="w-full bg-amber-300 text-black hover:bg-amber-400 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#222216] disabled:cursor-not-allowed disabled:opacity-50"
    />
  )
}
