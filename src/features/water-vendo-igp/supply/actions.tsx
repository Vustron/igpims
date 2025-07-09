"use client"

import { FileEdit, MoreHorizontal, TrashIcon } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/buttons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import { useDeleteWaterSupply } from "@/backend/actions/water-supply/delete-water-supply"
import { WaterSupplyWithVendoLocation } from "@/backend/actions/water-supply/find-by-id"
import { useConfirm } from "@/hooks/use-confirm"
import { useDialog } from "@/hooks/use-dialog"
import { catchError } from "@/utils/catch-error"

interface ActionsProps {
  supply: WaterSupplyWithVendoLocation
}

export const Actions = ({ supply }: ActionsProps) => {
  const { onOpen } = useDialog()
  const confirm = useConfirm()
  const deleteWaterVendo = useDeleteWaterSupply(supply.id)

  const handleDelete = async () => {
    const confirmed = confirm(
      "Delete Water Supply",
      "Are you sure you want to delete this water supply? This action cannot be undone.",
    )

    if (await confirmed) {
      await toast.promise(deleteWaterVendo.mutateAsync(), {
        loading: (
          <span className="animate-pulse">Deleting water supply...</span>
        ),
        success: "Water supply deleted",
        error: (error: unknown) => catchError(error),
      })
    }
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onOpen("editWaterSupply", { waterSupply: supply })}
          >
            <FileEdit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <TrashIcon className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
