import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      className="pt-20 pb-10 px-14"
      style={{ background: '#231900' }}
    >
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-16 mb-16">

          <div>
            <div className="font-display text-4xl text-gold tracking-widest mb-3">
              Herbixe
            </div>

            <div className="font-display italic text-sage text-base mb-5">
              &ldquo;Ancient herbs. Sacred science. Extraordinary hair.&rdquo;
            </div>

            <p className="text-sm text-mist/50 leading-[2] font-body max-w-md">
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
              <h4 className="text-[10px] tracking-[0.35em] uppercase text-gold font-body font-medium mb-5">
                {title}
              </h4>

              <ul className="space-y-4">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="font-display italic text-mist/55 hover:text-gold transition-colors text-lg"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-8 flex justify-between items-center flex-wrap gap-4
          text-xs tracking-[0.2em] text-mist/35 font-body"
        >
          <span>© 2025 Herbixe. All rights reserved.</span>

          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-gold transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Terms
            </Link>
            <Link href="/refund" className="hover:text-gold transition-colors">
              Refund Policy
            </Link>
          </div>

        </div>
      </div>
    </footer>
  )
}
