'use client'

import { useCartStore } from '@/store/cartStore'
import { PRODUCTS } from '@/lib/products'

export default function FeaturedProduct() {
  const { addItem } = useCartStore()
  const product = PRODUCTS[0]

  return (
    <section className="max-w-[1300px] mx-auto px-6 md:px-14 mb-20 md:mb-32">
      <div
        className="grid grid-cols-1 md:grid-cols-2 overflow-hidden border"
        style={{
          borderColor: '#2d2412',
          background:
            'linear-gradient(135deg, #161108 0%, #1b1409 100%)',
        }}
      >
        {/* Product Visual */}

        <div
          className="
            h-[320px]
            md:h-[520px]
            flex
            items-center
            justify-center
            relative
            overflow-hidden
          "
        >
          {/* Background Glow */}

          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at center, rgba(201,168,76,0.12), transparent 70%)',
            }}
          />

          {/* Decorative Ring */}

          <div
            className="
              absolute
              w-[320px]
              h-[320px]
              rounded-full
              border
            "
            style={{
              borderColor: 'rgba(201,168,76,0.12)',
            }}
          />

          {/* Product Icon */}

          <div
            className="
              relative
              z-10
              text-[180px]
              md:text-[220px]
            "
            style={{
              filter:
                'drop-shadow(0 0 40px rgba(201,168,76,0.25))',
            }}
          >
            {product.icon}
          </div>

          {/* Decorative Dots */}

          <div
            className="absolute top-16 left-16 w-2 h-2 rounded-full"
            style={{ background: '#c9a84c' }}
          />

          <div
            className="absolute bottom-20 right-20 w-3 h-3 rounded-full"
            style={{ background: '#7a9e6e' }}
          />
        </div>

        {/* Content */}

        <div className="p-8 md:p-16 flex flex-col justify-center">
          <span
            className="
              inline-block
              text-[10px]
              tracking-[0.3em]
              uppercase
              px-4
              py-2
              mb-6
              self-start
              border
            "
            style={{
              color: '#c9a84c',
              borderColor: '#3b321d',
              background: 'rgba(201,168,76,0.05)',
            }}
          >
            ✦ Bestselling Ritual ✦
          </span>

          <h2
            className="
              font-display
              font-light
              text-5xl
              mb-2
            "
            style={{ color: '#f5f0e8' }}
          >
            Bhringraj
          </h2>

          <p
            className="
              font-display
              italic
              text-xl
              mb-5
            "
            style={{ color: '#c9a84c' }}
          >
            Power Paste — The Growth Formula
          </p>

          <p
            className="
              text-sm
              leading-[2]
              mb-6
            "
            style={{ color: '#8d8778' }}
          >
            Our most potent formula. A rich herbal paste
            loaded with Bhringraj, Amla, and Methi —
            the sacred trinity of hair regrowth.
            Apply, leave for 45 minutes, and let
            ancient botanical magic transform your
            hair in 4 weeks.
          </p>

          {/* Ingredients */}

                    <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:32 }}>
            {['Bhringraj','Amla','Methi','Brahmi','Neem'].map(ing => <span key={ing} style={{ fontSize:10, letterSpacing:'0.1em', border:'1px solid rgba(122,158,110,0.4)', color:'var(--sage)', padding:'4px 12px' }}>{ing}</span>)}
          </div>

          {/* Footer */}

          <div className="flex items-center gap-8 flex-wrap">
            <div
              className="
                font-display
                text-4xl
                font-light
              "
              style={{ color: '#c9a84c' }}
            >
              ₹649

              <span
                className="text-sm ml-1"
                style={{ color: '#7f7768' }}
              >
                / 200g
              </span>
            </div>

            <button
              onClick={() => addItem(product)}
              className="
                px-8
                py-3
                border
                uppercase
                tracking-[0.25em]
                text-[10px]
                transition-all
                duration-300
                hover:bg-[#c9a84c]
                hover:text-[#161108]
              "
              style={{
                borderColor: '#c9a84c',
                color: '#c9a84c',
              }}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
