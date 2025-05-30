"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdowns"
import {
  Mail,
  RefreshCw,
  Settings2,
  PlusCircle,
  PrinterIcon,
} from "lucide-react"
import { Button } from "@/components/ui/buttons"
import { motion } from "framer-motion"
// import toast from "react-hot-toast"

import { useDialog } from "@/hooks/use-dialog"

import type { Table } from "@tanstack/react-table"

interface TableActionsProps<TData> {
  isIgp?: boolean
  isLockerRental?: boolean
  onRefetch: () => void
  isFetching: boolean
  table: Table<TData>
  isUser?: boolean
}

export function TableActions<TData>({
  isIgp,
  isLockerRental,
  onRefetch,
  isFetching,
  table,
  isUser,
}: TableActionsProps<TData>) {
  const { onOpen } = useDialog()

  return (
    <div className="flex flex-wrap items-center gap-2">
      {(isIgp || isLockerRental) && (
        <motion.div
          key="email-button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            size="sm"
            variant="outline"
            className="font-normal text-xs shadow-xs"
            onClick={() => onOpen("sendEmailLockerViolation")}
          >
            <Mail className="mr-2 h-4 w-4" />
            {isLockerRental ? "Send locker violations" : "Send email"}
          </Button>
        </motion.div>
      )}

      <motion.div
        key="print-button"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <Button
          size="sm"
          variant="outline"
          className="font-normal text-xs shadow-xs"
          onClick={() => onOpen("printRentalAgreementReceipt")}
        >
          <PrinterIcon className="mr-2 h-4 w-4" />
          Print
        </Button>
      </motion.div>

      {(isLockerRental || isUser) && (
        <motion.div
          key="add-rent-button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            size="sm"
            variant="outline"
            className="font-normal text-xs shadow-xs"
            onClick={() => onOpen(isUser ? "createUser" : "createRent")}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isUser ? "Create user" : "Create rent"}
          </Button>
        </motion.div>
      )}

      <motion.div
        key="refresh-button"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={onRefetch}
          disabled={isFetching}
        >
          <RefreshCw
            className={`mr-1 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      <motion.div
        key="view-button"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, delay: 0.15 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="font-normal text-xs shadow-xs"
            >
              <Settings2 className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    </div>
  )
}
