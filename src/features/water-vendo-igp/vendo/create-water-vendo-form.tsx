"use client"

import { useFindManyWaterSupplies } from "@/backend/actions/water-supply/find-many"
import { useCreateWaterVendo } from "@/backend/actions/water-vendo/create-water-vendo"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  CreateWaterVendoData,
  createWaterVendoSchema,
} from "@/validation/water-vendo"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface CreateWaterVendoFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateWaterVendoForm = ({
  onSuccess,
  onError,
}: CreateWaterVendoFormProps) => {
  const createWaterVendo = useCreateWaterVendo()
  const { data: suppliesResponse, isLoading } = useFindManyWaterSupplies()

  const form = useForm<CreateWaterVendoData>({
    resolver: zodResolver(createWaterVendoSchema),
    defaultValues: {
      waterVendoLocation: "",
      gallonsUsed: 0,
      vendoStatus: "operational",
      waterRefillStatus: "full",
    },
  })

  const remainingGallons = suppliesResponse?.data?.[0]?.remainingGallons || 0

  const createWaterVendoFields: FieldConfig<CreateWaterVendoData>[] = [
    {
      name: "waterVendoLocation",
      type: "text",
      label: "Location",
      placeholder: "Enter the location",
      description: "Where the water vendo is located",
      required: true,
    },
    {
      name: "vendoStatus",
      type: "select",
      label: "Vendo Status",
      placeholder: "Select water vendo status",
      description: "Current operational status of the water vendo",
      options: [
        { label: "Operational", value: "operational" },
        { label: "Maintenance", value: "maintenance" },
        { label: "Out of Service", value: "out-of-service" },
        { label: "Offline", value: "offline" },
      ],
      required: true,
    },
    {
      name: "waterRefillStatus",
      type: "select",
      label: "Refill Status",
      placeholder: "Select refill status",
      description: "Current water level status",
      options: [
        { label: "Full", value: "full" },
        { label: "Medium", value: "medium" },
        { label: "Low", value: "low" },
        { label: "Empty", value: "empty" },
      ],
      required: true,
    },
    {
      name: "gallonsUsed",
      type: "number",
      label: "Gallons Used",
      placeholder: "Enter gallons used",
      description: "Number of gallons currently used",
      required: true,
      min: 0,
      max: remainingGallons,
    },
  ]

  const onSubmit = async (values: CreateWaterVendoData) => {
    await toast.promise(createWaterVendo.mutateAsync(values), {
      loading: <span className="animate-pulse">Creating water vendo...</span>,
      success: "Successfully created a water vendo",
      error: (error: unknown) => catchError(error),
    })
    form.reset()

    if (createWaterVendo.isSuccess) {
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
      fields={createWaterVendoFields}
      mutation={createWaterVendo}
      submitButtonTitle="Create Water Vendo"
    />
  )
}
