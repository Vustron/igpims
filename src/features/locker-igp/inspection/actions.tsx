"use client"

import { FilePen, MoreHorizontal, Trash2 } from "lucide-react"
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
import { useDeleteInspection } from "@/backend/actions/inspection/delete-inspection"
import { Inspection } from "@/backend/db/schemas"
import { useConfirm } from "@/hooks/use-confirm"
import { useDialog } from "@/hooks/use-dialog"
import { catchError } from "@/utils/catch-error"

export const InspectionActions = ({
  inspection,
}: {
  inspection: Inspection
}) => {
  const { onOpen } = useDialog()
  const deleteInspection = useDeleteInspection(inspection.id!)
  const confirm = useConfirm()

  const handleEdit = () => {
    onOpen("editInspection", { inspection })
  }

  const handleDelete = async () => {
    const confirmed = confirm(
      "Delete Inspection",
      "Are you sure you want to delete this inspection? This action cannot be undone.",
    )

    if (await confirmed) {
      await toast.promise(deleteInspection.mutateAsync(), {
        loading: <span className="animate-pulse">Deleting inspection...</span>,
        success: "Inspection deleted",
        error: (error: unknown) => catchError(error),
      })
    }
  }

  return (
    <div className="flex justify-end">
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
            Edit Inspection
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete Inspection
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
