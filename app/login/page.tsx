"use client"

import { useStyle } from "@/components/useStyle"
import { AnimatePresence, motion } from "framer-motion"
import LoginPageIndustrial from "@/components/LoginPageIndustrial"
import LoginPageModern     from "@/components/LoginPageModern"

export default function LoginPage() {
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
          ? <LoginPageIndustrial />
          : <LoginPageModern />
        }
      </motion.div>
    </AnimatePresence>
  )
}