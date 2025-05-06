"use client"

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
      className="mb-4 text-center sm:mb-5 md:mb-6"
      animate={{ y: isSelected ? -5 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="font-bold text-lg text-white drop-shadow-md sm:text-xl md:text-2xl">
        {name}
      </div>
      <div className="mt-1 text-[10px] text-white/80 uppercase tracking-wide sm:text-xs">
        {getStatusText(status)}
      </div>
    </motion.div>
  )
}
