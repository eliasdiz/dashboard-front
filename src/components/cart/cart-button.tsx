"use client"
import { motion } from "framer-motion"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"

export default function CartButton() {
  const { toggleCart, totalItems } = useCart()

  return (
    <motion.button
      className="z-50 flex items-center justify-center w-8 h-8 rounded-full text-primary shadow-lg"
      onClick={() => toggleCart(true)}
      aria-label="Open shopping cart"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ShoppingCart className="h-4 w-4" />

      {totalItems > 0 && (
        <motion.div
          className="absolute top-1 right-[4rem] flex items-center justify-center w-5 h-5 rounded-full bg-destructive text-white text-xs font-bold"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {totalItems}
        </motion.div>
      )}
    </motion.button>
  )
}

