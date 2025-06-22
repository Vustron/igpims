"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useFindManyLockers } from "@/backend/actions/locker/find-many"
import { useUpdateViolation } from "@/backend/actions/violation/update-violation"
import { parseViolations } from "@/backend/helpers/violation-helpers"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  Violation as UpdateViolation,
  ViolationSchema,
} from "@/validation/violation"

interface EditViolationFormProps {
  violation: UpdateViolation
  onSuccess?: () => void
  onError?: () => void
}

export const EditViolationForm = ({
  violation,
  onSuccess,
  onError,
}: EditViolationFormProps) => {
  const updateViolation = useUpdateViolation(violation.id!)
  const {
    data: lockersData,
    isLoading: isLoadingLockers,
    isError,
  } = useFindManyLockers({
    limit: 100,
  })

  const [isFormReady, setIsFormReady] = useState(false)

  const form = useForm<UpdateViolation>({
    resolver: zodResolver(ViolationSchema),
    defaultValues: {
      id: violation.id,
      lockerId: violation.lockerId,
      studentName: violation.studentName,
      violations: parseViolations(violation.violations),
      dateOfInspection: violation.dateOfInspection,
      totalFine: violation.totalFine,
      fineStatus: violation.fineStatus,
    },
  })

  useEffect(() => {
    if (!isLoadingLockers && (lockersData?.data?.length! > 0 || isError)) {
      setIsFormReady(true)
    }
  }, [isLoadingLockers, lockersData, isError])

  const violationOptions = [
    { value: "damaged_locker", label: "Damaged Locker" },
    { value: "lost_key", label: "Lost Key" },
    { value: "unauthorized_use", label: "Unauthorized Use" },
    { value: "prohibited_items", label: "Prohibited Items" },
    { value: "other", label: "Other" },
  ]

  const lockerOptions =
    lockersData?.data.map((locker) => ({
      value: locker.id,
      label: `${locker.lockerName}`,
    })) || []

  const violationFields: FieldConfig<UpdateViolation>[] = [
    {
      name: "studentName",
      type: "text",
      label: "Student Name",
      placeholder: "Enter student name",
      description: "Full name of the student",
      required: true,
    },
    {
      name: "violations",
      type: "multiselect",
      label: "Violations",
      placeholder: "Select violations",
      description: "Select all applicable violations",
      required: true,
      options: violationOptions,
    },
    {
      name: "dateOfInspection",
      type: "date",
      label: "Date of Inspection",
      description: "When the violation was discovered",
      placeholder: "Select date",
      required: true,
    },
    {
      name: "lockerId",
      type: "select",
      label: "Locker",
      placeholder: isLoadingLockers ? "Loading lockers..." : "Select locker",
      description: "The locker involved in the violation",
      options: lockerOptions,
      required: true,
    },
    {
      name: "totalFine",
      type: "currency",
      label: "Total Fine (PHP)",
      placeholder: "Enter amount",
      description: "Total fine amount for the violation",
      required: true,
    },
    {
      name: "fineStatus",
      type: "select",
      label: "Payment Status",
      description: "Current status of the fine payment",
      options: [
        { label: "Paid", value: "paid" },
        { label: "Unpaid", value: "unpaid" },
        { label: "Partially Paid", value: "partial" },
        { label: "Waived", value: "waived" },
        { label: "Under Review", value: "under_review" },
      ],
      placeholder: "Select payment status",
      required: true,
    },
  ]

  const onSubmit = async (values: UpdateViolation) => {
    if (!values.lockerId) {
      toast.error("Please select a locker")
      return
    }

    if (!values.violations || values.violations.length === 0) {
      toast.error("Please select at least one violation")
      return
    }

    const submissionData = {
      ...values,
      dateOfInspection: new Date(values.dateOfInspection).setHours(0, 0, 0, 0),
      totalFine: Number(values.totalFine),
      violations: values.violations,
    }

    try {
      await toast.promise(updateViolation.mutateAsync(submissionData), {
        loading: <span className="animate-pulse">Updating violation...</span>,
        success: "Violation successfully updated",
        error: (error: unknown) => catchError(error),
      })

      if (updateViolation.isSuccess) {
        onSuccess?.()
      } else {
        onError?.()
      }
    } catch (error) {
      catchError(error)
    }
  }

  if (isLoadingLockers || !isFormReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || (!isLoadingLockers && lockerOptions.length === 0)) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        <h3 className="mb-2 font-semibold">Error Loading Form</h3>
        <p>There was a problem loading the locker data.</p>
      </div>
    )
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={violationFields}
      mutation={updateViolation}
      submitButtonTitle="Update Violation"
      twoColumnLayout
    />
  )
}
