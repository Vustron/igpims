import { createRentalSchema } from "@/schemas/rental"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"

import type { LockerRental } from "@/schemas/drizzle-schema"
import type { CreateRentalData } from "@/schemas/rental"
import type { PaginatedRentalsResponse } from "./find-many"

export async function createRent(
  payload: CreateRentalData,
): Promise<LockerRental> {
  return api.post<CreateRentalData, LockerRental>(
    "locker-rentals/create-rent",
    payload,
  )
}

export const useCreateRent = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-rent"],
    mutationFn: async (payload: CreateRentalData) => {
      const validatedData = createRentalSchema.parse(payload)
      return await createRent(validatedData)
    },
    onSuccess: async (newRental: LockerRental) => {
      queryClient.setQueryData<LockerRental>(
        ["locker-rental", newRental.id],
        newRental,
      )

      queryClient.setQueriesData(
        { queryKey: ["locker-rentals"] },
        (oldData: PaginatedRentalsResponse | undefined) => {
          if (!oldData?.data) return oldData

          const exists = oldData.data.some(
            (rental) => rental.id === newRental.id,
          )
          if (exists) return oldData

          if (oldData.meta.page === 1) {
            return {
              ...oldData,
              data: [
                newRental,
                ...oldData.data.slice(0, oldData.meta.limit - 1),
              ],
              meta: {
                ...oldData.meta,
                totalItems: oldData.meta.totalItems + 1,
                totalPages: Math.ceil(
                  (oldData.meta.totalItems + 1) / oldData.meta.limit,
                ),
              },
            }
          }

          return {
            ...oldData,
            meta: {
              ...oldData.meta,
              totalItems: oldData.meta.totalItems + 1,
              totalPages: Math.ceil(
                (oldData.meta.totalItems + 1) / oldData.meta.limit,
              ),
            },
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["locker-rentals-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const newPages = [...oldData.pages]
          if (newPages[0]?.data) {
            const exists = newPages[0].data.some(
              (rental: LockerRental) => rental.id === newRental.id,
            )
            if (!exists) {
              newPages[0] = {
                ...newPages[0],
                data: [newRental, ...newPages[0].data],
                meta: {
                  ...newPages[0].meta,
                  totalItems: newPages[0].meta.totalItems + 1,
                  totalPages: Math.ceil(
                    (newPages[0].meta.totalItems + 1) / newPages[0].meta.limit,
                  ),
                },
              }
            }
          }

          return {
            ...oldData,
            pages: newPages,
          }
        },
      )

      queryClient.setQueriesData({ queryKey: ["lockers"] }, (oldData: any) => {
        if (!oldData) return oldData

        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.map((locker: any) =>
              locker.id === newRental.lockerId
                ? { ...locker, lockerStatus: "occupied" }
                : locker,
            ),
          }
        }

        if (Array.isArray(oldData)) {
          return oldData.map((locker: any) =>
            locker.id === newRental.lockerId
              ? { ...locker, lockerStatus: "occupied" }
              : locker,
          )
        }

        return oldData
      })

      queryClient.invalidateQueries({
        queryKey: ["locker-rentals"],
        refetchType: "none",
      })

      queryClient.invalidateQueries({
        queryKey: ["locker-rentals-infinite"],
        refetchType: "none",
      })

      queryClient.invalidateQueries({
        queryKey: ["lockers"],
        refetchType: "none",
      })
    },
    onSettled: () => {
      router.refresh()
    },
    onError: (error) => catchError(error),
  })
}
