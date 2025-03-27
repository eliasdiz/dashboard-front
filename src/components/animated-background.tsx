"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Gradient Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-background to-background"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 50%, rgba(66, 133, 244, 0.05) 0%, transparent 70%), radial-gradient(circle at 80% 20%, rgba(234, 67, 53, 0.05) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(52, 168, 83, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <Particle key={i} isDark={false} />
        ))}
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </>
  )
}

function Particle({ isDark }: { isDark: boolean }) {
  const size = Math.random() * 60 + 20
  const xPos = Math.random() * 100
  const yPos = Math.random() * 100
  const duration = Math.random() * 20 + 10
  const delay = Math.random() * 5

  // Google colors with opacity
  const colors = [
    isDark ? "rgba(66, 133, 244, 0.15)" : "rgba(66, 133, 244, 0.08)", // Blue
    isDark ? "rgba(234, 67, 53, 0.15)" : "rgba(234, 67, 53, 0.08)", // Red
    isDark ? "rgba(251, 188, 5, 0.15)" : "rgba(251, 188, 5, 0.08)", // Yellow
    isDark ? "rgba(52, 168, 83, 0.15)" : "rgba(52, 168, 83, 0.08)", // Green
  ]

  const color = colors[Math.floor(Math.random() * colors.length)]

  return (
    <motion.div
      className="absolute rounded-full blur-xl"
      style={{
        width: size,
        height: size,
        left: `${xPos}%`,
        top: `${yPos}%`,
        background: color,
      }}
      animate={{
        x: [0, Math.random() * 100 - 50],
        y: [0, Math.random() * 100 - 50],
      }}
      transition={{
        duration,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
        delay,
      }}
    />
  )
}

