import { useDialog } from "@/hooks/use-dialog"

export const useConfirm = () => {
  const { onOpen } = useDialog()

  return (title: string, description: string): Promise<boolean> => {
    return new Promise((resolve) => {
      onOpen("confirm", { title, description, resolve })
    })
  }
}
