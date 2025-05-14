"use client"

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/cards"
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/selects"
import { DynamicForm } from "@/components/ui/forms"
import { Button } from "@/components/ui/buttons"
import { Switch } from "@/components/ui/inputs"
import { Mail, Printer } from "lucide-react"
import Image from "next/image"

import { useDialog } from "@/hooks/use-dialog"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import type { FieldConfig, FormSection } from "@/interfaces/form"

const renterInfoSchema = z.object({
  student_name: z.string().min(1, "Student name is required"),
  student_id: z.string().min(1, "Student ID is required"),
  course_set: z.string().min(1, "Course & Set is required"),
  student_age: z.string(),
  student_email: z.string().email("Invalid email format"),
  student_contact_number: z.string(),
  lockerStatus: z.string(),
  semester_academic_year: z.string(),
  dateRented: z.date().optional(),
  dateDue: z.date().optional(),

  // Fields that change based on isViolation
  lockerRentalPrice: z.number().min(0).optional(),
  lockerRentalPayment: z.number().min(0).optional(),
  violationType: z.string().optional(),
  violationPrice: z.number().min(0).optional(),
  violationPayment: z.number().min(0).optional(),

  paymentStatus: z.string(),
})

type RenterInfoForm = z.infer<typeof renterInfoSchema>

export const RenterInfo = ({ id }: { id: string }) => {
  const [documentType, setDocumentType] = useState<string>("agreement")
  const [isViolation, setIsViolation] = useState(false)
  const { onOpen } = useDialog()

  const form = useForm<RenterInfoForm>({
    resolver: zodResolver(renterInfoSchema),
    defaultValues: {
      student_name: "",
      student_id: "",
      course_set: "",
      student_age: "",
      student_email: "",
      student_contact_number: "",
      lockerStatus: "available",
      semester_academic_year: "",
      dateRented: undefined,
      dateDue: undefined,
      lockerRentalPrice: 0,
      lockerRentalPayment: 0,
      violationType: "",
      violationPrice: 0,
      violationPayment: 0,
      paymentStatus: "unpaid",
    },
  })

  useEffect(() => {
    if (isViolation) {
      form.setValue("lockerRentalPrice", undefined)
      form.setValue("lockerRentalPayment", undefined)
    } else {
      form.setValue("violationType", undefined)
      form.setValue("violationPrice", undefined)
      form.setValue("violationPayment", undefined)
    }
  }, [isViolation, form])

  const formSections: FormSection[] = [
    {
      id: "personal_info",
      title: "Student Information",
      description: "Enter the student's personal details",
      defaultExpanded: true,
    },
    {
      id: "locker_info",
      title: "Locker Information",
      description: "Enter locker rental details",
      defaultExpanded: true,
    },
  ]

  const baseFields: FieldConfig<RenterInfoForm>[] = [
    {
      name: "student_name",
      label: "Student Name",
      type: "text",
      placeholder: "Enter the student name",
      section: "personal_info",
    },
    {
      name: "student_id",
      label: "Student ID",
      type: "text",
      placeholder: "Enter the student ID",
      section: "personal_info",
    },
    {
      name: "course_set",
      label: "Course & Set",
      type: "text",
      placeholder: "Enter the course and set",
      section: "personal_info",
    },
    {
      name: "student_age",
      label: "Age",
      type: "text",
      placeholder: "Enter the student age",
      section: "personal_info",
    },
    {
      name: "student_email",
      label: "Student Email",
      type: "email",
      placeholder: "Enter the student Email",
      section: "personal_info",
    },
    {
      name: "student_contact_number",
      label: "Student Contact Number",
      type: "text",
      placeholder: "Enter the student contact number",
      section: "personal_info",
    },
    {
      name: "lockerStatus",
      label: "Locker Status",
      type: "select",
      placeholder: "Select the locker status",
      options: [
        { value: "available", label: "Available" },
        { value: "occupied", label: "Occupied" },
        { value: "reserved", label: "Reserved" },
        { value: "maintenance", label: "Maintenance" },
        { value: "out-of-service", label: "Out of Service" },
      ],
      section: "locker_info",
    },
    {
      name: "semester_academic_year",
      label: "Semester & Academic Year",
      type: "select",
      placeholder: "Select semester and academic year",
      options: [
        { value: "first_sem_2024", label: "First Semester | 2024" },
        { value: "second_sem_2024", label: "Second Semester | 2024" },
        { value: "first_sem_2025", label: "First Semester | 2025" },
        { value: "second_sem_2025", label: "Second Semester | 2025" },
      ],
      section: "locker_info",
    },
    {
      name: "dateRented",
      label: "Date Rented",
      type: "date",
      placeholder: "Select date",
      section: "locker_info",
    },
    {
      name: "dateDue",
      label: "Date Due",
      type: "date",
      placeholder: "Select date",
      section: "locker_info",
    },
    {
      name: "paymentStatus",
      label: "Payment Status",
      type: "select",
      placeholder: "Select the payment status",
      options: [
        { value: "paid", label: "Paid" },
        { value: "unpaid", label: "Unpaid" },
        { value: "partial", label: "Partial Payment" },
      ],
      section: "locker_info",
    },
  ]

  const rentalFields: FieldConfig<RenterInfoForm>[] = [
    {
      name: "lockerRentalPrice",
      label: "Rental Price",
      type: "currency",
      placeholder: "Enter the locker rental price",
      section: "locker_info",
    },
    {
      name: "lockerRentalPayment",
      label: "Rental Payment",
      type: "currency",
      placeholder: "Enter the locker rental payment",
      section: "locker_info",
    },
  ]

  const violationFields: FieldConfig<RenterInfoForm>[] = [
    {
      name: "violationType",
      label: "Violation Type",
      type: "select",
      placeholder: "Select violation type",
      options: [
        { value: "lost_key", label: "Lost Key" },
        { value: "damaged_locker", label: "Damaged Locker" },
        { value: "unauthorized_use", label: "Unauthorized Use" },
        { value: "prohibited_items", label: "Storing Prohibited Items" },
        { value: "late_renewal", label: "Late Renewal" },
        { value: "abandoned_items", label: "Abandoned Items" },
        { value: "other", label: "Other Violation" },
      ],
      section: "locker_info",
    },
    {
      name: "violationPrice",
      label: "Violation Fee",
      type: "currency",
      placeholder: "Enter the violation fee",
      section: "locker_info",
    },
    {
      name: "violationPayment",
      label: "Violation Payment",
      type: "currency",
      placeholder: "Enter the payment amount",
      section: "locker_info",
    },
  ]

  const renterInfoFields = [
    ...baseFields,
    ...(isViolation ? violationFields : rentalFields),
  ]

  const handleSubmit = async (data: RenterInfoForm) => {
    console.log("Form submitted with data:", data)
  }

  return (
    <Card className="w-full max-w-5xl p-4">
      <CardHeader className="flex flex-col items-center justify-center">
        <Image src="/images/logo.png" alt="logo" width={100} height={100} />
        <CardTitle>
          <h1 className="text-center font-semibold text-xl">
            Locker {isViolation ? "Violation" : "Rental"} Information
          </h1>
        </CardTitle>
        <CardDescription>
          <p className="text-center text-muted-foreground text-sm">
            Locker # {id}
          </p>
        </CardDescription>

        <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:justify-between">
          {/* Violation Switch */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">Locker Rental</span>
            <Switch checked={isViolation} onCheckedChange={setIsViolation} />
            <span className="font-medium text-sm">Locker Violation</span>
          </div>

          {/* Print Controls */}
          <div className="flex flex-row gap-3">
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select document to print" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agreement">
                  {isViolation ? "Violation Form" : "Rental Agreement"}
                </SelectItem>
                <SelectItem value="receipt">Receipt</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="flex min-w-[100px] items-center gap-2"
              onClick={() => onOpen("printRentalAgreementReceipt")}
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
            {isViolation && (
              <Button
                variant="outline"
                className="flex min-w-[100px] items-center gap-2"
                onClick={() => onOpen("printRentalAgreementReceipt")}
              >
                <Mail className="h-4 w-4" />
                Send to Email
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DynamicForm
          form={form}
          fields={renterInfoFields}
          sections={formSections}
          onSubmit={handleSubmit}
          submitButtonTitle={
            isViolation ? "Record Violation" : "Save Information"
          }
          className="w-auto"
          addCancelButton
          twoColumnLayout={true}
          submitButtonClassname={
            isViolation
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-primary hover:bg-primary/90"
          }
        />
      </CardContent>
    </Card>
  )
}
