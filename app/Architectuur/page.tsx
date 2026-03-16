"use client"

import { useStyle } from "@/components/useStyle"
import { AnimatePresence, motion } from "framer-motion"
import ArchitectuurPageIndustrial from "@/components/ArchitectuurPageIndustrial"
import ArchitectuurPageModern     from "@/components/ArchitectuurPageModern"

export default function ArchitectuurPage() {
  const { style } = useStyle()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={style}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{    opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {style === "industrial"
          ? <ArchitectuurPageIndustrial />
          : <ArchitectuurPageModern />
        }
      </motion.div>
    </AnimatePresence>
  )
}