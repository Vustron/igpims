"use client"

import { useDeleteWaterFund } from "@/backend/actions/water-fund/delete-fund"
import { WaterFundWithVendoLocation } from "@/backend/actions/water-fund/find-by-id"
import { Button } from "@/components/ui/buttons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import { useConfirm } from "@/hooks/use-confirm"
import { useDialog } from "@/hooks/use-dialog"
import { catchError } from "@/utils/catch-error"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

interface WaterFundActionsProps {
  fund: WaterFundWithVendoLocation
}

export const WaterFundActions = ({ fund }: WaterFundActionsProps) => {
  const { onOpen } = useDialog()
  const confirm = useConfirm()
  const deleteWaterFund = useDeleteWaterFund(fund.id)

  const handleDelete = async () => {
    const confirmed = confirm(
      "Delete Water Fund",
      "Are you sure you want to delete this water fund? This action cannot be undone.",
    )

    if (await confirmed) {
      await toast.promise(deleteWaterFund.mutateAsync(), {
        loading: <span className="animate-pulse">Deleting water fund...</span>,
        success: "Water fund deleted",
        error: (error: unknown) => catchError(error),
      })
    }
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-slate-100"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onOpen("editWaterFund", { waterFund: fund })}
            className="text-xs"
          >
            <Edit className="mr-2 h-3.5 w-3.5" />
            Edit Fund
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 text-xs"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete Fund
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
