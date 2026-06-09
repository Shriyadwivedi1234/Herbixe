'use client'

import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { PRODUCTS } from '@/lib/products'

export default function FeaturedProduct() {
  const { addItem } = useCartStore()
  const product = PRODUCTS[0] // Bhringraj Power Paste

  return (
    <section className="max-w-[1300px] mx-auto px-14 mb-32">
      <motion.div
        initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.9 }}
        className="grid grid-cols-2 border border-gold/20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(13,31,14,0.9), rgba(6,13,6,0.98))' }}>

        {/* Visual */}
        <div className="h-[480px] flex items-center justify-center relative"
             style={{ background: 'radial-gradient(ellipse at 40% 50%, rgba(201,168,76,0.08), transparent 70%)' }}>
          <span className="text-[140px] leading-none"
                style={{ filter: 'drop-shadow(0 0 50px rgba(201,168,76,0.3))', animation: 'float 4s ease-in-out infinite' }}>
            🌿
          </span>
        </div>

        {/* Content */}
        <div className="p-16 flex flex-col justify-center">
          <span className="inline-block font-display italic text-xs tracking-[0.3em] uppercase text-gold
                           border border-gold/40 bg-gold/7 px-4 py-1.5 mb-6 self-start">
            ✦ Bestselling Ritual ✦
          </span>
          <h2 className="font-display font-light text-5xl mb-2">Bhringraj</h2>
          <p className="font-display italic text-gold text-xl mb-5">Power Paste — The Growth Formula</p>
          <p className="text-mist/65 text-sm leading-[2] mb-6 font-body">
            Our most potent formula. A rich herbal paste loaded with Bhringraj, Amla, and Methi —
            the sacred trinity of hair regrowth. Apply, leave for 45 minutes, and let ancient
            botanical magic transform your hair in 4 weeks.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {product.ingredients.map(ing => (
              <span key={ing} className="font-display italic text-[10px] text-sage border border-sage/30 px-3 py-1">
                {ing}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <div className="font-display text-4xl text-gold font-light">
              ₹649 <span className="font-body text-sm text-mist/40">/ 200g</span>
            </div>
            <button
              onClick={() => addItem(product)}
              className="btn-gold font-display italic text-sm">
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
