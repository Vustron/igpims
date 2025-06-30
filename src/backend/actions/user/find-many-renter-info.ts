import { QueryClient, queryOptions, useQuery } from "@tanstack/react-query"
import { api } from "@/backend/helpers/api-client"

export interface RenterInfo {
  renterId: string
  renterName: string
  courseAndSet: string
  renterEmail: string
  lockerName: string
  lockerLocation: string
  dueDate: Date
  amount: number
}

export async function findManyRenterInfo(): Promise<RenterInfo[]> {
  return await api.get<RenterInfo[]>("users/find-many-renter-info")
}

export async function prefindManyRenterInfo() {
  return async (_queryClient: QueryClient) => {
    return queryOptions({
      queryKey: ["renter-info"],
      queryFn: async () => await findManyRenterInfo(),
    })
  }
}

export const useFindManyRenterInfo = (options?: { enabled?: boolean }) => {
  return useQuery<RenterInfo[]>({
    queryKey: ["renter-info"],
    queryFn: async () => await findManyRenterInfo(),
    ...options,
  })
}
