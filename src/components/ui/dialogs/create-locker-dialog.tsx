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
import { CreateLockerForm } from "@/features/locker-igp/lockers/create-locker-form"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const CreateLockerDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createLocker"

  const handleClose = () => {
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="min-w-[450px] max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create new locker</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new locker.
            </DialogDescription>
          </DialogHeader>
          <CreateLockerForm onSuccess={handleClose} onError={handleClose} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create new locker</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new locker.
          </DrawerDescription>
        </DrawerHeader>
        <CreateLockerForm onSuccess={handleClose} onError={handleClose} />
      </DrawerContent>
    </Drawer>
  )
}
