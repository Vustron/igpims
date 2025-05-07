"use client"

import { getStatusIndicator } from "@/utils/get-percentage-color"
import { motion } from "framer-motion"

interface LockerStatusIndicatorProps {
  status: string
}

export const LockerStatusIndicator: React.FC<LockerStatusIndicatorProps> = ({
  status,
}) => {
  return (
    <motion.div
      className={`absolute top-1.5 right-1.5 size-1.5 rounded-full sm:size-2 md:size-2.5 ${getStatusIndicator(status)}`}
      animate={{
        scale:
          status === "active"
            ? [1, 1.2, 1]
            : status === "under_maintenance"
              ? [1, 0.8, 1]
              : 1,
      }}
      transition={{
        repeat:
          status === "active" || status === "under_maintenance"
            ? Number.POSITIVE_INFINITY
            : 0,
        duration: status === "under_maintenance" ? 0.8 : 2,
      }}
    />
  )
}
