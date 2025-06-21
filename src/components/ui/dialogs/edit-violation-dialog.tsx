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
import { EditViolationForm } from "@/features/locker-igp/violations/edit-violation-form"
import { isViolationData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const EditViolationDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "editViolation"

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  const handleClose = () => {
    onClose()
  }

  if (!isDialogOpen || !isViolationData(data) || !data.violation) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Violation</DialogTitle>
            <DialogDescription>
              Update the violation details below.
            </DialogDescription>
          </DialogHeader>
          {isDialogOpen && (
            <EditViolationForm
              violation={data.violation}
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
          <DrawerTitle>Edit Violation</DrawerTitle>
          <DrawerDescription>
            Update the violation details below.
          </DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-4">
          {isDialogOpen && (
            <EditViolationForm
              violation={data.violation}
              onSuccess={handleClose}
              onError={handleClose}
            />
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
