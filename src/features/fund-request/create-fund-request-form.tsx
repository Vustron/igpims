"use client"

import { useCreateFundRequest } from "@/backend/actions/fund-request/create-fund-request"
import { useFindManyUser } from "@/backend/actions/user/find-many"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  CreateFundRequest,
  createFundRequestSchema,
} from "@/validation/fund-request"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export const CreateFundRequestForm = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: () => void
}) => {
  const createFundRequest = useCreateFundRequest()
  const { data: users, isLoading } = useFindManyUser()

  const form = useForm<CreateFundRequest>({
    resolver: zodResolver(createFundRequestSchema),
    defaultValues: {
      requestor: "",
      purpose: "",
      position: "",
      amount: 0,
      requestDate: new Date(),
      dateNeeded: new Date(),
    },
  })

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "requestor" && value.requestor && users?.data) {
        const selectedUser = users.data.find(
          (user) => user.id === value.requestor,
        )
        if (selectedUser) {
          form.setValue("position", selectedUser.role || "")
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, users])

  const createFundRequestFields: FieldConfig<CreateFundRequest>[] = [
    {
      name: "requestor",
      type: "select",
      label: "Requestor Name",
      placeholder: "Enter requestor name",
      description: "Full name of the person requesting funds",
      options: users?.data.map((user) => ({
        label: user.name,
        value: user.id,
      })),
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

  const onSubmit = async (values: CreateFundRequest) => {
    const processedValues = {
      ...values,
      amount: Number(values.amount),
      requestDate: new Date(values.requestDate).setHours(0, 0, 0, 0),
      dateNeeded: new Date(values.dateNeeded).setHours(0, 0, 0, 0),
    }
    await toast.promise(createFundRequest.mutateAsync(processedValues), {
      loading: <span className="animate-pulse">Creating fund request...</span>,
      success: "Successfully created fund request",
      error: (error: unknown) => catchError(error),
    })

    form.reset()

    if (createFundRequest.isSuccess) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      mutation={createFundRequest}
      fields={createFundRequestFields}
      submitButtonTitle={
        createFundRequest.isPending ? "Creating..." : "Submit Fund Request"
      }
      disabled={createFundRequest.isPending}
      twoColumnLayout
    />
  )
}
