"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useUpdateWaterVendo } from "@/backend/actions/water-vendo/update-water-vendo"
import { WaterVendo } from "@/backend/db/schemas"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  UpdateWaterVendoData,
  updateWaterVendoSchema,
} from "@/validation/water-vendo"

interface EditWaterVendoFormProps {
  initialData: WaterVendo
  onSuccess?: () => void
  onError?: () => void
}

export const EditWaterVendoForm = ({
  initialData,
  onSuccess,
  onError,
}: EditWaterVendoFormProps) => {
  const updateWaterVendo = useUpdateWaterVendo(initialData.id)

  const form = useForm<UpdateWaterVendoData>({
    resolver: zodResolver(updateWaterVendoSchema),
    defaultValues: {
      waterVendoLocation: initialData.waterVendoLocation,
      gallonsUsed: initialData.gallonsUsed,
      vendoStatus: initialData.vendoStatus,
      waterRefillStatus: initialData.waterRefillStatus,
    },
  })

  const editWaterVendoFields: FieldConfig<UpdateWaterVendoData>[] = [
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
    },
  ]

  const onSubmit = async (values: UpdateWaterVendoData) => {
    const submissionData = {
      ...values,
      gallonsUsed: Number.parseInt(String(values?.gallonsUsed!), 10),
    }

    await toast.promise(updateWaterVendo.mutateAsync(submissionData), {
      loading: <span className="animate-pulse">Updating water vendo...</span>,
      success: "Successfully updated water vendo",
      error: (error: unknown) => catchError(error),
    })

    if (updateWaterVendo.isSuccess) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={editWaterVendoFields}
      mutation={updateWaterVendo}
      submitButtonTitle="Update Water Vendo"
    />
  )
}
