"use client"

import { LockerInfoLoadingState } from "@/features/locker/locker-info-loading"
import { LockerInfoErrorState } from "@/features/locker/locker-info-error"
import { LockerInfoEmptyState } from "@/features/locker/locker-info-empty"
import { LockerConfigurationCard } from "@/features/locker/locker-config"
import { CurrentRentalCard } from "@/features/locker/current-rental-card"
import { RentalHistoryCard } from "@/features/locker/rental-history-card"
import { LockerInfoHeader } from "@/features/locker/locker-info-header"

import { lockerConfigSchema } from "@/schemas/locker"
import { zodResolver } from "@hookform/resolvers/zod"
import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"

import { useDeleteLockerById } from "@/backend/actions/locker/delete-by-id"
import { useUpdateLocker } from "@/backend/actions/locker/update-locker"
import { useFindLockerById } from "@/backend/actions/locker/find-by-id"

import { useConfirm } from "@/hooks/use-confirm"
import { useForm } from "react-hook-form"

import type { LockerConfig } from "@/schemas/locker"
import type { FieldConfig } from "@/interfaces/form"
import { formatDateFromTimestamp } from "@/utils/date-convert"

export const LockerClient = ({ id }: { id: string }) => {
  const { data: lockerData, error: lockerError } = useFindLockerById(id)
  const updateLocker = useUpdateLocker(id)
  const deleteLocker = useDeleteLockerById(id)
  const confirm = useConfirm()

  const locker = lockerData
  const rental = lockerData?.rental
  const rentalHistory = lockerData?.rentalHistory || []

  const form = useForm<LockerConfig>({
    resolver: zodResolver(lockerConfigSchema),
    defaultValues: {
      lockerLocation: locker?.lockerLocation || "",
      lockerStatus: locker?.lockerStatus || "available",
      lockerType:
        (locker?.lockerType as "small" | "medium" | "large" | "extra-large") ||
        "small",
      lockerName: locker?.lockerName || "",
      lockerRentalPrice: String(locker?.lockerRentalPrice) || "100",
      rentalId: locker?.rental?.id || "",
      lockerId: locker?.rental?.lockerId || "",
      renterId: locker?.rental?.renterId || "",
      renterName: locker?.rental?.renterName || "",
      courseAndSet: locker?.rental?.courseAndSet || "",
      renterEmail: locker?.rental?.renterEmail || "",
      rentalStatus: locker?.rental?.rentalStatus || "pending",
      paymentStatus: locker?.rental?.paymentStatus || "pending",
      dateRented:
        formatDateFromTimestamp(locker?.rental?.dateRented!) || Date.now(),
      dateDue: formatDateFromTimestamp(locker?.rental?.dateDue!) || Date.now(),
    },
  })

  const lockerConfigFields: FieldConfig<LockerConfig>[] = [
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
    ...(rental
      ? [
          {
            name: "rentalId" as keyof LockerConfig,
            label: "Rental ID",
            type: "text" as const,
            placeholder: "Rental identifier",
            description: "System-generated rental identifier",
          },
          {
            name: "renterId" as keyof LockerConfig,
            label: "Student ID",
            type: "text" as const,
            placeholder: "Enter student ID",
            required: true,
          },
          {
            name: "renterName" as keyof LockerConfig,
            label: "Student Name",
            type: "text" as const,
            placeholder: "Enter student's full name",
            required: true,
          },
          {
            name: "renterEmail" as keyof LockerConfig,
            label: "Student Email",
            type: "email" as const,
            placeholder: "Enter student's email address",
          },
          {
            name: "courseAndSet" as keyof LockerConfig,
            label: "Course & Set",
            type: "text" as const,
            placeholder: "Enter course and set (e.g., BSIT 3-A)",
            required: true,
          },
          {
            name: "rentalStatus" as keyof LockerConfig,
            label: "Rental Status",
            type: "select" as const,
            placeholder: "Select rental status",
            options: [
              { value: "pending", label: "Pending" },
              { value: "active", label: "Active" },
              { value: "expired", label: "Expired" },
              { value: "terminated", label: "Terminated" },
              { value: "suspended", label: "Suspended" },
            ],
          },
          {
            name: "paymentStatus" as keyof LockerConfig,
            label: "Payment Status",
            type: "select" as const,
            placeholder: "Select payment status",
            options: [
              { value: "pending", label: "Pending Payment" },
              { value: "partial", label: "Partially Paid" },
              { value: "paid", label: "Fully Paid" },
              { value: "overdue", label: "Overdue" },
              { value: "refunded", label: "Refunded" },
            ],
          },
          {
            name: "dateRented" as keyof LockerConfig,
            label: "Date Rented",
            type: "date" as const,
            placeholder: "Select rental start date",
            required: true,
          },
          {
            name: "dateDue" as keyof LockerConfig,
            label: "Due Date",
            type: "date" as const,
            placeholder: "Select rental end date",
            required: true,
          },
        ]
      : []),
  ]

  const handleSubmit = async (values: LockerConfig) => {
    const formData = {
      ...values,
      lockerRentalPrice: Number.parseInt(values.lockerRentalPrice, 10),
    }

    await toast.promise(updateLocker.mutateAsync(formData), {
      loading: (
        <span className="animate-pulse">Updating locker information...</span>
      ),
      success: "Locker information updated successfully",
      error: (error: unknown) => catchError(error),
    })
  }

  const handleDelete = async () => {
    const confirmed = confirm(
      "Delete Locker",
      "Are you sure you want to delete this locker? This action cannot be undone.",
    )

    if (await confirmed) {
      await toast.promise(deleteLocker.mutateAsync(), {
        loading: <span className="animate-pulse">Deleting locker...</span>,
        success: "Locker deleted successfully",
        error: (error: unknown) => catchError(error),
      })
    }
  }

  const isLoading = !lockerData && !lockerError

  if (isLoading) {
    return <LockerInfoLoadingState />
  }

  if (lockerError) {
    return <LockerInfoErrorState />
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 pb-8 sm:space-y-8 sm:px-6 lg:px-8">
      <LockerInfoHeader
        id={id}
        locker={locker}
        onDelete={handleDelete}
        isDeleting={deleteLocker.isPending}
      />

      <LockerConfigurationCard
        form={form}
        fields={lockerConfigFields}
        onSubmit={handleSubmit}
        mutation={updateLocker}
      />

      {rental && <CurrentRentalCard rental={rental} locker={locker} />}

      {rentalHistory.length > 0 && (
        <RentalHistoryCard rentalHistory={rentalHistory} locker={locker} />
      )}

      {!rental && rentalHistory.length === 0 && <LockerInfoEmptyState />}
    </div>
  )
}
