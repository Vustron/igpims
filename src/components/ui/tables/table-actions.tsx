"use client"

import { ExpenseTransactionWithRequestor } from "@/backend/actions/expense-transaction/find-many"
import { useUpdateFundRequest } from "@/backend/actions/fund-request/update-fund-request"
import { IgpSupplyWithRelations } from "@/backend/actions/igp-supply/find-by-id"
import { ViolationWithRenters } from "@/backend/actions/violation/find-many"
import { Button } from "@/components/ui/buttons"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import { useConfirm } from "@/hooks/use-confirm"
import { useDialog } from "@/hooks/use-dialog"
import { catchError } from "@/utils/catch-error"
import { Table } from "@tanstack/react-table"
import { motion } from "framer-motion"
import { FileCheck, Mail, PlusCircle, RefreshCw, Settings2 } from "lucide-react"
import { useRouter } from "next-nprogress-bar"
import toast from "react-hot-toast"

interface TableActionsProps<TData> {
  isIgp?: boolean
  isLockerRental?: boolean
  onRefetch: () => void
  isFetching: boolean
  table: Table<TData>
  tableData: TData[]
  isUser?: boolean
  isOnViolations?: boolean
  isOnInspection?: boolean
  isOnWaterSupply?: boolean
  isOnWaterFund?: boolean
  isOnExpense?: boolean
  isBudgetFullyUtilized?: boolean
  requestId?: string
  isOnIgpTransaction?: boolean
  isOnIgpSupplies?: boolean
}

export function TableActions<TData>({
  isIgp,
  isLockerRental,
  onRefetch,
  isFetching,
  table,
  tableData,
  isUser,
  isOnViolations,
  isOnInspection,
  isOnWaterSupply,
  isOnWaterFund,
  isOnExpense,
  isBudgetFullyUtilized,
  requestId,
  isOnIgpTransaction,
  isOnIgpSupplies,
}: TableActionsProps<TData>) {
  const { onOpen } = useDialog()
  const hasExpenseTransactions = tableData.length > 0
  const fundRequestData = tableData[0] as
    | ExpenseTransactionWithRequestor
    | undefined
  const igpSupplyData = tableData[0] as IgpSupplyWithRelations | undefined
  const confirm = useConfirm()
  const updateFundRequest = useUpdateFundRequest(
    fundRequestData?.requestId || "",
  )
  const router = useRouter()
  const isReceipted = fundRequestData?.requestData?.status === "receipted"
  const isValidated = tableData.every(
    (transaction) =>
      (transaction as ExpenseTransactionWithRequestor).status === "validated",
  )
  const isFundRequestValidated =
    fundRequestData?.requestData?.status === "validated"

  const handleConfirmSubmittedReceipt = async () => {
    if (!fundRequestData) return

    const confirmed = await confirm(
      isReceipted ? "Confirm validated receipts" : "Confirm submitted receipts",
      isReceipted
        ? "Are you sure you want to confirm these submitted receipts? This action cannot be undone."
        : "Are you sure you want to confirm these validated receipts? This action cannot be undone.",
    )
    if (confirmed) {
      await toast.promise(
        updateFundRequest.mutateAsync({
          id: fundRequestData.requestId,
          status: isReceipted ? "validated" : "receipted",
          currentStep: 8,
        }),
        {
          loading: isReceipted
            ? "Confirming validated receipts..."
            : "Confirming submitted receipts...",
          success: isReceipted
            ? "Validated receipts confirmed successfully"
            : "Submitted receipts confirmed successfully",
          error: (error) => catchError(error),
        },
      )
      router.push("/fund-request")
    }
  }

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
            onClick={() => onOpen("sendEmailLockerRent")}
          >
            <Mail className="mr-2 h-4 w-4" />
            {isLockerRental ? "Send email" : "Send locker violations"}
          </Button>
        </motion.div>
      )}

      {isOnExpense && !isFundRequestValidated && (
        <motion.div
          key="confirm-submit-reciept-button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            size="sm"
            variant="outline"
            className="font-normal text-xs shadow-xs"
            onClick={handleConfirmSubmittedReceipt}
            disabled={!hasExpenseTransactions || (isReceipted && !isValidated)}
          >
            <FileCheck />
            {isValidated
              ? "Confirm all validated receipts"
              : isReceipted
                ? "Validate receipts first"
                : "Confirm submitted receipts"}
          </Button>
        </motion.div>
      )}

      {(isLockerRental ||
        isUser ||
        isOnViolations ||
        isOnInspection ||
        isOnWaterSupply ||
        isOnWaterFund ||
        isOnIgpTransaction ||
        isOnIgpSupplies ||
        (isOnExpense && !isBudgetFullyUtilized)) && (
        <motion.div
          key="add-button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            size="sm"
            variant="outline"
            className="font-normal text-xs shadow-xs"
            onClick={() =>
              onOpen(
                isUser
                  ? "createUser"
                  : isOnViolations
                    ? "createViolation"
                    : isOnInspection
                      ? "createInspection"
                      : isOnWaterSupply
                        ? "createWaterSupply"
                        : isOnWaterFund
                          ? "createWaterFund"
                          : isOnExpense
                            ? "createExpense"
                            : isOnIgpTransaction
                              ? "createIgpTransaction"
                              : isOnIgpSupplies
                                ? "createIgpSupply"
                                : "createRent",
                isOnViolations
                  ? {
                      violation: tableData[0] as ViolationWithRenters,
                    }
                  : isOnExpense
                    ? {
                        requestId: requestId,
                      }
                    : isOnIgpSupplies
                      ? {
                          requestId: igpSupplyData?.igpId,
                        }
                      : undefined,
              )
            }
            disabled={isOnExpense && isBudgetFullyUtilized}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isUser
              ? "Create user"
              : isOnViolations
                ? "Create violation"
                : isOnInspection
                  ? "Create inspection"
                  : isOnWaterSupply
                    ? "Create water supply"
                    : isOnWaterFund
                      ? "Create water fund"
                      : isOnExpense
                        ? "Create expense"
                        : isOnIgpTransaction
                          ? "Create IGP transaction"
                          : isOnIgpSupplies
                            ? "Create igp supply"
                            : "Create rent"}
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
          className="font-normal text-xs"
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
