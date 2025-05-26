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
  ReceiptText,
  AlertTriangle,
  Plus,
  Trash2,
  Eye,
  Calendar,
} from "lucide-react"
import { FileUpload } from "@/components/ui/inputs/file-upload"
import { Textarea } from "@/components/ui/inputs"
import { Button } from "@/components/ui/buttons"
import { Label } from "@/components/ui/labels"
import { Input } from "@/components/ui/inputs"
import { Badge } from "@/components/ui/badges"

import { useFundRequestStore } from "@/features/fund-request/fund-request-store"
import { isFundRequestData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState } from "react"

import { format } from "date-fns/format"
import toast from "react-hot-toast"

interface ExpenseEntry {
  expenseName: string
  amount: number
  date: Date
  receipt?: File
}

export const SubmitReceiptDialog = () => {
  const { type, data, isOpen, onOpen, onClose } = useDialog()
  const {
    getRequestById,
    approveRequest,
    updateUtilizedFunds,
    addExpenseTransaction,
  } = useFundRequestStore()
  const [expenses, setExpenses] = useState<ExpenseEntry[]>([])
  const [receiptNotes, setReceiptNotes] = useState("")
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const isDialogOpen = isOpen && type === "submitReceipt"
  const request =
    isFundRequestData(data) && data.requestId
      ? getRequestById(data.requestId)
      : null

  const addExpenseEntry = () => {
    setExpenses([
      ...expenses,
      {
        expenseName: "",
        amount: 0,
        date: new Date(),
      },
    ])
  }

  const removeExpenseEntry = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index))
  }

  const updateExpenseEntry = (
    index: number,
    field: keyof ExpenseEntry,
    value: any,
  ) => {
    setExpenses(
      expenses.map((expense, i) =>
        i === index ? { ...expense, [field]: value } : expense,
      ),
    )
  }

  const handleFileChange = (index: number, files: (File | string)[]) => {
    const file = files[0] as File
    if (file) {
      updateExpenseEntry(index, "receipt", file)
    }
  }

  const totalExpenseAmount = expenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0,
  )

  const handleSubmitReceipt = () => {
    if (request && expenses.length > 0) {
      // Validate that all expenses have required fields
      const invalidExpenses = expenses.filter(
        (expense) => !expense.expenseName.trim() || expense.amount <= 0,
      )

      if (invalidExpenses.length > 0) {
        toast.error("Please fill in all expense details")
        return
      }

      if (totalExpenseAmount > request.allocatedFunds) {
        toast.error("Total expenses cannot exceed allocated funds")
        return
      }

      // Add each expense transaction
      expenses.forEach((expense) => {
        return addExpenseTransaction(request.id, {
          expenseName: expense.expenseName,
          amount: expense.amount,
          date: expense.date,
          receipt: expense.receipt
            ? `receipt-${Date.now()}-${expense.expenseName}`
            : undefined,
          status: "pending",
        })
      })

      // Update utilized funds with total expense amount
      updateUtilizedFunds(request.id, totalExpenseAmount)

      // Move to next step
      const notes = `Expense receipts submitted. Total expenses: ${formatCurrency(totalExpenseAmount)}. Items: ${expenses.length} expense(s). ${receiptNotes ? `Notes: ${receiptNotes}` : ""}`

      approveRequest(request.id, notes)

      toast.success("Receipts and expenses submitted successfully!")

      onClose()
      resetForm()
    } else {
      toast.error("Please add at least one expense entry")
    }
  }

  const resetForm = () => {
    setExpenses([])
    setReceiptNotes("")
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

  const remainingFunds = request.allocatedFunds - totalExpenseAmount
  const utilizationPercentage = Math.round(
    (totalExpenseAmount / request.allocatedFunds) * 100,
  )

  return (
    <DialogContent_Component open={isDialogOpen} onOpenChange={onClose}>
      <Content
        className={
          isDesktop
            ? "flex max-h-[95vh] min-w-[1000px] max-w-[1100px] flex-col overflow-hidden"
            : "flex max-h-[95vh] flex-col overflow-hidden"
        }
      >
        <Header className="flex-shrink-0 border-b bg-gradient-to-r from-teal-50 to-teal-100/50 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 rounded-xl bg-teal-100 p-3 shadow-sm">
              <ReceiptText className="h-6 w-6 text-teal-600" />
            </div>
            <div className="min-w-0 flex-1">
              <Title className="font-bold text-gray-900 text-xl">
                Submit Expense Receipts
              </Title>
              <Description className="mt-1 text-base text-gray-600">
                Add detailed expense information and upload supporting receipts
                for the disbursed funds.
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
            {/* Enhanced Fund Summary */}
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900 text-lg">
                Fund Allocation Summary
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="font-medium text-gray-600 text-sm">
                    Allocated Funds
                  </p>
                  <p className="mt-1 font-bold text-2xl text-green-600">
                    {formatCurrency(request.allocatedFunds)}
                  </p>
                  <p className="mt-1 text-gray-500 text-xs">
                    Total approved amount
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="font-medium text-gray-600 text-sm">
                    Total Expenses
                  </p>
                  <p
                    className={`mt-1 font-bold text-2xl ${
                      totalExpenseAmount > request.allocatedFunds
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {formatCurrency(totalExpenseAmount)}
                  </p>
                  <p className="mt-1 text-gray-500 text-xs">
                    {expenses.length} expense item
                    {expenses.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="font-medium text-gray-600 text-sm">Remaining</p>
                  <p
                    className={`mt-1 font-bold text-2xl ${
                      remainingFunds < 0 ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    {formatCurrency(remainingFunds)}
                  </p>
                  <p className="mt-1 text-gray-500 text-xs">
                    {remainingFunds < 0 ? "Over budget" : "Within budget"}
                  </p>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="font-medium text-gray-600 text-sm">
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
              </div>
            </div>

            {/* Enhanced Expense Entries */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-xl">
                    Expense Details
                  </h3>
                  <p className="mt-1 text-gray-600 text-sm">
                    Add individual expense items with supporting documentation
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={addExpenseEntry}
                  className="gap-2 border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100"
                >
                  <Plus className="h-4 w-4" />
                  Add New Expense
                </Button>
              </div>

              {expenses.length === 0 && (
                <div className="rounded-xl border border-gray-300 border-dashed bg-gray-50/50 p-12 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <ReceiptText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="mt-4 font-medium text-gray-900 text-lg">
                    No expenses added yet
                  </h4>
                  <p className="mt-2 text-gray-500 text-sm">
                    Click "Add New Expense" to start adding your expense items
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {expenses.map((expense, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 font-semibold text-sm text-teal-600">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-lg">
                            Expense Item #{index + 1}
                          </h4>
                          <p className="text-gray-500 text-sm">
                            Fill in the details for this expense
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExpenseEntry(index)}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
                      <div className="space-y-3 lg:col-span-1">
                        <Label className="font-medium text-gray-700 text-sm">
                          Expense Name *
                        </Label>
                        <Input
                          placeholder="e.g., Office Supplies, Transportation"
                          value={expense.expenseName}
                          onChange={(e) =>
                            updateExpenseEntry(
                              index,
                              "expenseName",
                              e.target.value,
                            )
                          }
                          className="h-12 border-gray-300 focus:border-teal-400 focus:ring-teal-200"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="font-medium text-gray-700 text-sm">
                          Amount (PHP) *
                        </Label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          value={expense.amount || ""}
                          onChange={(e) =>
                            updateExpenseEntry(
                              index,
                              "amount",
                              Number.parseFloat(e.target.value) || 0,
                            )
                          }
                          className="h-12 border-gray-300 focus:border-teal-400 focus:ring-teal-200"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="font-medium text-gray-700 text-sm">
                          Date of Expense *
                        </Label>
                        <div className="relative">
                          <Input
                            type="date"
                            value={format(expense.date, "yyyy-MM-dd")}
                            onChange={(e) =>
                              updateExpenseEntry(
                                index,
                                "date",
                                new Date(e.target.value),
                              )
                            }
                            className="h-12 border-gray-300 focus:border-teal-400 focus:ring-teal-200"
                          />
                          <Calendar className="pointer-events-none absolute top-3 right-3 h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="font-medium text-gray-700 text-sm">
                          Receipt File
                        </Label>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <FileUpload
                              multiple={false}
                              maxFiles={1}
                              accept="image/*,.pdf"
                              onChange={(files) =>
                                handleFileChange(index, files)
                              }
                              label=""
                              className="h-12 w-full rounded-lg border border-gray-300 border-dashed transition-colors hover:border-teal-400"
                            />
                          </div>
                          {expense.receipt && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-12 gap-2 px-4"
                              onClick={() =>
                                onOpen("printRentalAgreementReceipt")
                              }
                            >
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expense Summary for each item */}
                    <div className="mt-6 rounded-lg bg-gray-50 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">This expense:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(expense.amount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Receipt Notes */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <Label className="block font-semibold text-gray-900 text-lg">
                Additional Notes
              </Label>
              <p className="mt-1 mb-4 text-gray-600 text-sm">
                Provide any additional context or details about these expenses
                (optional)
              </p>
              <Textarea
                placeholder="Add any additional notes about the expenses, procurement process, or other relevant details..."
                value={receiptNotes}
                onChange={(e) => setReceiptNotes(e.target.value)}
                rows={4}
                className="w-full resize-none border-gray-300 focus:border-teal-400 focus:ring-teal-200"
              />
            </div>

            {/* Enhanced Validation Messages */}
            {totalExpenseAmount > request.allocatedFunds && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-full bg-red-100 p-2">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-red-800">
                      Budget Exceeded
                    </h4>
                    <p className="mt-1 text-red-700 text-sm">
                      Your total expenses of{" "}
                      <strong>{formatCurrency(totalExpenseAmount)}</strong>{" "}
                      exceed the allocated funds of{" "}
                      <strong>{formatCurrency(request.allocatedFunds)}</strong>{" "}
                      by{" "}
                      <strong>
                        {formatCurrency(
                          totalExpenseAmount - request.allocatedFunds,
                        )}
                      </strong>
                      .
                    </p>
                    <p className="mt-2 text-red-600 text-xs">
                      Please review and adjust your expenses before submitting.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer className="flex-shrink-0 border-t bg-gray-50/50 px-8 py-6">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-gray-700">
                <span className="font-medium text-lg">
                  Total: {formatCurrency(totalExpenseAmount)}
                </span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-600">
                  {formatCurrency(request.allocatedFunds)}
                </span>
              </div>
              {expenses.length > 0 && (
                <Badge variant="outline" className="bg-white px-3 py-1">
                  {expenses.length} expense item
                  {expenses.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={onClose}
                size="lg"
                className="px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReceipt}
                disabled={
                  expenses.length === 0 ||
                  totalExpenseAmount > request.allocatedFunds
                }
                size="lg"
                className="bg-teal-600 px-8 hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Expenses
              </Button>
            </div>
          </div>
        </Footer>
      </Content>
    </DialogContent_Component>
  )
}
