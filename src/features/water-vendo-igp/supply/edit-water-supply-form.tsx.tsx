"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useUpdateWaterSupply } from "@/backend/actions/water-supply/update-water-supply"
import { useFindManyWaterVendos } from "@/backend/actions/water-vendo/find-many"
import { WaterSupply } from "@/backend/db/schemas"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  UpdateWaterSupplyData,
  updateWaterSupplySchema,
} from "@/validation/water-supply"

interface EditWaterSupplyFormProps {
  initialData: WaterSupply & { vendoLocation: string }
  onSuccess?: () => void
  onError?: () => void
}

export const EditWaterSupplyForm = ({
  initialData,
  onSuccess,
  onError,
}: EditWaterSupplyFormProps) => {
  const updateWaterSupply = useUpdateWaterSupply(initialData.id)
  const { data: vendosResponse, isLoading: isLoadingForm } =
    useFindManyWaterVendos({
      limit: 100,
    })

  const form = useForm<UpdateWaterSupplyData>({
    resolver: zodResolver(updateWaterSupplySchema),
    defaultValues: {
      waterVendoId: initialData.waterVendoId,
      supplyDate: initialData.supplyDate,
      suppliedGallons: initialData.suppliedGallons,
      expenses: initialData.expenses,
    },
  })

  const editWaterSupplyFields: FieldConfig<UpdateWaterSupplyData>[] = [
    {
      name: "waterVendoId",
      type: "select",
      label: "Water Vendo Location",
      placeholder: "Select water vendo location",
      required: true,
      options:
        vendosResponse?.data?.map((vendo) => ({
          value: vendo.id,
          label: vendo.waterVendoLocation,
        })) ?? [],
    },
    {
      name: "supplyDate",
      type: "date",
      label: "Supply Date",
      placeholder: "Select supply date",
      required: true,
    },
    {
      name: "suppliedGallons",
      type: "number",
      label: "Supplied Gallons",
      placeholder: "Enter supplied gallons",
      description: "Number of gallons supplied",
      required: true,
    },
    {
      name: "expenses",
      type: "currency",
      label: "Expenses",
      placeholder: "Enter expenses amount",
      description: "Total expenses for this supply",
      required: true,
    },
  ]

  const onSubmit = async (values: UpdateWaterSupplyData) => {
    const submissionData = {
      ...values,
      supplyDate: Number(values.supplyDate),
      suppliedGallons: Number(values.suppliedGallons),
      expenses: Number(values.expenses),
    }

    await toast.promise(updateWaterSupply.mutateAsync(submissionData), {
      loading: <span className="animate-pulse">Updating water supply...</span>,
      success: "Successfully updated water supply record",
      error: (error: unknown) => catchError(error),
    })

    if (updateWaterSupply.isSuccess) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  if (isLoadingForm) {
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
      fields={editWaterSupplyFields}
      mutation={updateWaterSupply}
      submitButtonTitle="Update Water Supply"
      disabled={isLoadingForm}
    />
  )
}
