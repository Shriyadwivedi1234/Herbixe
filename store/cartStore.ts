'use client'

import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Wait for localStorage rehydration before rendering cart values (avoids hydration mismatch). */
export function useCartHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

// Matches PRODUCTS shape from lib/products.ts
export interface CartProduct {
  id: string
  name: string
  slug: string
  category: string
  price: number
  size: string
  description: string
  icon: string
  badge?: string
  ingredients: string[]
  [key: string]: any
}

export interface CartItem {
  product: CartProduct
  qty: number
}

interface CartState {
  items:      CartItem[]
  isOpen:     boolean
  addItem:    (product: CartProduct) => void
  removeItem: (productId: string) => void
  updateQty:  (productId: string, qty: number) => void
  clearCart:  () => void
  toggleCart: () => void
  openCart:   () => void
  closeCart:  () => void
  subtotal:   () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem: (product) => {
        const existing = get().items.find(i => i.product.id === product.id)
        if (existing) {
          set(s => ({
            items: s.items.map(i =>
              i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
            ),
          }))
        } else {
          set(s => ({ items: [...s.items, { product, qty: 1 }] }))
        }
      },

      removeItem: (productId) =>
        set(s => ({ items: s.items.filter(i => i.product.id !== productId) })),

      updateQty: (productId, qty) => {
        if (qty <= 0) { get().removeItem(productId); return }
        set(s => ({
          items: s.items.map(i =>
            i.product.id === productId ? { ...i, qty } : i
          ),
        }))
      },

      clearCart:  () => set({ items: [] }),
      toggleCart: () => set(s => ({ isOpen: !s.isOpen })),
      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
      subtotal:   () => get().items.reduce((sum, i) => sum + i.product.price * i.qty, 0),
    }),
    {
      name: 'herbixe-cart',
      partialize: (s) => ({ items: s.items }),
    }
  )
)
