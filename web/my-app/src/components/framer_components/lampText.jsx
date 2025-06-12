import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "../ui/lamp";

export function LampText() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 30 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-900 font-extrabold font-mono to-slate-500 py-4 bg-clip-text text-center text-4xl tracking-tight text-transparent md:text-7xl"
      >
        Welcome To Our Online Medical Clinic
      </motion.h1>
    </LampContainer>
  );
}
