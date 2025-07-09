import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  CreateWaterFundData,
  createWaterFundSchema,
} from "@/validation/water-fund"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { PaginatedWaterFundsResponse } from "./find-many"

export async function createWaterFund(
  payload: CreateWaterFundData,
): Promise<any> {
  return api.post<CreateWaterFundData>("water-funds/create-water-fund", payload)
}

export const useCreateWaterFund = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-water-fund"],
    mutationFn: async (payload: CreateWaterFundData) => {
      const sanitizedData = sanitizer<CreateWaterFundData>(
        {
          ...payload,
        },
        createWaterFundSchema,
      )
      return await createWaterFund(sanitizedData)
    },
    onMutate: async (newWaterFund: any) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["water-funds"] }),
        queryClient.cancelQueries({ queryKey: ["water-funds-infinite"] }),
      ])

      const previousWaterFunds = queryClient.getQueryData(["water-funds"])
      const previousWaterFundsInfinite = queryClient.getQueryData([
        "water-funds-infinite",
      ])

      const optimisticWaterFund = {
        ...newWaterFund,
        id: `temp-${Date.now()}`,
      }

      queryClient.setQueriesData<PaginatedWaterFundsResponse>(
        { queryKey: ["water-funds"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          if (oldData.meta.page === 1) {
            const updatedData = [optimisticWaterFund, ...oldData.data]
            const newTotalItems = oldData.meta.totalItems + 1

            return {
              ...oldData,
              data: updatedData,
              meta: {
                ...oldData.meta,
                totalItems: newTotalItems,
                totalPages: Math.ceil(newTotalItems / oldData.meta.limit),
                hasNextPage:
                  oldData.meta.page <
                  Math.ceil(newTotalItems / oldData.meta.limit),
                hasPrevPage: oldData.meta.page > 1,
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
        { queryKey: ["water-funds-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = [...oldData.pages]
          if (updatedPages.length > 0 && updatedPages[0]?.data) {
            updatedPages[0] = {
              ...updatedPages[0],
              data: [optimisticWaterFund, ...updatedPages[0].data],
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

      return {
        previousWaterFunds,
        previousWaterFundsInfinite,
        optimisticWaterFund,
      }
    },
    onSuccess: (newWaterFund: any, _variables, _context) => {
      queryClient.setQueryData(["water-fund", newWaterFund.id], newWaterFund)

      queryClient.setQueriesData<PaginatedWaterFundsResponse>(
        { queryKey: ["water-funds"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          const filteredData = oldData.data.filter(
            (item: any) => !item.id.toString().startsWith("temp-"),
          )

          if (oldData.meta.page === 1) {
            const updatedData = [
              newWaterFund,
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
        { queryKey: ["water-funds-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = oldData.pages.map(
            (page: PaginatedWaterFundsResponse) => {
              const filteredData = page.data.filter(
                (item) => !item.id.toString().startsWith("temp-"),
              )

              return {
                ...page,
                data:
                  page.meta.page === 1
                    ? [newWaterFund, ...filteredData]
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
    },
    onError: (error, _variables, context) => {
      if (context?.previousWaterFunds) {
        queryClient.setQueryData(["water-funds"], context.previousWaterFunds)
      }
      if (context?.previousWaterFundsInfinite) {
        queryClient.setQueryData(
          ["water-funds-infinite"],
          context.previousWaterFundsInfinite,
        )
      }
      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
