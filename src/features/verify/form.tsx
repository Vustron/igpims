"use client"

import { DynamicForm } from "@/components/ui/forms"

import { zodResolver } from "@hookform/resolvers/zod"
import { sendEmailSchema } from "@/schemas/user"
import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"

import { useSendVerifyLink } from "@/backend/actions/user/send-verify-link"
import { useForm } from "react-hook-form"

import type { SendEmailPayload } from "@/schemas/user"
import type { FieldConfig } from "@/interfaces/form"

interface VerifyFormProps {
  onSuccess?: () => void
  disabled?: boolean
}

export const VerifyForm = ({ onSuccess, disabled }: VerifyFormProps) => {
  const sendVerifyLink = useSendVerifyLink()

  const verifyFields: FieldConfig<SendEmailPayload>[] = [
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
    await toast.promise(sendVerifyLink.mutateAsync(values), {
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
      fields={verifyFields}
      submitButtonTitle="Send link"
      disabled={disabled}
      mutation={sendVerifyLink}
    />
  )
}
