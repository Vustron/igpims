"use client"

import { FundRequestWithUser } from "@/backend/actions/fund-request/find-by-id"
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
import { Calendar, FileSearch } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

export const ReviewFundRequestDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const [reviewComments, setReviewComments] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const fundRequest =
    data && "fundRequest" in data
      ? (data.fundRequest as FundRequestWithUser)
      : null

  const { mutateAsync: updateRequest } = useUpdateFundRequest(
    fundRequest?.id || "",
  )

  const handleApprove = async () => {
    try {
      await toast.promise(
        updateRequest({
          status: "in_review",
          reviewerComments: reviewComments,
          currentStep: fundRequest?.currentStep
            ? fundRequest.currentStep + 1
            : 2,
        }),
        {
          loading: "Approving fund request...",
          success: "Fund request approved for checking",
          error: (error) => catchError(error),
        },
      )
      onClose()
      setReviewComments("")
      setIsRejecting(false)
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
          rejectionStep: fundRequest?.currentStep || 1,
          currentStep: fundRequest?.currentStep || 1,
        }),
        {
          loading: "Rejecting fund request...",
          success: "Fund request rejected",
          error: (error) => catchError(error),
        },
      )
      onClose()
      setRejectionReason("")
      setIsRejecting(false)
    } catch (error) {
      catchError(error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const isDialogOpen = isOpen && type === "reviewFundRequest"

  if (!isDialogOpen || !fundRequest) return null

  const DialogContent_Component = isDesktop ? Dialog : Drawer
  const Content = isDesktop ? DialogContent : DrawerContent
  const Header = isDesktop ? DialogHeader : DrawerHeader
  const Title = isDesktop ? DialogTitle : DrawerTitle
  const Description = isDesktop ? DialogDescription : DrawerDescription
  const Footer = isDesktop ? DialogFooter : DrawerFooter

  return (
    <DialogContent_Component open={isDialogOpen} onOpenChange={onClose}>
      <Content className={isDesktop ? "max-w-2xl" : ""}>
        <Header>
          <div className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-blue-600" />
            <Title>Review Fund Request</Title>
          </div>
          <Description>
            Review the fund request details and approve or reject the request.
          </Description>
        </Header>

        <div className="space-y-4 p-6">
          {/* Request Details */}
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

          {/* Review Comments */}
          {!isRejecting ? (
            <div>
              <span className="mb-2 block font-medium text-gray-700 text-sm">
                Review Comments (Optional)
              </span>
              <Textarea
                placeholder="Add any comments about this review..."
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                rows={3}
              />
            </div>
          ) : (
            <div>
              <span className="mb-2 block font-medium text-red-700 text-sm">
                Rejection Reason *
              </span>
              <Textarea
                placeholder="Please provide a reason for rejection..."
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
                Reject Request
              </Button>
              <Button onClick={handleApprove}>
                Approve & Move to Checking
              </Button>
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
