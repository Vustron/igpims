"use client"

import { IgpTransactionWithIgp } from "@/backend/actions/igp-transaction/find-many"
import { useUpdateIgpTransaction } from "@/backend/actions/igp-transaction/update-igp-transaction"
import { useFindManyIgp } from "@/backend/actions/igp/find-many"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  UpdateIgpTransactionPayload,
  updateIgpTransactionSchema,
} from "@/validation/igp-transaction"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface UpdateIgpTransactionFormProps {
  initialData: IgpTransactionWithIgp
  onSuccess?: () => void
  onError?: () => void
}

export const UpdateIgpTransactionForm = ({
  initialData,
  onSuccess,
  onError,
}: UpdateIgpTransactionFormProps) => {
  const { data: igps, isLoading: isLoadingIgps } = useFindManyIgp()
  const updateTransaction = useUpdateIgpTransaction(
    initialData.id,
    initialData.igpId,
  )
  const [isFormReady, setIsFormReady] = useState(false)

  const getInitialDate = (timestamp: any) => {
    return new Date(timestamp * 1000).toISOString().split("T")[0]
  }

  const form = useForm<UpdateIgpTransactionPayload>({
    resolver: zodResolver(updateIgpTransactionSchema),
    defaultValues: {
      igpId: initialData.igpId,
      purchaserName: initialData.purchaserName,
      courseAndSet: initialData.courseAndSet,
      batch: initialData.batch || "N/A",
      quantity: initialData.quantity,
      dateBought: getInitialDate(initialData.dateBought),
      itemReceived: initialData.itemReceived,
    },
  })

  useEffect(() => {
    if (!isLoadingIgps) {
      setIsFormReady(true)
    }
  }, [isLoadingIgps])

  const igpOptions =
    igps?.data?.map((igp) => ({
      value: igp.id,
      label: igp.igpName,
    })) || []

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "received", label: "Received" },
    { value: "cancelled", label: "Cancelled" },
  ]

  const transactionFields: FieldConfig<UpdateIgpTransactionPayload>[] = [
    {
      name: "igpId",
      type: "select",
      label: "IGP",
      placeholder: "Select IGP",
      description: "The IGP this transaction belongs to",
      options: igpOptions,
      required: true,
    },
    {
      name: "purchaserName",
      type: "text",
      label: "Purchaser Name",
      placeholder: "Enter purchaser name",
      description: "Full name of the purchaser",
      required: true,
    },
    {
      name: "courseAndSet",
      type: "text",
      label: "Course & Set",
      placeholder: "e.g. BSIT 3A",
      description: "Course and section/year of the purchaser",
      required: true,
    },
    {
      name: "batch",
      type: "text",
      label: "Batch",
      placeholder: "e.g. 2023",
      description: "Batch or year group of the purchaser",
      required: false,
    },
    {
      name: "quantity",
      type: "number",
      label: "Quantity",
      placeholder: "Enter quantity",
      description: "Number of items purchased",
      required: true,
      min: 1,
    },
    {
      name: "dateBought",
      type: "date",
      label: "Date Bought",
      placeholder: "Select purchase date",
      description: "Date when the items were purchased",
      required: true,
    },
    {
      name: "itemReceived",
      type: "select",
      label: "Status",
      placeholder: "Select status",
      description: "Current status of the transaction",
      options: statusOptions,
      required: false,
    },
  ]

  const onSubmit = async (values: UpdateIgpTransactionPayload) => {
    const processedValues = {
      ...values,
      quantity: Number(values.quantity),
      dateBought: new Date(values.dateBought).setHours(0, 0, 0, 0),
    }

    await toast.promise(updateTransaction.mutateAsync(processedValues), {
      loading: <span className="animate-pulse">Updating transaction...</span>,
      success: "Transaction successfully updated",
      error: (error: unknown) => catchError(error),
    })

    if (updateTransaction.isSuccess) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  if (isLoadingIgps || !isFormReady) {
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
      fields={transactionFields}
      mutation={updateTransaction}
      submitButtonTitle="Update Transaction"
      twoColumnLayout
    />
  )
}
