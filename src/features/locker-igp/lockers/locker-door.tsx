"use client"

import { LockIcon, UnlockIcon, WrenchIcon } from "lucide-react"
import { motion } from "framer-motion"

interface LockerDoorProps {
  status: string
  isSelected: boolean
}

export const LockerDoor: React.FC<LockerDoorProps> = ({
  status,
  isSelected,
}) => {
  return (
    <motion.div
      className={`relative flex w-full items-center justify-center rounded-md border border-white/20 bg-white/10 shadow-inner backdrop-blur-sm ${status === "under_maintenance" ? "opacity-60" : ""}h-16 sm:h-18 md:h-20`}
      animate={{
        rotateY: isSelected ? 30 : 0,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Door handle */}
      <motion.div
        className="absolute right-2 size-2.5 rounded-l-full bg-gray-800/70 sm:size-3 md:size-3.5"
        animate={{
          x: isSelected ? 2 : 0,
          scale: isSelected ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Lock icon animation */}
      <motion.div
        animate={{
          scale: isSelected
            ? [1, 1.2, 1]
            : status === "under_maintenance"
              ? [1, 0.9, 1]
              : 1,
          rotateZ: isSelected
            ? [0, -10, 10, -5, 5, 0]
            : status === "under_maintenance"
              ? [0, 5, -5, 0]
              : 0,
        }}
        transition={{
          duration: 0.5,
          repeat: status === "under_maintenance" ? Number.POSITIVE_INFINITY : 0,
          repeatDelay: 2,
        }}
      >
        {status === "active" ? (
          <UnlockIcon className="size-3.5 text-white/90 sm:size-4 md:size-5" />
        ) : status === "under_maintenance" ? (
          <WrenchIcon className="size-3.5 text-white/90 sm:size-4 md:size-5" />
        ) : (
          <LockIcon className="size-3.5 text-white/90 sm:size-4 md:size-5" />
        )}
      </motion.div>
    </motion.div>
  )
}
