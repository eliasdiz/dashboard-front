"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { BusinessFormValues } from "../business-form-dialog"

export default function CartModal() {
  const { state, removeItem, toggleCart, totalItems, totalPrice } = useCart()

  const handleCheckout = () => {
    // Implement checkout logic here
    console.log("Proceeding to checkout with items:", state.items)
    // This would typically redirect to a checkout page
    toggleCart(false)
  }

  return (
    <Sheet open={state.isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-[1rem]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </SheetTitle>
        </SheetHeader>

        {totalItems > 0 ? (
          <>
            <ScrollArea className="flex-1 my-4 pr-4">
              <AnimatePresence initial={false}>
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <CartItemCard key={item.locationId} item={item} onRemove={removeItem} />
                  ))}
                </div>
              </AnimatePresence>
            </ScrollArea>

            <Separator className="my-2" />

            <div className="space-y-4 mt-auto">
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <SheetFooter>
                <Button onClick={handleCheckout} className="w-full" size="lg">
                  Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 py-8">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Your cart is empty</h3>
            <p className="text-muted-foreground text-center mt-1 mb-6">Add some businesses to get started</p>
            <Button onClick={() => toggleCart(false)}>Continue Shopping</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

// Cart Item Card Component
function CartItemCard({
  item,
  onRemove,
}: {
  item: BusinessFormValues
  onRemove: (id: string) => void
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 p-3 rounded-lg border"
    >
      <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
          <ShoppingCart className="h-6 w-6" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{item.name}</h3>
        <p className="text-sm text-muted-foreground">{item.location}</p>

        <div className="flex items-center justify-between mt-1">
          <span className="font-medium">${item.price.toFixed(2)}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onRemove(item.locationId)}
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

