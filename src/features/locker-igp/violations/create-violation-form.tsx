"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useFindManyInspections } from "@/backend/actions/inspection/find-many"
import { useFindManyLockers } from "@/backend/actions/locker/find-many"
import { useCreateViolation } from "@/backend/actions/violation/create-violation"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import { Violation, ViolationSchema } from "@/validation/violation"

interface ViolationFormProps {
  violation?: Violation
  onSuccess?: () => void
  onError?: () => void
}

export const VIOLATION_FINES: Record<string, number> = {
  scratches: 5,
  dents: 50,
  prohibited_single_use_plastics: 70,
  lost_locker_key: 150,
  spoiled_food: 100,
  graffiti: 200,
  broken_locks: 300,
  broken_hinges: 300,
}

export const ViolationForm = ({
  violation,
  onSuccess,
  onError,
}: ViolationFormProps) => {
  const createViolation = useCreateViolation()
  const [isFormReady, setIsFormReady] = useState(false)

  const calculateTotalFine = (violations: string[]): number => {
    return violations.reduce(
      (sum, violation) => sum + (VIOLATION_FINES[violation] || 0),
      0,
    )
  }

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

  const form = useForm<Omit<Violation, "id">>({
    resolver: zodResolver(ViolationSchema.omit({ id: true })),
    defaultValues: {
      lockerId: violation?.lockerId || "",
      inspectionId: violation?.inspectionId || "",
      studentName: violation?.studentName || "",
      violations: violation?.violations || [],
      dateOfInspection: violation?.dateOfInspection || Date.now(),
      datePaid: violation?.datePaid || null,
      totalFine: calculateTotalFine(violation?.violations || []),
      fineStatus: violation?.fineStatus || "unpaid",
    },
  })

  const currentViolations = useWatch({
    control: form.control,
    name: "violations",
    defaultValue: form.getValues("violations"),
  })

  useEffect(() => {
    const totalFine = calculateTotalFine(currentViolations || [])
    form.setValue("totalFine", totalFine, { shouldValidate: true })
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

  const violationFields: FieldConfig<Omit<Violation, "id">>[] = [
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
      description: "",
      placeholder: "Select date",
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

  const onSubmit = async (values: Omit<Violation, "id">) => {
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
      dateOfInspection: new Date(values.dateOfInspection).setHours(0, 0, 0, 0),
      datePaid: values.datePaid
        ? new Date(values.datePaid).setHours(0, 0, 0, 0)
        : null,
      totalFine: calculateTotalFine(values.violations),
    }

    await toast.promise(createViolation.mutateAsync(submissionData), {
      loading: <span className="animate-pulse">Recording violation...</span>,
      success: "Violation successfully recorded",
      error: (error: unknown) => catchError(error),
    })

    if (createViolation.isSuccess) {
      form.reset()
      onSuccess?.()
    } else {
      onError?.()
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
      mutation={createViolation}
      submitButtonTitle="Record Violation"
      twoColumnLayout
    />
  )
}
