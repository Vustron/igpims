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
import SignUpForm from "@/features/auth/sign-up/sign-up-form"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

export const CreateUserDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createUser"

  const handleClose = () => {
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create new user</DialogTitle>
            <DialogDescription>
              Fill in the details below to create a new user.
            </DialogDescription>
          </DialogHeader>
          <SignUpForm onSuccess={handleClose} onError={handleClose} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90%]">
        <DrawerHeader className="px-6">
          <DrawerTitle>Create new user</DrawerTitle>
          <DrawerDescription>
            Fill in the details below to create a new user.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6">
          <SignUpForm onSuccess={handleClose} onError={handleClose} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
