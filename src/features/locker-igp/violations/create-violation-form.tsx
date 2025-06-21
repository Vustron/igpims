"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
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

export const ViolationForm = ({
  violation,
  onSuccess,
  onError,
}: ViolationFormProps) => {
  const createViolation = useCreateViolation()
  const [selectedLocker, setSelectedLocker] = useState(
    violation?.lockerId || "",
  )
  const [selectedViolations, setSelectedViolations] = useState<string[]>(
    violation?.violations || [],
  )

  const { data: lockersData, isLoading: isLoadingLockers } = useFindManyLockers(
    {
      limit: 10,
    },
  )

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
      label: `${locker.lockerName} (${locker.lockerLocation})`,
    })) || []

  const form = useForm<Omit<Violation, "id">>({
    resolver: zodResolver(ViolationSchema.omit({ id: true })),
    defaultValues: {
      lockerId: "",
      studentName: "",
      violations: [],
      dateOfInspection: Date.now(),
      totalFine: 0,
      fineStatus: "unpaid",
    },
  })

  useEffect(() => {
    form.setValue("lockerId", selectedLocker)

    const safeViolations = selectedViolations.filter(
      (v) => typeof v === "string",
    ) as string[]
    form.setValue(
      "violations",
      safeViolations.length > 0 ? safeViolations : [""],
    )
  }, [selectedLocker, selectedViolations, form])

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

  const onSubmit = async (values: Omit<Violation, "id">) => {
    if (!values.lockerId) {
      toast.error("Please select a locker")
      return
    }
    if (values.violations.length === 0) {
      toast.error("Please select at least one violation")
      return
    }

    const submissionData = {
      ...values,
      dateOfInspection: new Date(values.dateOfInspection).setHours(0, 0, 0, 0),
      totalFine: Number(values.totalFine),
      violations: values.violations.filter((v: string) => v.trim() !== ""),
    }

    await toast.promise(createViolation.mutateAsync(submissionData), {
      loading: <span className="animate-pulse">Recording violation...</span>,
      success: "Violation successfully recorded",
      error: (error: unknown) => catchError(error),
    })

    form.reset()
    setSelectedLocker("")
    setSelectedViolations([])

    if (createViolation.isSuccess) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  if (isLoadingLockers) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
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
