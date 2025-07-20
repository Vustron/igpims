"use client"

import { useFindManyIgpSupply } from "@/backend/actions/igp-supply/find-many"
import { useCreateIgpTransaction } from "@/backend/actions/igp-transaction/create-igp-transaction"
import { useFindManyIgp } from "@/backend/actions/igp/find-many"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  CreateIgpTransactionPayload,
  createIgpTransactionSchema,
} from "@/validation/igp-transaction"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export const CreateIgpTransactionForm = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: () => void
}) => {
  const { data: igps, isLoading: loadingIgp } = useFindManyIgp()
  const { data: igpSupply, isLoading: loadingIgpSupply } =
    useFindManyIgpSupply()
  const createIgpTransaction = useCreateIgpTransaction()
  const isLoading = loadingIgp || loadingIgpSupply

  const form = useForm<CreateIgpTransactionPayload>({
    resolver: zodResolver(createIgpTransactionSchema),
    defaultValues: {
      igpId: "",
      purchaserName: "",
      courseAndSet: "",
      batch: "N/A",
      quantity: 1,
      dateBought: new Date(),
      itemReceived: "pending",
    },
  })

  const createIgpTransactionFields: FieldConfig<CreateIgpTransactionPayload>[] =
    [
      {
        name: "igpId",
        type: "select",
        label: "IGP",
        placeholder: "Select IGP",
        description: "Select the IGP this transaction belongs to",
        options: igps?.data?.map((igp) => ({
          label: igp.igpName,
          value: igp.id,
        })),
        required: true,
      },
      {
        name: "igpSupplyId",
        type: "select",
        label: "Igp Supply",
        placeholder: "Select Igp Supply",
        description: "Select the Igp Supply this transaction belongs to",
        options: igpSupply?.data?.map((supply) => ({
          label: `Supply ${new Date(supply.supplyDate).toLocaleDateString()} (${supply.quantity - supply.quantitySold} available)`,
          value: supply.id,
        })),
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
        options: [
          { value: "pending", label: "Pending" },
          { value: "received", label: "Received" },
          { value: "cancelled", label: "Cancelled" },
        ],
        required: false,
      },
    ]

  const onSubmit = async (values: CreateIgpTransactionPayload) => {
    const selectedSupply = igpSupply?.data?.find(
      (supply) => supply.id === values.igpSupplyId,
    )

    if (
      selectedSupply &&
      selectedSupply.quantity - selectedSupply.quantitySold <= 0
    ) {
      toast.error("This IGP supply has no available quantity")
      return
    }

    const processedValues = {
      ...values,
      quantity: Number(values.quantity),
      dateBought: new Date(values.dateBought).setHours(0, 0, 0, 0),
    }

    await toast.promise(createIgpTransaction.mutateAsync(processedValues), {
      loading: <span className="animate-pulse">Creating transaction...</span>,
      success: "Successfully created IGP transaction",
      error: (error: unknown) => catchError(error),
    })

    form.reset()

    if (createIgpTransaction.isSuccess) {
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
      mutation={createIgpTransaction}
      fields={createIgpTransactionFields}
      submitButtonTitle={
        createIgpTransaction.isPending ? "Creating..." : "Create Transaction"
      }
      disabled={createIgpTransaction.isPending}
      twoColumnLayout
    />
  )
}
