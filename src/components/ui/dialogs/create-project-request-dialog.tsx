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
import { CreateProjectRequestForm } from "@/features/project-request/create-project-request-form"
import { ScrollArea } from "@/components/ui/scrollareas"

import { useMediaQuery } from "@/hooks/use-media-query"
import { useDialog } from "@/hooks/use-dialog"

export const CreateProjectRequestDialog = () => {
  const { isOpen, onClose, type } = useDialog()
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const isDialogOpen = isOpen && type === "createProjectRequest"

  const handleClose = () => {
    onClose()
  }

  if (isDesktop) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <ScrollArea>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new project request</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new project request.
              </DialogDescription>
            </DialogHeader>
            <CreateProjectRequestForm />
          </DialogContent>
        </ScrollArea>
      </Dialog>
    )
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={onClose}>
      <ScrollArea>
        <DrawerContent className="max-h-[90%]">
          <DrawerHeader className="px-6">
            <DrawerTitle>Create new project request</DrawerTitle>
            <DrawerDescription>
              Fill in the details below to create a new project request.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-6 pb-6">
            <CreateProjectRequestForm />
          </div>
        </DrawerContent>
      </ScrollArea>
    </Drawer>
  )
}
