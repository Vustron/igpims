"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { DynamicForm } from "@/components/ui/forms"
import { useDialog } from "@/hooks/use-dialog"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import { useProjectRequestStore } from "./project-request-store"

export const projectRequestSchema = z.object({
  projectLeadName: z.string().min(1, "Project lead name is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  projectTitle: z.string().min(1, "Project title is required"),
  purpose: z.string().min(1, "Purpose is required"),
  dateNeeded: z.any().optional(),
})

export type CreateProjectRequestForm = z.infer<typeof projectRequestSchema>

export const CreateProjectRequestForm = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: () => void
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addRequest } = useProjectRequestStore()
  const { onClose } = useDialog()

  const form = useForm<CreateProjectRequestForm>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      projectLeadName: "",
      position: "",
      department: "",
      projectTitle: "",
      purpose: "",
      dateNeeded: new Date(),
    },
  })

  const createProjectRequestFields: FieldConfig<CreateProjectRequestForm>[] = [
    {
      name: "projectLeadName",
      type: "text",
      label: "Project Lead Name",
      placeholder: "Enter project lead name",
      description: "Full name of the person leading the project",
      required: true,
    },
    {
      name: "position",
      type: "text",
      label: "Position",
      placeholder: "Enter position",
      description: "Job title or position of the project lead",
      required: true,
    },
    {
      name: "department",
      type: "text",
      label: "Department",
      placeholder: "Enter department",
      description: "Department or unit submitting the project",
      required: true,
    },
    {
      name: "projectTitle",
      type: "text",
      label: "Project Title",
      placeholder: "Enter project title",
      description: "Title of the IGP project proposal",
      required: true,
    },
    {
      name: "purpose",
      type: "textarea",
      label: "Project Purpose",
      placeholder: "Enter purpose",
      description: "Detailed explanation of the project goals and objectives",
      required: true,
    },
    {
      name: "dateNeeded",
      type: "date",
      label: "Date Needed By",
      placeholder: "Select date needed by",
      required: true,
    },
  ]

  const onSubmit = async (data: CreateProjectRequestForm) => {
    try {
      setIsSubmitting(true)

      const requestId = addRequest({
        projectLead: data.projectLeadName,
        position: data.position,
        department: data.department,
        projectTitle: data.projectTitle,
        purpose: data.purpose,
        dateNeeded: data.dateNeeded,
        requestDate: new Date(),
      })

      toast.success(`Project request ${requestId} created successfully!`)

      form.reset({
        projectLeadName: "",
        position: "",
        department: "",
        projectTitle: "",
        purpose: "",
        dateNeeded: new Date(),
      })

      onClose()
      onSuccess?.()
    } catch (error) {
      const errorMessage = catchError(error)
      toast.error(errorMessage || "Failed to create project request")
      onError?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={createProjectRequestFields}
      submitButtonTitle={
        isSubmitting ? "Creating..." : "Submit Project Request"
      }
      disabled={isSubmitting}
      twoColumnLayout
    />
  )
}
