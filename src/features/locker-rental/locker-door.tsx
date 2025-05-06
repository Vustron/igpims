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
      className={`relative flex h-24 w-full items-center justify-center rounded-md border border-white/20 bg-white/10 shadow-inner backdrop-blur-sm sm:h-28 md:h-32 ${
        status === "under_maintenance" ? "opacity-60" : ""
      }`}
      animate={{
        rotateY: isSelected ? 30 : 0,
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* Door handle */}
      <motion.div
        className="absolute right-3 size-4 rounded-l-full bg-gray-800/70 sm:size-5 md:size-6"
        animate={{
          x: isSelected ? 3 : 0,
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
          <UnlockIcon className="size-5 text-white/90 sm:size-6 md:size-7" />
        ) : status === "under_maintenance" ? (
          <WrenchIcon className="size-5 text-white/90 sm:size-6 md:size-7" />
        ) : (
          <LockIcon className="size-5 text-white/90 sm:size-6 md:size-7" />
        )}
      </motion.div>
    </motion.div>
  )
}
