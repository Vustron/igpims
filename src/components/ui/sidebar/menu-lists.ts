import { LayoutGrid, LucideIcon, User } from "lucide-react"
import { FaMoneyBillTransfer } from "react-icons/fa6"
import { GiClothes } from "react-icons/gi"
import { IoBarChartSharp, IoWaterOutline } from "react-icons/io5"
import { IconType } from "react-icons/lib"
import { PiLockers } from "react-icons/pi"
import { RiFileList3Fill } from "react-icons/ri"

interface Submenu {
  href: string
  label: string
  active: boolean
}

interface Menu {
  href: string
  label: string
  active: boolean
  icon: LucideIcon | IconType
  submenus: Submenu[]
}

interface Group {
  groupLabel: string
  menus: Menu[]
}

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Dashboard",
          active: pathname === "/",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "IGP Managements",
      menus: [
        {
          href: "/locker-rental",
          label: "Locker Rental",
          active: pathname.includes("/locker-rental"),
          icon: PiLockers,
          submenus: [],
        },
        {
          href: "/water-vendo",
          label: "Water Vendo",
          active: pathname.includes("/water-vendo"),
          icon: IoWaterOutline,
          submenus: [],
        },
        {
          href: "/other-igps",
          label: "Other IGPs",
          active: pathname.includes("/other-igps"),
          icon: GiClothes,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Operation Management",
      menus: [
        {
          href: "/fund-request",
          label: "Fund Request",
          active: pathname.includes("/fund-request"),
          icon: FaMoneyBillTransfer,
          submenus: [],
        },
        {
          href: "/project-approval",
          label: "Project Approval",
          active: pathname.includes("/project-approval"),
          icon: RiFileList3Fill,
          submenus: [],
        },
        {
          href: "/report",
          label: "Report",
          active: pathname.includes("/report"),
          icon: IoBarChartSharp,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "User Management",
      menus: [
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: User,
          submenus: [],
        },
      ],
    },
  ]
}
