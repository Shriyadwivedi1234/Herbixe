import ProductCard from '@/components/ui/ProductCard'
import { PRODUCTS } from '@/lib/products'

export default function ProductsSection() {
  return (
    <section id="products" className="py-28">
      <div className="max-w-[1300px] mx-auto px-14">

        <div className="text-center mb-20">
          <div className="section-tag justify-center before:w-12 after:w-12">The Collection</div>
          <h2 className="font-display font-light leading-[1.1] mb-5"
              style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}>
            Crafted for every <span className="italic text-gold">hair story</span>
          </h2>
          <p className="text-mist/60 text-sm leading-relaxed max-w-lg mx-auto font-body">
            Each formula tested for 6 months before launch. No shortcuts. No compromises. Only botanical truth.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-px bg-gold/6 border border-gold/8">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product as any} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
