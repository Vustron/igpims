"use client"

import { IgpSupplyWithRelations } from "@/backend/actions/igp-supply/find-by-id"
import { useUpdateIgpSupply } from "@/backend/actions/igp-supply/update-igp-supply"
import { useFindManyIgp } from "@/backend/actions/igp/find-many"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  UpdateIgpSupplyPayload,
  updateIgpSupplySchema,
} from "@/validation/igp-supply"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface EditIgpSupplyFormProps {
  initialData: IgpSupplyWithRelations
  onSuccess?: () => void
  onError?: () => void
}

export const EditIgpSupplyForm = ({
  initialData,
  onSuccess,
  onError,
}: EditIgpSupplyFormProps) => {
  const { data: igps, isLoading: isLoadingIgps } = useFindManyIgp()
  const updateIgpSupply = useUpdateIgpSupply(initialData.id, initialData.igpId)
  const [isFormReady, setIsFormReady] = useState(false)

  const form = useForm<UpdateIgpSupplyPayload>({
    resolver: zodResolver(updateIgpSupplySchema),
    defaultValues: {
      igpId: initialData.igpId,
      supplyDate: new Date(initialData.supplyDate),
      quantity: initialData.quantity,
      quantitySold: initialData.quantitySold,
      unitPrice: initialData.unitPrice,
      expenses: initialData.expenses,
      totalRevenue: initialData.totalRevenue,
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

  const igpSupplyFields: FieldConfig<UpdateIgpSupplyPayload>[] = [
    {
      name: "igpId",
      type: "select",
      label: "IGP",
      placeholder: "Select IGP",
      description: "Select the IGP this supply belongs to",
      options: igpOptions,
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

  const onSubmit = async (values: UpdateIgpSupplyPayload) => {
    const processedValues = {
      ...values,
      quantity: Number(values.quantity),
      quantitySold: Number(values.quantitySold || 0),
      unitPrice: Number(values.unitPrice),
      expenses: Number(values.expenses || 0),
      totalRevenue: Number(values.totalRevenue || 0),
      supplyDate: new Date(values.supplyDate).setHours(0, 0, 0, 0),
    }

    await toast.promise(updateIgpSupply.mutateAsync(processedValues), {
      loading: <span className="animate-pulse">Updating supply...</span>,
      success: "Successfully updated IGP supply",
      error: (error: unknown) => catchError(error),
    })

    if (updateIgpSupply.isSuccess) {
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
      mutation={updateIgpSupply}
      fields={igpSupplyFields}
      submitButtonTitle={
        updateIgpSupply.isPending ? "Updating..." : "Update Supply"
      }
      disabled={updateIgpSupply.isPending}
      twoColumnLayout
    />
  )
}
