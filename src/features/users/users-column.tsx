"use client"

import {
  Edit,
  Mail,
  Trash2,
  Shield,
  XCircle,
  ArrowUpDown,
  CheckCircle,
  MoreHorizontal,
  User as UserIcon,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdowns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/images"
import { Button } from "@/components/ui/buttons"
import { Badge } from "@/components/ui/badges"

import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "@/schemas/drizzle-schema"
import { useRouter } from "next-nprogress-bar"

export const usersColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto justify-start p-0 text-left font-semibold hover:text-foreground"
      >
        <UserIcon className="mr-2 h-4 w-4" />
        Name
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="ml-3 flex items-center space-x-3 py-2">
          <Avatar className="h-10 w-10 ring-2 ring-border">
            <AvatarImage src={user.image || ""} alt={user.name || ""} />
            <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 font-semibold text-blue-900 text-sm">
              {user.name
                ?.split(" ")
                .map((n: any) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-semibold text-foreground leading-tight">
              {user.name || "Unknown User"}
            </div>
            <div className="text-muted-foreground text-xs">
              ID: {user.id.slice(0, 8)}...
            </div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto justify-start p-0 text-left font-semibold hover:text-foreground"
      >
        <Mail className="mr-2 h-4 w-4" />
        Email
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </Button>
    ),
    cell: ({ row }) => {
      const email = row.getValue("email") as string
      return (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground text-sm">{email}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto justify-start p-0 text-left font-semibold hover:text-foreground"
      >
        <Shield className="mr-2 h-4 w-4" />
        Role
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </Button>
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <div className="flex items-center space-x-2">
          {role === "admin" ? (
            <Badge
              variant="default"
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm"
            >
              <Shield className="mr-1 h-3 w-3" />
              Admin
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="border border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
            >
              <UserIcon className="mr-1 h-3 w-3" />
              User
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto justify-start p-0 text-left font-semibold hover:text-foreground"
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Verification
        <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
      </Button>
    ),
    cell: ({ row }) => {
      const emailVerified = row.getValue("emailVerified") as number | null
      return (
        <div className="flex items-center space-x-2">
          {emailVerified ? (
            <Badge
              variant="success"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified
            </Badge>
          ) : (
            <Badge
              variant="destructive"
              className="bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-sm"
            >
              <XCircle className="mr-1 h-3 w-3" />
              Unverified
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold">Actions</div>,
    cell: ({ row }) => {
      const id = row.original.id
      const router = useRouter()
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
                onClick={() => router.push(`/users/${id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                <span className="font-medium">Edit</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                <span className="font-medium">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
