"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useSendResetLink } from "@/backend/actions/user/send-reset-link"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import { SendEmailPayload, sendEmailSchema } from "@/validation/user"

interface ResetLinkFormProps {
  onSuccess?: () => void
  disabled?: boolean
}

export const SendResetLinkForm = ({
  onSuccess,
  disabled,
}: ResetLinkFormProps) => {
  const sendResetLink = useSendResetLink()

  const resetFields: FieldConfig<SendEmailPayload>[] = [
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Enter your email",
    },
  ]

  const form = useForm<SendEmailPayload>({
    resolver: zodResolver(sendEmailSchema),
    defaultValues: {
      email: "",
    },
  })

  const submitHandler = async (values: SendEmailPayload) => {
    await toast.promise(sendResetLink.mutateAsync(values), {
      loading: <span className="animate-pulse">Sending link...</span>,
      success: "Link sent, please check your email",
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
      submitButtonTitle="Send link"
      disabled={disabled}
      mutation={sendResetLink}
      isResetPassword
      submitButtonClassname="w-full bg-amber-300 text-black hover:bg-amber-400 focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#222216] disabled:cursor-not-allowed disabled:opacity-50"
      isSignIn
    />
  )
}
