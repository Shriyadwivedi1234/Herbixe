import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gold/15 pt-20 pb-10 px-14"
            style={{ background: '#0d1208' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-16 mb-16">

          <div>
            <div className="font-display text-3xl text-gold tracking-widest mb-2">Herbixe ✦</div>
            <div className="font-display italic text-sage text-sm mb-4">&ldquo;Ancient herbs. Sacred science. Extraordinary hair.&rdquo;</div>
            <p className="text-xs text-mist/40 leading-[1.9] font-body">
              A premium botanical haircare brand rooted in Ayurvedic wisdom and driven by results.
              Every jar is a ritual. Every drop, a secret from the earth.
            </p>
          </div>

          {[
            {
              title: 'Collection',
              links: [
                ['Hair Pastes', '/products?category=hair-paste'],
                ['Herbal Oils', '/products?category=herbal-oil'],
                ['Gift Sets', '/products?category=premium-package'],
                ['Scalp Care', '/products?category=scalp-care'],
              ],
            },
            {
              title: 'Brand',
              links: [
                ['Our Story', '/our-story'],
                ['Botanicals', '/#ingredients'],
                ['Our Ritual', '/#process'],
                ['Sustainability', '/sustainability'],
              ],
            },
            {
              title: 'Support',
              links: [
                ['Track Order', '/track-order'],
                ['Returns', '/returns'],
                ['Hair Quiz', '/hair-quiz'],
                ['Contact Us', '/contact'],
              ],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-[9px] tracking-[0.35em] uppercase text-gold font-body font-medium mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="font-display italic text-mist/45 hover:text-gold transition-colors text-base">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gold/8 pt-7 flex justify-between items-center
                        text-[10px] tracking-widest text-mist/25 font-body">
          <span>© 2025 Herbixe. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms</Link>
            <Link href="/refund" className="hover:text-gold transition-colors">Refund Policy</Link>
          </div>
          <span>✦ Crafted with botanical love in India ✦</span>
        </div>
      </div>
    </footer>
  )
}
