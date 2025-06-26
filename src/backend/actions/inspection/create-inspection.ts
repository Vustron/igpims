import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next-nprogress-bar"
import { api } from "@/backend/helpers/api-client"
import { catchError } from "@/utils/catch-error"
import { sanitizer } from "@/utils/sanitizer"
import { Inspection, InspectionSchema } from "@/validation/inspection"
import { PaginatedInspectionsResponse } from "./find-many"

export async function createInspection(
  payload: Omit<Inspection, "id">,
): Promise<Inspection> {
  return api.post<typeof payload, Inspection>(
    "inspections/create-inspection",
    payload,
  )
}

export const useCreateInspection = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["create-inspection"],
    mutationFn: async (payload: Omit<Inspection, "id">) => {
      const sanitizedData = sanitizer<Omit<Inspection, "id">>(
        {
          ...payload,
        },
        InspectionSchema.omit({ id: true }),
      )
      return await createInspection(sanitizedData)
    },
    onMutate: async (newInspection) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["inspections"] }),
        queryClient.cancelQueries({ queryKey: ["inspections-infinite"] }),
      ])

      const previousInspections = queryClient.getQueryData(["inspections"])
      const previousInspectionsInfinite = queryClient.getQueryData([
        "inspections-infinite",
      ])

      const optimisticInspection: Inspection = {
        ...newInspection,
        id: `temp-${Date.now()}`,
      }

      queryClient.setQueriesData<PaginatedInspectionsResponse>(
        { queryKey: ["inspections"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          if (oldData.meta.page === 1) {
            const updatedData = [optimisticInspection, ...oldData.data]
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
        { queryKey: ["inspections-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = [...oldData.pages]
          if (updatedPages.length > 0 && updatedPages[0]?.data) {
            updatedPages[0] = {
              ...updatedPages[0],
              data: [optimisticInspection, ...updatedPages[0].data],
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
        previousInspections,
        previousInspectionsInfinite,
        optimisticInspection,
      }
    },
    onSuccess: (newInspection: Inspection, _variables, _context) => {
      queryClient.setQueryData(["inspection", newInspection.id], newInspection)
      console.log(newInspection)
      queryClient.setQueriesData<PaginatedInspectionsResponse>(
        { queryKey: ["inspections"] },
        (oldData: any) => {
          if (!oldData?.data) return oldData

          const filteredData = oldData.data.filter(
            (item: any) => !item.id.toString().startsWith("temp-"),
          )

          if (oldData.meta.page === 1) {
            const updatedData = [
              newInspection,
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
        { queryKey: ["inspections-infinite"] },
        (oldData: any) => {
          if (!oldData?.pages) return oldData

          const updatedPages = oldData.pages.map(
            (page: PaginatedInspectionsResponse) => {
              const filteredData = page.data.filter(
                (item) => !item.id.toString().startsWith("temp-"),
              )

              return {
                ...page,
                data:
                  page.meta.page === 1
                    ? [newInspection, ...filteredData]
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
