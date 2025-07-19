"use client"

import { useDeleteIgpTransaction } from "@/backend/actions/igp-transaction/delete-igp-transaction"
import { IgpTransactionWithIgp } from "@/backend/actions/igp-transaction/find-many"
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

export const IgpTransactionAction = ({
  igp,
}: { igp: IgpTransactionWithIgp }) => {
  const deleteExpenseTransaction = useDeleteIgpTransaction(igp?.id!)
  const confirm = useConfirm()
  const { onOpen } = useDialog()

  const handleEdit = () => {
    onOpen("editIgpTransaction", { igpTransaction: igp })
  }

  const handleDelete = async () => {
    const confirmed = await confirm(
      "Delete igp transaction",
      "Are you sure you want to delete this igp transaction? This action cannot be undone.",
    )

    if (confirmed) {
      await toast.promise(deleteExpenseTransaction.mutateAsync(), {
        loading: (
          <span className="animate-pulse">Deleting igp transaction...</span>
        ),
        success: "Igp transaction deleted successfully",
        error: (error) => catchError(error),
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
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
            Edit Transaction
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handleDelete}
          >
            <Trash2Icon className="mr-2 h-3.5 w-3.5" />
            Delete Transaction
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
