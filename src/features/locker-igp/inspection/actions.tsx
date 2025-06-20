"use client"

import {
  Eye,
  FilePen,
  Printer,
  ClipboardCopy,
  MoreHorizontal,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdowns"
import { Button } from "@/components/ui/buttons"

import type { Inspection } from "@/validation/inspection"

export const InspectionActions = ({
  inspection,
}: {
  inspection: Inspection
}) => {
  const handleView = () => {
    console.log("View inspection:", inspection.id)
  }

  const handleEdit = () => {
    console.log("Edit inspection:", inspection.id)
  }

  const handlePrint = () => {
    console.log("Print inspection:", inspection.id)
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
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={() => navigator.clipboard.writeText(inspection.id)}
          >
            <ClipboardCopy className="mr-2 h-3.5 w-3.5" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handleView}
          >
            <Eye className="mr-2 h-3.5 w-3.5" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handleEdit}
          >
            <FilePen className="mr-2 h-3.5 w-3.5" />
            Edit Violation
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handlePrint}
          >
            <Printer className="mr-2 h-3.5 w-3.5" />
            Print Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
