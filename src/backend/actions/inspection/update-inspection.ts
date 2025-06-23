import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { Inspection, InspectionSchema } from "@/validation/inspection"
import { PaginatedInspectionsResponse } from "./find-many"

export async function updateInspection(
  id: string,
  payload: Partial<Inspection>,
): Promise<Inspection> {
  return api.patch<Partial<Inspection>, Inspection>(
    "inspections/update-inspection",
    payload,
    {
      params: { id },
    },
  )
}

export const useUpdateInspection = (id: string) => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["update-inspection", id],
    mutationFn: async (payload: Partial<Inspection>) => {
      const sanitizedData = sanitizer<Partial<Inspection>>(
        payload,
        InspectionSchema.partial(),
      )
      return await updateInspection(id, sanitizedData)
    },
    onMutate: async (updatedData) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["inspection", id] }),
        queryClient.cancelQueries({ queryKey: ["inspections"] }),
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

      if (previousInspection) {
        const optimisticInspection: Inspection = {
          ...previousInspection,
          ...updatedData,
        }

        queryClient.setQueryData(["inspection", id], optimisticInspection)

        queryClient.setQueriesData<PaginatedInspectionsResponse>(
          { queryKey: ["inspections"] },
          (oldData: any) => {
            if (!oldData?.data) return oldData

            return {
              ...oldData,
              data: oldData.data.map((inspection: any) =>
                inspection.id === id ? optimisticInspection : inspection,
              ),
            }
          },
        )

        queryClient.setQueriesData(
          { queryKey: ["inspections-infinite"] },
          (oldData: any) => {
            if (!oldData?.pages) return oldData
            return {
              ...oldData,
              pages: oldData.pages.map(
                (page: PaginatedInspectionsResponse) => ({
                  ...page,
                  data: page.data.map((inspection) =>
                    inspection.id === id ? optimisticInspection : inspection,
                  ),
                }),
              ),
            }
          },
        )
      }

      return {
        previousInspection,
        previousInspections,
        previousInspectionsInfinite,
      }
    },
    onSuccess: (updatedInspection: Inspection) => {
      queryClient.setQueryData(["inspection", id], updatedInspection)

      queryClient.setQueriesData<PaginatedInspectionsResponse>(
        { queryKey: ["inspections"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData
          return {
            ...oldData,
            data: oldData.data.map((inspection: any) =>
              inspection.id === id ? updatedInspection : inspection,
            ),
          }
        },
      )

      queryClient.setQueriesData(
        { queryKey: ["inspections-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page: PaginatedInspectionsResponse) => ({
              ...page,
              data: page.data.map((inspection) =>
                inspection.id === id ? updatedInspection : inspection,
              ),
            })),
          }
        },
      )
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
