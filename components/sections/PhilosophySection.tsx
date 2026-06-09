'use client'

import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { motion } from 'framer-motion'

const stat = (num: string, label: string) => ({ num, label })
const stats = [stat('23+', 'Active Botanicals'), stat('0%', 'Synthetics'), stat('4.9★', 'Avg Rating')]

export default function PhilosophySection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const variants = {
    hidden:  { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.4, 0, 0.2, 1] } },
  }

  return (
    <section id="philosophy" className="py-36" ref={ref}>
      <div className="max-w-[1300px] mx-auto px-14 grid grid-cols-2 gap-20 items-center">

        {/* Visual — abstract botanical art */}
        <motion.div variants={variants} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="relative h-[580px] border border-gold/15">
          {/* Corner accents */}
          <span className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-gold" />
          <span className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-gold" />

          <svg viewBox="0 0 500 580" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Central botanical illustration */}
            <defs>
              <radialGradient id="phGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="rgba(74,124,74,0.25)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <rect width="500" height="580" fill="rgba(13,31,14,0.6)" />
            <ellipse cx="250" cy="290" rx="200" ry="240" fill="url(#phGlow)" />

            {/* Main stem */}
            <path d="M250,500 C250,400 230,300 250,150" stroke="#4a7c4a" strokeWidth="2.5" fill="none"/>
            {/* Leaves */}
            {[
              { y: 380, dir: 1 }, { y: 320, dir: -1 },
              { y: 260, dir: 1 }, { y: 200, dir: -1 },
            ].map((l, i) => (
              <g key={i}>
                <path d={`M250,${l.y} C${250 + l.dir * 80},${l.y - 30} ${250 + l.dir * 100},${l.y - 70} ${250 + l.dir * 30},${l.y - 80} C${250 + l.dir * 50},${l.y - 50} 250,${l.y} 250,${l.y}Z`}
                      fill="rgba(74,124,74,0.55)" stroke="#7a9e6e" strokeWidth="0.8"/>
                <path d={`M250,${l.y} L${250 + l.dir * 60},${l.y - 50}`}
                      stroke="#4a7c4a" strokeWidth="0.8" opacity="0.5"/>
              </g>
            ))}
            {/* Flower at top */}
            {[0,60,120,180,240,300].map((angle, i) => (
              <ellipse key={i}
                cx={250 + Math.cos(angle * Math.PI / 180) * 22}
                cy={150 + Math.sin(angle * Math.PI / 180) * 22}
                rx="12" ry="20"
                fill="rgba(201,168,76,0.35)" stroke="#c9a84c" strokeWidth="0.6"
                transform={`rotate(${angle},${250 + Math.cos(angle * Math.PI / 180) * 22},${150 + Math.sin(angle * Math.PI / 180) * 22})`}
              />
            ))}
            <circle cx="250" cy="150" r="10" fill="rgba(201,168,76,0.6)" stroke="#e8c96a" strokeWidth="1"/>

            {/* Decorative corner botanicals */}
            <text x="40"  y="80"  fontSize="28" opacity="0.2" fill="#7a9e6e">🌿</text>
            <text x="400" y="500" fontSize="24" opacity="0.2" fill="#7a9e6e">🌱</text>
            <text x="380" y="80"  fontSize="20" opacity="0.15" fill="#c9a84c">✦</text>
            <text x="60"  y="500" fontSize="16" opacity="0.15" fill="#c9a84c">✦</text>
          </svg>
        </motion.div>

        {/* Text */}
        <motion.div variants={variants} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          transition={{ delay: 0.2 }}>
          <div className="section-tag">Our Philosophy</div>
          <h2 className="font-display font-light leading-[1.1] mb-7"
              style={{ fontSize: 'clamp(32px,3.5vw,54px)' }}>
            Nature holds every<br />
            <span className="italic text-sage">secret your hair needs</span>
          </h2>
          <p className="text-mist/70 text-sm leading-[2] mb-4">
            At Herbixe, we believe that centuries of Ayurvedic wisdom hold solutions no laboratory can replicate.
            Each product is a careful distillation of botanicals known for their transformative effects on hair —
            encoded in the DNA of Indian herbalism for thousands of years.
          </p>
          <p className="text-mist/70 text-sm leading-[2]">
            We source herbs from certified organic farms across India's most fertile regions and process them
            with cold-press techniques that preserve every active compound.
          </p>

          <div className="flex gap-12 mt-14">
            {stats.map(({ num, label }) => (
              <div key={label} className="border-l-2 border-gold pl-5">
                <div className="font-display text-5xl text-gold font-light leading-none">{num}</div>
                <div className="text-[11px] tracking-wider text-mist/50 mt-1 font-body">{label}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
