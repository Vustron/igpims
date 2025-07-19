"use client"

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
import { isExpenseTransactionData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { catchError } from "@/utils/catch-error"
import { useRouter } from "next-nprogress-bar"
import { useState } from "react"
import toast from "react-hot-toast"

export const RejectReasonDialog = () => {
  const { onClose, isOpen, type, data } = useDialog()
  const isDialogOpen = isOpen && type === "rejectReason"
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [rejectionReason, setRejectionReason] = useState("")
  const router = useRouter()

  const updateFundRequest = useUpdateFundRequest(
    isExpenseTransactionData(data) && data.expenseTransaction
      ? data.expenseTransaction.requestId
      : "",
  )

  const handleClose = () => {
    onClose()
    setRejectionReason("")
  }

  if (
    !isDialogOpen ||
    !isExpenseTransactionData(data) ||
    !data.expenseTransaction
  ) {
    return null
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason")
      return
    }

    await toast.promise(
      updateFundRequest.mutateAsync({
        status: "rejected",
        isRejected: true,
        rejectionStep: 8,
        rejectionReason: rejectionReason,
      }),
      {
        loading: (
          <span className="animate-pulse">Rejecting fund request...</span>
        ),
        success: "Fund request rejected successfully",
        error: (error) => catchError(error),
      },
    )
    if (updateFundRequest.isSuccess) {
      router.push("/fund-request")
    }
    handleClose()
  }

  const DialogContent_Component = isDesktop ? Dialog : Drawer
  const Content = isDesktop ? DialogContent : DrawerContent
  const Header = isDesktop ? DialogHeader : DrawerHeader
  const Title = isDesktop ? DialogTitle : DrawerTitle
  const Description = isDesktop ? DialogDescription : DrawerDescription
  const Footer = isDesktop ? DialogFooter : DrawerFooter

  return (
    <DialogContent_Component open={isDialogOpen} onOpenChange={handleClose}>
      <Content
        className={isDesktop ? "max-h-[95vh] max-w-4xl overflow-y-auto" : ""}
      >
        <Header>
          <Title>Reject Fund Request</Title>
          <Description>
            Please provide a reason for rejecting this fund request.
          </Description>
        </Header>

        <div className="p-6">
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            className="w-full"
            rows={5}
          />
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleReject} disabled={!rejectionReason.trim()}>
            Submit Rejection
          </Button>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
