"use client"

import { Edit, Eye, MoreHorizontal, Printer, Trash2 } from "lucide-react"
import { useRouter } from "next-nprogress-bar"
import toast from "react-hot-toast"
import { useSession } from "@/components/context/session"
import { Button } from "@/components/ui/buttons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import { useDeleteRent } from "@/backend/actions/locker-rental/delete-rent"
import { useFindRentById } from "@/backend/actions/locker-rental/find-by-id"
import { useFindAccountById } from "@/backend/actions/user/find-by-id"
import { LockerRental } from "@/backend/db/schemas"
import { useConfirm } from "@/hooks/use-confirm"
import { useDialog } from "@/hooks/use-dialog"
import { LockerRentalWithLocker } from "@/interfaces/locker"
import { catchError } from "@/utils/catch-error"

interface ActionMenuProps {
  rental: LockerRental
}

export const ActionMenu = ({ rental }: ActionMenuProps) => {
  const router = useRouter()
  const deleteRental = useDeleteRent(rental.id)
  const session = useSession()
  const confirm = useConfirm()
  const { onOpen } = useDialog()
  const { data: completeRental, isLoading } = useFindRentById(rental.id)
  const currentUser = useFindAccountById(session.userId)

  const handleViewDetails = () => {
    router.push(`/locker-rental/${rental.lockerId}`)
  }

  const handleEdit = () => {
    router.push(`/locker-rental/${rental.lockerId}`)
  }

  const handlePrintReceipt = () => {
    const rentalWithLocker =
      completeRental || (rental as LockerRentalWithLocker)
    onOpen("printRentalAgreementReceipt", {
      rental: rentalWithLocker,
      currentUser: currentUser.data,
    })
  }

  const handleDelete = async () => {
    const confirmed = await confirm(
      "Delete Rental",
      `Are you sure you want to delete this rental for ${rental.renterName}? This action cannot be undone.`,
    )

    if (confirmed) {
      await toast.promise(deleteRental.mutateAsync(), {
        loading: <span className="animate-pulse">Deleting rental...</span>,
        success: "Rental deleted successfully",
        error: (error) => catchError(error),
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
            className="mr-2 size-8"
            disabled={deleteRental.isPending}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
          <DropdownMenuItem className="text-xs" onClick={handleViewDetails}>
            <Eye className="mr-2 h-3.5 w-3.5" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs" onClick={handleEdit}>
            <Edit className="mr-2 h-3.5 w-3.5" />
            Edit rental
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onClick={handlePrintReceipt}
            disabled={isLoading}
          >
            <Printer className="mr-2 h-3.5 w-3.5" />
            Print receipt
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 text-xs"
            onClick={handleDelete}
            disabled={deleteRental.isPending}
          >
            <Trash2
              className={`mr-2 h-3.5 w-3.5 ${deleteRental.isPending ? "animate-pulse" : ""}`}
            />
            {deleteRental.isPending ? "Deleting..." : "Delete rental"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
