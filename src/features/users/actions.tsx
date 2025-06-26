"use client"

import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next-nprogress-bar"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/buttons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdowns"
import { useDeleteUserById } from "@/backend/actions/user/delete-by-id"
import { User } from "@/backend/db/schemas"
import { useConfirm } from "@/hooks/use-confirm"
import { catchError } from "@/utils/catch-error"

interface UserActionsProps {
  user: User
}

export const UserActions = ({ user }: UserActionsProps) => {
  const router = useRouter()
  const deleteUser = useDeleteUserById(user.id)
  const confirm = useConfirm()

  const handleDelete = async () => {
    const confirmed = confirm(
      "Delete User",
      "Are you sure you want to delete this user? This action cannot be undone.",
    )

    if (await confirmed) {
      await toast.promise(deleteUser.mutateAsync(), {
        loading: <span className="animate-pulse">Deleting user...</span>,
        success: "User deleted",
        error: (error: unknown) => catchError(error),
      })
    }
  }

  return (
    <div className="mr-3 flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-20">
          <DropdownMenuItem
            className="cursor-pointer hover:bg-muted/80"
            onClick={() => router.push(`/users/${user.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span className="font-medium">Edit</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span className="font-medium">Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
