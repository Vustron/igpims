"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { DynamicForm } from "@/components/ui/forms"
import { useCreateInspection } from "@/backend/actions/inspection/create-inspection"
import { useFindManyViolations } from "@/backend/actions/violation/find-many"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import { Inspection, InspectionSchema } from "@/validation/inspection"

interface InspectionFormProps {
  inspection?: Partial<Inspection>
  onSuccess?: () => void
  onError?: () => void
}

export const CreateInspectionForm = ({
  onSuccess,
  onError,
}: InspectionFormProps) => {
  const createInspection = useCreateInspection()
  const [isFormReady, setIsFormReady] = useState(false)
  const [selectedViolators, setSelectedViolators] = useState<
    { id: string; name: string }[]
  >([])

  const { data: violationsData, isLoading: isLoadingViolations } =
    useFindManyViolations({
      limit: 100,
    })

  const violatorOptions = useMemo(() => {
    if (!violationsData?.data) return []

    const uniqueViolatorsMap = new Map()

    violationsData.data.forEach((violation) => {
      if (violation.id && violation.studentName) {
        uniqueViolatorsMap.set(violation.id, {
          value: violation.id,
          label: violation.studentName,
          data: { id: violation.id, name: violation.studentName },
        })
      }
    })

    return Array.from(uniqueViolatorsMap.values())
  }, [violationsData])

  const form = useForm<Omit<Inspection, "id">>({
    resolver: zodResolver(InspectionSchema.omit({ id: true })),
    defaultValues: {
      dateOfInspection: new Date(),
      dateSet: new Date(),
      violators: [],
      totalFines: 0,
    },
  })

  useEffect(() => {
    form.setValue("violators", selectedViolators)
  }, [selectedViolators, form])

  useEffect(() => {
    if (selectedViolators.length > 0 && violationsData?.data) {
      const selectedViolatorIds = new Set(selectedViolators.map((v) => v.id))

      const totalFines = violationsData.data.reduce((sum, violation) => {
        if (selectedViolatorIds.has(violation.id!) && violation.totalFine) {
          return sum + Number(violation.totalFine)
        }
        return sum
      }, 0)

      form.setValue("totalFines", totalFines)
    } else {
      form.setValue("totalFines", 0)
    }
  }, [selectedViolators, violationsData, form])

  useEffect(() => {
    if (!isLoadingViolations && violatorOptions.length > 0) {
      setIsFormReady(true)
    }
  }, [isLoadingViolations, violatorOptions])

  const inspectionFields: FieldConfig<Omit<Inspection, "id">>[] = [
    {
      name: "dateOfInspection",
      type: "date",
      label: "Date of Inspection",
      description: "Date when the inspection was conducted",
      placeholder: "Select date",
      required: true,
    },
    {
      name: "dateSet",
      type: "date",
      label: "Date Set",
      description: "Date when the inspection was scheduled",
      placeholder: "Select date",
      required: true,
    },
    {
      name: "violators",
      type: "multiselect",
      label: "Violators",
      description: "Select students who violated rules",
      placeholder: "Add violators",
      required: false,
      options: violatorOptions,
    },
    {
      name: "totalFines",
      type: "currency",
      label: "Total Fines (PHP)",
      placeholder: "Enter amount",
      description: "Total fine amount for all violations",
      required: true,
    },
  ]

  const onSubmit = async (values: Omit<Inspection, "id">) => {
    if (!values.violators || values.violators.length === 0) {
      toast.error("Please select at least one violator")
      return
    }

    const dateOfInspection =
      values.dateOfInspection instanceof Date
        ? values.dateOfInspection.getTime()
        : values.dateOfInspection

    const dateSet =
      values.dateSet instanceof Date ? values.dateSet.getTime() : values.dateSet

    const submissionData = {
      ...values,
      dateOfInspection,
      dateSet,
      violators: Array.isArray(values.violators)
        ? values.violators.map((v) => {
            if (typeof v === "string") {
              const option = violatorOptions.find((opt) => opt.value === v)
              return {
                id: v,
                studentName: option?.label || "",
              }
            }
            return {
              id: v.id,
              studentName: v.name,
            }
          })
        : values.violators,
      totalFines: Number(values.totalFines),
    }

    console.log(submissionData)

    await toast.promise(createInspection.mutateAsync(submissionData), {
      loading: <span className="animate-pulse">Creating inspection...</span>,
      success: "Inspection created successfully",
      error: (error) => `Failed to create inspection: ${catchError(error)}`,
    })

    form.reset()
    setSelectedViolators([])

    if (createInspection.isSuccess) {
      onSuccess?.()
    } else {
      onError?.()
    }
  }

  if (!isFormReady) {
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
      fields={inspectionFields}
      mutation={createInspection}
      submitButtonTitle="Create Inspection"
      twoColumnLayout
    />
  )
}
