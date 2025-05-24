"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/cards"
import { Loader2, ArrowLeft, Trash2 } from "lucide-react"
import { DynamicForm } from "@/components/ui/forms"
import { Button } from "@/components/ui/buttons"
import { PiLockers } from "react-icons/pi"

import { useDeleteLockerById } from "@/backend/actions/locker/delete-by-id"
import { useUpdateLocker } from "@/backend/actions/locker/update-locker"
import { useFindLockerById } from "@/backend/actions/locker/find-by-id"
import { useConfirm } from "@/hooks/use-confirm"
import { useRouter } from "next-nprogress-bar"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { catchError } from "@/utils/catch-error"
import { lockerSchema } from "@/schemas/locker"
import toast from "react-hot-toast"

import type { FieldConfig } from "@/interfaces/form"
import type { Locker } from "@/schemas/locker"

export const LockerInfo = ({ id }: { id: string }) => {
  const router = useRouter()
  const { data: locker, error: lockerError } = useFindLockerById(id)
  const updateLocker = useUpdateLocker(id)
  const deleteLocker = useDeleteLockerById(id)
  const confirm = useConfirm()

  const form = useForm<Locker>({
    resolver: zodResolver(lockerSchema),
    defaultValues: {
      lockerLocation: locker?.lockerLocation || "",
      lockerStatus: locker?.lockerStatus || "available",
      lockerType:
        (locker?.lockerType as "small" | "medium" | "large" | "extra-large") ||
        "small",
      lockerName: locker?.lockerName || "",
      lockerRentalPrice: locker?.lockerRentalPrice || 0,
    },
  })

  const lockerFields: FieldConfig<Locker>[] = [
    {
      name: "lockerName",
      label: "Locker Name",
      type: "text",
      placeholder: "Enter the locker name",
    },
    {
      name: "lockerLocation",
      label: "Location",
      type: "text",
      placeholder: "Enter the locker location",
    },
    {
      name: "lockerType",
      label: "Size Type",
      type: "select",
      placeholder: "Select the locker type",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
        { value: "extra-large", label: "Extra Large" },
      ],
    },
    {
      name: "lockerStatus",
      label: "Status",
      type: "select",
      placeholder: "Select the locker status",
      options: [
        { value: "available", label: "Available" },
        { value: "occupied", label: "Occupied" },
        { value: "reserved", label: "Reserved" },
        { value: "maintenance", label: "Under Maintenance" },
        { value: "out-of-service", label: "Out of Service" },
      ],
    },
    {
      name: "lockerRentalPrice",
      label: "Rental Price",
      type: "currency",
      placeholder: "Enter the locker rental price",
      description: "Price per semester for renting this locker",
    },
  ]

  const handleSubmit = async (values: Locker) => {
    await toast.promise(updateLocker.mutateAsync(values), {
      loading: (
        <span className="animate-pulse">Updating locker information...</span>
      ),
      success: "Locker information updated successfully",
      error: (error: unknown) => catchError(error),
    })
  }

  const handleDelete = async () => {
    const confirmed = confirm(
      "Delete Locker",
      "Are you sure you want to delete this locker? This action cannot be undone.",
    )

    if (await confirmed) {
      await toast.promise(deleteLocker.mutateAsync(), {
        loading: <span className="animate-pulse">Deleting locker...</span>,
        success: "Locker deleted successfully",
        error: (error: unknown) => catchError(error),
      })
    }
  }

  const goBack = () => router.back()
  const isLoading = !locker && !lockerError

  if (isLoading) {
    return (
      <Card className="mx-auto w-full max-w-4xl p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
          <p className="font-medium text-lg text-muted-foreground">
            Loading locker information...
          </p>
        </div>
      </Card>
    )
  }

  if (lockerError) {
    return (
      <Card className="mx-auto w-full max-w-4xl p-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <PiLockers className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mb-2 font-medium text-lg">
            Failed to load locker information
          </h3>
          <p className="mb-6 text-muted-foreground">
            There was an error retrieving the locker data. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="border-b bg-muted/40 pb-8">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={goBack} className="mr-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteLocker.isPending}
            className="gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            {deleteLocker.isPending ? "Deleting..." : "Delete Locker"}
          </Button>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <PiLockers className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Locker Information</CardTitle>
              <CardDescription>
                ID: {id} {locker?.lockerName && `• ${locker.lockerName}`}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <DynamicForm
          form={form}
          fields={lockerFields}
          onSubmit={handleSubmit}
          mutation={updateLocker}
          submitButtonTitle="Save Changes"
          addCancelButton
          twoColumnLayout={true}
        />
      </CardContent>
    </Card>
  )
}
