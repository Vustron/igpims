"use client"
import { LockerStatusIndicator } from "@/features/locker-rental/locker-status-indicator"
import { MaintenanceTape } from "@/features/locker-rental/maintainance-tape"
import { LockerControls } from "@/features/locker-rental/locker-controls"
import { LockerHeader } from "@/features/locker-rental/locker-header"
import { LockerDoor } from "@/features/locker-rental//locker-door"
import { Card } from "@/components/ui/cards"

import { getStatusColor } from "@/utils/get-percentage-color"
import { motion, AnimatePresence } from "framer-motion"

import type { Locker } from "@/interfaces/locker"

interface LockerCardProps {
  locker: Locker
  index: number
  isSelected: boolean
  onSelect: () => void
}

export const LockerCard: React.FC<LockerCardProps> = ({
  locker,
  index,
  isSelected,
  onSelect,
}) => {
  const isDisabled = locker.status === "under_maintenance"

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: [0, -5, 0],
          transition: {
            duration: 0.5,
            delay: index * 0.15,
            y: {
              repeat: isSelected ? Number.POSITIVE_INFINITY : 0,
              repeatType: "reverse",
              duration: 2,
              ease: "easeInOut",
            },
          },
        }}
        whileHover={{
          scale: !isDisabled ? 1.05 : 1,
          boxShadow: !isDisabled
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            : "none",
          transition: { duration: 0.2 },
        }}
        onClick={() => !isDisabled && onSelect()}
        className={!isDisabled ? "cursor-pointer" : "cursor-not-allowed"}
      >
        <Card
          className={`relative flex h-75 w-35 flex-col items-center justify-start overflow-hidden bg-gradient-to-br p-4 transition-all duration-300 sm:h-75 sm:w-48 sm:p-5 md:h-75 md:w-45 md:p-6 ${getStatusColor(locker.status)}`}
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
      </motion.div>
    </AnimatePresence>
  )
}
