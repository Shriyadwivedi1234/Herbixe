'use client'

import Link from 'next/link'
import { useCartStore, useCartHydrated } from '@/store/cartStore'
import { useAuth } from '@/components/providers/AuthProvider'

export default function Navbar() {
  const hydrated = useCartHydrated()
  const { toggleCart, items } = useCartStore()
  const { user, signOut, loading: authLoading } = useAuth()
  const count = hydrated ? items.reduce((s, i) => s + i.qty, 0) : 0

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-14 py-6 backdrop-blur-sm"
         style={{ background: 'linear-gradient(to bottom, rgba(26,18,8,0.95) 0%, rgba(26,18,8,0.7) 70%, transparent 100%)' }}>

      <Link href="/" className="font-display text-gold text-2xl tracking-widest font-light">
        Herb<span className="italic text-sage">ixe</span>
      </Link>

      <ul className="hidden md:flex gap-9 list-none">
        {[
          ['Our Story', '/our-story'],
          ['Collection', '/products'],
          ['Botanicals', '/#ingredients'],
          ['Process', '/#process'],
        ].map(([label, href]) => (
          <li key={label}>
            <Link href={href}
                  className="text-cream/70 text-[11px] tracking-[0.22em] uppercase font-body hover:text-gold transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        {!authLoading && (
          user ? (
            <button onClick={() => signOut()}
                    className="hidden sm:block text-cream/50 text-[10px] tracking-widest uppercase font-body hover:text-gold transition-colors">
              Sign Out
            </button>
          ) : (
            <Link href="/login?redirect=%2Fcheckout"
                  className="hidden sm:block text-cream/50 text-[10px] tracking-widest uppercase font-body hover:text-gold transition-colors">
              Sign In
            </Link>
          )
        )}
        <button onClick={toggleCart}
                className="flex items-center gap-2 border border-gold/40 bg-gold/10 text-gold
                           px-4 md:px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-body
                           hover:bg-gold hover:text-dark transition-all duration-300">
          ✦ Cart
          {count > 0 && (
            <span className="bg-gold text-dark rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>
    </nav>
  )
}
