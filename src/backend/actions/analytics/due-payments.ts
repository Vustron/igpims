import { api } from "@/backend/helpers/api-client"
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"

export interface StudentDueInfo {
  studentId: string
  studentName: string
  courseAndSet: string
  igpType: string
  lockerId?: string
  amountDue: number
  dateDue: any
  contactEmail: string
}

export interface StudentDuesReport {
  reportPeriod: number
  dateGenerated: any
  overdueStudents: StudentDueInfo[]
  dueStudents: StudentDueInfo[]
}

export async function getDuePayments(): Promise<StudentDuesReport> {
  return await api.get<StudentDuesReport>("analytics/get-due-payments")
}

export async function preFetchDuePayments() {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["due-payments"],
      queryFn: async () => await getDuePayments(),
    })
  }
}

export const useGetDuePayments = () => {
  return useQuery({
    queryKey: ["due-payments"],
    queryFn: getDuePayments,
  })
}
