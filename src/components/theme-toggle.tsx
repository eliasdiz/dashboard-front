"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon } from "lucide-react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {}}
      className="relative overflow-hidden rounded-full"
      aria-label="Toggle theme"
    >
      <div className="relative z-10"><Moon className="h-5 w-5" /></div>
      <motion.div
        className="absolute inset-0 bg-primary/10"
        initial={false}
        animate={{ scale: 0 }}
        transition={{ duration: 0.5 }}
        style={{ borderRadius: "100%" }}
      />
    </Button>
  )
}

