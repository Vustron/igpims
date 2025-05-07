"use client"
import { LockerStatusIndicator } from "@/features/locker-rental/locker-status-indicator"
import { MaintenanceTape } from "@/features/locker-rental/maintainance-tape"
import { LockerControls } from "@/features/locker-rental/locker-controls"
import { LockerHeader } from "@/features/locker-rental/locker-header"
import { LockerDoor } from "@/features/locker-rental/locker-door"
import { Card } from "@/components/ui/cards"

import { getStatusColor } from "@/utils/get-percentage-color"
import { motion, AnimatePresence } from "framer-motion"

import type { Locker } from "@/interfaces/locker"

interface LockerCardProps {
  locker: Locker
  index: number
  isSelected: boolean
  onSelect: () => void
  compact: boolean
}

export const LockerCard: React.FC<LockerCardProps> = ({
  locker,
  index,
  isSelected,
  onSelect,
  compact = false,
}) => {
  const isDisabled = locker.status === "under_maintenance"

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`relative ${compact ? "max-w-[100px]" : "max-w-[115px]"}`}
        onClick={() => !isDisabled && onSelect()}
      >
        <Card
          className={`relative flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br transition-all duration-300 ${
            compact
              ? "h-50 w-24 p-2"
              : "h-50 w-28 p-2 sm:h-50 sm:w-30 sm:p-2.5 md:h-50 md:w-32 md:p-3"
          }
            ${getStatusColor(locker.status)}
            ${isDisabled ? "cursor-not-allowed opacity-90" : "cursor-pointer hover:shadow-lg"}`}
        >
          <LockerStatusIndicator status={locker.status} />

          {isDisabled && <MaintenanceTape index={index} />}

          <LockerHeader
            name={locker.name}
            status={locker.status}
            isSelected={isSelected}
          />

          <LockerDoor status={locker.status} isSelected={isSelected} />

          <LockerControls status={locker.status} />
        </Card>

        {/* Shadow effect */}
        <div
          className={`-bottom-1 absolute inset-x-2 h-2 rounded-b-md blur-sm transition-opacity duration-300 ${isSelected ? "opacity-60" : "opacity-30"}
            ${getStatusColor(locker.status).replace("to-", "").replace("from-", "")}`}
        />
      </motion.div>
    </AnimatePresence>
  )
}
