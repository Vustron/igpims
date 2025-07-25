"use client"

import { ColumnDef } from "@tanstack/react-table"
import {
  ArrowUpDown,
  CheckCircle,
  Mail,
  Shield,
  User as UserIcon,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badges"
import { Button } from "@/components/ui/buttons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/images"
import { User } from "@/backend/db/schemas"
import { UserActions } from "./actions"

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

      const getRoleBadge = (role: string) => {
        switch (role) {
          case "admin":
            return (
              <Badge
                variant="default"
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm"
              >
                <Shield className="mr-1 h-3 w-3" />
                Admin
              </Badge>
            )
          case "ssc_president":
            return (
              <Badge
                variant="default"
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-sm"
              >
                <Shield className="mr-1 h-3 w-3" />
                SSC President
              </Badge>
            )
          case "dpdm_secretary":
            return (
              <Badge
                variant="default"
                className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-sm"
              >
                <Shield className="mr-1 h-3 w-3" />
                DPDM Secretary
              </Badge>
            )
          case "dpdm_officers":
            return (
              <Badge
                variant="default"
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm"
              >
                <Shield className="mr-1 h-3 w-3" />
                DPDM Officers
              </Badge>
            )
          case "ssc_treasurer":
            return (
              <Badge
                variant="default"
                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-sm"
              >
                <Shield className="mr-1 h-3 w-3" />
                SSC Treasurer
              </Badge>
            )
          case "ssc_auditor":
            return (
              <Badge
                variant="default"
                className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-sm"
              >
                <Shield className="mr-1 h-3 w-3" />
                SSC Auditor
              </Badge>
            )
          case "chief_legislator":
            return (
              <Badge
                variant="default"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm"
              >
                <Shield className="mr-1 h-3 w-3" />
                Chief Legislator
              </Badge>
            )
          case "ssc_secretary":
            return (
              <Badge
                variant="default"
                className="bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-sm"
              >
                <Shield className="mr-1 h-3 w-3" />
                SSC Secretary
              </Badge>
            )
          case "student":
            return (
              <Badge
                variant="outline"
                className="border-blue-300 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700"
              >
                <UserIcon className="mr-1 h-3 w-3" />
                Student
              </Badge>
            )
          default:
            return (
              <Badge
                variant="secondary"
                className="border border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700"
              >
                <UserIcon className="mr-1 h-3 w-3" />
                User
              </Badge>
            )
        }
      }

      return (
        <div className="flex items-center space-x-2">{getRoleBadge(role)}</div>
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
      const user = row.original
      return <UserActions user={user} />
    },
    enableSorting: false,
    enableHiding: false,
  },
]
