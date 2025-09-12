"use client"

import { motion } from "framer-motion"

export default function ToBeAnnouncedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-muted-foreground text-center"
      >
        To be announced...
      </motion.div>
    </div>
  )
}
