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
        className="-top-1 absolute left-0 flex h-4 w-[200%] origin-bottom-left rotate-45 items-center justify-center bg-yellow-300 shadow-md sm:h-5"
        initial={{ x: -100 }}
        animate={{ x: -15 }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
      >
        <div className="flex items-center gap-0.5 font-bold text-[7px] text-red-600 tracking-wider sm:text-[8px]">
          <WrenchIcon size={6} className="sm:size-2" />
          MAINTENANCE
          <WrenchIcon size={6} className="sm:size-2" />
        </div>
      </motion.div>

      <motion.div
        className="absolute right-0 bottom-0 flex h-4 w-[200%] origin-top-right rotate-45 items-center justify-center bg-yellow-300 shadow-md sm:h-5"
        initial={{ x: 100 }}
        animate={{ x: 15 }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.3 }}
      >
        <div className="flex items-center gap-0.5 font-bold text-[7px] text-red-600 tracking-wider sm:text-[8px]">
          <WrenchIcon size={6} className="sm:size-2" />
          MAINTENANCE
          <WrenchIcon size={6} className="sm:size-2" />
        </div>
      </motion.div>
    </>
  )
}
