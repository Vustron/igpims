"use client"

import { KeyIcon, AlertTriangleIcon, WrenchIcon } from "lucide-react"
import { motion } from "framer-motion"

interface LockerControlsProps {
  status: string
}

export const LockerControls: React.FC<LockerControlsProps> = ({ status }) => {
  return (
    <div className="absolute right-0 bottom-0 left-0 mt-6 flex items-center justify-between bg-black/10 p-3 backdrop-blur-sm sm:p-3 md:p-4">
      <motion.div
        whileHover={
          status !== "under_maintenance" ? { scale: 1.2, rotate: 15 } : {}
        }
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {status === "inactive" && (
          <AlertTriangleIcon className="size-4 text-amber-300 sm:size-5 md:size-5" />
        )}
        {status === "active" && (
          <KeyIcon className="size-4 text-amber-300 sm:size-5 md:size-5" />
        )}
        {status === "under_maintenance" && (
          <motion.div
            animate={{ rotate: [0, 45, 0, -45, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
            }}
          >
            <WrenchIcon className="size-4 text-yellow-300 sm:size-5 md:size-5" />
          </motion.div>
        )}
      </motion.div>

      <motion.button
        className={`rounded-full px-2 py-0.5 font-medium text-[10px] sm:px-2.5 sm:py-0.5 sm:text-xs md:px-3 md:py-1 ${
          status === "active"
            ? "bg-white/20 text-white hover:bg-white/30"
            : status === "under_maintenance"
              ? "bg-black/30 text-white/50"
              : "bg-slate-700/50 text-slate-300"
        }`}
        whileHover={status !== "under_maintenance" ? { scale: 1.05 } : {}}
        whileTap={status !== "under_maintenance" ? { scale: 0.95 } : {}}
        disabled={status === "under_maintenance"}
      >
        {status === "active"
          ? "Rent"
          : status === "under_maintenance"
            ? "Unavailable"
            : "Occupied"}
      </motion.button>
    </div>
  )
}
