'use client'

import { useCartStore, useCartHydrated } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'

export default function CartDrawer() {
  const hydrated = useCartHydrated()
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal } = useCartStore()
  const router = useRouter()
  const { user } = useAuth()
  const cartItems = hydrated ? items : []
  const total  = hydrated ? subtotal() : 0

  const handleCheckout = () => {
    closeCart()
    router.push(user ? '/checkout' : '/login?redirect=%2Fcheckout')
  }

  return (
    <>
      {/* Overlay */}
      <div onClick={closeCart}
           className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[1999] transition-opacity duration-400
                       ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} />

      {/* Drawer */}
      <aside className={`fixed right-0 top-0 bottom-0 w-full sm:w-[420px] bg-bark z-[2000] flex flex-col
                         border-l border-gold/20 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                         ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-7 border-b border-gold/12">
          <h3 className="font-display text-2xl font-light text-gold">Your Ritual Cart</h3>
          <button onClick={closeCart} className="text-cream/50 hover:text-cream text-xl transition-colors">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-5">
          {cartItems.length === 0 ? (
            <p className="text-center mt-16 font-display italic text-mist/40 text-base">
              Your sacred cart awaits…
            </p>
          ) : (
            cartItems.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-4 py-4 border-b border-gold/10 items-center">
                <div className="w-14 h-14 bg-moss/30 border border-gold/15 flex items-center justify-center text-2xl flex-shrink-0">
                  {product.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-cream mb-1">{product.name}</p>
                  <p className="font-display text-gold text-base">₹{product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQty(product.id, qty - 1)}
                            className="w-6 h-6 border border-gold/30 text-gold text-sm hover:bg-gold hover:text-dark transition-all">−</button>
                    <span className="text-xs text-cream/70">{qty}</span>
                    <button onClick={() => updateQty(product.id, qty + 1)}
                            className="w-6 h-6 border border-gold/30 text-gold text-sm hover:bg-gold hover:text-dark transition-all">+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(product.id)}
                        className="text-cream/30 hover:text-cream text-sm transition-colors">✕</button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gold/12">
          <div className="flex justify-between font-display text-xl mb-5">
            <span>Total</span>
            <span className="text-gold">₹{total.toLocaleString()}</span>
          </div>
          <button onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-gold to-gold-dk text-dark py-4 font-display
                             text-sm tracking-wider hover:shadow-[0_0_40px_rgba(201,168,76,0.4)]
                             transition-all duration-300 hover:-translate-y-0.5">
            Begin the Ritual — Checkout
          </button>
          <p className="text-center text-[9px] tracking-widest text-mist/30 mt-3 font-body">
            Secured by Razorpay · UPI · Cards · NetBanking
          </p>
        </div>
      </aside>
    </>
  )
}
