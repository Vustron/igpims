"use client"

import { useCreateExpenseTransaction } from "@/backend/actions/expense-transaction/create-expense"
import { useFindFundRequestById } from "@/backend/actions/fund-request/find-by-id"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import { convertImageToBase64 } from "@/utils/image-convert-base64"
import {
  CreateExpenseTransaction,
  createExpenseTransactionSchema,
} from "@/validation/expense-transaction"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface CreateExpenseFormProps {
  requestId?: string
  onSuccess?: () => void
  onError?: () => void
}

export const CreateExpenseForm = ({
  requestId,
  onSuccess,
  onError,
}: CreateExpenseFormProps) => {
  const createExpense = useCreateExpenseTransaction()
  const [isFormReady, setIsFormReady] = useState(false)
  const {
    data: fundRequestData,
    isLoading: isLoadingFundRequest,
    isError: isFundRequestError,
  } = useFindFundRequestById(requestId || "")

  const remainingBalance =
    (fundRequestData?.allocatedFunds ?? 0) -
    (fundRequestData?.utilizedFunds ?? 0)

  const form = useForm<CreateExpenseTransaction>({
    resolver: zodResolver(createExpenseTransactionSchema),
    defaultValues: {
      requestId: requestId || "",
      expenseName: "",
      amount: 0,
      date: Date.now(),
      receipt: undefined,
      status: "pending",
      rejectionReason: null,
    },
  })

  useEffect(() => {
    if (requestId && !isLoadingFundRequest) {
      form.reset({
        requestId: requestId,
        expenseName: "",
        amount: 0,
        date: Date.now(),
        receipt: undefined,
        status: "pending",
        rejectionReason: null,
      })
      setIsFormReady(true)
    } else if (!requestId) {
      setIsFormReady(true)
    }
  }, [requestId, isLoadingFundRequest, form])

  const fundRequestOptions =
    requestId && fundRequestData
      ? [
          {
            value: fundRequestData.id,
            label: fundRequestData.purpose,
          },
        ]
      : []
  const expenseFields: FieldConfig<CreateExpenseTransaction>[] = [
    {
      name: "requestId",
      type: "select",
      label: "Fund Request",
      placeholder: isLoadingFundRequest
        ? "Loading fund requests..."
        : "Select fund request",
      description: "The approved fund request this expense belongs to",
      options: fundRequestOptions,
      required: true,
    },
    {
      name: "expenseName",
      type: "text",
      label: "Expense Name",
      placeholder: "Enter expense name",
      description: "Name or description of the expense",
      required: true,
    },
    {
      name: "amount",
      type: "currency",
      label: "Amount (PHP)",
      placeholder: "Enter amount",
      description: "Amount spent for this expense",
      required: true,
    },
    {
      name: "date",
      type: "date",
      label: "Date of Expense",
      placeholder: "",
      description: "When this expense occurred",
      required: true,
    },
    {
      name: "receipt",
      type: "image",
      label: "Receipt",
      placeholder: "",
      description: "Upload receipt for this expense",
      required: false,
    },
  ]

  const onSubmit = async (values: CreateExpenseTransaction) => {
    if (!values.requestId) {
      toast.error("Please select a fund request")
      return
    }
    if (values.amount <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }

    if (values.amount > remainingBalance) {
      toast.error("Amount must not exceed remaining balance")
      return
    }

    const formData = { ...values, utilizedFunds: values.amount }

    if (formData.receipt instanceof File) {
      const base64Image = await convertImageToBase64(formData.receipt)
      formData.receipt = base64Image
    }

    await toast.promise(createExpense.mutateAsync(formData), {
      loading: <span className="animate-pulse">Recording expense...</span>,
      success: "Expense successfully recorded",
      error: (error: unknown) => catchError(error),
    })

    if (createExpense.isSuccess) {
      form.reset()
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  if (isLoadingFundRequest || !isFormReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (
    isFundRequestError ||
    (!isLoadingFundRequest && fundRequestOptions.length === 0)
  ) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        <h3 className="mb-2 font-semibold">Error Loading Form</h3>
        <p>
          There was a problem loading the fund request data or no approved fund
          requests available.
        </p>
      </div>
    )
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={expenseFields}
      mutation={createExpense}
      submitButtonTitle="Record Expense"
      twoColumnLayout
    />
  )
}
