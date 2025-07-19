"use client"

import { useDeleteExpenseTransaction } from "@/backend/actions/expense-transaction/delete-expense"
import { ExpenseTransactionWithRequestor } from "@/backend/actions/expense-transaction/find-many"
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
import { FilePen, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"

export const Actions = ({
  transaction,
}: {
  transaction: ExpenseTransactionWithRequestor
}) => {
  const deleteExpenseTransaction = useDeleteExpenseTransaction(transaction?.id!)
  const confirm = useConfirm()
  const { onOpen } = useDialog()

  const handleEdit = () => {
    onOpen("editExpense", { expenseTransaction: transaction })
  }

  const handleDelete = async () => {
    const confirmed = await confirm(
      "Delete transaction",
      "Are you sure you want to delete this expense transaction? This action cannot be undone.",
    )

    if (confirmed) {
      await toast.promise(deleteExpenseTransaction.mutateAsync(), {
        loading: (
          <span className="animate-pulse">Deleting expense transaction...</span>
        ),
        success: "Expense transaction deleted successfully",
        error: (error) => catchError(error),
      })
    }
  }

  const handleReject = async () => {
    const confirmed = await confirm(
      "Reject fund request",
      "Are you sure you want to reject this fund request? This action cannot be undone.",
    )

    if (confirmed) {
      onOpen("rejectReason", { expenseTransaction: transaction })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onClick={handleEdit}
        >
          <FilePen className="mr-2 h-3.5 w-3.5" />
          Edit Transaction
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onClick={handleReject}
        >
          <FilePen className="mr-2 h-3.5 w-3.5" />
          Reject Fund Request
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onClick={handleDelete}
        >
          <Trash className="mr-2 h-3.5 w-3.5" />
          Delete Record
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
