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
import { CreateFundRequestForm } from "@/features/fund-request/create-fund-request-form"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"

export const CreateFundRequestDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createFundRequest"

  const handleClose = () => {
    onClose()
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
          <CreateFundRequestForm />
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
          <CreateFundRequestForm />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
