"use client"

import { motion } from "framer-motion"

export function AnimatedLogo() {

  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20">
      {/* Logo Container with Glow Effect */}
      <div className={`absolute inset-0 rounded-full animate-glow-light`} />

      {/* Logo Elements */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Google-inspired logo */}
        <div className="relative w-full h-full">
          {/* Blue circle */}
          <motion.div
            className="absolute w-1/2 h-1/2 bg-primary rounded-tl-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />

          {/* Red circle */}
          <motion.div
            className="absolute w-1/2 h-1/2 bg-destructive rounded-tr-full right-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />

          {/* Yellow circle */}
          <motion.div
            className="absolute w-1/2 h-1/2 bg-muted rounded-bl-full bottom-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />

          {/* Green circle */}
          <motion.div
            className="absolute w-1/2 h-1/2 bg-secondary rounded-br-full bottom-0 right-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          />

          {/* Center white circle */}
          <motion.div
            className="absolute w-1/3 h-1/3 bg-background rounded-full top-1/3 left-1/3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  )
}

