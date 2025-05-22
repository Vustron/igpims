"use client"

import { DynamicForm } from "@/components/ui/forms"

import { zodResolver } from "@hookform/resolvers/zod"
import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"
import { z } from "zod"

import { useForm } from "react-hook-form"
import { useState } from "react"

import type { FieldConfig } from "@/interfaces/form"

export const projectRequestSchema = z.object({
  projectLeadName: z.string().min(1, "Project lead name is required"),
  position: z.string().min(1, "Position is required"),
  projectTitle: z.string().min(1, "Project title is required"),
  projectDocument: z.any().optional(),
  currentStep: z.number().default(1),
  requestStatus: z.enum(["pending", "approved", "rejected"]).default("pending"),
})

export type ProjectRequest = z.infer<typeof projectRequestSchema>

interface CreateProjectRequestFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateProjectRequestForm = ({
  onSuccess,
  onError,
}: CreateProjectRequestFormProps) => {
  const [, setIsSubmitting] = useState(false)
  const [projectDocument, setProjectDocument] = useState<File | null>(null)

  const form = useForm<ProjectRequest>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      projectLeadName: "",
      position: "",
      projectTitle: "",
      currentStep: 1,
      requestStatus: "pending",
    },
  })

  const createProjectRequestFields: FieldConfig<ProjectRequest>[] = [
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
      name: "projectTitle",
      type: "text",
      label: "Project Title",
      placeholder: "Enter project title",
      description: "Title of the IGP project proposal",
      required: true,
    },
    {
      name: "projectDocument",
      type: "file",
      label: "Project Document",
      placeholder: "Upload project document",
      description: "Upload the project proposal document (PDF, DOCX, etc.)",
      required: true,
    },
  ]

  const onSubmit = async (data: ProjectRequest) => {
    try {
      setIsSubmitting(true)

      if (!projectDocument) {
        toast.error("Please upload a project document")
        setIsSubmitting(false)
        return
      }

      // Normally here you would create FormData and send the file to the server
      const formData = new FormData()
      formData.append("projectLeadName", data.projectLeadName)
      formData.append("position", data.position)
      formData.append("projectTitle", data.projectTitle)
      formData.append("projectDocument", projectDocument)
      formData.append("currentStep", "1")
      formData.append("requestStatus", "pending")

      // Mock API call
      // await fetch('/api/project-requests', { method: 'POST', body: formData })

      toast.success("IGP proposal submitted successfully!")

      form.reset({
        projectLeadName: "",
        position: "",
        projectTitle: "",
        currentStep: 1,
        requestStatus: "pending",
      })

      setProjectDocument(null)

      if (onSuccess) onSuccess()
    } catch (error) {
      const errorMessage = catchError(error)
      toast.error(errorMessage || "Failed to submit IGP proposal")
      if (onError) onError()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DynamicForm
      form={form}
      fields={createProjectRequestFields}
      twoColumnLayout={false}
      submitButtonTitle="Submit IGP Proposal"
      onSubmit={onSubmit}
    />
  )
}
