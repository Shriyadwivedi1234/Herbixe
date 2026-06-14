'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCartStore, useCartHydrated } from '@/store/cartStore'
import { useAuth } from '@/components/providers/AuthProvider'

const NAV_LINKS = [
  ['Our Story', '/our-story'],
  ['Collection', '/products'],
  ['Hair Quiz', '/hair-quiz'],
  ['Ingredients', '/#ingredients'],
  ['Process', '/#process'],
]

export default function Navbar() {
  const hydrated = useCartHydrated()
  const { toggleCart, items } = useCartStore()
  const { user, signOut, loading: authLoading } = useAuth()
  const count = hydrated ? items.reduce((s, i) => s + i.qty, 0) : 0
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-14 py-5 md:py-6 backdrop-blur-sm"
           style={{ background: 'linear-gradient(to bottom, rgba(26,18,8,0.95) 0%, rgba(26,18,8,0.7) 70%, transparent 100%)' }}>

        <Link href="/" className="font-display text-gold text-2xl tracking-widest font-light">
          Herb<span className="italic text-sage">ixe</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex gap-9 list-none">
          {NAV_LINKS.map(([label, href]) => (
            <li key={label}>
              <Link href={href}
                    className="text-cream/70 text-[11px] tracking-[0.22em] uppercase font-body hover:text-gold transition-colors">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Desktop auth buttons */}
          <div className="hidden sm:block">
            {!authLoading && (
              user ? (
                <Link href="/account" className="text-cream/50 text-[10px] tracking-widest uppercase font-body hover:text-gold transition-colors mr-3">
                  Account
                </Link>
              ) : (
                <Link href="/login?redirect=%2Fcheckout"
                      className="text-cream/50 text-[10px] tracking-widest uppercase font-body hover:text-gold transition-colors mr-3">
                  Sign In
                </Link>
              )
            )}
          </div>

          {/* Cart button */}
          <button onClick={toggleCart}
                  className="flex items-center gap-2 border border-gold/40 bg-gold/10 text-gold
                             px-4 md:px-5 py-2.5 text-[11px] tracking-[0.2em] uppercase font-body
                             hover:bg-gold hover:text-dark transition-all duration-300">
            <span className="hidden sm:inline">✦ Cart</span>
            <span className="sm:hidden">✦</span>
            {count > 0 && (
              <span className="bg-gold text-dark rounded-full w-4 h-4 text-[9px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>

          {/* Hamburger button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2 -mr-2"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-px bg-gold transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
            <span className={`w-5 h-px bg-gold transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Mobile menu drawer */}
      <div className={`fixed top-0 left-0 right-0 z-45 bg-bark border-b border-gold/20 md:hidden transition-all duration-400 ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
           style={{ paddingTop: '70px', zIndex: 45 }}>
        <div className="px-6 py-6 space-y-5">
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block text-cream/80 text-sm tracking-widest uppercase font-body hover:text-gold transition-colors py-2"
            >
              {label}
            </Link>
          ))}
          <div className="border-t border-gold/15 pt-4">
            {!authLoading && (
              user ? (
                <>
                  <Link href="/account" onClick={() => setMenuOpen(false)} className="block text-sm text-gold mb-3">My Account</Link>
                  <button onClick={() => { signOut(); setMenuOpen(false) }} className="text-sm text-cream/50 uppercase tracking-widest">Sign Out</button>
                </>
              ) : (
                <Link href="/login?redirect=%2Fcheckout" onClick={() => setMenuOpen(false)} className="block text-sm text-gold">Sign In</Link>
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}
