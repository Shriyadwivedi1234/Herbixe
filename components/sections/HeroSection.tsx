'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

// Lazy-load the 3D canvas — not SSR compatible
const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false })

const fadeUp = (delay = 0) => ({
  initial:   { opacity: 0, y: 28 },
  animate:   { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] },
})

export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center">

      {/* 3D Canvas background */}
      <HeroScene />

        {/* Top-left corner */}
        <g transform="translate(30,30)" opacity="0.5" fill="none" stroke="#c9a84c" strokeWidth="0.8">
          <path d="M0,0 C20,40 10,80 30,120" strokeWidth="1.2"/>
          <path d="M12,35 C-10,20 -25,45 5,55 C-5,35 12,35 12,35Z" fill="rgba(30,80,30,0.5)" strokeWidth="0.6"/>
          <path d="M20,70 C-5,60 -20,85 12,90 C0,70 20,70 20,70Z" fill="rgba(30,80,30,0.5)" strokeWidth="0.6"/>
          <path d="M15,50 C35,35 55,55 30,65 C40,48 15,50 15,50Z" fill="rgba(30,80,30,0.5)" strokeWidth="0.6"/>
          <path d="M0,0 L200,0" strokeWidth="0.5" opacity="0.4"/>
          <path d="M0,0 L0,200" strokeWidth="0.5" opacity="0.4"/>
          <path d="M0,0 L40,0 L40,8 L8,8 L8,40 L0,40Z" fill="rgba(201,168,76,0.1)" strokeWidth="0.8"/>
        </g>
        {/* Top-right corner */}
        <g transform="translate(1410,30) scale(-1,1)" opacity="0.5" fill="none" stroke="#c9a84c" strokeWidth="0.8">
          <path d="M0,0 C20,40 10,80 30,120" strokeWidth="1.2"/>
          <path d="M12,35 C-10,20 -25,45 5,55 C-5,35 12,35 12,35Z" fill="rgba(30,80,30,0.5)" strokeWidth="0.6"/>
          <path d="M20,70 C-5,60 -20,85 12,90 C0,70 20,70 20,70Z" fill="rgba(30,80,30,0.5)" strokeWidth="0.6"/>
          <path d="M15,50 C35,35 55,55 30,65 C40,48 15,50 15,50Z" fill="rgba(30,80,30,0.5)" strokeWidth="0.6"/>
          <path d="M0,0 L200,0" strokeWidth="0.5" opacity="0.4"/>
          <path d="M0,0 L0,200" strokeWidth="0.5" opacity="0.4"/>
          <path d="M0,0 L40,0 L40,8 L8,8 L8,40 L0,40Z" fill="rgba(201,168,76,0.1)" strokeWidth="0.8"/>
        </g>
        {/* Bottom-left */}
        <g transform="translate(30,870) scale(1,-1)" opacity="0.5" fill="none" stroke="#c9a84c" strokeWidth="0.8">
          <path d="M0,0 C20,40 10,80 30,120" strokeWidth="1.2"/>
          <path d="M12,35 C-10,20 -25,45 5,55 C-5,35 12,35 12,35Z" fill="rgba(30,80,30,0.5)" strokeWidth="0.6"/>
          <path d="M0,0 L200,0" strokeWidth="0.5" opacity="0.4"/>
          <path d="M0,0 L0,200" strokeWidth="0.5" opacity="0.4"/>
          <path d="M0,0 L40,0 L40,8 L8,8 L8,40 L0,40Z" fill="rgba(201,168,76,0.1)" strokeWidth="0.8"/>
        </g>
        {/* Bottom-right */}
        <g transform="translate(1410,870) scale(-1,-1)" opacity="0.5" fill="none" stroke="#c9a84c" strokeWidth="0.8">
          <path d="M0,0 C20,40 10,80 30,120" strokeWidth="1.2"/>
          <path d="M12,35 C-10,20 -25,45 5,55 C-5,35 12,35 12,35Z" fill="rgba(30,80,30,0.5)" strokeWidth="0.6"/>
          <path d="M0,0 L200,0" strokeWidth="0.5" opacity="0.4"/>
          <path d="M0,0 L0,200" strokeWidth="0.5" opacity="0.4"/>
          <path d="M0,0 L40,0 L40,8 L8,8 L8,40 L0,40Z" fill="rgba(201,168,76,0.1)" strokeWidth="0.8"/>
        </g>


      {/* Hero text */}
<div className="relative z-20 text-center px-5 max-w-4xl">
  <motion.p
    {...fadeUp(0.5)}
    className="uppercase text-[11px] tracking-[0.4em] text-sage mb-6"
  >
    Pure • Potent • Botanical
  </motion.p>

  <motion.h1
    {...fadeUp(0.8)}
    className="font-display font-light leading-[0.9]"
    style={{
      fontSize: 'clamp(64px,10vw,140px)',
      textShadow: '0 0 60px rgba(201,168,76,0.18)',
    }}
  >
    Where Herbs
    <br />
    <em
      className="block text-gold not-italic"
      style={{
        fontStyle: 'italic',
      }}
    >
      Transform Hair
    </em>
  </motion.h1>

  <motion.p
    {...fadeUp(1.2)}
    className="mx-auto mt-7 max-w-[420px] text-[14px] tracking-[0.15em] text-mist leading-[1.8]"
  >
    Ancient botanical wisdom meets modern formulation science.
    Herbixe creates haircare that truly works.
  </motion.p>

  <motion.div
    {...fadeUp(1.5)}
    className="flex flex-wrap justify-center gap-5 mt-12"
  >
    <a
      href="#products"
      className="px-11 py-4 text-[11px] uppercase tracking-[0.25em] border border-gold bg-gold text-dark transition-all duration-300 hover:scale-105"
    >
      Explore Collection
    </a>

    <a
      href="#philosophy"
      className="px-11 py-4 text-[11px] uppercase tracking-[0.25em] border border-white/30 text-cream transition-all duration-300 hover:border-gold hover:text-gold"
    >
      Our Philosophy
    </a>
  </motion.div>
</div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="font-display italic text-gold text-[10px] tracking-[0.4em] uppercase">
          Scroll Down
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent animate-breathe" />
      </motion.div>
    </section>
  )
}
