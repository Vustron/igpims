"use client"

import { format } from "date-fns"
import { AlertTriangle, Calendar, DollarSign } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
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
import { useFundRequestStore } from "@/features/fund-request/fund-request-store"
import { isFundRequestData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const DeleteFundRequestDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const { getRequestById, deleteRequest } = useFundRequestStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "deleteFundRequest"
  const request =
    isFundRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const handleDelete = async () => {
    if (!request) return

    setIsDeleting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      deleteRequest(request.id)
      toast.success(`Fund request ${request.id} deleted successfully`)
      onClose()
    } catch (error) {
      toast.error("Failed to delete fund request")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (!request) return null

  const DialogContent_Component = isDesktop ? Dialog : Drawer
  const Content = isDesktop ? DialogContent : DrawerContent
  const Header = isDesktop ? DialogHeader : DrawerHeader
  const Title = isDesktop ? DialogTitle : DrawerTitle
  const Description = isDesktop ? DialogDescription : DrawerDescription
  const Footer = isDesktop ? DialogFooter : DrawerFooter

  return (
    <DialogContent_Component open={isDialogOpen} onOpenChange={onClose}>
      <Content className={isDesktop ? "h-[90vh] max-w-md overflow-y-auto" : ""}>
        <Header>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <Title>Delete Fund Request</Title>
          </div>
          <Description>
            Are you sure you want to delete this fund request? This action
            cannot be undone.
          </Description>
        </Header>

        <div className="space-y-4">
          {/* Request Details */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="space-y-2">
              <div>
                <p className="font-medium text-red-800 text-sm">Request ID</p>
                <p className="font-mono text-red-900 text-sm">{request.id}</p>
              </div>
              <div>
                <p className="font-medium text-red-800 text-sm">Purpose</p>
                <p className="text-red-900 text-sm">{request.purpose}</p>
              </div>
              <div>
                <p className="font-medium text-red-800 text-sm">Requestor</p>
                <p className="text-red-900 text-sm">{request.requestor}</p>
              </div>
              <div>
                <p className="font-medium text-red-800 text-sm">Amount</p>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-red-600" />
                  <p className="font-semibold text-red-900 text-sm">
                    {formatCurrency(request.amount)}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-red-800 text-sm">
                  Date Submitted
                </p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-red-600" />
                  <p className="text-red-900 text-sm">
                    {format(new Date(request.requestDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-red-800 text-sm">
                  Current Status
                </p>
                <p className="text-red-900 text-sm capitalize">
                  {request.status.replace("_", " ")}
                </p>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800 text-sm">Warning</p>
                <p className="mt-1 text-amber-700 text-xs">
                  This will permanently delete the fund request and all
                  associated data including any expense transactions. This
                  action cannot be reversed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Request"}
          </Button>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
