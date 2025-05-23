"use client"

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/cards"
import FallbackBoundary from "@/components/ui/fallbacks/fallback-boundary"
import { DynamicButton } from "@/components/ui/buttons"
import { EditUserForm } from "@/features/user/form"
import { Trash2 } from "lucide-react"

import { catchError } from "@/utils/catch-error"
import toast from "react-hot-toast"

import { useDeleteUserById } from "@/backend/actions/user/delete-by-id"
import { useFindAccountById } from "@/backend/actions/user/find-by-id"
import { useConfirm } from "@/hooks/use-confirm"
import { useDialog } from "@/hooks/use-dialog"
import { useEffect } from "react"

interface UserClientProps {
  id: string
}

export const UserClient = ({ id }: UserClientProps) => {
  const { data: user, isLoading } = useFindAccountById(id)
  const deleteUser = useDeleteUserById(id)
  const confirm = useConfirm()
  const { onOpen } = useDialog()

  useEffect(() => {
    if (user && !isLoading) {
      if (!user.emailVerified) {
        onOpen("needVerifyUser")
      }
      if (user.sessionExpired) {
        onOpen("sessionExpired")
      }
    }
  }, [isLoading, onOpen, user])

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
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="mt-6 rounded-lg border">
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle className="font-bold text-2xl">
                User Information
              </CardTitle>
              <CardDescription>Manage your user information</CardDescription>
            </div>
            <DynamicButton
              onClick={handleDelete}
              size="icon"
              buttonClassName="rounded-md size-10 cursor-pointer hover:scale-110 hover:ring-2 hover:ring-black"
              type="button"
              position="left"
              icon={<Trash2 className="ml-2 size-5" />}
              variant="destructive"
              disabled={deleteUser.isPending}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] flex-col items-center justify-center">
            <FallbackBoundary>
              <EditUserForm data={user} id={id} />
            </FallbackBoundary>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
