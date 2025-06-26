"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useFindManyInspections } from "@/backend/actions/inspection/find-many"
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

// TODO: fix date of inspection mess

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

  const {
    data: inspectionsData,
    isLoading: isLoadingInspections,
    isError: isInspectionsError,
  } = useFindManyInspections({
    limit: 100,
  })

  const [isFormReady, setIsFormReady] = useState(false)

  const form = useForm<UpdateViolation>({
    resolver: zodResolver(ViolationSchema),
    defaultValues: {
      id: violation.id,
      lockerId: violation.lockerId,
      inspectionId: violation.inspectionId,
      studentName: violation.studentName,
      violations: parseViolations(violation.violations),
      dateOfInspection: violation.dateOfInspection,
      datePaid: violation.datePaid,
      totalFine: violation.totalFine,
      fineStatus: violation.fineStatus,
    },
  })

  useEffect(() => {
    if (
      !isLoadingLockers &&
      !isLoadingInspections &&
      (lockersData?.data?.length! > 0 || isError) &&
      (inspectionsData?.data?.length! > 0 || isInspectionsError)
    ) {
      setIsFormReady(true)
    }
  }, [
    isLoadingLockers,
    isLoadingInspections,
    lockersData,
    inspectionsData,
    isError,
    isInspectionsError,
  ])

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

  const inspectionOptions =
    inspectionsData?.data.map((inspection) => ({
      value: inspection.id,
      label: new Date(
        new Date(inspection.dateOfInspection).getTime() > 1e15
          ? new Date(inspection.dateOfInspection).getTime() / 1000
          : inspection.dateOfInspection,
      ).toLocaleDateString(),
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
      name: "inspectionId",
      type: "select",
      label: "Inspection Date",
      placeholder: isLoadingInspections
        ? "Loading inspections..."
        : "Select inspection",
      description: "Select the inspection date",
      options: inspectionOptions,
      required: true,
    },
    {
      name: "datePaid",
      type: "date",
      label: "Paid Date",
      description: "Date when the fine was paid",
      placeholder: "Select date",
      required: false,
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

    if (!values.inspectionId) {
      toast.error("Please select an inspection")
      return
    }

    if (!values.violations || values.violations.length === 0) {
      toast.error("Please select at least one violation")
      return
    }

    const submissionData = {
      ...values,
      dateOfInspection:
        inspectionsData?.data.find(
          (inspection) => inspection.id === values.inspectionId,
        )?.dateOfInspection || values.dateOfInspection,
      datePaid: values.datePaid
        ? new Date(values.datePaid).setHours(0, 0, 0, 0)
        : null,
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

  if (isLoadingLockers || isLoadingInspections || !isFormReady) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  if (
    isError ||
    isInspectionsError ||
    (!isLoadingLockers && lockerOptions.length === 0) ||
    (!isLoadingInspections && inspectionOptions.length === 0)
  ) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
        <h3 className="mb-2 font-semibold">Error Loading Form</h3>
        <p>There was a problem loading the locker or inspection data.</p>
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
