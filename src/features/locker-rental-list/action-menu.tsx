"use client"

import {
  Ban,
  Eye,
  Edit,
  Trash2,
  Printer,
  ClipboardCopy,
  MoreHorizontal,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdowns"
import { Button } from "@/components/ui/buttons"

import { useRouter } from "next-nprogress-bar"

import type { LockerRental } from "@/schemas/drizzle-schema"

interface ActionMenuProps {
  rental: LockerRental
}

export const ActionMenu = ({ rental }: ActionMenuProps) => {
  const router = useRouter()

  const handleViewDetails = () => {
    router.push(`/locker-rental/${rental.lockerId}`)
  }

  const handleEdit = () => {
    router.push(`/locker-rental/${rental.lockerId}`)
  }

  const handlePrint = () => {
    console.log("Print receipt for rental:", rental.id)
    // Implement print functionality
  }

  const handleCancel = () => {
    console.log("Cancel rental:", rental.id)
    // Implement cancel functionality
  }

  const handleDelete = () => {
    console.log("Delete rental:", rental.id)
    // Implement delete functionality
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuLabel className="text-xs">Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(rental.id)}
            className="text-xs"
          >
            <ClipboardCopy className="mr-2 h-3.5 w-3.5" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-xs" onClick={handleViewDetails}>
            <Eye className="mr-2 h-3.5 w-3.5" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs" onClick={handleEdit}>
            <Edit className="mr-2 h-3.5 w-3.5" />
            Edit rental
          </DropdownMenuItem>
          <DropdownMenuItem className="text-xs" onClick={handlePrint}>
            <Printer className="mr-2 h-3.5 w-3.5" />
            Print receipt
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {rental.rentalStatus === "active" && (
            <DropdownMenuItem
              className="text-amber-600 text-xs"
              onClick={handleCancel}
            >
              <Ban className="mr-2 h-3.5 w-3.5" />
              Cancel rental
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-red-600 text-xs"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Delete rental
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
