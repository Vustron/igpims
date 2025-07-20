"use client"

import { useCreateIgpSupply } from "@/backend/actions/igp-supply/create-igp-supply"
import { useFindManyIgp } from "@/backend/actions/igp/find-many"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  CreateIgpSupplyPayload,
  createIgpSupplySchema,
} from "@/validation/igp-supply"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

export const CreateIgpSupplyForm = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: () => void
}) => {
  const { data: igps, isLoading } = useFindManyIgp()
  const createIgpSupply = useCreateIgpSupply()

  const form = useForm<CreateIgpSupplyPayload>({
    resolver: zodResolver(createIgpSupplySchema),
    defaultValues: {
      igpId: "",
      supplyDate: new Date(),
      quantity: 0,
      quantitySold: 0,
      unitPrice: 0,
      expenses: 0,
      totalRevenue: 0,
    },
  })

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "igpId" && value.igpId && igps?.data) {
        const selectedIgp = igps.data.find((igp) => igp.id === value.igpId)
        if (selectedIgp) {
          form.setValue("unitPrice", selectedIgp.costPerItem)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, igps])

  const createIgpSupplyFields: FieldConfig<CreateIgpSupplyPayload>[] = [
    {
      name: "igpId",
      type: "select",
      label: "IGP",
      placeholder: "Select IGP",
      description: "Select the IGP this supply belongs to",
      options: igps?.data?.map((igp) => ({
        label: igp.igpName,
        value: igp.id,
      })),
      required: true,
    },
    {
      name: "supplyDate",
      type: "date",
      label: "Supply Date",
      placeholder: "Select supply date",
      description: "Date when the items were supplied",
      required: true,
    },
    {
      name: "quantity",
      type: "number",
      label: "Quantity",
      placeholder: "Enter quantity",
      description: "Total number of items supplied",
      required: true,
      min: 1,
    },
    {
      name: "unitPrice",
      type: "number",
      label: "Unit Price",
      placeholder: "Enter price per unit",
      description: "Cost per individual item",
      required: true,
      min: 0,
    },
    {
      name: "quantitySold",
      type: "number",
      label: "Quantity Sold",
      placeholder: "Enter quantity sold",
      description: "Number of items already sold (if any)",
      required: false,
      min: 0,
    },
    {
      name: "expenses",
      type: "number",
      label: "Expenses",
      placeholder: "Enter additional expenses",
      description: "Any additional costs associated with this supply",
      required: false,
      min: 0,
    },
    {
      name: "totalRevenue",
      type: "number",
      label: "Total Revenue",
      placeholder: "Enter total revenue",
      description: "Total revenue generated from this supply (if any)",
      required: false,
      min: 0,
    },
  ]

  const onSubmit = async (values: CreateIgpSupplyPayload) => {
    const processedValues = {
      ...values,
      quantity: Number(values.quantity),
      quantitySold: Number(values.quantitySold || 0),
      unitPrice: Number(values.unitPrice),
      expenses: Number(values.expenses || 0),
      totalRevenue: Number(values.totalRevenue || 0),
      supplyDate: new Date(values.supplyDate).setHours(0, 0, 0, 0),
    }

    await toast.promise(createIgpSupply.mutateAsync(processedValues), {
      loading: <span className="animate-pulse">Creating supply...</span>,
      success: "Successfully created IGP supply",
      error: (error: unknown) => catchError(error),
    })

    form.reset()

    if (createIgpSupply.isSuccess) {
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
      mutation={createIgpSupply}
      fields={createIgpSupplyFields}
      submitButtonTitle={
        createIgpSupply.isPending ? "Creating..." : "Create Supply"
      }
      disabled={createIgpSupply.isPending}
      twoColumnLayout
    />
  )
}
