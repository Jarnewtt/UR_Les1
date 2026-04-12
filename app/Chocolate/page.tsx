"use client";
import { useStyle } from "@/components/useStyle";
import { AnimatePresence, motion } from "framer-motion";
import ChocolatePageIndustrial from "@/components/ChocolatePageIndustrial";
import ChocolatePageModern from "@/components/ChocolatePageModern";

export default function ChocolatePage() {
  const { style } = useStyle();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={style}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
        {style === "industrial" ? <ChocolatePageIndustrial /> : <ChocolatePageModern />}
      </motion.div>
    </AnimatePresence>
  );
}
