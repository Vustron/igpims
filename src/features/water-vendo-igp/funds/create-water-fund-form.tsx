"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { z } from "zod"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"

const waterFundSchema = z.object({
  id: z.string().optional(),
  week: z.string({
    required_error: "Week is required.",
  }),
  month: z.string({
    required_error: "Month is required.",
  }),
  dateStart: z.date({
    required_error: "Start date is required.",
    invalid_type_error: "Start date must be a valid date.",
  }),
  dateEnd: z
    .date({
      required_error: "End date is required.",
      invalid_type_error: "End date must be a valid date.",
    })
    .refine((_data) => true, {
      message: "End date must be after start date",
    }),
})

type WaterFundFormData = z.infer<typeof waterFundSchema>

interface CreateWaterFundFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateWaterFundForm = ({
  onSuccess,
  onError,
}: CreateWaterFundFormProps) => {
  const [, setIsSubmitting] = useState(false)

  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.toLocaleString("default", { month: "long" })

  const getWeekOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return Math.ceil((date.getDate() + firstDay) / 7)
  }

  const weekNumber = getWeekOfMonth(today)
  const currentWeek = `${weekNumber}${
    weekNumber === 1
      ? "st"
      : weekNumber === 2
        ? "nd"
        : weekNumber === 3
          ? "rd"
          : "th"
  } Week of ${currentMonth} ${currentYear}`

  // Get date range for the current week
  const getStartOfWeek = (date: Date) => {
    const day = date.getDay()
    const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Sunday
    return new Date(date.setDate(diff))
  }

  const startDate = getStartOfWeek(new Date())
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)

  const form = useForm<WaterFundFormData>({
    resolver: zodResolver(waterFundSchema),
    defaultValues: {
      week: currentWeek,
      month: currentMonth,
      dateStart: startDate,
      dateEnd: endDate,
    },
  })

  // Generate options for months
  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ].map((month) => ({
    label: month,
    value: month,
  }))

  // Generate options for weeks
  const weekOptions = Array.from({ length: 5 }, (_, i) => {
    const num = i + 1
    const suffix = num === 1 ? "st" : num === 2 ? "nd" : num === 3 ? "rd" : "th"
    return {
      label: `${num}${suffix} Week`,
      value: `${num}${suffix} Week of ${currentMonth} ${currentYear}`,
    }
  })

  // Add "Last Week" option
  weekOptions.push({
    label: "Last Week",
    value: `Last Week of ${currentMonth} ${currentYear}`,
  })

  const createWaterFundFields: FieldConfig<WaterFundFormData>[] = [
    {
      name: "week",
      type: "select",
      label: "Week",
      placeholder: "Select the week",
      description: "The week of the water fund entry",
      options: weekOptions,
      required: true,
    },
    {
      name: "month",
      type: "select",
      label: "Month",
      placeholder: "Select the month",
      description: "The month of the water fund entry",
      options: monthOptions,
      required: true,
    },
    {
      name: "dateStart",
      type: "date",
      label: "Start Date",
      placeholder: "Select start date",
      description: "The start date of the period",
      required: true,
    },
    {
      name: "dateEnd",
      type: "date",
      label: "End Date",
      placeholder: "Select end date",
      description: "The end date of the period",
      required: true,
    },
  ]

  const onSubmit = async (data: WaterFundFormData) => {
    try {
      setIsSubmitting(true)

      // Validate that end date is after start date
      if (data.dateEnd < data.dateStart) {
        form.setError("dateEnd", {
          type: "manual",
          message: "End date must be after start date",
        })
        setIsSubmitting(false)
        return
      }

      console.log("Submitting water fund data:", data)

      const newId = `WF-${currentYear}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`

      const waterFundData = {
        ...data,
        id: newId,
      }

      console.log("Created water fund:", waterFundData)

      toast.success("Water fund entry created successfully!")

      form.reset({
        week: currentWeek,
        month: currentMonth,
        dateStart: startDate,
        dateEnd: endDate,
      })

      if (onSuccess) onSuccess()
    } catch (error) {
      const errorMessage = catchError(error)
      toast.error(errorMessage || "Failed to create water fund entry")
      if (onError) onError()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DynamicForm
      form={form}
      onSubmit={onSubmit}
      fields={createWaterFundFields}
      submitButtonTitle="Create Water Fund Entry"
    />
  )
}
