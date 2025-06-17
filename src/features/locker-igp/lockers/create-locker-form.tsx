"use client"

import { DynamicForm } from "@/components/ui/forms"

import { zodResolver } from "@hookform/resolvers/zod"
import { catchError } from "@/utils/catch-error"
import { lockerSchema } from "@/schemas/locker"
import toast from "react-hot-toast"

import { useCreateLocker } from "@/backend/actions/locker/create-locker"
import { useForm } from "react-hook-form"

import type { FieldConfig } from "@/interfaces/form"
import type { Locker } from "@/schemas/locker"

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
      lockerLocation: "Academic Building 1st Floor (LEFT)",
      lockerRentalPrice: "100",
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
      label: "Locker Type",
      placeholder: "Select locker type",
      description: "The size or type of the locker",
      options: [
        { label: "Small", value: "small" },
        { label: "Large", value: "large" },
      ],
      required: true,
    },
    {
      name: "lockerLocation",
      type: "select",
      label: "Locker Location",
      placeholder: "Select location (e.g., Building A, Floor 2)",
      description: "Physical location of the locker",
      options: [
        {
          label: "Academic Building 1st Floor (LEFT)",
          value: "Academic Building 1st Floor (LEFT)",
        },
        {
          label: "Academic Building 1st Floor (Right)",
          value: "Academic Building 1st Floor (Right)",
        },
        {
          label: "Academic Building 2nd Floor (Left)",
          value: "Academic Building 2nd Floor (Left)",
        },
        {
          label: "Academic Building 2nd Floor (Right)",
          value: "Academic Building 2nd Floor (Right)",
        },
      ],
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
      type: "select",
      label: "Rental Price",
      placeholder: "Select the rental price",
      description: "Monthly rental price for the locker",
      options: [
        { label: "100", value: "100" },
        { label: "150", value: "150" },
      ],
      required: true,
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
      mutation={createLocker}
      submitButtonTitle="Create Locker"
    />
  )
}
