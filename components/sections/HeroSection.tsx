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

      {/* SVG botanical corner frame */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10"
           viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="vig">
            <stop offset="30%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(10,15,10,0.85)" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#vig)" />

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

        {/* Sparkle dots */}
        <g fill="#c9a84c" opacity="0.35">
          <text x="120" y="240" fontSize="10">✦</text>
          <text x="1280" y="180" fontSize="8">✦</text>
          <text x="80"   y="680" fontSize="6">✦</text>
          <text x="1350" y="700" fontSize="10">✦</text>
        </g>
      </svg>

      {/* Hero text */}
      <div className="relative z-20 text-center px-5 max-w-2xl">
        <motion.p {...fadeUp(0.5)}
          className="font-display italic tracking-[0.5em] text-gold text-sm uppercase mb-5">
          Ancient Botanicals · Sacred Formulas
        </motion.p>

        <motion.h1 {...fadeUp(0.8)}
          className="font-display font-light leading-[0.95] mb-6"
          style={{ fontSize: 'clamp(52px,9vw,110px)', textShadow: '0 0 60px rgba(201,168,76,0.25)' }}>
          Herbixe<br />
          <span className="italic text-gold">Botanical Rituals</span>
        </motion.h1>

        <motion.div {...fadeUp(1.1)}
          className="flex items-center justify-center gap-4 my-6">
          <div className="h-px bg-gradient-to-r from-transparent to-gold w-20" />
          <span className="text-gold">✦</span>
          <div className="h-px bg-gradient-to-l from-transparent to-gold w-20" />
        </motion.div>

        <motion.p {...fadeUp(1.3)}
          className="font-display italic text-mist/80 text-lg leading-relaxed">
          Where the wisdom of ancient herbs meets<br />the alchemy of modern science.
        </motion.p>

        <motion.div {...fadeUp(1.6)} className="flex gap-5 justify-center mt-11">
          <a href="#products" className="btn-gold font-display italic">Explore the Collection</a>
          <a href="#philosophy" className="btn-ghost">Our Philosophy</a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="font-display italic text-gold text-[10px] tracking-[0.4em] uppercase">
          Discover the Magic
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent animate-breathe" />
      </motion.div>
    </section>
  )
}
