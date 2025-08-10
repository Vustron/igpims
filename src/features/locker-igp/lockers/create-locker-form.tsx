"use client"

import { useCreateLocker } from "@/backend/actions/locker/create-locker"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  CreateLockerForm as CreateLockerFormType,
  createLockerFormSchema,
} from "@/validation/locker"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface CreateLockerFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateLockerForm = ({
  onSuccess,
  onError,
}: CreateLockerFormProps) => {
  const createLocker = useCreateLocker()

  const form = useForm<CreateLockerFormType>({
    resolver: zodResolver(createLockerFormSchema),
    defaultValues: {
      lockerStatus: "available",
      lockerType: "small",
      lockerLocation: "Academic Building 1st Floor (LEFT)",
      lockerRentalPrice: "100",
      clusterName: "",
      lockersPerCluster: 1,
    },
  })

  const createLockerFields: FieldConfig<CreateLockerFormType>[] = [
    {
      name: "clusterName",
      type: "text",
      label: "Cluster Name",
      placeholder: "Enter cluster name (e.g., AB, CD, EF)",
      description:
        "Base name for the cluster - lockers will be named as ClusterName-1, ClusterName-2, etc.",
      required: true,
    },
    {
      name: "lockersPerCluster",
      type: "number",
      label: "Number of Lockers",
      placeholder: "Enter number of lockers to create",
      description: "How many lockers to create in this cluster",
      required: true,
      min: 1,
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

  const onSubmit = async (values: CreateLockerFormType) => {
    const successMessage =
      values.lockersPerCluster === 1
        ? "Successfully created locker"
        : `Successfully created ${values.lockersPerCluster} lockers in cluster ${values.clusterName}`

    const createLockersPayload = {
      ...values,
      lockersPerCluster: Number(values.lockersPerCluster),
    }

    await toast.promise(createLocker.mutateAsync(createLockersPayload), {
      loading: (
        <span className="animate-pulse">
          Creating{" "}
          {values.lockersPerCluster === 1
            ? "locker"
            : `${values.lockersPerCluster} lockers`}
          ...
        </span>
      ),
      success: successMessage,
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
      submitButtonTitle="Create Cluster"
    />
  )
}
