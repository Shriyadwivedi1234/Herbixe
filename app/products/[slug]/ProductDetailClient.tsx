'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'
import { PRODUCTS } from '@/lib/products'
import ProductCard from '@/components/ui/ProductCard'

export default function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCartStore()

  const related = PRODUCTS
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  return (
    <main className="page-main">
      <div className="page-container-wide">

        <nav className="page-breadcrumb">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-gold transition-colors">Collection</Link>
          <span>/</span>
          <span className="text-gold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="h-[400px] lg:h-[520px] border border-gold/15 flex items-center justify-center relative overflow-hidden"
            style={{ background: 'radial-gradient(ellipse at 50% 60%, rgba(30,58,30,0.7) 0%, rgba(6,13,6,0.97) 100%)' }}
          >
            <span className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold" />
            <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold" />
            {product.badge && (
              <span className="absolute top-5 right-5 bg-gold text-dark text-[9px] tracking-widest px-3 py-1 font-body uppercase">
                {product.badge}
              </span>
            )}
            <span className="text-[100px] lg:text-[120px] leading-none"
                  style={{ filter: 'drop-shadow(0 0 40px rgba(201,168,76,0.35))', animation: 'float 4s ease-in-out infinite' }}>
              {product.icon}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-[9px] tracking-[0.35em] uppercase text-sage font-body mb-3">
              {product.category.replace(/-/g, ' ')}
            </p>
            <h1 className="font-display font-light text-4xl lg:text-5xl mb-2 text-cream">{product.name}</h1>
            <p className="font-display italic text-gold text-lg mb-4">{product.size}</p>

            <div className="flex items-center gap-3 my-4">
              <span className="text-gold text-sm tracking-widest">{'★'.repeat(Math.floor(product.rating))}</span>
              <span className="text-mist/40 text-xs font-body">{product.rating} · {product.review_count} reviews</span>
            </div>

            <p className="text-mist/65 text-sm leading-[2] font-body mb-6">{product.long_description}</p>

            <div className="mb-6">
              <p className="form-label mb-3">Key Benefits</p>
              <ul className="space-y-2">
                {product.benefits?.map(b => (
                  <li key={b} className="flex items-start gap-3 text-xs text-mist/65 font-body">
                    <span className="text-sage mt-0.5 flex-shrink-0">✦</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <p className="form-label mb-3">Ingredients</p>
              <div className="flex flex-wrap gap-2">
                {product.ingredients?.map(ing => (
                  <span key={ing} className="font-display italic text-[11px] text-sage border border-sage/30 px-3 py-1">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6 border-t border-gold/12">
              <div>
                <div className="font-display text-4xl text-gold font-light">
                  ₹{product.price.toLocaleString()}
                </div>
                {product.original_price && (
                  <div className="text-xs text-mist/30 line-through font-body">
                    ₹{product.original_price.toLocaleString()}
                  </div>
                )}
              </div>
              <button onClick={() => addItem(product)} className="btn-gold font-display italic text-sm flex-1 max-w-full sm:max-w-[220px]">
                Add to Cart
              </button>
            </div>

            <div className="flex flex-wrap gap-6 mt-5">
              <span className="text-[10px] tracking-widest text-sage font-body">✓ {product.stock} in stock</span>
              <span className="text-[10px] tracking-widest text-mist/35 font-body">Free shipping above ₹999</span>
            </div>
          </motion.div>
        </div>

        <div className="panel-moss mb-16">
          <p className="section-tag mb-5">How to Use</p>
          <p className="text-mist/65 text-sm leading-[2] font-body max-w-2xl">{product.how_to_use}</p>
        </div>

        {related.length > 0 && (
          <div>
            <p className="section-tag mb-10">You May Also Like</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/6 border border-gold/8">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
