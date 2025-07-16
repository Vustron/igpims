"use client"

import { useCreateIgp } from "@/backend/actions/igp/create-igp"
import { useFindManyUser } from "@/backend/actions/user/find-many"
import { Button } from "@/components/ui/buttons"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import { CreateIgpPayload, createIgpSchema } from "@/validation/igp"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next-nprogress-bar"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface CreateIgpFormProps {
  onSuccess?: () => void
  onError?: () => void
  onClose?: () => void
}

export const CreateIgpForm = ({
  onSuccess,
  onError,
  onClose,
}: CreateIgpFormProps) => {
  const [isSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedProjectId, setSubmittedProjectId] = useState<string>("")
  const [duplicateError, setDuplicateError] = useState<string>("")
  const createIgp = useCreateIgp()
  const currentYear = new Date().getFullYear()
  const { data: users } = useFindManyUser()

  const router = useRouter()

  const form = useForm<CreateIgpPayload>({
    resolver: zodResolver(createIgpSchema),
    defaultValues: {
      igpName: "",
      igpDescription: "",
      iconType: "",
      semesterAndAcademicYear: "",
      igpType: "",
      igpStartDate: new Date(),
      igpEndDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      itemsToSell: "",
      assignedOfficers: [],
      estimatedQuantities: "",
      budget: "",
      costPerItem: "",
      projectLead: "",
      department: "",
      position: "",
      typeOfTransaction: "",
      projectTitle: "",
      purpose: "",
      requestDate: new Date(),
      dateNeeded: new Date(),
    },
  })
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "projectLead" && value.projectLead && users?.data) {
        const selectedUser = users.data.find(
          (user) => user.id === value.projectLead,
        )
        if (selectedUser) {
          form.setValue("position", selectedUser.role || "")
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [form, users?.data])

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

  const iconTypeOptions = [
    { label: "Food", value: "food" },
    { label: "Merchandise", value: "merchandise" },
    { label: "Service", value: "service" },
    { label: "Event", value: "event" },
    { label: "Bakery", value: "bakery" },
    { label: "Coffee", value: "coffee" },
    { label: "Books", value: "books" },
    { label: "Technology", value: "tech" },
    { label: "Education", value: "education" },
    { label: "Crafts", value: "craft" },
    { label: "Sports", value: "sports" },
    { label: "Tickets", value: "tickets" },
    { label: "Health", value: "health" },
    { label: "Donation", value: "donation" },
    { label: "Art", value: "art" },
    { label: "Store", value: "store" },
    { label: "Card", value: "card" },
    { label: "Tag", value: "tag" },
    { label: "Package", value: "package" },
    { label: "Shirt", value: "shirt" },
    { label: "Research", value: "research" },
    { label: "Printing", value: "printing" },
    { label: "Media", value: "media" },
    { label: "Farm", value: "farm" },
    { label: "Vendo", value: "vendo" },
    { label: "Music", value: "music" },
    { label: "Rental", value: "rental" },
    { label: "Newspaper", value: "newspaper" },
    { label: "Pin", value: "pin" },
  ]

  const officerOptions = users?.data.map((user) => ({
    label: user.name,
    value: user.id,
  }))

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

  const createIgpFields: FieldConfig<CreateIgpPayload>[] = [
    {
      name: "projectLead",
      type: "select",
      label: "Project Lead",
      placeholder: "select project lead",
      description: "Full name of the person leading the project",
      options: officerOptions,
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
      name: "semesterAndAcademicYear",
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
      name: "igpDescription",
      type: "textarea",
      label: "IGP Description",
      placeholder: "Enter IGP description",
      description: "Detailed description of the IGP",
      required: true,
    },

    {
      name: "iconType",
      type: "select",
      label: "Select icon",
      placeholder: "Select IGP icon",
      description: "Category classification of the IGP",
      options: iconTypeOptions,
      required: true,
    },
    {
      name: "igpStartDate",
      type: "date",
      label: "Start Date",
      placeholder: "Select start date",
      description: "When the IGP implementation should begin",
      required: true,
    },
    {
      name: "igpEndDate",
      type: "date",
      label: "End Date",
      placeholder: "Select end date",
      description: "Expected completion date of the IGP",
      required: true,
    },
    {
      name: "itemsToSell",
      type: "text",
      label: "Item to Sell",
      placeholder: "Enter items or services to offer",
      description: "Products or services that will be offered",
      required: true,
    },
    {
      name: "assignedOfficers",
      type: "multiselect",
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

  const onSubmit = async (values: CreateIgpPayload) => {
    try {
      setDuplicateError("")

      if (values.igpEndDate < values.igpStartDate) {
        toast.error("End date must be after start date")
        return
      }

      const projectTitle = `${values.igpName} - ${values.itemsToSell} (${values.semesterAndAcademicYear})`

      const purpose = `Income Generating Project proposal for ${values.igpName} focusing on ${values.itemsToSell}. 
  
  Project Details:
  - Type: ${values.igpType}
  - Academic Period: ${values.semesterAndAcademicYear}
  - Estimated Quantities: ${values.estimatedQuantities}
  - Budget: ₱${values.budget}
  - Cost per Item: ₱${values.costPerItem}
  - Assigned Officers: ${values.assignedOfficers}
  - Implementation Period: ${values.igpStartDate.toLocaleDateString()} to ${values.igpEndDate.toLocaleDateString()}
  
  This IGP aims to generate income while providing valuable products/services to the college community.`

      const formData = {
        ...values,
        igpName: projectTitle,
        igpDescription: purpose,
        position: values.position || "IGP Coordinator",
        igpStartDate: new Date(values.igpStartDate).setHours(0, 0, 0, 0),
        igpEndDate: new Date(values.igpEndDate).setHours(0, 0, 0, 0),
      }

      await toast.promise(createIgp.mutateAsync(formData), {
        loading: <span className="animate-pulse">Creating proposal...</span>,
        success: "Proposal successfully submitted",
        error: (error: unknown) => catchError(error),
      })

      if (createIgp.isSuccess) {
        onSuccess?.()
      } else {
        onError?.()
      }
    } catch (error) {
      const errorMessage = catchError(error)
      toast.error(errorMessage || "Failed to submit IGP proposal")
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
        mutation={createIgp}
        twoColumnLayout={true}
      />
    </div>
  )
}
