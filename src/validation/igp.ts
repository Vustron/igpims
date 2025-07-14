import z from "zod"

export const createIgpSchema = z.object({
  id: z.string().optional(),
  igpName: z.string().min(1, "IGP name is required."),
  igpDescription: z.string().min(1, "IGP description is required."),
  iconType: z.string().min(1, "IGP icon is required."),
  semesterAndAcademicYear: z
    .string()
    .min(1, "Semester and academic year are required."),
  igpType: z.string().min(1, "Type of IGP is required."),
  igpStartDate: z.any().optional(),
  igpEndDate: z.any().optional(),
  itemsToSell: z.string().min(1, "Item to sell is required.").optional(),
  assignedOfficers: z.array(z.string()).default([]).optional(),
  estimatedQuantities: z
    .number()
    .min(1, "Estimated quantities are required.")
    .optional(),
  budget: z.number().min(1, "Budget is required.").optional(),
  costPerItem: z.number().min(1, "Cost per item is required.").optional(),
  projectLead: z.string().min(1, "Project lead is required.").optional(),
  department: z.string().min(1, "Department is required.").optional(),
  position: z.string().optional(),
  typeOfTransaction: z.string().optional(),
})

export const updateIgpSchema = z.object({
  id: z.string().optional(),
  igpName: z.string().min(1, "IGP name is required.").optional(),
  igpDescription: z.string().min(1, "IGP description is required.").optional(),
  iconType: z.string().min(1, "IGP icon is required.").optional(),
  semesterAndAcademicYear: z
    .string()
    .min(1, "Semester and academic year are required.")
    .optional(),
  igpType: z.string().min(1, "Type of IGP is required.").optional(),
  totalSold: z.number().optional(),
  igpRevenue: z.number().optional(),
  igpStartDate: z.any().optional(),
  igpEndDate: z.any().optional(),
  itemsToSell: z.string().min(1, "Item to sell is required.").optional(),
  assignedOfficers: z.any().optional(),
  estimatedQuantities: z
    .number()
    .min(1, "Estimated quantities are required.")
    .optional(),
  budget: z.number().min(1, "Budget is required.").optional(),
  costPerItem: z.number().min(1, "Cost per item is required.").optional(),
  projectLead: z.string().min(1, "Project lead is required.").optional(),
  department: z.string().min(1, "Department is required.").optional(),
  position: z.string().optional(),
  typeOfTransaction: z.string().optional(),
})

export type CreateIgpPayload = z.infer<typeof createIgpSchema>
export type UpdateIgpPayload = z.infer<typeof updateIgpSchema>
