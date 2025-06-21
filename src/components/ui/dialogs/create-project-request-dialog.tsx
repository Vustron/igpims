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
import { ScrollArea } from "@/components/ui/scrollareas"
import { CreateProjectRequestForm } from "@/features/project-request/create-project-request-form"
import { useDialog } from "@/hooks/use-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

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
