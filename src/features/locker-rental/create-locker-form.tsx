"use client"

import { DynamicForm } from "@/components/ui/forms"

import { zodResolver } from "@hookform/resolvers/zod"
import { catchError } from "@/utils/catch-error"
import { lockerSchema } from "@/schemas/locker"
import toast from "react-hot-toast"

import { useForm } from "react-hook-form"

import type { FieldConfig } from "@/interfaces/form"
import type { Locker } from "@/schemas/locker"

import { useCreateLocker } from "@/backend/actions/locker/create-locker"

interface CreateLockerFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateLockerForm = ({
  onSuccess,
  onError,
}: CreateLockerFormProps) => {
  const createLocker = useCreateLocker()

  const form = useForm<Locker>({
    resolver: zodResolver(lockerSchema),
    defaultValues: {
      lockerStatus: "available",
      lockerType: "small",
      lockerName: "",
      lockerLocation: "",
      lockerRentalPrice: 0,
    },
  })

  const createLockerFields: FieldConfig<Locker>[] = [
    {
      name: "lockerName",
      type: "text",
      label: "Locker Name/Number",
      placeholder: "Enter locker name or number",
      description: "A unique identifier for the locker",
      required: true,
    },
    {
      name: "lockerType",
      type: "select",
      label: "Locker Size/Type",
      placeholder: "Select locker type",
      description: "The size or type of the locker",
      options: [
        { label: "Small", value: "small" },
        { label: "Medium", value: "medium" },
        { label: "Large", value: "large" },
        { label: "Extra Large", value: "extra-large" },
      ],
      required: true,
    },
    {
      name: "lockerLocation",
      type: "text",
      label: "Locker Location",
      placeholder: "Enter location (e.g., Building A, Floor 2)",
      description: "Physical location of the locker",
      required: true,
    },
    {
      name: "lockerStatus",
      type: "select",
      label: "Locker Status",
      placeholder: "Select locker status",
      description: "Current status of the locker",
      options: [
        { label: "Available", value: "available" },
        { label: "Occupied", value: "occupied" },
        { label: "Reserved", value: "reserved" },
        { label: "Maintenance", value: "maintenance" },
        { label: "Out of Service", value: "out-of-service" },
      ],
      required: true,
    },
    {
      name: "lockerRentalPrice",
      type: "currency",
      label: "Rental Price",
      placeholder: "Enter price in PHP",
      description: "Monthly rental price for the locker",
    },
  ]

  const onSubmit = async (values: Locker) => {
    await toast.promise(createLocker.mutateAsync(values), {
      loading: <span className="animate-pulse">Creating locker...</span>,
      success: "Successfully created a locker",
      error: (error: unknown) => catchError(error),
    })
    form.reset()

    if (createLocker.isSuccess) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={createLockerFields}
      submitButtonTitle="Create Locker"
    />
  )
}
