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
import { EditInspectionForm } from "@/features/locker-igp/inspection/edit-inspection-form"
import { isInspectionData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const EditInspectionDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "editInspection"

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  const handleClose = () => {
    onClose()
  }

  if (!isDialogOpen || !isInspectionData(data) || !data.inspection) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Inspection</DialogTitle>
            <DialogDescription>
              Update the inspection details below.
            </DialogDescription>
          </DialogHeader>
          {isDialogOpen && (
            <EditInspectionForm
              inspection={data.inspection}
              onSuccess={handleClose}
              onError={handleClose}
            />
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit Inspection</DrawerTitle>
          <DrawerDescription>
            Update the inspection details below.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">
          {isDialogOpen && (
            <EditInspectionForm
              inspection={data.inspection}
              onSuccess={handleClose}
              onError={handleClose}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
