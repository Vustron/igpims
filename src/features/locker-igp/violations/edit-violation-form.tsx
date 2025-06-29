"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useFindManyInspections } from "@/backend/actions/inspection/find-many"
import { useFindManyLockers } from "@/backend/actions/locker/find-many"
import { useUpdateViolation } from "@/backend/actions/violation/update-violation"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  Violation as UpdateViolation,
  ViolationSchema,
} from "@/validation/violation"
import { VIOLATION_FINES } from "./create-violation-form"

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

  const {
    data: inspectionsData,
    isLoading: isLoadingInspections,
    isError: isInspectionsError,
  } = useFindManyInspections({
    limit: 100,
  })

  const [isFormReady, setIsFormReady] = useState(false)

  const calculateTotalFine = (violations: string[]): number => {
    return violations.reduce(
      (sum, violation) => sum + (VIOLATION_FINES[violation] || 0),
      0,
    )
  }

  const parseViolations = (violations: string | string[]): string[] => {
    if (!violations) return []

    if (
      Array.isArray(violations) &&
      violations.length === 1 &&
      typeof violations[0] === "string"
    ) {
      try {
        const parsed = JSON.parse(violations[0])
        return Array.isArray(parsed) ? parsed : [parsed]
      } catch {
        return violations[0]
          .split(",")
          .map((v) => v.trim().replace(/^"(.*)"$/, "$1"))
          .filter((v) => v)
      }
    }

    if (Array.isArray(violations)) return violations
    if (typeof violations === "string") {
      try {
        const parsed = JSON.parse(violations)
        return Array.isArray(parsed) ? parsed : [parsed]
      } catch {
        return violations
          .split(",")
          .map((v) => v.trim().replace(/^"(.*)"$/, "$1"))
          .filter((v) => v)
      }
    }

    return []
  }

  const initialViolations = parseViolations(violation.violations)
  const initialTotalFine = calculateTotalFine(initialViolations)

  const form = useForm<UpdateViolation>({
    resolver: zodResolver(ViolationSchema),
    defaultValues: {
      id: violation.id,
      lockerId: violation.lockerId,
      inspectionId: violation.inspectionId,
      studentName: violation.studentName,
      violations: initialViolations,
      dateOfInspection: violation.dateOfInspection,
      datePaid: violation.datePaid,
      totalFine: initialTotalFine,
      fineStatus: violation.fineStatus,
    },
  })

  useEffect(() => {
    if (violation && isFormReady) {
      const parsedViolations = parseViolations(violation.violations)
      form.reset({
        ...violation,
        violations: parsedViolations,
        totalFine: calculateTotalFine(parsedViolations),
      })
    }
  }, [violation, form, isFormReady])

  const currentViolations = useWatch({
    control: form.control,
    name: "violations",
  })

  useEffect(() => {
    if (currentViolations) {
      const totalFine = calculateTotalFine(currentViolations)
      form.setValue("totalFine", totalFine, { shouldValidate: true })
    }
  }, [currentViolations, form])

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (
        name === "inspectionId" &&
        value.inspectionId &&
        inspectionsData?.data
      ) {
        const selectedInspection = inspectionsData.data.find(
          (inspection) => inspection.id === value.inspectionId,
        )
        if (selectedInspection) {
          form.setValue("dateOfInspection", selectedInspection.dateOfInspection)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, inspectionsData])

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
    { value: "scratches", label: "Scratches" },
    { value: "dents", label: "Dents" },
    {
      value: "prohibited_single_use_plastics",
      label: "Prohibited Single Use Plastics",
    },
    { value: "lost_locker_key", label: "Lost Locker Key" },
    { value: "spoiled_food", label: "Spoiled Food" },
    { value: "graffiti", label: "Graffiti" },
    { value: "broken_locks", label: "Broken Locks" },
    { value: "broken_hinges", label: "Broken Hinges" },
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

  useEffect(() => {
    console.log("Original violations:", violation.violations)
    console.log("Parsed violations:", initialViolations)
    console.log("Form violations value:", form.watch("violations"))
  }, [violation.violations, initialViolations, form])

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
      defaultValues: initialViolations,
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
      description: "",
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
      totalFine: calculateTotalFine(values.violations),
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
