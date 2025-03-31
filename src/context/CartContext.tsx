"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState } from "react"
// import { toast } from "@/components/ui/use-toast"

// Define types
export type CartItem = {
  id: string
  name: string
  location: string
  price: number
  image?: string
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART"; payload?: boolean }

type CartContextType = {
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  toggleCart: (isOpen?: boolean) => void
  totalItems: number
  totalPrice: number
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM":
      // Check if item already exists
      const existingItemIndex = state.items.findIndex((item) => item.id === action.payload.id)

      if (existingItemIndex > -1) {
        // Item already exists, don't add it again
        // toast({
        //   title: "Item already in cart",
        //   description: `${action.payload.name} is already in your cart.`,
        //   variant: "destructive",
        // })
        return state
      }

      // // Add new item
      // toast({
      //   title: "Item added to cart",
      //   description: `${action.payload.name} has been added to your cart.`,
      // })
      return {
        ...state,
        items: [...state.items, action.payload],
      }

    case "REMOVE_ITEM":
      const itemToRemove = state.items.find((item) => item.id === action.payload)
      console.log(itemToRemove?.name)
      // toast({
      //   title: "Item removed",
      //   description: `${itemToRemove?.name || "Item"} has been removed from your cart.`,
      // })
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: action.payload !== undefined ? action.payload : !state.isOpen,
      }

    default:
      return state
  }
}

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: CartState = {
    items: [],
    isOpen: false,
  }

  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Calculate derived values
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    setTotalItems(state.items.length)
    setTotalPrice(state.items.reduce((total, item) => total + item.price, 0))
  }, [state.items]) // ✅ Recalcula totalItems y totalPrice cuando cambia el estado

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      parsedCart.forEach((item: CartItem) => {
        dispatch({ type: "ADD_ITEM", payload: item })
      })
    }
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items))
  }, [state.items])

  // Action creators
  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const toggleCart = (isOpen?: boolean) => {
    dispatch({ type: "TOGGLE_CART", payload: isOpen })
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        clearCart,
        toggleCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

