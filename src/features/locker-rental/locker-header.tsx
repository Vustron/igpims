"use client"

import { Badge } from "@/components/ui/badges"

import { getStatusText } from "@/utils/get-percentage-color"
import { motion } from "framer-motion"

interface LockerHeaderProps {
  name: string
  status: string
  isSelected: boolean
}

export const LockerHeader: React.FC<LockerHeaderProps> = ({
  name,
  status,
  isSelected,
}) => {
  return (
    <motion.div
      className="relative z-10 mb-1.5 text-center sm:mb-2 md:mb-3"
      animate={{ y: isSelected ? -3 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="font-bold text-sm text-white drop-shadow-md sm:text-base md:text-lg">
        {name}
      </div>
      <Badge
        className="mt-0.5 bg-white/20 text-[8px] text-white uppercase tracking-wide sm:text-[9px]"
        variant="secondary"
      >
        {getStatusText(status)}
      </Badge>
    </motion.div>
  )
}
