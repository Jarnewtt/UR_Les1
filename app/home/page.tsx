"use client"

import { useStyle } from "@/components/useStyle"
import HomePageIndustrial from "@/components/HomePageIndustrial"
import HomePageModern     from "@/components/HomePageModern"
import { AnimatePresence, motion } from "framer-motion"

export default function HomePage() {
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
        {style === "industrial" ? <HomePageIndustrial /> : <HomePageModern />}
      </motion.div>
    </AnimatePresence>
  )
}