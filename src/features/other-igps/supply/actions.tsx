"use client"

import { useDeleteIgpSupply } from "@/backend/actions/igp-supply/delete-igp-supply"
import { IgpSupply } from "@/backend/db/schemas"
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
import { MoreHorizontal, Pencil, Trash2Icon } from "lucide-react"
import toast from "react-hot-toast"

export const SupplyActions = ({ supply }: { supply: IgpSupply }) => {
  const deleteExpenseTransaction = useDeleteIgpSupply(supply?.id!)
  const confirm = useConfirm()
  const { onOpen } = useDialog()

  const handleEdit = () => {
    onOpen("editIgpSupply", { igpSupply: supply })
  }

  const handleDelete = async () => {
    const confirmed = await confirm(
      "Delete igp supply",
      "Are you sure you want to delete this igp supply? This action cannot be undone.",
    )

    if (confirmed) {
      await toast.promise(deleteExpenseTransaction.mutateAsync(), {
        loading: <span className="animate-pulse">Deleting igp supply...</span>,
        success: "Igp supply deleted successfully",
        error: (error) => catchError(error),
      })
    }
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0 mr-5">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[170px]">
          <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handleEdit}
          >
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Edit Supply
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handleDelete}
          >
            <Trash2Icon className="mr-2 h-3.5 w-3.5" />
            Delete Supply
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
