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
      costPerItem: "",
      projectLead: "",
      position: "",
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
    { label: "Permanent", value: "permanent" },
    { label: "Temporary", value: "temporary" },
    { label: "Maintenance", value: "maintenance" },
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

  const costOptions = [
    { label: "₱50", value: "50" },
    { label: "₱100", value: "100" },
    { label: "₱150", value: "150" },
    { label: "₱200", value: "200" },
    { label: "₱250", value: "250" },
    { label: "₱300", value: "300" },
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
      name: "igpName",
      type: "text",
      label: "IGP Name",
      placeholder: "Input IGP Name",
      description: "",
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
      placeholder: "Enter details",
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
      if (values.igpEndDate < values.igpStartDate) {
        toast.error("End date must be after start date")
        return
      }

      const formData = {
        ...values,
        position: values.position || "IGP Coordinator",
        igpStartDate: new Date(values.igpStartDate).setHours(0, 0, 0, 0),
        igpEndDate: new Date(values.igpEndDate).setHours(0, 0, 0, 0),
        requestDate: new Date(values.igpStartDate).setHours(0, 0, 0, 0),
        dateNeeded: new Date(values.dateNeeded).setHours(0, 0, 0, 0),
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
