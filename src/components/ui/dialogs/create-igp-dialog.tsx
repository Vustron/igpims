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
import { CreateIgpForm } from "@/features/other-igps/create-igp-form"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

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
