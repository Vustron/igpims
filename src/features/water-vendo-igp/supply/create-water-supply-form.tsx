"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useCreateWaterSupply } from "@/backend/actions/water-supply/create-water-supply"
import { useFindManyWaterVendos } from "@/backend/actions/water-vendo/find-many"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  CreateWaterSupplyData,
  createWaterSupplySchema,
} from "@/validation/water-supply"

interface CreateWaterSupplyFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateWaterSupplyForm = ({
  onSuccess,
  onError,
}: CreateWaterSupplyFormProps) => {
  const createWaterSupply = useCreateWaterSupply()

  const { data: vendosResponse, isLoading: isLoadingVendos } =
    useFindManyWaterVendos({
      limit: 100,
    })

  const form = useForm<CreateWaterSupplyData>({
    resolver: zodResolver(createWaterSupplySchema),
    defaultValues: {
      waterVendoId: "",
      supplyDate: Date.now(),
      suppliedGallons: 0,
      expenses: 0,
    },
  })

  const createWaterSupplyFields: FieldConfig<CreateWaterSupplyData>[] = [
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

  const onSubmit = async (values: CreateWaterSupplyData) => {
    const submissionData = {
      ...values,
      suppliedGallons: Number(values.suppliedGallons),
      expenses: Number(values.expenses),
    }

    await toast.promise(createWaterSupply.mutateAsync(submissionData), {
      loading: <span className="animate-pulse">Creating water supply...</span>,
      success: "Successfully created a water supply record",
      error: (error: unknown) => catchError(error),
    })
    form.reset()

    if (createWaterSupply.isSuccess) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  if (isLoadingVendos) {
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
      fields={createWaterSupplyFields}
      mutation={createWaterSupply}
      submitButtonTitle="Create Water Supply"
      disabled={isLoadingVendos}
    />
  )
}
