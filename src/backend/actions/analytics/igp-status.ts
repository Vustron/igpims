import { api } from "@/backend/helpers/api-client"
import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"

export interface IgpStatus {
  id: string
  name: string
  type: string
  description: string
  startDate?: number
  assignedOfficers?: Array<{
    id: string
    name: string
    email: string
    emailVerified: boolean
    sessionExpired: boolean
    role: string
    image: string | null
    createdAt: string
    updatedAt: string
  }>
  revenue: number
  status: string
}

export interface IgpObjective {
  id: string
  name: string
  type: string
  description: string
  dateCompleted?: number
  igpRevenue: number
  progress: number
  status: string
}

export interface IgpRepair {
  id: string
  name: string
  type: string
  description: string
  issueDate?: number
  expectedRepair?: number
  lastRevenue: number
  status: string
}

export interface IgpStatusReport {
  reportPeriod: string
  dateGenerated: string
  active: IgpStatus[]
  objectives: IgpObjective[]
  forRepair: IgpRepair[]
}

export async function getIgpStatus(): Promise<IgpStatusReport> {
  return await api.get<IgpStatusReport>("analytics/get-igp-status")
}

export async function preFetchIgpStatus() {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["igp-status"],
      queryFn: async () => await getIgpStatus(),
    })
  }
}

export const useIgpStatus = () => {
  return useQuery({
    queryKey: ["igp-status"],
    queryFn: getIgpStatus,
  })
}
