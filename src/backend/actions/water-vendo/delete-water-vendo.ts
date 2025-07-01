import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { PaginatedWaterVendosResponse } from "./find-many"

export async function deleteWaterVendo(vendoId: string) {
  return api.delete("water-vendos/delete-water-vendo", {
    params: { id: vendoId },
  })
}

export const useDeleteWaterVendo = (vendoId: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-water-vendo", vendoId],
    mutationFn: async () => {
      return await deleteWaterVendo(vendoId)
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["water-vendos"] }),
        queryClient.cancelQueries({ queryKey: ["water-vendos-infinite"] }),
        queryClient.cancelQueries({ queryKey: ["water-vendo", vendoId] }),
      ])

      const previousVendos = queryClient.getQueryData(["water-vendos"])
      const previousVendosInfinite = queryClient.getQueryData([
        "water-vendos-infinite",
      ])
      const previousVendo = queryClient.getQueryData(["water-vendo", vendoId])

      queryClient.setQueriesData<PaginatedWaterVendosResponse>(
        { queryKey: ["water-vendos"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((vendo) => vendo.id !== vendoId),
            meta: {
              ...oldData.meta,
              totalItems: Math.max(0, oldData.meta.totalItems - 1),
              totalPages: Math.max(
                1,
                Math.ceil((oldData.meta.totalItems - 1) / oldData.meta.limit),
              ),
            },
          }
        },
      )

      queryClient.removeQueries({ queryKey: ["water-vendo", vendoId] })

      return {
        previousVendos,
        previousVendosInfinite,
        previousVendo,
      }
    },
    onSuccess: async (_data, _variables, _context) => {
      queryClient.setQueriesData<PaginatedWaterVendosResponse>(
        { queryKey: ["water-vendos"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((vendo) => vendo.id !== vendoId),
            meta: {
              ...oldData.meta,
              totalItems: Math.max(0, oldData.meta.totalItems - 1),
              totalPages: Math.max(
                1,
                Math.ceil((oldData.meta.totalItems - 1) / oldData.meta.limit),
              ),
            },
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["water-vendos-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter((vendo: any) => vendo.id !== vendoId),
              meta: {
                ...page.meta,
                totalItems: Math.max(0, page.meta.totalItems - 1),
                totalPages: Math.max(
                  1,
                  Math.ceil((page.meta.totalItems - 1) / page.meta.limit),
                ),
              },
            })),
          }
        },
      )
    },
    onError: (error, _variables, context) => {
      if (context?.previousVendos) {
        queryClient.setQueryData(["water-vendos"], context.previousVendos)
      }
      if (context?.previousVendosInfinite) {
        queryClient.setQueryData(
          ["water-vendos-infinite"],
          context.previousVendosInfinite,
        )
      }
      if (context?.previousVendo) {
        queryClient.setQueryData(
          ["water-vendo", vendoId],
          context.previousVendo,
        )
      }

      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
