"use client"

import { WrenchIcon } from "lucide-react"
import { motion } from "framer-motion"

interface MaintenanceTapeProps {
  index: number
}

export const MaintenanceTape: React.FC<MaintenanceTapeProps> = ({ index }) => {
  return (
    <>
      <motion.div
        className="absolute top-0 left-0 flex h-6 w-[200%] origin-bottom-left rotate-45 items-center justify-center bg-yellow-300 shadow-md sm:h-7 md:h-8"
        initial={{ x: -100 }}
        animate={{ x: -20 }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
      >
        <div className="flex items-center gap-1 font-bold text-[10px] text-red-600 tracking-wider sm:gap-1.5 sm:text-xs">
          <WrenchIcon size={10} className="sm:size-3 md:size-4" />
          <span className="hidden sm:inline">UNDER</span> MAINTENANCE
          <WrenchIcon size={10} className="sm:size-3 md:size-4" />
        </div>
      </motion.div>

      <motion.div
        className="absolute right-0 bottom-0 flex h-6 w-[200%] origin-top-right rotate-45 items-center justify-center bg-yellow-300 shadow-md sm:h-7 md:h-8"
        initial={{ x: 100 }}
        animate={{ x: 20 }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
      >
        <div className="flex items-center gap-1 font-bold text-[10px] text-red-600 tracking-wider sm:gap-1.5 sm:text-xs">
          <WrenchIcon size={10} className="sm:size-3 md:size-4" />
          <span className="hidden sm:inline">UNDER</span> MAINTENANCE
          <WrenchIcon size={10} className="sm:size-3 md:size-4" />
        </div>
      </motion.div>
    </>
  )
}
