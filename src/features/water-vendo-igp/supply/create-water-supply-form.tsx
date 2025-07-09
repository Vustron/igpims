"use client"

import { useCreateWaterSupply } from "@/backend/actions/water-supply/create-water-supply"
import { useFindManyWaterVendos } from "@/backend/actions/water-vendo/find-many"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  CreateWaterSupplyData,
  createWaterSupplySchema,
} from "@/validation/water-supply"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface CreateWaterSupplyFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateWaterSupplyForm = ({
  onSuccess,
  onError,
}: CreateWaterSupplyFormProps) => {
  const createWaterSupply = useCreateWaterSupply()

  const { data: vendosResponse, isLoading: isLoadingForm } =
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

  const suppliedGallons = form.watch("suppliedGallons")
  const expenses = suppliedGallons * 25
  form.setValue("expenses", expenses)

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
      description:
        "Total expenses for this supply (automatically calculated as 25 per gallon)",
      required: true,
    },
  ]

  const onSubmit = async (values: CreateWaterSupplyData) => {
    const submissionData = {
      ...values,
      supplyDate: new Date(values.supplyDate).setHours(0, 0, 0, 0),
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
      fields={createWaterSupplyFields}
      mutation={createWaterSupply}
      submitButtonTitle="Create Water Supply"
      disabled={isLoadingForm}
    />
  )
}
