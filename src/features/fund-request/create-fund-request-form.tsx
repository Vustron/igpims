"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { DynamicForm } from "@/components/ui/forms"
import { useDialog } from "@/hooks/use-dialog"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import { useFundRequestStore } from "./fund-request-store"

export const fundRequestSchema = z.object({
  requestorName: z.string().min(1, "Requestor name is required"),
  purpose: z.string().min(1, "Purpose is required"),
  position: z.string().min(1, "Position is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  requestDate: z.any().optional(),
  dateNeeded: z.any().optional(),
})

export type CreateFundRequestForm = z.infer<typeof fundRequestSchema>

export const CreateFundRequestForm = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: () => void
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addRequest } = useFundRequestStore()
  const { onClose } = useDialog()

  const form = useForm<CreateFundRequestForm>({
    resolver: zodResolver(fundRequestSchema),
    defaultValues: {
      requestorName: "",
      purpose: "",
      position: "",
      amount: 0,
      requestDate: new Date(),
      dateNeeded: new Date(),
    },
  })

  const createFundRequestFields: FieldConfig<CreateFundRequestForm>[] = [
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
      label: "Fund Request Purpose",
      placeholder: "Enter purpose of funds",
      description:
        "Detailed explanation of why funds are needed and how they will be used",
      required: true,
    },
    {
      name: "amount",
      type: "number",
      label: "Amount (PHP)",
      placeholder: "Enter amount",
      description: "Amount of funds requested in Philippine Pesos",
      required: true,
    },
    {
      name: "requestDate",
      type: "date",
      label: "Date of Request",
      placeholder: "Select date of request",
      description: "Date when the fund request is being made",
      required: true,
    },
    {
      name: "dateNeeded",
      type: "date",
      label: "Date Needed By",
      placeholder: "Select date needed by",
      description:
        "Date by which the funds are needed for the intended purpose",
      required: true,
    },
  ]

  const onSubmit = async (data: CreateFundRequestForm) => {
    try {
      setIsSubmitting(true)

      if (data.amount <= 0) {
        form.setError("amount", {
          type: "manual",
          message: "Amount must be greater than 0",
        })
        setIsSubmitting(false)
        return
      }

      const requestId = addRequest({
        requestor: data.requestorName,
        position: data.position,
        purpose: data.purpose,
        amount: data.amount,
        requestDate: data.requestDate,
        dateNeeded: data.dateNeeded,
        utilizedFunds: 0,
        allocatedFunds: 0,
      })

      toast.success(`Fund request ${requestId} created successfully!`)

      form.reset({
        requestorName: "",
        position: "",
        purpose: "",
        amount: 0,
        requestDate: new Date(),
        dateNeeded: new Date(),
      })

      onClose()
      onSuccess?.()
    } catch (error) {
      const errorMessage = catchError(error)
      toast.error(errorMessage || "Failed to create fund request")
      onError?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={createFundRequestFields}
      submitButtonTitle={isSubmitting ? "Creating..." : "Submit Fund Request"}
      disabled={isSubmitting}
      twoColumnLayout
    />
  )
}
