"use client"

import { DynamicForm } from "@/components/ui/forms"

import { zodResolver } from "@hookform/resolvers/zod"
import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"
import { z } from "zod"

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
})

type IgpFormData = z.infer<typeof igpSchema>

interface CreateIgpFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateIgpForm = ({ onSuccess, onError }: CreateIgpFormProps) => {
  const [, setIsSubmitting] = useState(false)
  const currentYear = new Date().getFullYear()

  const form = useForm<IgpFormData>({
    resolver: zodResolver(igpSchema),
    defaultValues: {
      dateStart: new Date(),
      dateEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
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
    { label: "President", value: "president" },
    { label: "Vice President", value: "vicePresident" },
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

  const createIgpFields: FieldConfig<IgpFormData>[] = [
    {
      name: "igpName",
      type: "select",
      label: "IGP Name",
      placeholder: "Select",
      description: "",
      options: igpNameOptions,
      required: true,
    },
    {
      name: "semesterYear",
      type: "select",
      label: "Semester & Academic Year",
      placeholder: "Select",
      description: "",
      options: semesterOptions,
      required: true,
    },
    {
      name: "igpType",
      type: "select",
      label: "Type of IGP",
      placeholder: "Select",
      description: "",
      options: igpTypeOptions,
      required: true,
    },
    {
      name: "dateStart",
      type: "date",
      label: "Start Date",
      placeholder: "Select start date",
      description: "",
      required: true,
    },
    {
      name: "dateEnd",
      type: "date",
      label: "End Date",
      placeholder: "Select end date",
      description: "",
      required: true,
    },
    {
      name: "itemToSell",
      type: "text",
      label: "Item to Sell",
      placeholder: "Input",
      description: "",
      required: true,
    },
    {
      name: "assignedOfficers",
      type: "select",
      label: "Assigned Officers",
      placeholder: "Select",
      description: "",
      options: officerOptions,
      required: true,
    },
    {
      name: "estimatedQuantities",
      type: "select",
      label: "Estimated Quantities",
      placeholder: "Select",
      description: "",
      options: quantityOptions,
      required: true,
    },
    {
      name: "budget",
      type: "select",
      label: "Budget",
      placeholder: "Select",
      description: "",
      options: budgetOptions,
      required: true,
    },
    {
      name: "costPerItem",
      type: "select",
      label: "Cost per Item",
      placeholder: "Select",
      description: "",
      options: costOptions,
      required: true,
    },
  ]

  const onSubmit = async (data: IgpFormData) => {
    try {
      setIsSubmitting(true)

      if (data.dateEnd < data.dateStart) {
        form.setError("dateEnd", {
          type: "manual",
          message: "End date must be after start date",
        })
        setIsSubmitting(false)
        return
      }

      console.log("Submitting IGP data:", data)

      const newId = `IGP-${currentYear}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`

      const igpData = {
        ...data,
        id: newId,
      }

      console.log("Created IGP:", igpData)

      toast.success("IGP module created successfully!")

      // Reset the form
      form.reset({
        dateStart: new Date(),
        dateEnd: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      })

      if (onSuccess) onSuccess()
    } catch (error) {
      const errorMessage = catchError(error)
      toast.error(errorMessage || "Failed to create IGP module")
      if (onError) onError()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={createIgpFields}
      submitButtonTitle="COMPLETE"
      twoColumnLayout={true}
    />
  )
}
