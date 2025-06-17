"use client"

import { Card } from "@/components/ui/cards"

import { getStatusColor } from "@/utils/get-percentage-color"
import { motion, AnimatePresence } from "framer-motion"

import { useRouter } from "next-nprogress-bar"

import { LockerStatusIndicator } from "./locker-status-indicator"
import { MaintenanceTape } from "./maintainance-tape"
import { LockerControls } from "./locker-controls"
import { LockerHeader } from "./locker-header"
import { LockerDoor } from "./locker-door"

import type { Locker } from "@/schemas/locker"

interface LockerCardProps {
  id: string
  locker: Locker
  index: number
  isSelected: boolean
  onSelect: () => void
  compact: boolean
}

export const LockerCard: React.FC<LockerCardProps> = ({
  id,
  locker,
  index,
  isSelected,
  onSelect,
  compact = false,
}) => {
  const isDisabled = locker.lockerStatus === "maintenance"
  const router = useRouter()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`relative ${compact ? "max-w-[100px]" : "max-w-[115px]"}`}
        onClick={() => {
          router.push(`/locker-rental/${id}`)
          onSelect()
        }}
      >
        <Card
          className={`relative flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br transition-all duration-300 ${
            compact
              ? "h-50 w-24 p-2"
              : "h-50 w-28 p-2 sm:h-50 sm:w-30 sm:p-2.5 md:h-50 md:w-32 md:p-3"
          }
            ${getStatusColor(locker.lockerStatus!)}
            ${isDisabled ? "cursor-not-allowed opacity-90" : "cursor-pointer hover:shadow-lg"}`}
        >
          <LockerStatusIndicator status={locker.lockerStatus!} />

          {isDisabled && <MaintenanceTape index={index} />}

          <LockerHeader
            name={locker.lockerName!}
            status={locker.lockerStatus!}
            isSelected={isSelected}
          />

          <LockerDoor status={locker.lockerStatus!} isSelected={isSelected} />

          <LockerControls status={locker.lockerStatus!} />
        </Card>

        {/* Shadow effect */}
        <div
          className={`-bottom-1 absolute inset-x-2 h-2 rounded-b-md blur-sm transition-opacity duration-300 ${isSelected ? "opacity-60" : "opacity-30"}
            ${getStatusColor(locker.lockerStatus!).replace("to-", "").replace("from-", "")}`}
        />
      </motion.div>
    </AnimatePresence>
  )
}
