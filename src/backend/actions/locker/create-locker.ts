import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { Locker } from "@/backend/db/schemas"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { Locker as LockerType, lockerSchema } from "@/validation/locker"
import { PaginatedLockersResponse } from "../locker/find-many"

export async function createLocker(payload: LockerType): Promise<Locker> {
  return api.post<LockerType, Locker>("lockers/create-locker", payload)
}

export const useCreateLocker = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationKey: ["create-locker"],
    mutationFn: async (payload: LockerType) => {
      const sanitizedData = sanitizer<LockerType>(payload, lockerSchema)
      return await createLocker(sanitizedData)
    },
    onMutate: async (newLockerData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["lockers"] }),
        queryClient.cancelQueries({ queryKey: ["lockers-infinite"] }),
      ])

      const previousLockers =
        queryClient.getQueryData<PaginatedLockersResponse>(["lockers"])
      const previousLockersInfinite = queryClient.getQueryData([
        "lockers-infinite",
      ])

      const optimisticLocker: any = {
        id: `temp-${Date.now()}`,
        lockerName: newLockerData.lockerName!,
        lockerType: newLockerData.lockerType!,
        lockerLocation: newLockerData.lockerLocation,
        lockerStatus: newLockerData.lockerStatus || "available",
        lockerRentalPrice: Number(newLockerData.lockerRentalPrice) || 0,
      }

      if (previousLockers) {
        queryClient.setQueryData<PaginatedLockersResponse>(
          ["lockers"],
          (old) => ({
            ...old!,
            data: [optimisticLocker, ...old!.data],
            meta: {
              ...old!.meta,
              totalItems: old!.meta.totalItems + 1,
              totalPages: Math.ceil(
                (old!.meta.totalItems + 1) / old!.meta.limit,
              ),
            },
          }),
        )
      }

      queryClient.setQueriesData(
        { queryKey: ["lockers-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = [...oldData.pages]
          if (updatedPages.length > 0 && updatedPages[0]?.data) {
            updatedPages[0] = {
              ...updatedPages[0],
              data: [optimisticLocker, ...updatedPages[0].data],
              meta: {
                ...updatedPages[0].meta,
                totalItems: updatedPages[0].meta.totalItems + 1,
                totalPages: Math.ceil(
                  (updatedPages[0].meta.totalItems + 1) /
                    updatedPages[0].meta.limit,
                ),
              },
            }
          }

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )

      return { previousLockers, previousLockersInfinite }
    },
    onSuccess: async (newLocker: Locker) => {
      queryClient.setQueriesData<PaginatedLockersResponse>(
        { queryKey: ["lockers"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          const filteredData = oldData.data.filter(
            (item) => !item.id.toString().startsWith("temp-"),
          )

          if (oldData.meta.page === 1) {
            const updatedData = [
              newLocker,
              ...filteredData.slice(0, oldData.meta.limit - 1),
            ]

            return {
              ...oldData,
              data: updatedData,
            }
          }

          return oldData
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["lockers-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = oldData.pages.map(
            (page: PaginatedLockersResponse) => {
              const filteredData = page.data.filter(
                (item) => !item.id.toString().startsWith("temp-"),
              )

              return {
                ...page,
                data:
                  page.meta.page === 1
                    ? [newLocker, ...filteredData]
                    : filteredData,
              }
            },
          )

          return {
            ...oldData,
            pages: updatedPages,
          }
        },
      )

      queryClient.setQueryData(["locker", newLocker.id], newLocker)
    },
    onError: (error, _variables, context) => {
      if (context?.previousLockers) {
        queryClient.setQueryData(["lockers"], context.previousLockers)
      }
      if (context?.previousLockersInfinite) {
        queryClient.setQueryData(
          ["lockers-infinite"],
          context.previousLockersInfinite,
        )
      }
      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
