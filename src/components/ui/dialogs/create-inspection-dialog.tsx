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
import { CreateInspectionForm } from "@/features/locker-igp/inspection/create-inspection-form"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const CreateInspectionDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createInspection"

  const handleClose = () => {
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="min-w-[900px] max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Create new inspection</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new inspection.
            </DialogDescription>
          </DialogHeader>
          <CreateInspectionForm onSuccess={handleClose} onError={handleClose} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="px-6">
          <DrawerTitle>Create new inspection</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new inspection.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6">
          <CreateInspectionForm onSuccess={handleClose} onError={handleClose} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
