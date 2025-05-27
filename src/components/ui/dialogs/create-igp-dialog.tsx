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
import { CreateIgpForm } from "@/features/other-igps/create-igp-form"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"

export const CreateIgpDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createIgp"

  const handleClose = () => {
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Create new IGP</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new Income Generating
              Project.
            </DialogDescription>
          </DialogHeader>
          <CreateIgpForm
            onSuccess={handleClose}
            onError={handleClose}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="px-6">
          <DrawerTitle>Create new IGP</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new Income Generating Project.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6">
          <CreateIgpForm
            onSuccess={handleClose}
            onError={handleClose}
            onClose={handleClose}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
