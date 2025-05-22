"use client"

import { DynamicForm } from "@/components/ui/forms"

import { zodResolver } from "@hookform/resolvers/zod"
import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { useState } from "react"

import type { FieldConfig } from "@/interfaces/form"

export const fundRequestSchema = z.object({
  requestorName: z.string().min(1, "Requestor name is required"),
  position: z.string().min(1, "Position is required"),
  purpose: z.string().min(1, "Purpose is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  dateOfRequest: z.date({
    required_error: "Date of request is required",
  }),
  dateOfNeed: z
    .date({
      required_error: "Date of need is required",
    })
    .refine(
      (date) => {
        return date >= new Date()
      },
      {
        message: "Date of need must be today or in the future",
      },
    ),
  requestStatus: z.enum(["pending", "approved", "rejected"]).optional(),
})

export type FundRequest = z.infer<typeof fundRequestSchema>

interface CreateFundRequestFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateFundRequestForm = ({
  onSuccess,
  onError,
}: CreateFundRequestFormProps) => {
  const [, setIsSubmitting] = useState(false)

  const form = useForm<FundRequest>({
    resolver: zodResolver(fundRequestSchema),
    defaultValues: {
      requestorName: "",
      position: "",
      purpose: "",
      amount: 0,
      dateOfRequest: new Date(),
      dateOfNeed: new Date(),
      requestStatus: "pending",
    },
  })

  const createFundRequestFields: FieldConfig<FundRequest>[] = [
    {
      name: "requestorName",
      type: "text",
      label: "Requestor Name",
      placeholder: "Enter requestor name",
      description: "Full name of the person requesting funds",
      required: true,
    },
    {
      name: "position",
      type: "text",
      label: "Position",
      placeholder: "Enter position",
      description: "Job title or position of the requestor",
      required: true,
    },
    {
      name: "purpose",
      type: "textarea",
      label: "Purpose",
      placeholder: "",
      description: "Detailed explanation of why funds are needed",
      required: true,
    },
    {
      name: "amount",
      type: "currency",
      label: "Amount",
      placeholder: "Enter amount in PHP",
      description: "Amount of funds requested",
      required: true,
    },
    {
      name: "dateOfRequest",
      type: "date",
      label: "Date of Request",
      placeholder: "Enter date of request",
      description: "Date when the request is submitted",
      required: true,
    },
    {
      name: "dateOfNeed",
      type: "date",
      label: "Date of Need",
      placeholder: "Enter date of need",
      description: "Date when the funds are needed",
      required: true,
    },
  ]

  const onSubmit = async (data: FundRequest) => {
    try {
      setIsSubmitting(true)

      toast.success("Fund request created successfully!")

      const formattedData = {
        ...data,
        amount: Number(data.amount),
      }

      form.reset({
        requestorName: "",
        position: "",
        purpose: "",
        amount: 0,
        dateOfRequest: new Date(),
        dateOfNeed: new Date(),
        requestStatus: "pending",
      })

      console.log(formattedData)

      if (onSuccess) onSuccess()
    } catch (error) {
      const errorMessage = catchError(error)
      toast.error(errorMessage || "Failed to create fund request")
      if (onError) onError()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={createFundRequestFields}
      submitButtonTitle="Submit Fund Request"
      twoColumnLayout
    />
  )
}
