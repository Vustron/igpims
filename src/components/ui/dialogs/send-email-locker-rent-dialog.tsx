"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/buttons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialogs"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawers"
import { Label } from "@/components/ui/labels"
import { useSendRentLockerConfirm } from "@/backend/actions/emails/send-rent-locker-confirm.ts"
import { useFindManyRenterInfo } from "@/backend/actions/user/find-many-renter-info"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { FieldConfig } from "@/interfaces/form"
import { RecipientPayload, recipientSchema } from "@/validation/email"
import { DynamicForm } from "../forms"

const DialogContent_Component = ({
  children,
  isDialogOpen,
  handleClose,
  isDesktop,
}: {
  children: React.ReactNode
  isDialogOpen: boolean
  handleClose: () => void
  isDesktop: boolean
}) => {
  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="font-semibold text-lg">
              Send Email Confirmation
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select renters to send locker rental confirmation emails
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-4">{children}</div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={handleClose}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="border-b px-6 py-4">
          <DrawerTitle className="font-semibold text-lg">
            Send Email Confirmation
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            Select renters to send locker rental confirmation emails
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 py-4">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}

export const SendEmailLockerRentDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "sendEmailLockerRent"

  const { data: renters, isLoading: isLoadingRenters } = useFindManyRenterInfo({
    enabled: isDialogOpen,
  })

  const sendRentLockerConfirm = useSendRentLockerConfirm()

  const [renterOptions, setRenterOptions] = useState<
    Array<{
      value: string
      label: string
      name: string
      course: string
      lockerName: string
      lockerLocation: string
      dueDate: Date
      amount: number
    }>
  >([])

  useEffect(() => {
    if (renters && isDialogOpen) {
      const options = Array.isArray(renters)
        ? renters.map((renter) => ({
            value: renter.renterEmail,
            label: `${renter.renterName} (${renter.courseAndSet})`,
            name: renter.renterName,
            course: renter.courseAndSet,
            lockerName: renter.lockerName,
            lockerLocation: renter.lockerLocation,
            dueDate: renter.dueDate,
            amount: renter.amount,
          }))
        : []

      setRenterOptions([
        {
          value: "all-renters",
          label: "Select All Renters",
          name: "All Renters",
          course: "Multiple",
          lockerName: "Multiple",
          lockerLocation: "Multiple",
          dueDate: new Date(),
          amount: 0,
        },
        ...options,
      ])
    }
  }, [renters, isDialogOpen])

  const form = useForm<RecipientPayload>({
    resolver: zodResolver(recipientSchema),
    defaultValues: {
      recipients: [],
    },
  })

  const selectedRecipients = form.watch("recipients")
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    form.reset()
    setIsLoading(false)
    onClose()
  }

  const handleSelectAll = () => {
    const allUserEmails = renterOptions
      .filter((option) => option.value !== "all-renters")
      .map((user) => user.value)
    form.setValue("recipients", allUserEmails)
  }

  const removeRecipient = (email: string) => {
    form.setValue(
      "recipients",
      selectedRecipients.filter((recipient) => recipient !== email),
    )
  }

  const getUserDetails = (email: string) => {
    const user = renterOptions.find((user) => user.value === email)
    return user
      ? {
          name: user.name,
          course: user.course,
          lockerName: user.lockerName,
          lockerLocation: user.lockerLocation,
          dueDate: user.dueDate,
          amount: user.amount,
        }
      : null
  }

  const onSubmit = async (values: RecipientPayload) => {
    setIsLoading(true)

    try {
      const emailData = values.recipients.map((email) => {
        const user = getUserDetails(email)
        return {
          renterName: user?.name || "",
          courseAndSet: user?.course || "",
          renterEmail: email,
          lockerName: user?.lockerName || "",
          lockerLocation: user?.lockerLocation || "",
          notificationType: "rental-confirmation",
          dueDate: user?.dueDate || new Date(),
          amount: user?.amount || 0,
        }
      })

      await toast.promise(sendRentLockerConfirm.mutateAsync(emailData), {
        loading: (
          <span>
            Sending to {values.recipients.length} recipient
            {values.recipients.length !== 1 ? "s" : ""}...
          </span>
        ),
        success: <span>Successfully sent to recipients</span>,
        error: "Failed to send emails",
      })
      handleClose()
    } catch (error) {
      setIsLoading(false)
    }
  }

  const emailFields: FieldConfig<RecipientPayload>[] = [
    {
      name: "recipients",
      type: "multiselect",
      label: "Select Renters",
      placeholder: "Search or select renters...",
      description: "Select recipients for the email confirmation",
      required: true,
      options: renterOptions,
    },
  ]

  return (
    <DialogContent_Component
      isDialogOpen={isDialogOpen}
      handleClose={handleClose}
      isDesktop={isDesktop}
    >
      <div className="space-y-6">
        {isLoadingRenters ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Selected Recipients Preview */}
            {selectedRecipients.length > 0 && (
              <div className="rounded-lg border bg-muted/10 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <Label className="font-medium text-sm">
                    Selected ({selectedRecipients.length})
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => form.setValue("recipients", [])}
                    className="text-muted-foreground text-xs hover:text-destructive"
                  >
                    Clear all
                  </Button>
                </div>
                <div className="max-h-40 space-y-2 overflow-y-auto">
                  {selectedRecipients.map((email) => {
                    const user = getUserDetails(email)
                    return (
                      <div
                        key={email}
                        className="flex flex-col rounded-md bg-background p-2 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate font-medium">
                            {user?.name} ({user?.course})
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeRecipient(email)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="mt-1 grid grid-cols-1 gap-1 text-muted-foreground text-xs">
                          <span className="text-black">
                            Locker: {user?.lockerName}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {selectedRecipients.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/30 p-6 text-center">
                <p className="mb-3 text-muted-foreground text-sm">
                  No recipients selected yet
                </p>
                <Button variant="outline" onClick={handleSelectAll} size="sm">
                  Select All Renters
                </Button>
              </div>
            )}
            <DynamicForm
              form={form}
              onSubmit={onSubmit}
              fields={emailFields}
              submitButtonTitle={`Send to (${selectedRecipients.length}) recipients`}
              disabled={isLoading || isLoadingRenters}
              submitButtonClassname="bg-primary hover:bg-primary/90"
            />
          </>
        )}
      </div>
    </DialogContent_Component>
  )
}
