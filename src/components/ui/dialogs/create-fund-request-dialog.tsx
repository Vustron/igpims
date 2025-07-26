"use client"

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
import { CreateFundRequestForm } from "@/features/fund-request/create-fund-request-form"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

interface CreateFundRequestDialogData {
  session: {
    id: string
    userId: string
    token: string
    createdAt: Date
    updatedAt: Date
    expiresAt: Date
    userAgent: string
    ipAddress: string
    userRole: string
    userName: string
  }
  fundRequest?: any
}

export const CreateFundRequestDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createFundRequest"

  const handleClose = () => {
    onClose()
  }

  const hasSessionData = (data: any): data is CreateFundRequestDialogData => {
    return data?.session !== undefined
  }

  if (!isDialogOpen || !hasSessionData(data)) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create new fund request</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new fund request.
            </DialogDescription>
          </DialogHeader>
          <CreateFundRequestForm
            session={data.session}
            onSuccess={handleClose}
            onError={handleClose}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="px-6">
          <DrawerTitle>Create new fund request</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new fund request.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6">
          <CreateFundRequestForm
            session={data.session}
            onSuccess={handleClose}
            onError={handleClose}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
