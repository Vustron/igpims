"use client"

import { FilePen, MoreHorizontal, Trash } from "lucide-react"
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
import { useDeleteViolation } from "@/backend/actions/violation/delete-violation"
import { ViolationWithRenters } from "@/backend/actions/violation/find-many"
import { useDialog } from "@/hooks/use-dialog"
import { catchError } from "@/utils/catch-error"

export const ViolationActions = ({
  violation,
}: {
  violation: ViolationWithRenters
}) => {
  const deleteViolation = useDeleteViolation(violation?.id!)
  const { onOpen } = useDialog()

  const handleEdit = () => {
    onOpen("editViolation", { violation })
  }

  const handleDelete = async () => {
    await toast.promise(deleteViolation.mutateAsync(), {
      loading: (
        <span className="animate-pulse">Deleting violation record...</span>
      ),
      success: "Violation record deleted successfully",
      error: (error) => catchError(error),
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-xs"
          onClick={handleEdit}
        >
          <FilePen className="mr-2 h-3.5 w-3.5" />
          Edit Violation
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
