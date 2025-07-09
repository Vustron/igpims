"use client"

import { useCreateWaterFund } from "@/backend/actions/water-fund/create-fund"
import { useFindManyWaterVendos } from "@/backend/actions/water-vendo/find-many"
import { DynamicForm } from "@/components/ui/forms"
import { FieldConfig } from "@/interfaces/form"
import { catchError } from "@/utils/catch-error"
import {
  CreateWaterFundData,
  createWaterFundSchema,
} from "@/validation/water-fund"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

interface CreateWaterFundFormProps {
  onSuccess?: () => void
  onError?: () => void
}

export const CreateWaterFundForm = ({
  onSuccess,
  onError,
}: CreateWaterFundFormProps) => {
  const createWaterFund = useCreateWaterFund()
  const { data: vendosResponse, isLoading: isLoadingForm } =
    useFindManyWaterVendos({ limit: 100 })

  const form = useForm<CreateWaterFundData>({
    resolver: zodResolver(createWaterFundSchema),
    defaultValues: {
      waterVendoId: "",
      waterVendoLocation: "",
      waterFundsExpenses: 0,
      waterFundsRevenue: 0,
      waterFundsProfit: 0,
      weekFund: Date.now(),
      dateFund: Date.now(),
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

  const createWaterFundFields: FieldConfig<CreateWaterFundData>[] = [
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

  const onSubmit = async (values: CreateWaterFundData) => {
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
      await toast.promise(createWaterFund.mutateAsync(submissionData), {
        loading: <span className="animate-pulse">Creating water fund...</span>,
        success: "Successfully created a water fund record",
        error: (error: unknown) => catchError(error),
      })
      form.reset()
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
        fields={createWaterFundFields}
        mutation={createWaterFund}
        submitButtonTitle="Create Water Fund"
        disabled={isLoadingForm}
      />
    </div>
  )
}
