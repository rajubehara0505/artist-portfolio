"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Artwork } from "@/lib/artworks-data"

interface CartItem extends Artwork {
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (artwork: Artwork) => void
  removeItem: (artworkId: string) => void
  clearCart: () => void
  getTotalPrice: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (artwork) => {
        const items = get().items
        const existingItem = items.find((item) => item.id === artwork.id)

        if (existingItem) {
          set({
            items: items.map((item) => (item.id === artwork.id ? { ...item, quantity: item.quantity + 1 } : item)),
          })
        } else {
          set({ items: [...items, { ...artwork, quantity: 1 }] })
        }
      },
      removeItem: (artworkId) => {
        set({ items: get().items.filter((item) => item.id !== artworkId) })
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.discount ? item.price - (item.price * item.discount) / 100 : item.price
          return total + price * item.quantity
        }, 0)
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
