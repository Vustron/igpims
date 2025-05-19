import { LayoutGrid, Settings2Icon, User } from "lucide-react"
import { FaMoneyBillTransfer } from "react-icons/fa6"
import { IoBarChartSharp } from "react-icons/io5"
import { IoWaterOutline } from "react-icons/io5"
import { RiFileList3Fill } from "react-icons/ri"
import { GiClothes } from "react-icons/gi"
import { PiLockers } from "react-icons/pi"
import { BiTask } from "react-icons/bi"

import type { IconType } from "react-icons/lib"
import type { LucideIcon } from "lucide-react"


type Submenu = {
  href: string
  label: string
  active: boolean
}

type Menu = {
  href: string
  label: string
  active: boolean
  icon: LucideIcon | IconType
  submenus: Submenu[]
}

type Group = {
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
          label: "Other Igps",
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
          href: "/locker-inspection",
          label: "Locker Inspection",
          active: pathname.includes("/locker-inspection"),
          icon: BiTask,
          submenus: [],
        },
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
      ],
    },
    {
      groupLabel: "Reporting & Analysis",
      menus: [
        {
          href: "/sales-report",
          label: "Sales Report",
          active: pathname.includes("/sales-report"),
          icon: IoBarChartSharp,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "User & Management",
      menus: [
        {
          href: "/user",
          label: "User",
          active: pathname.includes("/user"),
          icon: User,
          submenus: [],
        },
        {
          href: "/settings",
          label: "IGP Settings",
          active: pathname.includes("/settings"),
          icon: Settings2Icon,
          submenus: [],
        },
      ],
    },
  ]
}
