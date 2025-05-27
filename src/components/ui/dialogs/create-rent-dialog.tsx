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
import { CreateLockerRentForm } from "@/features/locker-rental-list/create-rent-form"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"

export const CreateLockerRentDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createRent"

  const handleClose = () => {
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="min-w-[900px] max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Create new locker rent</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new locker rent.
            </DialogDescription>
          </DialogHeader>
          <CreateLockerRentForm onSuccess={handleClose} onError={handleClose} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="px-6">
          <DrawerTitle>Create new locker rent</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new locker rent.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6">
          <CreateLockerRentForm onSuccess={handleClose} onError={handleClose} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
