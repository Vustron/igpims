"use client"

import {
  FundRequestWithUser,
  useFindFundRequestById,
} from "@/backend/actions/fund-request/find-by-id"
import { useUpdateFundRequest } from "@/backend/actions/fund-request/update-fund-request"
import { Button } from "@/components/ui/buttons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogs/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawers"
import { Textarea } from "@/components/ui/inputs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/selects"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { catchError } from "@/utils/catch-error"
import { formatDateFromTimestamp } from "@/utils/date-convert"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, Calendar, Loader2, PiggyBank } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import VisuallyHiddenComponent from "../separators/visually-hidden"

export const CheckFundsDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const [notes, setNotes] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [showWarning, setShowWarning] = useState(false)
  const [budgetSource, setBudgetSource] = useState<string>("")
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const fundRequest =
    data && "fundRequest" in data
      ? (data.fundRequest as FundRequestWithUser)
      : null

  const { mutateAsync: updateRequest, isPending } = useUpdateFundRequest(
    fundRequest?.id || "",
  )
  const { data: fundRequestData, isLoading } = useFindFundRequestById(
    fundRequest?.id || "",
  )

  const isInsufficientFunds =
    (fundRequest?.amount ?? 0) > (fundRequestData?.profitData?.netProfit ?? 0)

  useEffect(() => {
    if (fundRequestData && fundRequest) {
      setShowWarning(isInsufficientFunds)
    }
  }, [fundRequestData, fundRequest])

  const handleApprove = async () => {
    if (isPending) return

    if (isInsufficientFunds) {
      toast.error("The amount requested exceeds the available budget")
      return
    }

    if (!budgetSource) {
      toast.error("Please select a budget source")
      return
    }

    try {
      await toast.promise(
        updateRequest({
          status: "checking",
          allocatedFunds: fundRequest?.amount,
          notes: notes,
          currentStep: 3,
        }),
        {
          loading: "Approving fund allocation...",
          success: "Funds allocated successfully",
          error: (error) => catchError(error),
        },
      )
      onClose()
      resetForm()
    } catch (error) {
      catchError(error)
    }
  }

  const handleReject = async () => {
    if (isPending) return
    if (!rejectionReason.trim()) return

    try {
      await toast.promise(
        updateRequest({
          status: "rejected",
          isRejected: true,
          rejectionReason,
          rejectionStep: 2,
          currentStep: 2,
        }),
        {
          loading: "Rejecting fund request...",
          success: "Fund request rejected",
          error: (error) => catchError(error),
        },
      )
      onClose()
      resetForm()
    } catch (error) {
      catchError(error)
    }
  }

  const resetForm = () => {
    setNotes("")
    setRejectionReason("")
    setIsRejecting(false)
    setBudgetSource("")
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const isDialogOpen = isOpen && type === "checkFunds"

  if (!isDialogOpen || !fundRequest) return null

  const DialogContent_Component = isDesktop ? Dialog : Drawer
  const Content = isDesktop ? DialogContent : DrawerContent
  const Header = isDesktop ? DialogHeader : DrawerHeader
  const Title = isDesktop ? DialogTitle : DrawerTitle
  const Description = isDesktop ? DialogDescription : DrawerDescription
  const Footer = isDesktop ? DialogFooter : DrawerFooter

  const hasFundsData =
    fundRequestData?.profitData?.netProfit !== undefined &&
    fundRequestData?.profitData?.netProfit !== null

  return (
    <DialogContent_Component open={isDialogOpen} onOpenChange={onClose}>
      <Content
        className={isDesktop ? "max-h-[95vh] max-w-4xl overflow-y-auto" : ""}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <VisuallyHiddenComponent>
              <div className="flex items-center gap-2">
                <Title>Check Available Funds</Title>
              </div>
              <Description>
                Verify fund availability and allocate the appropriate amount.
              </Description>
            </VisuallyHiddenComponent>
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <Header>
              <div className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-purple-600" />
                <Title>Check Available Funds</Title>
              </div>
              <Description>
                Verify fund availability and allocate the appropriate amount.
              </Description>

              <div className="mt-2 -mb-5 w-full text-center">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center"
                >
                  <span className="font-bold">
                    {!hasFundsData ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="size-8 animate-spin text-primary" />
                        <span className="ml-2">Loading funds data...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <span>
                          Current IGP Funds:{" "}
                          {formatCurrency(
                            fundRequestData?.profitData?.netProfit || 0,
                          )}
                        </span>
                        <span>
                          Allocated Funds:{" "}
                          {formatCurrency(fundRequest?.amount || 0)}
                        </span>
                      </div>
                    )}
                  </span>

                  <AnimatePresence>
                    {showWarning && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="mt-2 flex items-center gap-2 rounded-lg bg-yellow-100 px-3 py-2 text-yellow-800"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <span>Requested amount exceeds available funds!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </Header>

            <div className="p-6">
              {/* Request Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-lg border bg-gray-50 p-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-600 text-sm">
                      Request ID
                    </p>
                    <p className="font-mono text-sm">{fundRequest.id}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 text-sm">Purpose</p>
                    <p className="text-sm">{fundRequest.purpose}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 text-sm">Amount</p>
                    <motion.p
                      className="font-semibold text-sm"
                      animate={{
                        color: isInsufficientFunds ? "#dc2626" : "#16a34a",
                      }}
                    >
                      {formatCurrency(fundRequest.amount)}
                    </motion.p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 text-sm">
                      Requestor
                    </p>
                    <p className="text-sm">
                      {fundRequest.requestorData?.name || fundRequest.requestor}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 text-sm">
                      Date Requested
                    </p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <p className="text-sm">
                        {formatDateFromTimestamp(fundRequest.requestDate)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-600 text-sm">
                      Date Needed
                    </p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <p className="text-sm">
                        {formatDateFromTimestamp(fundRequest.dateNeeded)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Budget Source Selector */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mt-4"
              >
                <span className="mb-2 block font-medium text-gray-700 text-sm">
                  Budget Source *
                </span>
                <Select
                  value={budgetSource}
                  onValueChange={setBudgetSource}
                  disabled={isPending || isRejecting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select budget source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="locker">Locker</SelectItem>
                    <SelectItem value="water-vendo">Water Vendo</SelectItem>
                    <SelectItem value="igp">IGP</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {!isRejecting ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="mt-4 mb-2 block font-medium text-gray-700 text-sm">
                    Allocation Notes (Optional)
                  </span>
                  <Textarea
                    placeholder="Add any notes about this allocation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    disabled={isPending}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="mt-4 mb-2 block font-medium text-red-700 text-sm">
                    Rejection Reason *
                  </span>
                  <Textarea
                    placeholder="Please provide a reason for rejection (e.g., insufficient funds)..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    disabled={isPending}
                    className="border-red-300 focus:border-red-500 focus:ring-red-500"
                  />
                </motion.div>
              )}
            </div>

            <Footer className="flex flex-col gap-2 sm:flex-row">
              {!isRejecting ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setIsRejecting(true)}
                      disabled={isPending}
                      className={
                        isInsufficientFunds ? "bg-red-50 hover:bg-red-100" : ""
                      }
                    >
                      Reject - Insufficient Funds
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: isInsufficientFunds ? 1 : 1.03 }}
                    whileTap={{ scale: isInsufficientFunds ? 1 : 0.97 }}
                  >
                    <Button
                      onClick={handleApprove}
                      disabled={
                        isPending || isInsufficientFunds || !budgetSource
                      }
                      className={
                        isInsufficientFunds
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }
                    >
                      Approve Fund Allocation
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setIsRejecting(false)}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      variant="destructive"
                      onClick={handleReject}
                      disabled={!rejectionReason.trim() || isPending}
                    >
                      Reject Request
                    </Button>
                  </motion.div>
                </>
              )}
            </Footer>
          </>
        )}
      </Content>
    </DialogContent_Component>
  )
}
