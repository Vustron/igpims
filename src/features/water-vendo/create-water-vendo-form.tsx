"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"

const waterVendoSchema = z.object({
  id: z.string().optional(),
  watervendoLocation: z
    .string()
    .min(3, {
      message: "Location must be at least 3 characters.",
    })
    .optional(),
  installationDate: z
    .date({
      required_error: "Installation date is required.",
      invalid_type_error: "Installation date must be a valid date.",
    })
    .optional(),
  waterVendoStatus: z
    .enum(["online", "offline", "maintenance"], {
      required_error: "Status is required.",
      invalid_type_error: "Please select a valid status.",
    })
    .optional(),
  refillStatus: z
    .enum(["full", "low", "critical", "empty"], {
      required_error: "Refill status is required.",
      invalid_type_error: "Please select a valid refill status.",
    })
    .optional(),
  gallonsUsed: z
    .number({
      required_error: "Gallons used is required.",
      invalid_type_error: "Gallons used must be a number.",
    })
    .min(0, {
      message: "Gallons used cannot be negative.",
    })
    .default(0)
    .optional(),
})

type WaterVendoFormData = z.infer<typeof waterVendoSchema>

interface CreateWaterVendoFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateWaterVendoForm = ({
  onSuccess,
  onError,
}: CreateWaterVendoFormProps) => {
  const [, setIsSubmitting] = useState(false)

  const form = useForm<WaterVendoFormData>({
    resolver: zodResolver(waterVendoSchema),
    defaultValues: {
      watervendoLocation: "",
      installationDate: new Date(),
      waterVendoStatus: "online",
      refillStatus: "full",
      gallonsUsed: 0,
    },
  })

  const createWaterVendoFields: FieldConfig<WaterVendoFormData>[] = [
    {
      name: "watervendoLocation",
      type: "text",
      label: "Location",
      placeholder: "Enter the location",
      description: "Where the water vendo is located",
      required: true,
    },
    {
      name: "installationDate",
      type: "date",
      label: "Installation Date",
      placeholder: "Select installation date",
      description: "When the water vendo was installed",
      required: true,
    },
    {
      name: "waterVendoStatus",
      type: "select",
      label: "Vendo Status",
      placeholder: "Select water vendo status",
      description: "Current operational status of the water vendo",
      options: [
        { label: "Online", value: "online" },
        { label: "Offline", value: "offline" },
        { label: "Maintenance", value: "maintenance" },
      ],
      required: true,
    },
    {
      name: "refillStatus",
      type: "select",
      label: "Refill Status",
      placeholder: "Select refill status",
      description: "Current water level status",
      options: [
        { label: "Full", value: "full" },
        { label: "Low", value: "low" },
        { label: "Critical", value: "critical" },
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

  const onSubmit = async (data: WaterVendoFormData) => {
    try {
      setIsSubmitting(true)

      console.log("Submitting water vendo data:", data)

      const newId = `WV-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 1000,
      )
        .toString()
        .padStart(3, "0")}`

      const waterVendoData = {
        ...data,
        id: newId,
      }

      console.log("Created water vendo:", waterVendoData)

      toast.success("Water vendo created successfully!")

      form.reset({
        watervendoLocation: "",
        installationDate: new Date(),
        waterVendoStatus: "online",
        refillStatus: "full",
        gallonsUsed: 0,
      })

      if (onSuccess) onSuccess()
    } catch (error) {
      const errorMessage = catchError(error)
      toast.error(errorMessage || "Failed to create water vendo")
      if (onError) onError()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={createWaterVendoFields}
      submitButtonTitle="Create Water Vendo"
    />
  )
}
