"use client"

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialogs/dialog"
import {
  Drawer,
  DrawerTitle,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawers"
import {
  X,
  Eye,
  Check,
  FileText,
  AlertTriangle,
  ClipboardCheck,
} from "lucide-react"
import { Textarea } from "@/components/ui/inputs"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"

import { useFundRequestStore } from "@/features/fund-request/fund-request-store"
import { isFundRequestData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState } from "react"
import { format } from "date-fns"

export const ValidateExpenseDialog = () => {
  const { type, data, isOpen, onOpen, onClose } = useDialog()
  const {
    getRequestById,
    approveRequest,
    rejectRequest,
    getExpensesByRequestId,
    updateExpenseStatus,
  } = useFundRequestStore()
  const [validationNotes, setValidationNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [isRejecting, setIsRejecting] = useState(false)
  const [individualRejectionReasons, setIndividualRejectionReasons] = useState<{
    [key: string]: string
  }>({})
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "validateExpense"
  const request =
    isFundRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const expenses = request ? getExpensesByRequestId(request.id) : []

  const handleValidateExpense = (expenseId: string) => {
    if (request) {
      updateExpenseStatus(
        request.id,
        expenseId,
        "validated",
        "System Validator",
      )
    }
  }

  const handleRejectExpense = (expenseId: string, reason?: string) => {
    if (request) {
      const rejectionReason =
        reason || individualRejectionReasons[expenseId] || "Invalid expense"
      updateExpenseStatus(
        request.id,
        expenseId,
        "rejected",
        undefined,
        rejectionReason,
      )
    }
  }

  const handleValidateAll = () => {
    if (request) {
      // Validate all pending expenses
      expenses.forEach((expense) => {
        if (expense.status === "pending") {
          updateExpenseStatus(
            request.id,
            expense.id,
            "validated",
            "System Validator",
          )
        }
      })

      // Move request to validated status
      const finalNotes = validationNotes.trim()
        ? `All expenses validated. ${validationNotes}`
        : "All expenses validated."

      approveRequest(request.id, finalNotes)
      onClose()
      resetForm()
    }
  }

  const handleRejectAll = () => {
    if (request && rejectionReason.trim()) {
      // Reject all pending expenses first
      expenses.forEach((expense) => {
        if (expense.status === "pending") {
          updateExpenseStatus(
            request.id,
            expense.id,
            "rejected",
            undefined,
            rejectionReason,
          )
        }
      })

      // Then reject the entire request
      rejectRequest(request.id, rejectionReason, 8)
      onClose()
      resetForm()
    }
  }

  const resetForm = () => {
    setValidationNotes("")
    setRejectionReason("")
    setIsRejecting(false)
    setIndividualRejectionReasons({})
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

  if (!request) return null

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const validatedExpenses = expenses.filter((exp) => exp.status === "validated")
  const pendingExpenses = expenses.filter((exp) => exp.status === "pending")
  const rejectedExpenses = expenses.filter((exp) => exp.status === "rejected")

  const utilizationPercentage =
    request.allocatedFunds > 0
      ? Math.round((totalExpenses / request.allocatedFunds) * 100)
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
              <Title className="font-bold text-gray-900 text-xl">
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
                className="bg-white px-3 py-1 font-medium text-sm"
              >
                Request ID: {request.id}
              </Badge>
            </div>
          </div>
        </Header>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-8 p-8">
            {/* Enhanced Expense Summary */}
            <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100/50 p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900 text-lg">
                Fund Utilization Summary
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="font-medium text-green-700 text-sm">
                    Total Expenses
                  </p>
                  <p className="mt-1 font-bold text-2xl text-green-800">
                    {formatCurrency(totalExpenses)}
                  </p>
                  <p className="mt-1 text-green-600 text-xs">
                    Sum of all submitted expenses
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="font-medium text-green-700 text-sm">
                    Allocated Funds
                  </p>
                  <p className="mt-1 font-bold text-2xl text-green-800">
                    {formatCurrency(request.allocatedFunds || request.amount)}
                  </p>
                  <p className="mt-1 text-green-600 text-xs">
                    Originally approved amount
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="font-medium text-green-700 text-sm">
                    Utilization Rate
                  </p>
                  <p
                    className={`mt-1 font-bold text-2xl ${
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
                  <p className="font-medium text-green-700 text-sm">
                    Expense Items
                  </p>
                  <p className="mt-1 font-bold text-2xl text-green-800">
                    {expenses.length}
                  </p>
                  <p className="mt-1 text-green-600 text-xs">
                    Total expense entries
                  </p>
                </div>
              </div>
            </div>

            {/* Expense Status Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h4 className="mb-3 font-medium text-base text-gray-900">
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
                  <h3 className="font-semibold text-gray-900 text-xl">
                    Expense Details
                  </h3>
                  <p className="mt-1 text-gray-600 text-sm">
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
                {expenses.length > 0 ? (
                  expenses.map((expense, index) => (
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
                            className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm ${
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
                            <h4 className="font-semibold text-gray-900 text-lg">
                              {expense.expenseName}
                            </h4>
                            <p className="text-gray-500 text-sm">
                              ID: {expense.id}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-xl">
                            {formatCurrency(expense.amount)}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {format(new Date(expense.date), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="space-y-2">
                          <p className="font-medium text-gray-600 text-sm">
                            Expense Details
                          </p>
                          <div className="rounded-lg bg-gray-50 p-3">
                            <p className="font-medium text-gray-900 text-sm">
                              {expense.expenseName}
                            </p>
                            <p className="text-gray-600 text-xs">
                              Date:{" "}
                              {format(
                                new Date(expense.date),
                                "EEEE, MMMM d, yyyy",
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="font-medium text-gray-600 text-sm">
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
                                  onClick={() =>
                                    onOpen("printRentalAgreementReceipt")
                                  }
                                >
                                  <Eye className="h-3 w-3" />
                                  View Receipt
                                </Button>
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">
                                No receipt uploaded
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="font-medium text-gray-600 text-sm">
                            Actions
                          </p>
                          <div className="flex gap-2">
                            {expense.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleValidateExpense(expense.id)
                                  }
                                  className="gap-1 bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-3 w-3" />
                                  Validate
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleRejectExpense(expense.id)
                                  }
                                  className="gap-1 border-red-200 text-red-700 hover:bg-red-50"
                                >
                                  <X className="h-3 w-3" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {expense.status === "validated" && (
                              <Badge className="bg-green-100 px-3 py-1 text-green-800">
                                <Check className="mr-1 h-3 w-3" />
                                Validated by {expense.validatedBy}
                              </Badge>
                            )}
                            {expense.status === "rejected" && (
                              <Badge className="bg-red-100 px-3 py-1 text-red-800">
                                <X className="mr-1 h-3 w-3" />
                                Rejected
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
                            <p className="font-medium text-red-800 text-sm">
                              Rejection Reason:
                            </p>
                            <p className="text-red-700 text-sm">
                              {expense.rejectionReason}
                            </p>
                          </div>
                        )}
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-gray-300 border-dashed bg-gray-50/50 p-12 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="mt-4 font-medium text-gray-900 text-lg">
                      No expenses submitted
                    </h4>
                    <p className="mt-2 text-gray-500 text-sm">
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
                  <h4 className="mb-3 font-semibold text-gray-900 text-lg">
                    Validation Notes
                  </h4>
                  <p className="mb-4 text-gray-600 text-sm">
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
                  <h4 className="mb-3 font-semibold text-lg text-red-800">
                    Rejection Reason
                  </h4>
                  <p className="mb-4 text-red-600 text-sm">
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
                <span className="font-medium text-lg">
                  Total: {formatCurrency(totalExpenses)}
                </span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-600">
                  {formatCurrency(request.allocatedFunds || request.amount)}
                </span>
              </div>
              <Badge variant="outline" className="bg-white px-3 py-1">
                {expenses.length} expense item{expenses.length !== 1 ? "s" : ""}
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
                    disabled={expenses.length === 0}
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
