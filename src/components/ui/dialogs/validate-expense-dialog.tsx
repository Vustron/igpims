"use client"

import { FundRequestWithUser } from "@/backend/actions/fund-request/find-by-id"
import { useUpdateFundRequest } from "@/backend/actions/fund-request/update-fund-request"
import { Badge } from "@/components/ui/badges"
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
import {
  AlertTriangle,
  Check,
  ClipboardCheck,
  Eye,
  FileText,
  X,
} from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

export const ValidateExpenseDialog = () => {
  const { type, data, isOpen, onClose } = useDialog()
  const [validationNotes, setValidationNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [individualRejectionReasons, setIndividualRejectionReasons] = useState<{
    [key: string]: string
  }>({})
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const fundRequest =
    data && "fundRequest" in data
      ? (data.fundRequest as FundRequestWithUser)
      : null

  const { mutateAsync: updateRequest } = useUpdateFundRequest(
    fundRequest?.id || "",
  )

  const handleValidateAll = async () => {
    try {
      await toast.promise(
        updateRequest({
          status: "validated",
          notes: validationNotes.trim()
            ? `All expenses validated. ${validationNotes}`
            : "All expenses validated",
          validationDate: new Date().toISOString(),
          currentStep: fundRequest?.currentStep
            ? fundRequest.currentStep + 1
            : 8,
        }),
        {
          loading: "Validating all expenses...",
          success: "All expenses validated successfully!",
          error: (error) => catchError(error),
        },
      )
      onClose()
      setValidationNotes("")
    } catch (error) {
      catchError(error)
    }
  }

  const handleRejectAll = async () => {
    if (!rejectionReason.trim()) return

    try {
      await toast.promise(
        updateRequest({
          status: "rejected",
          isRejected: true,
          rejectionReason,
          rejectionStep: fundRequest?.currentStep || 8,
          currentStep: fundRequest?.currentStep || 8,
        }),
        {
          loading: "Rejecting all expenses...",
          success: "All expenses rejected",
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

  const handleIndividualRejectionReasonChange = (
    expenseId: string,
    reason: string,
  ) => {
    setIndividualRejectionReasons((prev) => ({
      ...prev,
      [expenseId]: reason,
    }))
  }

  const isDialogOpen = isOpen && type === "validateExpense"

  if (!isDialogOpen || !fundRequest || !fundRequest.expenses) return null

  const totalExpenses = fundRequest.expenses.reduce(
    (sum, exp) => sum + exp.amount,
    0,
  )
  const validatedExpenses = fundRequest.expenses.filter(
    (exp) => exp.status === "validated",
  )
  const pendingExpenses = fundRequest.expenses.filter(
    (exp) => exp.status === "pending",
  )
  const rejectedExpenses = fundRequest.expenses.filter(
    (exp) => exp.status === "rejected",
  )

  const utilizationPercentage =
    fundRequest.allocatedFunds > 0
      ? Math.round((totalExpenses / fundRequest.allocatedFunds) * 100)
      : 0

  const DialogContent_Component = isDesktop ? Dialog : Drawer
  const Content = isDesktop ? DialogContent : DrawerContent
  const Header = isDesktop ? DialogHeader : DrawerHeader
  const Title = isDesktop ? DialogTitle : DrawerTitle
  const Description = isDesktop ? DialogDescription : DrawerDescription
  const Footer = isDesktop ? DialogFooter : DrawerFooter

  return (
    <DialogContent_Component open={isDialogOpen} onOpenChange={onClose}>
      <Content
        className={
          isDesktop
            ? "flex max-h-[95vh] min-w-[1000px] max-w-[1200px] flex-col overflow-hidden"
            : "flex max-h-[95vh] flex-col overflow-hidden"
        }
      >
        <Header className="flex-shrink-0 border-b bg-gradient-to-r from-green-50 to-emerald-100/50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 rounded-xl bg-green-100 p-3 shadow-sm">
              <ClipboardCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <Title className="text-xl font-bold text-gray-900">
                Validate Expenses
              </Title>
              <Description className="mt-1 text-base text-gray-600">
                Review and validate the submitted expense receipts and
                utilization for accurate fund tracking.
              </Description>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="bg-white px-3 py-1 text-sm font-medium"
              >
                Request ID: {fundRequest.id}
              </Badge>
            </div>
          </div>
        </Header>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-8 p-8">
            {/* Enhanced Expense Summary */}
            <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100/50 p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Fund Utilization Summary
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-green-700">
                    Total Expenses
                  </p>
                  <p className="mt-1 text-2xl font-bold text-green-800">
                    {formatCurrency(totalExpenses)}
                  </p>
                  <p className="mt-1 text-xs text-green-600">
                    Sum of all submitted expenses
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-green-700">
                    Allocated Funds
                  </p>
                  <p className="mt-1 text-2xl font-bold text-green-800">
                    {formatCurrency(
                      fundRequest.allocatedFunds || fundRequest.amount,
                    )}
                  </p>
                  <p className="mt-1 text-xs text-green-600">
                    Originally approved amount
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-green-700">
                    Utilization Rate
                  </p>
                  <p
                    className={`mt-1 text-2xl font-bold ${
                      utilizationPercentage > 100
                        ? "text-red-600"
                        : "text-indigo-600"
                    }`}
                  >
                    {utilizationPercentage}%
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full transition-all duration-300 ${
                        utilizationPercentage > 100
                          ? "bg-red-500"
                          : "bg-indigo-500"
                      }`}
                      style={{
                        width: `${Math.min(utilizationPercentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="text-sm font-medium text-green-700">
                    Expense Items
                  </p>
                  <p className="mt-1 text-2xl font-bold text-green-800">
                    {fundRequest.expenses.length}
                  </p>
                  <p className="mt-1 text-xs text-green-600">
                    Total expense entries
                  </p>
                </div>
              </div>
            </div>

            {/* Expense Status Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="mb-3 text-base font-medium text-gray-900">
                Validation Status
              </h4>
              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="outline"
                  className="bg-green-50 px-4 py-2 text-green-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Validated: {validatedExpenses.length}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-amber-50 px-4 py-2 text-amber-700"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Pending: {pendingExpenses.length}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-red-50 px-4 py-2 text-red-700"
                >
                  <X className="mr-2 h-4 w-4" />
                  Rejected: {rejectedExpenses.length}
                </Badge>
              </div>
            </div>

            {/* Enhanced Expense List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Expense Details
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Review each expense item and validate or reject as needed
                  </p>
                </div>
                {pendingExpenses.length > 0 && (
                  <Button
                    onClick={handleValidateAll}
                    size="sm"
                    className="gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4" />
                    Validate All Pending
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {fundRequest.expenses.length > 0 ? (
                  fundRequest.expenses.map((expense, index) => (
                    <div
                      key={expense.id}
                      className={`rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${
                        expense.status === "validated"
                          ? "border-green-200 bg-green-50"
                          : expense.status === "rejected"
                            ? "border-red-200 bg-red-50"
                            : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                              expense.status === "validated"
                                ? "bg-green-100 text-green-600"
                                : expense.status === "rejected"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {expense.expenseName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              ID: {expense.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(expense.amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(expense.date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Expense Details
                          </p>
                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-sm font-medium text-gray-900">
                              {expense.expenseName}
                            </p>
                            <p className="text-xs text-gray-600">
                              Date:{" "}
                              {format(
                                new Date(expense.date),
                                "EEEE, MMMM d, yyyy",
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Receipt
                          </p>
                          <div className="rounded-lg bg-gray-50 p-3">
                            {expense.receipt ? (
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 gap-1"
                                >
                                  <Eye className="h-3 w-3" />
                                  View Receipt
                                </Button>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                No receipt uploaded
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-600">
                            Status
                          </p>
                          <div className="flex gap-2">
                            {expense.status === "validated" && (
                              <Badge className="bg-green-100 px-3 py-1 text-green-800">
                                <Check className="mr-1 h-3 w-3" />
                                Validated
                              </Badge>
                            )}
                            {expense.status === "rejected" && (
                              <Badge className="bg-red-100 px-3 py-1 text-red-800">
                                <X className="mr-1 h-3 w-3" />
                                Rejected
                              </Badge>
                            )}
                            {expense.status === "pending" && (
                              <Badge className="bg-amber-100 px-3 py-1 text-amber-800">
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Individual rejection reason input for pending expenses */}
                      {expense.status === "pending" && (
                        <div className="mt-4">
                          <Textarea
                            placeholder="Optional: Add rejection reason for this expense..."
                            value={individualRejectionReasons[expense.id] || ""}
                            onChange={(e) =>
                              handleIndividualRejectionReasonChange(
                                expense.id,
                                e.target.value,
                              )
                            }
                            rows={2}
                            className="w-full resize-none border-gray-300 focus:border-red-400 focus:ring-red-200"
                          />
                        </div>
                      )}

                      {expense.status === "rejected" &&
                        expense.rejectionReason && (
                          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="text-sm font-medium text-red-800">
                              Rejection Reason:
                            </p>
                            <p className="text-sm text-red-700">
                              {expense.rejectionReason}
                            </p>
                          </div>
                        )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="mt-4 text-lg font-medium text-gray-900">
                      No expenses submitted
                    </h4>
                    <p className="mt-2 text-sm text-gray-500">
                      No expense records found for this fund request
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Notes Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              {!isRejecting ? (
                <div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
                    Validation Notes
                  </h4>
                  <p className="mb-4 text-sm text-gray-600">
                    Add any comments or observations about the expense
                    validation (optional)
                  </p>
                  <Textarea
                    placeholder="Add validation comments, recommendations, or observations..."
                    value={validationNotes}
                    onChange={(e) => setValidationNotes(e.target.value)}
                    rows={4}
                    className="w-full resize-none border-gray-300 focus:border-green-400 focus:ring-green-200"
                  />
                </div>
              ) : (
                <div>
                  <h4 className="mb-3 text-lg font-semibold text-red-800">
                    Rejection Reason
                  </h4>
                  <p className="mb-4 text-sm text-red-600">
                    Please provide a detailed reason for rejecting all expenses
                    *
                  </p>
                  <Textarea
                    placeholder="Specify the reason for rejection (e.g., insufficient documentation, improper expenses, policy violations)..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    className="w-full resize-none border-red-300 focus:border-red-500 focus:ring-red-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer className="flex-shrink-0 border-t bg-gray-50/50 px-8 py-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-gray-700">
                <span className="text-lg font-medium">
                  Total: {formatCurrency(totalExpenses)}
                </span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-600">
                  {formatCurrency(
                    fundRequest.allocatedFunds || fundRequest.amount,
                  )}
                </span>
              </div>
              <Badge variant="outline" className="bg-white px-3 py-1">
                {fundRequest.expenses.length} expense
                {fundRequest.expenses.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <div className="flex gap-4">
              {!isRejecting ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsRejecting(true)}
                    size="lg"
                    className="px-8"
                    disabled={fundRequest.expenses.length === 0}
                  >
                    Reject All Expenses
                  </Button>
                  <Button
                    onClick={handleValidateAll}
                    disabled={pendingExpenses.length === 0}
                    size="lg"
                    className="bg-green-600 px-8 hover:bg-green-700"
                  >
                    Validate All & Complete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsRejecting(false)}
                    size="lg"
                    className="px-8"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRejectAll}
                    disabled={!rejectionReason.trim()}
                    size="lg"
                    className="px-8"
                  >
                    Reject All Expenses
                  </Button>
                </>
              )}
            </div>
          </div>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
