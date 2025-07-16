"use client"

import { ExpenseTransactionWithRequestor } from "@/backend/actions/expense-transaction/find-many"
import { useUpdateExpenseTransaction } from "@/backend/actions/expense-transaction/update-expense"
import { useFindManyFundRequests } from "@/backend/actions/fund-request/find-many"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  UpdateExpenseTransaction,
  updateExpenseTransactionSchema,
} from "@/validation/expense-transaction"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface EditExpenseTransactionFormProps {
  initialData: ExpenseTransactionWithRequestor
  onSuccess?: () => void
  onError?: () => void
}

export const EditExpenseForm = ({
  initialData,
  onSuccess,
  onError,
}: EditExpenseTransactionFormProps) => {
  const updateExpense = useUpdateExpenseTransaction(initialData.id)
  const [isFormReady, setIsFormReady] = useState(false)
  const [, setCurrentReceipt] = useState<string | null>(initialData.receipt)

  const {
    data: fundRequestsData,
    isLoading: isLoadingFundRequests,
    isError: isFundRequestsError,
  } = useFindManyFundRequests({
    limit: 100,
  })

  const form = useForm<UpdateExpenseTransaction>({
    resolver: zodResolver(updateExpenseTransactionSchema),
    defaultValues: {
      requestId: initialData.requestId,
      expenseName: initialData.expenseName,
      amount: initialData.amount,
      date: initialData.date,
      receipt: initialData.receipt || undefined,
      utilizedFunds: initialData.amount,
      status: initialData.status,
      rejectionReason: initialData.rejectionReason || undefined,
    },
  })

  useEffect(() => {
    if (
      !isLoadingFundRequests &&
      (fundRequestsData?.data?.length! > 0 || isFundRequestsError)
    ) {
      setIsFormReady(true)
    }
  }, [isLoadingFundRequests, fundRequestsData, isFundRequestsError])

  const fundRequestOptions =
    fundRequestsData?.data.map((request) => ({
      value: request.id,
      label: `${request.purpose} (${new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(request.amount)})`,
    })) || []

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "validated", label: "Validated" },
    { value: "rejected", label: "Rejected" },
  ]

  const expenseFields: FieldConfig<UpdateExpenseTransaction>[] = [
    {
      name: "requestId",
      type: "select",
      label: "Fund Request",
      placeholder: "Select fund request",
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
      name: "status",
      type: "select",
      label: "Status",
      placeholder: "",
      description: "Current status of the expense",
      options: statusOptions,
      required: true,
    },
    {
      name: "rejectionReason",
      type: "textarea",
      label: "Rejection Reason",
      description: "Required if status is rejected",
      placeholder: "",
      required: form.watch("status") === "rejected",
      hidden: form.watch("status") !== "rejected",
    },
    {
      name: "receipt",
      type: "image",
      label: "Receipt",
      placeholder: "",
      required: false,
    },
  ]

  const onSubmit = async (values: UpdateExpenseTransaction) => {
    if (values?.amount! <= 0) {
      toast.error("Amount must be greater than 0")
      return
    }

    if (values.status === "rejected" && !values.rejectionReason) {
      toast.error("Please provide a rejection reason")
      return
    }

    const formData = {
      ...values,
      receipt: values.receipt === undefined ? null : values.receipt,
      date: new Date(values.date).setHours(0, 0, 0, 0),
    }

    await toast.promise(updateExpense.mutateAsync(formData), {
      loading: <span className="animate-pulse">Updating expense...</span>,
      success: "Expense successfully updated",
      error: (error: unknown) => catchError(error),
    })

    if (updateExpense.isSuccess) {
      if (formData.receipt !== undefined) {
        setCurrentReceipt(formData.receipt)
      }
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  if (isLoadingFundRequests || !isFormReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (
    isFundRequestsError ||
    (!isLoadingFundRequests && fundRequestOptions.length === 0)
  ) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        <h3 className="mb-2 font-semibold">Error Loading Form</h3>
        <p>There was a problem loading the fund request data.</p>
      </div>
    )
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={expenseFields}
      mutation={updateExpense}
      submitButtonTitle="Update Expense"
      twoColumnLayout
      isUsingImagekit
    />
  )
}
