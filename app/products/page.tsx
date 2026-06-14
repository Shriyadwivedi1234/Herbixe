import { Metadata } from 'next'
import { filterByCategory, CATEGORY_LABELS } from '@/lib/products'
import ProductCard from '@/components/ui/ProductCard'

export const metadata: Metadata = {
  title: 'Collection — Herbixe',
  description: 'Browse Herbixe\'s complete range of botanical hair pastes, herbal oils, and premium ritual kits.',
}

const CATEGORIES = Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label }))

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const active   = searchParams.category || 'all'
  const filtered = filterByCategory(active)

  return (
    <main className="page-main">
      <div className="page-container-wide">
        <div className="text-center mb-16">
          <div className="section-tag-center mb-6">The Collection</div>
          <h1 className="font-display font-light mb-4 text-4xl md:text-6xl">
            Botanical <span className="italic text-gold">Rituals</span>
          </h1>
          <p className="text-mist/55 text-sm font-body max-w-md mx-auto leading-relaxed">
            Every formula tested for 6 months. No shortcuts. No compromises.
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-14 flex-wrap">
          {CATEGORIES.map(({ key, label }) => (
            <a key={key} href={`/products?category=${key}`}
               className={`pill ${active === key ? 'pill-active' : ''}`}>
              {label}
            </a>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <div key={product.id} className="rounded-2xl overflow-hidden bg-forest/40">
                <ProductCard product={product} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-mist/40 font-display italic text-xl py-20">
            No products found in this category.
          </p>
        )}
      </div>
    </main>
  )
}
