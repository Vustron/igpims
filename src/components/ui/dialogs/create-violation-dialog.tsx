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
import { ViolationForm } from "@/features/locker-igp/violations/create-violation-form"
import { isViolationData, useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const CreateViolationDialog = () => {
  const { isOpen, onClose, type, data } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createViolation"

  const handleClose = () => {
    onClose()
  }

  if (!isDialogOpen || !isViolationData(data) || !data.violation) {
    return null
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create new violation</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new violation.
            </DialogDescription>
          </DialogHeader>
          <ViolationForm
            violation={data.violation || undefined}
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
          <DrawerTitle>Create new violation</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new violation.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6">
          <ViolationForm
            violation={data.violation || undefined}
            onSuccess={handleClose}
            onError={handleClose}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
