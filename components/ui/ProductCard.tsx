'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

interface Props {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addItem } = useCartStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      className="group bg-ink border border-gold/10 hover:border-gold/40 transition-all duration-500
                 hover:-translate-y-1 cursor-none relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <Link href={`/products/${product.slug}`} className="block">
        <div className="h-64 relative overflow-hidden flex items-center justify-center border-b border-gold/8"
             style={{ background: 'radial-gradient(ellipse at 50% 70%, rgba(30,58,30,0.8) 0%, rgba(6,13,6,0.95) 100%)' }}>
          <span className="text-7xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                style={{ filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.35))', animation: `float ${2.5 + index * 0.3}s ease-in-out infinite` }}>
            {product.icon}
          </span>
          {product.badge && (
            <span className="absolute top-4 right-4 bg-gold text-dark text-[9px] tracking-widest uppercase px-3 py-1 font-body font-medium">
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      <div className="p-7">
        <Link href={`/products/${product.slug}`}>
          <p className="text-[9px] tracking-[0.35em] uppercase text-sage mb-2 font-body">
            {product.category.replace(/-/g, ' ')}
          </p>
          <h3 className="font-display text-xl mb-2.5 hover:text-gold transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-mist/60 leading-[1.8] mb-5 font-body">{product.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {product.ingredients.slice(0, 4).map(ing => (
            <span key={ing} className="font-display italic text-[10px] text-sage border border-sage/30 px-2.5 py-1">
              {ing}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gold/10 pt-5">
          <div className="font-display text-2xl text-gold font-light">
            ₹{product.price.toLocaleString()}
            <span className="font-body text-xs text-mist/40 ml-1 font-light">/ {product.size}</span>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); addItem(product) }}
            className="border border-gold/50 text-gold px-5 py-2.5 text-[9px] tracking-[0.2em]
                       uppercase font-body hover:bg-gold hover:text-dark transition-all duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  )
}
