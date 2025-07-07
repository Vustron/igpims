import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import {
  CreateWaterVendoData,
  createWaterVendoSchema,
} from "@/validation/water-vendo"
import { PaginatedWaterVendosResponse } from "./find-many"
import { PaginatedWaterSuppliesResponse } from "../water-supply/find-many"

export async function createWaterVendo(
  payload: CreateWaterVendoData,
): Promise<any> {
  return api.post<typeof payload, any>(
    "water-vendos/create-water-vendo",
    payload,
  )
}

export const useCreateWaterVendo = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-water-vendo"],
    mutationFn: async (payload: CreateWaterVendoData) => {
      const sanitizedData = sanitizer<CreateWaterVendoData>(
        {
          ...payload,
        },
        createWaterVendoSchema,
      )
      return await createWaterVendo(sanitizedData)
    },
    onMutate: async (newWaterVendo) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["water-vendos"] }),
        queryClient.cancelQueries({ queryKey: ["water-vendos-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["water-supplies"] }),
        queryClient.cancelQueries({ queryKey: ["water-supplies-infinite"] }),
      ])

      const previousWaterVendos = queryClient.getQueryData(["water-vendos"])
      const previousWaterVendosInfinite = queryClient.getQueryData([
        "water-vendos-infinite",
      ])
      const previousWaterSupplies = queryClient.getQueryData(["water-supplies"])
      const previousWaterSuppliesInfinite = queryClient.getQueryData([
        "water-supplies-infinite",
      ])

      const optimisticWaterVendo = {
        ...newWaterVendo,
        id: `temp-${Date.now()}`,
      }

      queryClient.setQueriesData<PaginatedWaterVendosResponse>(
        { queryKey: ["water-vendos"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          if (oldData.meta.page === 1) {
            const updatedData = [optimisticWaterVendo, ...oldData.data]
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
        { queryKey: ["water-vendos-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = [...oldData.pages]
          if (updatedPages.length > 0 && updatedPages[0]?.data) {
            updatedPages[0] = {
              ...updatedPages[0],
              data: [optimisticWaterVendo, ...updatedPages[0].data],
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

      queryClient.setQueriesData<PaginatedWaterSuppliesResponse>(
        { queryKey: ["water-supplies"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          if (oldData.meta.page === 1) {
            const updatedData = [...oldData.data]
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
        { queryKey: ["water-supplies-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = [...oldData.pages]
          if (updatedPages.length > 0 && updatedPages[0]?.data) {
            updatedPages[0] = {
              ...updatedPages[0],
              data: [...updatedPages[0].data],
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
        previousWaterVendos,
        previousWaterVendosInfinite,
        previousWaterSupplies,
        previousWaterSuppliesInfinite,
        optimisticWaterVendo,
      }
    },
    onSuccess: (newWaterVendo: any, _variables, _context) => {
      queryClient.setQueryData(["water-vendo", newWaterVendo.id], newWaterVendo)

      queryClient.setQueriesData<PaginatedWaterVendosResponse>(
        { queryKey: ["water-vendos"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          const filteredData = oldData.data.filter(
            (item: any) => !item.id.toString().startsWith("temp-"),
          )

          if (oldData.meta.page === 1) {
            const updatedData = [
              newWaterVendo,
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
        { queryKey: ["water-vendos-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = oldData.pages.map(
            (page: PaginatedWaterVendosResponse) => {
              const filteredData = page.data.filter(
                (item) => !item.id.toString().startsWith("temp-"),
              )

              return {
                ...page,
                data:
                  page.meta.page === 1
                    ? [newWaterVendo, ...filteredData]
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

      queryClient.setQueriesData<PaginatedWaterSuppliesResponse>(
        { queryKey: ["water-supplies"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          const filteredData = oldData.data.filter(
            (item: any) => !item.id.toString().startsWith("temp-"),
          )

          if (oldData.meta.page === 1) {
            const updatedData = [
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
        { queryKey: ["water-supplies-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = oldData.pages.map(
            (page: PaginatedWaterSuppliesResponse) => {
              const filteredData = page.data.filter(
                (item) => !item.id.toString().startsWith("temp-"),
              )

              return {
                ...page,
                data: page.meta.page === 1 ? [...filteredData] : filteredData,
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
      if (context?.previousWaterVendos) {
        queryClient.setQueryData(["water-vendos"], context.previousWaterVendos)
      }
      if (context?.previousWaterVendosInfinite) {
        queryClient.setQueryData(
          ["water-vendos-infinite"],
          context.previousWaterVendosInfinite,
        )
      }
      if (context?.previousWaterSupplies) {
        queryClient.setQueryData(
          ["water-supplies"],
          context.previousWaterSupplies,
        )
      }
      if (context?.previousWaterSuppliesInfinite) {
        queryClient.setQueryData(
          ["water-supplies-infinite"],
          context.previousWaterSuppliesInfinite,
        )
      }
      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
