"use client"

import { useStyle } from "@/components/useStyle"
import { AnimatePresence, motion } from "framer-motion"
import GlobalNavbarIndustrial from "@/components/GlobalNavbarIndustrial"
import GlobalNavbarModern     from "@/components/GlobalNavbarModern"

export default function GlobalNavbar() {
  const { style } = useStyle()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={style}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{    opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {style === "industrial"
          ? <GlobalNavbarIndustrial />
          : <GlobalNavbarModern />
        }
      </motion.div>
    </AnimatePresence>
  )
}