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
import { formatDateFromTimestamp } from "@/utils/date-convert"
import { Calendar, DollarSign } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

export const DisburseFundsDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const [disbursementNotes, setDisbursementNotes] = useState("")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const fundRequest =
    data && "fundRequest" in data
      ? (data.fundRequest as FundRequestWithUser)
      : null

  const { mutateAsync: updateRequest, isPending } = useUpdateFundRequest(
    fundRequest?.id || "",
  )

  const handleDisburse = async () => {
    try {
      await toast.promise(
        updateRequest({
          status: "disbursed",
          notes: disbursementNotes,
          disbursementDate: new Date().toISOString(),
          currentStep: fundRequest?.currentStep
            ? fundRequest.currentStep + 1
            : 5,
        }),
        {
          loading: "Processing fund disbursement...",
          success: "Funds disbursed successfully",
          error: (error) => catchError(error),
        },
      )
      onClose()
      setDisbursementNotes("")
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

  const isDialogOpen = isOpen && type === "disburseFunds"

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
            <DollarSign className="h-5 w-5 text-indigo-600" />
            <Title>Disburse Funds</Title>
          </div>
          <Description>
            Process the fund disbursement to the requestor.
          </Description>
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
                    {formatDateFromTimestamp(fundRequest.requestDate)}
                  </p>
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-600 text-sm">Date Needed</p>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <p className="text-sm">
                    {fundRequest.dateNeeded
                      ? formatDateFromTimestamp(fundRequest.dateNeeded)
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Disbursement Notes */}
          <div className="mt-4">
            <span className="mb-2 block font-medium text-gray-700 text-sm">
              Disbursement Notes (Optional)
            </span>
            <Textarea
              placeholder="Add any notes about this disbursement..."
              value={disbursementNotes}
              onChange={(e) => setDisbursementNotes(e.target.value)}
              rows={3}
              disabled={isPending}
            />
          </div>
        </div>

        <Footer className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleDisburse} disabled={isPending}>
            Confirm Disbursement
          </Button>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
