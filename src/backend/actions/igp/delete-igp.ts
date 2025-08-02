import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { IgpWithRelations } from "./find-by-id"
import { PaginatedIgpResponse } from "./find-many"

export async function deleteIgp(id: string) {
  return api.delete<IgpWithRelations>("igps/delete-igp", {
    params: { id },
  })
}

export const useDeleteIgp = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-igp", id],
    mutationFn: async () => {
      return await deleteIgp(id)
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["igps"] }),
        queryClient.cancelQueries({ queryKey: ["igp", id] }),
        queryClient.cancelQueries({ queryKey: ["igp-infinite"] }),
      ])

      const previousIgp = queryClient.getQueryData<IgpWithRelations>([
        "igp",
        id,
      ])
      const previousIgpList = queryClient.getQueryData(["igp"])
      const previousIgpInfinite = queryClient.getQueryData(["igp-infinite"])

      queryClient.setQueriesData<PaginatedIgpResponse>(
        { queryKey: ["igp"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((igp) => igp.id !== id),
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
        { queryKey: ["igp-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter((igp: IgpWithRelations) => igp.id !== id),
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

      return {
        previousIgp,
        previousIgpList,
        previousIgpInfinite,
      }
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["igp", id] })
    },
    onError: (error, _variables, context) => {
      if (context?.previousIgp) {
        queryClient.setQueryData(["igp", id], context.previousIgp)
      }
      if (context?.previousIgpList) {
        queryClient.setQueryData(["igp"], context.previousIgpList)
      }
      if (context?.previousIgpInfinite) {
        queryClient.setQueryData(["igp-infinite"], context.previousIgpInfinite)
      }
      catchError(error)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["igps"] })
      queryClient.invalidateQueries({ queryKey: ["igp", id] })
      queryClient.invalidateQueries({ queryKey: ["igp-infinite"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      router.refresh()
    },
  })
}
