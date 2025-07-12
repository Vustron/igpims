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
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { catchError } from "@/utils/catch-error"
import { format } from "date-fns"
import { Calendar, Loader2, PiggyBank } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

export const CheckFundsDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const [notes, setNotes] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const fundRequest =
    data && "fundRequest" in data
      ? (data.fundRequest as FundRequestWithUser)
      : null

  const { mutateAsync: updateRequest } = useUpdateFundRequest(
    fundRequest?.id || "",
  )
  const { data: fundRequestData, isLoading } = useFindFundRequestById(
    fundRequest?.id || "",
  )

  const handleApprove = async () => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <DialogContent_Component open={isDialogOpen} onOpenChange={onClose}>
      <Content className={isDesktop ? "max-w-2xl" : ""}>
        <Header>
          <div className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-purple-600" />
            <Title>Check Available Funds</Title>
          </div>
          <Description>
            Verify fund availability and allocate the appropriate amount.
          </Description>
          <div className="mt-2 -mb-5 w-full text-center font-bold">
            Current IGP Funds:{" "}
            {isLoading
              ? "Loading..."
              : fundRequestData?.profitData?.totalRevenue !== undefined
                ? formatCurrency(fundRequestData.profitData.totalRevenue)
                : "N/A"}
          </div>
        </Header>

        <div className="p-6">
          {/* Request Summary */}
          <div className="rounded-lg border bg-gray-50 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-600 text-sm">Request ID</p>
                <p className="font-mono text-sm">{fundRequest.id}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Purpose</p>
                <p className="text-sm">{fundRequest.purpose}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Amount</p>
                <p className="font-semibold text-green-600 text-sm">
                  {formatCurrency(fundRequest.amount)}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Requestor</p>
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
                    {format(new Date(fundRequest.requestDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Date Needed</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    {fundRequest.dateNeeded
                      ? format(new Date(fundRequest.dateNeeded), "MMM d, yyyy")
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!isRejecting ? (
            <div>
              <span className="mt-2 mb-2 block font-medium text-gray-700 text-sm">
                Allocation Notes (Optional)
              </span>
              <Textarea
                placeholder="Add any notes about this allocation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          ) : (
            <div>
              <span className="mt-2 mb-2 block font-medium text-red-700 text-sm">
                Rejection Reason *
              </span>
              <Textarea
                placeholder="Please provide a reason for rejection (e.g., insufficient funds)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="border-red-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
          )}
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          {!isRejecting ? (
            <>
              <Button variant="outline" onClick={() => setIsRejecting(true)}>
                Reject - Insufficient Funds
              </Button>
              <Button onClick={handleApprove}>Approve Fund Allocation</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsRejecting(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Request
              </Button>
            </>
          )}
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
