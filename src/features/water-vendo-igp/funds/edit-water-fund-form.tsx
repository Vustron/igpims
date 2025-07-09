"use client"

import { WaterFundWithVendoLocation } from "@/backend/actions/water-fund/find-by-id"
import { useUpdateWaterFund } from "@/backend/actions/water-fund/update-fund"
import { useFindManyWaterVendos } from "@/backend/actions/water-vendo/find-many"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  UpdateWaterFundData,
  updateWaterFundSchema,
} from "@/validation/water-fund"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface EditWaterFundFormProps {
  initialData: WaterFundWithVendoLocation
  onSuccess?: () => void
  onError?: () => void
}

export const EditWaterFundForm = ({
  initialData,
  onSuccess,
  onError,
}: EditWaterFundFormProps) => {
  const updateWaterFund = useUpdateWaterFund(initialData.id)
  const { data: vendosResponse, isLoading: isLoadingForm } =
    useFindManyWaterVendos({ limit: 100 })
  console.log(initialData)

  const convertTimestampToDate = (timestamp: number) => {
    return new Date(timestamp * 1000)
  }

  const form = useForm<UpdateWaterFundData>({
    resolver: zodResolver(updateWaterFundSchema),
    defaultValues: {
      waterVendoId: initialData.waterVendoId,
      waterVendoLocation: initialData.waterVendoLocation,
      waterFundsExpenses: initialData.waterFundsExpenses,
      waterFundsRevenue: initialData.waterFundsRevenue,
      waterFundsProfit: initialData.waterFundsProfit,
      // @ts-ignore
      dateFund: convertTimestampToDate(initialData.dateFund),
      // @ts-ignore
      weekFund: convertTimestampToDate(initialData.weekFund),
    },
  })

  const [waterVendoId, expenses, revenue, dateFund] = form.watch([
    "waterVendoId",
    "waterFundsExpenses",
    "waterFundsRevenue",
    "dateFund",
  ])

  const profit = useMemo(() => {
    const exp = Number(expenses) || 0
    const rev = Number(revenue) || 0
    return rev - exp
  }, [expenses, revenue])

  useEffect(() => {
    form.setValue("waterFundsProfit", profit)
  }, [profit, form])

  useEffect(() => {
    if (waterVendoId && vendosResponse?.data) {
      const selectedVendo = vendosResponse.data.find(
        (v) => v.id === waterVendoId,
      )
      if (selectedVendo) {
        form.setValue("waterVendoLocation", selectedVendo.waterVendoLocation)
      }
    }
  }, [waterVendoId, vendosResponse?.data, form])

  useEffect(() => {
    if (dateFund) {
      const date = new Date(dateFund)
      const weekFundDate = new Date(date)
      weekFundDate.setDate(date.getDate() + 6)
      form.setValue("weekFund", weekFundDate.getTime())
    }
  }, [dateFund, form])

  const editWaterFundFields: FieldConfig<UpdateWaterFundData>[] = [
    {
      name: "waterVendoId",
      type: "select",
      label: "Water Vendo Location",
      placeholder: "Select water vendo",
      required: true,
      options:
        vendosResponse?.data?.map((v) => ({
          value: v.id,
          label: v.waterVendoLocation,
        })) ?? [],
    },
    {
      name: "dateFund",
      type: "date",
      label: "Fund Date",
      placeholder: "Select fund date",
      required: true,
    },
    {
      name: "weekFund",
      type: "date",
      label: "Week of Fund",
      placeholder: "Select week of fund",
      required: true,
    },
    {
      name: "waterFundsRevenue",
      type: "currency",
      label: "Revenue",
      placeholder: "Enter revenue",
      required: true,
    },
  ]

  const onSubmit = async (values: UpdateWaterFundData) => {
    const selectedVendo = vendosResponse?.data?.find(
      (v) => v.id === values.waterVendoId,
    )

    const submissionData = {
      ...values,
      waterVendoLocation: selectedVendo?.waterVendoLocation || "",
      dateFund: new Date(values.dateFund).setHours(0, 0, 0, 0),
      weekFund: new Date(values.weekFund).setHours(0, 0, 0, 0),
      waterFundsProfit: profit,
    }

    try {
      await toast.promise(updateWaterFund.mutateAsync(submissionData), {
        loading: <span className="animate-pulse">Updating water fund...</span>,
        success: "Successfully updated water fund record",
        error: (error: unknown) => catchError(error),
      })
      onSuccess?.()
    } catch (error) {
      onError?.()
    }
  }

  if (isLoadingForm) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="w-[450px]">
      <DynamicForm
        form={form}
        onSubmit={onSubmit}
        fields={editWaterFundFields}
        mutation={updateWaterFund}
        submitButtonTitle="Update Water Fund"
        disabled={isLoadingForm}
      />
    </div>
  )
}
