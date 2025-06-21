"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useFindManyLockers } from "@/backend/actions/locker/find-many"
import { useCreateRent } from "@/backend/actions/locker-rental/create-rent"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import { CreateRentalData, createRentalSchema } from "@/validation/rental"

interface CreateLockerRentFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateLockerRentForm = ({
  onSuccess,
  onError,
}: CreateLockerRentFormProps) => {
  const createRent = useCreateRent()

  const { data: lockersResponse } = useFindManyLockers({
    status: "available",
    limit: 100,
  })

  const form = useForm<CreateRentalData>({
    resolver: zodResolver(createRentalSchema),
    defaultValues: {
      lockerId: "",
      renterId: "",
      renterName: "",
      courseAndSet: "",
      renterEmail: "",
      rentalStatus: "active",
      paymentStatus: "pending",
      dateRented: Date.now(),
      dateDue: Date.now(),
    },
  })

  const createRentFields: FieldConfig<CreateRentalData>[] = [
    {
      name: "lockerId",
      type: "select",
      label: "Select Locker",
      placeholder: "Choose an available locker",
      options:
        lockersResponse?.data.map((locker) => ({
          label: `${locker.lockerName} - ${locker.lockerLocation} (₱${locker.lockerRentalPrice})`,
          value: locker.id,
        })) || [],
      required: true,
    },
    {
      name: "renterId",
      type: "text",
      label: "Student ID",
      placeholder: "Enter student ID number",
      required: true,
    },
    {
      name: "renterName",
      type: "text",
      label: "Student Name",
      placeholder: "Enter full name of student",
      required: true,
    },
    {
      name: "courseAndSet",
      type: "text",
      label: "Course and Section",
      placeholder: "e.g., BSCS 3A, BSN 2B",
      description: "Student's course and section",
      required: true,
    },
    {
      name: "renterEmail",
      type: "email",
      label: "Student Email",
      placeholder: "Enter student email address",
      required: true,
    },
    {
      name: "rentalStatus",
      type: "select",
      label: "Rental Status",
      placeholder: "Select rental status",
      options: [
        { label: "Active", value: "active" },
        { label: "Pending", value: "pending" },
        { label: "Expired", value: "expired" },
        { label: "Cancelled", value: "cancelled" },
      ],
      required: true,
    },
    {
      name: "paymentStatus",
      type: "select",
      label: "Payment Status",
      placeholder: "Select payment status",
      options: [
        { label: "Paid", value: "paid" },
        { label: "Pending", value: "pending" },
        { label: "Partial", value: "partial" },
        { label: "Overdue", value: "overdue" },
      ],
      required: true,
    },
    {
      name: "dateRented",
      type: "date",
      label: "Rental Start Date",
      placeholder: "Select start date",
      required: true,
    },
    {
      name: "dateDue",
      type: "date",
      label: "Rental Due Date",
      placeholder: "Select due date",
      required: true,
    },
  ]

  const onSubmit = async (values: CreateRentalData) => {
    const processedValues = {
      ...values,
      dateRented: new Date(values.dateRented).setHours(0, 0, 0, 0),
      dateDue: new Date(values.dateDue).setHours(0, 0, 0, 0),
    }
    await toast.promise(createRent.mutateAsync(processedValues), {
      loading: <span className="animate-pulse">Creating rental...</span>,
      success: "Successfully created locker rental",
      error: (error: unknown) => catchError(error),
    })

    form.reset()

    if (createRent.isSuccess) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={createRentFields}
      mutation={createRent}
      submitButtonTitle="Create Rental"
      twoColumnLayout={true}
    />
  )
}
