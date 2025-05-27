"use client"

import {
  Drawer,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerDescription,
} from "@/components/ui/drawers"
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialogs"
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/selects"
import { Textarea } from "@/components/ui/inputs"
import { Button } from "@/components/ui/buttons"
import { Label } from "@/components/ui/labels"
import { Badge } from "@/components/ui/badges"
import { X } from "lucide-react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"
import { useState } from "react"

import toast from "react-hot-toast"

const sampleEmails = [
  {
    value: "lost-key",
    label: "Lost Key Violation",
    template:
      "Dear Student,\n\nWe have received a report that you have lost your locker key. This is a violation of the locker rental agreement. Please report to the administration office immediately to pay the required fine and obtain a replacement key.\n\nFine Amount: ₱250\nDue Date: Within 7 days\n\nFailure to comply may result in additional penalties.\n\nBest regards,\nLocker Management Team",
  },
  {
    value: "damaged-locker",
    label: "Damaged Locker Violation",
    template:
      "Dear Student,\n\nDuring our routine inspection, we found that your assigned locker has been damaged. This violates the terms of your locker rental agreement. You are required to pay for the repair costs and any applicable fines.\n\nRepair Cost: ₱500\nFine: ₱200\nTotal Amount Due: ₱700\n\nPlease settle this matter within 14 days.\n\nBest regards,\nLocker Management Team",
  },
  {
    value: "unauthorized-use",
    label: "Unauthorized Use Violation",
    template:
      "Dear Student,\n\nIt has come to our attention that your locker is being used by unauthorized individuals. This is a serious violation of the locker rental policy. Please report to the administration office immediately.\n\nFine Amount: ₱300\nDue Date: Within 5 days\n\nFurther violations may result in termination of your locker rental.\n\nBest regards,\nLocker Management Team",
  },
  {
    value: "prohibited-items",
    label: "Prohibited Items Violation",
    template:
      "Dear Student,\n\nProhibited items were found in your assigned locker during inspection. This violates the locker rental agreement and campus policies. Please remove all prohibited items immediately and pay the required fine.\n\nFine Amount: ₱400\nDue Date: Within 3 days\n\nRepeated violations may result in permanent ban from locker rental services.\n\nBest regards,\nLocker Management Team",
  },
  {
    value: "late-renewal",
    label: "Late Renewal Violation",
    template:
      "Dear Student,\n\nYour locker rental has expired and you have failed to renew on time. This constitutes a violation of the rental agreement. Please renew your rental and pay the late fee immediately.\n\nLate Fee: ₱100\nRenewal Fee: ₱150\nTotal Amount Due: ₱250\n\nFailure to renew within 7 days will result in locker termination.\n\nBest regards,\nLocker Management Team",
  },
  {
    value: "custom",
    label: "Custom Message",
    template: "",
  },
]

const sampleUsers = [
  {
    value: "john.doe@university.edu",
    label: "John Doe - Locker #101",
    name: "John Doe",
    locker: "101",
  },
  {
    value: "jane.smith@university.edu",
    label: "Jane Smith - Locker #205",
    name: "Jane Smith",
    locker: "205",
  },
  {
    value: "mike.johnson@university.edu",
    label: "Mike Johnson - Locker #309",
    name: "Mike Johnson",
    locker: "309",
  },
  {
    value: "sarah.wilson@university.edu",
    label: "Sarah Wilson - Locker #156",
    name: "Sarah Wilson",
    locker: "156",
  },
  {
    value: "alex.brown@university.edu",
    label: "Alex Brown - Locker #278",
    name: "Alex Brown",
    locker: "278",
  },
  {
    value: "lisa.davis@university.edu",
    label: "Lisa Davis - Locker #432",
    name: "Lisa Davis",
    locker: "432",
  },
  {
    value: "all-violators",
    label: "All Students with Violations",
    name: "All Violators",
    locker: "Multiple",
  },
]

export const SendEmailLockerViolationDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "sendEmailLockerViolation"

  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleClose = () => {
    setSelectedTemplate("")
    setEmailContent("")
    setSelectedUsers([])
    setIsLoading(false)
    onClose()
  }

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value)
    const template = sampleEmails.find((email) => email.value === value)
    if (template) {
      setEmailContent(template.template)
    }
  }

  const handleUserSelect = (userEmail: string) => {
    if (userEmail === "all-violators") {
      // If "All Students with Violations" is selected, clear other selections and add all user emails
      const allUserEmails = sampleUsers
        .filter((user) => user.value !== "all-violators")
        .map((user) => user.value)
      setSelectedUsers(allUserEmails)
    } else {
      // Toggle individual user selection
      setSelectedUsers((prev) => {
        if (prev.includes(userEmail)) {
          return prev.filter((email) => email !== userEmail)
        }
        return [...prev, userEmail]
      })
    }
  }

  const removeUser = (userEmail: string) => {
    setSelectedUsers((prev) => prev.filter((email) => email !== userEmail))
  }

  const getUserDisplayName = (email: string) => {
    const user = sampleUsers.find((user) => user.value === email)
    return user ? user.label : email
  }

  const handleSendEmails = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one recipient")
      return
    }

    if (!emailContent.trim()) {
      toast.error("Please enter email content")
      return
    }

    if (emailContent.length < 10) {
      toast.error("Email content must be at least 10 characters")
      return
    }

    if (emailContent.length > 1000) {
      toast.error("Email content must not exceed 1000 characters")
      return
    }

    setIsLoading(true)

    await toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(`Emails sent to ${selectedUsers.length} recipient(s)`)
        }, 2000)
      }),
      {
        loading: (
          <span className="animate-pulse">
            Sending violation emails to {selectedUsers.length} recipient(s)...
          </span>
        ),
        success: `Violation emails sent successfully to ${selectedUsers.length} recipient(s)`,
        error: "Failed to send violation emails",
      },
    )

    setIsLoading(false)
    handleClose()
  }

  const DialogContent_Component = ({
    children,
  }: { children: React.ReactNode }) => {
    if (isDesktop) {
      return (
        <Dialog open={isDialogOpen} onOpenChange={handleClose}>
          <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Send Locker Violation Emails</DialogTitle>
              <DialogDescription>
                Select recipients and customize the message to send violation
                notifications to students.
              </DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      )
    }

    return (
      <Drawer open={isDialogOpen} onOpenChange={handleClose}>
        <DrawerContent className="max-h-[90%]">
          <DrawerHeader className="px-6">
            <DrawerTitle>Send Locker Violation Emails</DrawerTitle>
            <DrawerDescription>
              Select recipients and customize the message to send violation
              notifications to students.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-6 pb-6">{children}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DialogContent_Component>
      <div className="space-y-6">
        {/* User Selection */}
        <div className="space-y-2">
          <Label htmlFor="user-select">Select Recipients</Label>
          <Select onValueChange={handleUserSelect}>
            <SelectTrigger id="user-select">
              <SelectValue placeholder="Choose students to send emails to" />
            </SelectTrigger>
            <SelectContent>
              {sampleUsers.map((user) => (
                <SelectItem key={user.value} value={user.value}>
                  {user.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selected Users Display */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <Label className="font-medium text-sm">
                Selected Recipients ({selectedUsers.length})
              </Label>
              <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-md border bg-muted/20 p-2">
                {selectedUsers.map((userEmail) => (
                  <Badge
                    key={userEmail}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    <span className="max-w-48 truncate text-xs">
                      {getUserDisplayName(userEmail)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeUser(userEmail)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Template Selection */}
        <div className="space-y-2">
          <Label htmlFor="template-select">Select Email Template</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger id="template-select">
              <SelectValue placeholder="Choose a violation type template" />
            </SelectTrigger>
            <SelectContent>
              {sampleEmails.map((email) => (
                <SelectItem key={email.value} value={email.value}>
                  {email.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Email Content */}
        <div className="space-y-2">
          <Label htmlFor="email-content">
            Email Content
            <span className="ml-2 text-muted-foreground text-sm">
              ({emailContent.length}/1000 characters)
            </span>
          </Label>
          <Textarea
            id="email-content"
            placeholder="Enter your violation email message here..."
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
            className="min-h-[200px] resize-none"
            maxLength={1000}
          />
          <p className="text-muted-foreground text-xs">
            Minimum 10 characters, maximum 1000 characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSendEmails}
            disabled={
              isLoading ||
              selectedUsers.length === 0 ||
              !emailContent.trim() ||
              emailContent.length < 10 ||
              emailContent.length > 1000
            }
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading
              ? "Sending..."
              : `Send Violation Emails (${selectedUsers.length})`}
          </Button>
        </div>
      </div>
    </DialogContent_Component>
  )
}
