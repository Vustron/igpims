import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { Inspection } from "@/validation/inspection"
import { PaginatedInspectionsResponse } from "./find-many"

export async function deleteInspection(id: string) {
  return api.delete<Inspection>("inspections/delete-inspection", {
    params: { id },
  })
}

export const useDeleteInspection = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["delete-inspection", id],
    mutationFn: async () => {
      return await deleteInspection(id)
    },
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["inspections"] }),
        queryClient.cancelQueries({ queryKey: ["inspection", id] }),
        queryClient.cancelQueries({ queryKey: ["inspections-infinite"] }),
      ])

      const previousInspection = queryClient.getQueryData<Inspection>([
        "inspection",
        id,
      ])
      const previousInspections = queryClient.getQueryData(["inspections"])
      const previousInspectionsInfinite = queryClient.getQueryData([
        "inspections-infinite",
      ])

      queryClient.setQueriesData<PaginatedInspectionsResponse>(
        { queryKey: ["inspections"] },
        (oldData) => {
          if (!oldData?.data) return oldData

          return {
            ...oldData,
            data: oldData.data.filter((inspection) => inspection.id !== id),
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
        { queryKey: ["inspections-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              data: page.data.filter(
                (inspection: Inspection) => inspection.id !== id,
              ),
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
        previousInspection,
        previousInspections,
        previousInspectionsInfinite,
      }
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["inspection", id] })
    },
    onError: (error, _variables, context) => {
      if (context?.previousInspection) {
        queryClient.setQueryData(["inspection", id], context.previousInspection)
      }
      if (context?.previousInspections) {
        queryClient.setQueryData(["inspections"], context.previousInspections)
      }
      if (context?.previousInspectionsInfinite) {
        queryClient.setQueryData(
          ["inspections-infinite"],
          context.previousInspectionsInfinite,
        )
      }
      catchError(error)
    },
    onSettled: () => {
      router.refresh()
    },
  })
}
