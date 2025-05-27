"use client"

import { DynamicForm } from "@/components/ui/forms"
import { Button } from "@/components/ui/buttons"

import { zodResolver } from "@hookform/resolvers/zod"
import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"
import { z } from "zod"

import { useProjectRequestStore } from "@/features/project-request/project-request-store"
import { useRouter } from "next-nprogress-bar"
import { useForm } from "react-hook-form"
import { useState } from "react"

import type { FieldConfig } from "@/interfaces/form"

const igpSchema = z.object({
  id: z.string().optional(),
  igpName: z.string({
    required_error: "IGP name is required.",
  }),
  semesterYear: z.string({
    required_error: "Semester and academic year are required.",
  }),
  igpType: z.string({
    required_error: "Type of IGP is required.",
  }),
  dateStart: z.date({
    required_error: "Start date is required.",
    invalid_type_error: "Start date must be a valid date.",
  }),
  dateEnd: z.date({
    required_error: "End date is required.",
    invalid_type_error: "End date must be a valid date.",
  }),
  itemToSell: z.string({
    required_error: "Item to sell is required.",
  }),
  assignedOfficers: z.string({
    required_error: "Assigned officers are required.",
  }),
  estimatedQuantities: z.string({
    required_error: "Estimated quantities are required.",
  }),
  budget: z.string({
    required_error: "Budget is required.",
  }),
  costPerItem: z.string({
    required_error: "Cost per item is required.",
  }),
  projectLead: z.string({
    required_error: "Project lead is required.",
  }),
  department: z.string({
    required_error: "Department is required.",
  }),
  position: z.string().optional(),
})

type IgpFormData = z.infer<typeof igpSchema>

interface CreateIgpFormProps {
  onSuccess?: () => void
  onError?: () => void
  onClose?: () => void
}

export const CreateIgpForm = ({
  // onSuccess,
  onError,
  onClose,
}: CreateIgpFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedProjectId, setSubmittedProjectId] = useState<string>("")
  const [duplicateError, setDuplicateError] = useState<string>("")
  const { addRequest, validateProjectCreation } = useProjectRequestStore()
  const currentYear = new Date().getFullYear()

  const router = useRouter()

  const form = useForm<IgpFormData>({
    resolver: zodResolver(igpSchema),
    defaultValues: {
      dateStart: new Date(),
      dateEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      projectLead: "",
      department: "",
      position: "",
    },
  })

  // Options for form fields
  const igpNameOptions = [
    { label: "Food Sale", value: "foodSale" },
    { label: "Merchandise Sale", value: "merchandiseSale" },
    { label: "School Supplies", value: "schoolSupplies" },
    { label: "Fundraising Event", value: "fundraisingEvent" },
  ]

  const semesterOptions = [
    {
      label: `1st Semester ${currentYear}-${currentYear + 1}`,
      value: `1st-${currentYear}-${currentYear + 1}`,
    },
    {
      label: `2nd Semester ${currentYear}-${currentYear + 1}`,
      value: `2nd-${currentYear}-${currentYear + 1}`,
    },
    { label: `Summer ${currentYear + 1}`, value: `summer-${currentYear + 1}` },
  ]

  const igpTypeOptions = [
    { label: "Food", value: "food" },
    { label: "Merchandise", value: "merchandise" },
    { label: "Service", value: "service" },
    { label: "Event", value: "event" },
  ]

  const officerOptions = [
    { label: "SSC President", value: "president" },
    { label: "Secretary", value: "secretary" },
    { label: "Treasurer", value: "treasurer" },
    { label: "Auditor", value: "auditor" },
  ]

  const quantityOptions = [
    { label: "10", value: "10" },
    { label: "20", value: "20" },
    { label: "50", value: "50" },
    { label: "100", value: "100" },
    { label: "200", value: "200" },
    { label: "500", value: "500" },
  ]

  const budgetOptions = [
    { label: "₱1,000", value: "1000" },
    { label: "₱2,000", value: "2000" },
    { label: "₱5,000", value: "5000" },
    { label: "₱10,000", value: "10000" },
    { label: "₱20,000", value: "20000" },
  ]

  const costOptions = [
    { label: "₱50", value: "50" },
    { label: "₱100", value: "100" },
    { label: "₱150", value: "150" },
    { label: "₱200", value: "200" },
    { label: "₱250", value: "250" },
    { label: "₱300", value: "300" },
  ]

  const departmentOptions = [
    { label: "Student Affairs", value: "Student Affairs" },
    { label: "Academic Affairs", value: "Academic Affairs" },
    { label: "Finance", value: "Finance" },
    { label: "Student Services", value: "Student Services" },
    { label: "Information Technology", value: "Information Technology" },
    { label: "Engineering", value: "Engineering" },
    { label: "Business Administration", value: "Business Administration" },
    { label: "Education", value: "Education" },
  ]

  const createIgpFields: FieldConfig<IgpFormData>[] = [
    {
      name: "projectLead",
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
      required: false,
    },
    {
      name: "department",
      type: "select",
      label: "Department",
      placeholder: "Select department",
      description: "Department or unit submitting the project",
      options: departmentOptions,
      required: true,
    },
    {
      name: "igpName",
      type: "select",
      label: "IGP Name",
      placeholder: "Select IGP type",
      description: "Type of Income Generating Project",
      options: igpNameOptions,
      required: true,
    },
    {
      name: "semesterYear",
      type: "select",
      label: "Semester & Academic Year",
      placeholder: "Select semester",
      description: "Academic period for the IGP",
      options: semesterOptions,
      required: true,
    },
    {
      name: "igpType",
      type: "select",
      label: "Type of IGP",
      placeholder: "Select IGP category",
      description: "Category classification of the IGP",
      options: igpTypeOptions,
      required: true,
    },
    {
      name: "dateStart",
      type: "date",
      label: "Start Date",
      placeholder: "Select start date",
      description: "When the IGP implementation should begin",
      required: true,
    },
    {
      name: "dateEnd",
      type: "date",
      label: "End Date",
      placeholder: "Select end date",
      description: "Expected completion date of the IGP",
      required: true,
    },
    {
      name: "itemToSell",
      type: "text",
      label: "Item to Sell",
      placeholder: "Enter items or services to offer",
      description: "Products or services that will be offered",
      required: true,
    },
    {
      name: "assignedOfficers",
      type: "select",
      label: "Assigned Officers",
      placeholder: "Select responsible officers",
      description: "Officers who will manage the IGP",
      options: officerOptions,
      required: true,
    },
    {
      name: "estimatedQuantities",
      type: "select",
      label: "Estimated Quantities",
      placeholder: "Select expected quantity",
      description: "Expected number of items/services to sell",
      options: quantityOptions,
      required: true,
    },
    {
      name: "budget",
      type: "select",
      label: "Budget",
      placeholder: "Select budget range",
      description: "Total budget required for the IGP",
      options: budgetOptions,
      required: true,
    },
    {
      name: "costPerItem",
      type: "select",
      label: "Cost per Item",
      placeholder: "Select cost per item",
      description: "Expected selling price per item/service",
      options: costOptions,
      required: true,
    },
  ]

  const onSubmit = async (data: IgpFormData) => {
    try {
      setIsSubmitting(true)
      setDuplicateError("")

      if (data.dateEnd < data.dateStart) {
        form.setError("dateEnd", {
          type: "manual",
          message: "End date must be after start date",
        })
        setIsSubmitting(false)
        return
      }

      // Create project title from IGP details
      const projectTitle = `${data.igpName} - ${data.itemToSell} (${data.semesterYear})`

      // Check for duplicates before proceeding
      const validation = validateProjectCreation(projectTitle, data.projectLead)

      if (!validation.isValid) {
        setDuplicateError(validation.error || "Duplicate project detected")

        // Set form field errors for better UX
        if (
          validation.duplicateInfo?.duplicateType === "title" ||
          validation.duplicateInfo?.duplicateType === "both"
        ) {
          form.setError("igpName", {
            type: "manual",
            message: "This project title already exists",
          })
          form.setError("itemToSell", {
            type: "manual",
            message: "This combination already exists",
          })
        }

        if (
          validation.duplicateInfo?.duplicateType === "lead" ||
          validation.duplicateInfo?.duplicateType === "both"
        ) {
          form.setError("projectLead", {
            type: "manual",
            message: "This person already has an active project",
          })
        }

        toast.error(validation.error || "Cannot create duplicate project")
        setIsSubmitting(false)
        return
      }

      // Create comprehensive purpose description
      const purpose = `Income Generating Project proposal for ${data.igpName} focusing on ${data.itemToSell}. 

Project Details:
- Type: ${data.igpType}
- Academic Period: ${data.semesterYear}
- Estimated Quantities: ${data.estimatedQuantities}
- Budget: ₱${data.budget}
- Cost per Item: ₱${data.costPerItem}
- Assigned Officers: ${data.assignedOfficers}
- Implementation Period: ${data.dateStart.toLocaleDateString()} to ${data.dateEnd.toLocaleDateString()}

This IGP aims to generate income while providing valuable products/services to the college community.`

      // Create project request using the project request store
      const projectId = addRequest({
        projectTitle,
        purpose,
        projectLead: data.projectLead,
        position: data.position || "IGP Coordinator",
        department: data.department,
        dateNeeded: data.dateStart,
        requestDate: new Date(),
      })

      console.log("Created IGP Project Request:", {
        projectId,
        projectTitle,
        projectLead: data.projectLead,
        department: data.department,
      })

      toast.success(`IGP Proposal ${projectId} submitted successfully!`)

      // Set submission state
      setIsSubmitted(true)
      setSubmittedProjectId(projectId)

      // Reset the form
      form.reset({
        dateStart: new Date(),
        dateEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        projectLead: "",
        department: "",
        position: "",
      })
    } catch (error) {
      const errorMessage = catchError(error)

      // Check if it's a duplicate error
      if (
        errorMessage.includes("already exists") ||
        errorMessage.includes("already has an active")
      ) {
        setDuplicateError(errorMessage)
      }

      toast.error(errorMessage || "Failed to submit IGP proposal")
      if (onError) onError()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateAnother = () => {
    setIsSubmitted(false)
    setSubmittedProjectId("")
  }

  const handleViewAllProposals = () => {
    if (onClose) {
      onClose()
    }
    router.push("/project-approval")
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-8 text-center">
        <div className="rounded-full bg-green-100 p-6">
          <svg
            className="h-16 w-16 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="font-bold text-2xl text-gray-900">
            Your IGP Proposal is Submitted!
          </h2>
          <p className="text-gray-600">
            Project ID:{" "}
            <span className="font-medium font-mono">{submittedProjectId}</span>
          </p>
          <p className="max-w-md text-gray-500 text-sm">
            Your Income Generating Project proposal has been successfully
            submitted and is now under review. You will be notified of any
            updates regarding your proposal status.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleCreateAnother}
            className="rounded-md px-6 py-2 text-white"
          >
            Submit Another Proposal
          </Button>
          <Button onClick={handleViewAllProposals} variant={"ghost"}>
            View All Proposals
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[80vh] overflow-y-auto p-6">
      {/* Duplicate Error Alert */}
      {duplicateError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="font-medium text-red-800 text-sm">
                Duplicate Project Detected
              </h3>
              <p className="mt-1 text-red-700 text-sm">{duplicateError}</p>
              <p className="mt-2 text-red-600 text-xs">
                Please modify the project details or contact the SSC President
                if you believe this project does not already exists.
              </p>
            </div>
          </div>
        </div>
      )}

      <DynamicForm
        form={form}
        onSubmit={onSubmit}
        fields={createIgpFields}
        submitButtonTitle={
          isSubmitting ? "Submitting..." : "Submit IGP Proposal"
        }
        disabled={isSubmitting}
        twoColumnLayout={true}
      />
    </div>
  )
}
