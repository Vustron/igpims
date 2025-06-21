"use client"

import { motion } from "framer-motion"
import { AlertTriangleIcon, KeyIcon, WrenchIcon } from "lucide-react"

interface LockerControlsProps {
  status: string
}

export const LockerControls: React.FC<LockerControlsProps> = ({ status }) => {
  return (
    <div className="absolute right-0 bottom-0 left-0 flex items-center justify-between bg-black/15 p-1.5 backdrop-blur-sm sm:p-2 md:p-2.5">
      <motion.div
        whileHover={
          status !== "under_maintenance" ? { scale: 1.2, rotate: 15 } : {}
        }
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {status === "inactive" && (
          <AlertTriangleIcon className="size-2.5 text-amber-300 sm:size-3 md:size-3.5" />
        )}
        {status === "active" && (
          <KeyIcon className="size-2.5 text-amber-300 sm:size-3 md:size-3.5" />
        )}
        {status === "under_maintenance" && (
          <motion.div
            animate={{ rotate: [0, 45, 0, -45, 0] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
            }}
          >
            <WrenchIcon className="size-2.5 text-yellow-300 sm:size-3 md:size-3.5" />
          </motion.div>
        )}
      </motion.div>

      <motion.button
        className={`rounded-full px-1.5 py-0.5 font-medium text-[7px] sm:text-[8px] md:text-[9px] ${
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
            : "Used"}
      </motion.button>
    </div>
  )
}
