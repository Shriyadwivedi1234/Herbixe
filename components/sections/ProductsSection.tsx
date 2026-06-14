import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import { PRODUCTS } from '@/lib/products'

export default function ProductsSection() {
  const featuredProducts = PRODUCTS.slice(0, 3)

  return (
    <section
      id="products"
      className="max-w-[1400px] mx-auto px-6 md:px-[60px] py-[120px]"
    >
      {/* Header */}
      <div className="text-center mb-20">
        <p className="flex items-center justify-center gap-4 mb-5 text-[10px] uppercase tracking-[0.4em] text-gold">
          <span className="w-10 h-px bg-gold" />
          Our Collection
          <span className="w-10 h-px bg-gold" />
        </p>

        <h2
          className="font-display font-light leading-[1.1] max-w-[500px] mx-auto mb-5"
          style={{ fontSize: 'clamp(38px,4vw,60px)' }}
        >
          Crafted for every{' '}
          <span className="italic text-sage">
            hair story
          </span>
        </h2>

        <p className="max-w-[480px] mx-auto text-[15px] leading-8 text-mist/70">
          Each formula is tested for a minimum of 6 months before launch.
          No shortcuts. No compromises.
        </p>
      </div>

      {/* Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredProducts.map((product, i) => (
          <div
            key={product.id}
            className="rounded-2xl overflow-hidden bg-forest/40"
          >
            <ProductCard
              product={product as any}
              index={i}
            />
          </div>
        ))}
      </div>

      {/* View All */}
      <div className="text-center mt-12">
        <Link
          href="/products"
          className="
            inline-block
            border
            border-gold
            text-gold
            px-11
            py-4
            text-[11px]
            uppercase
            tracking-[0.25em]
            transition-all
            duration-300
            hover:bg-gold
            hover:text-background
          "
        >
          View Full Collection
        </Link>
      </div>
    </section>
  )
}
