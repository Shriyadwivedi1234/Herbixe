'use client'

import Link from 'next/link'
import { Product } from '@/types'
import { useCartStore } from '@/store/cartStore'

interface Props {
  product: Product
  index?: number
}

export default function ProductCard({
  product,
}: Props) {
  const { addItem } = useCartStore()

  return (
    <div
      className="
        group
        h-full
        flex
        flex-col
        overflow-hidden
        border
        border-[#2d2412]
        hover:border-[#c9a84c]/40
        transition-all
        duration-500
      "
      style={{
        background:
          'linear-gradient(180deg, #161108 0%, #1b1409 100%)',
      }}
    >
      <Link
        href={`/products/${product.slug}`}
        className="block"
      >
        {/* Product Visual */}
        <div
          className="
            relative
            h-[320px]
            overflow-hidden
            flex
            items-center
            justify-center
          "
          style={{
            background:
              'linear-gradient(135deg, rgba(45,60,25,0.35) 0%, rgba(15,10,5,0.95) 100%)',
          }}
        >
          {/* Glow */}
          <div
            className="
              absolute
              inset-0
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-500
            "
            style={{
              background:
                'radial-gradient(circle at 50% 20%, rgba(122,158,110,0.25) 0%, transparent 65%)',
            }}
          />

          <span
            className="
              text-[90px]
              transition-transform
              duration-500
              group-hover:scale-110
            "
            style={{
              filter:
                'drop-shadow(0 0 25px rgba(122,158,110,0.4))',
            }}
          >
            {product.icon}
          </span>

          {product.badge && (
            <span
              className="
                absolute
                top-5
                right-5
                bg-[#c9a84c]
                text-[#161108]
                px-3
                py-1.5
                text-[9px]
                uppercase
                tracking-[0.2em]
              "
            >
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-10 flex flex-col flex-1">

        <Link href={`/products/${product.slug}`}>
          <p
            className="
              text-[9px]
              uppercase
              tracking-[0.35em]
              text-[#7a9e6e]
              mb-3
            "
          >
            {product.category.replace(/-/g, ' ')}
          </p>

          <h3
            className="
              font-display
              text-[22px]
              text-[#f5f0e8]
              mb-4
              transition-colors
              duration-300
              group-hover:text-[#c9a84c]
            "
          >
            {product.name}
          </h3>
        </Link>

        <p
          className="
            text-[14px]
            leading-9
            text-[#8d8778]
            mb-7
          "
        >
          {product.description}
        </p>

        {/* Ingredients */}
        <div className="flex flex-wrap gap-2 mb-8">
          {product.ingredients
            .slice(0, 4)
            .map((ingredient) => (
              <span
                key={ingredient}
                className="
                  px-3
                  py-1.5
                  text-[10px]
                  border
                  border-[#3b321d]
                  text-[#9b8d63]
                "
              >
                {ingredient}
              </span>
            ))}
        </div>

        {/* Footer */}
        <div
          className="
            mt-auto
            pt-6
            border-t
            border-[#2d2412]
            flex
            items-center
            justify-between
          "
        >
          <div
            className="
              font-display
              text-[34px]
              font-light
              text-[#c9a84c]
            "
          >
            ₹{product.price.toLocaleString()}

            <span
              className="
                text-base
                text-[#7f7768]
                ml-1
              "
            >
              / {product.size}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.preventDefault()
              addItem(product)
            }}
            className="
              border
              border-[#c9a84c]
              text-[#c9a84c]
              px-8
              py-3
              text-[10px]
              uppercase
              tracking-[0.25em]
              transition-all
              duration-300
              hover:bg-[#c9a84c]
              hover:text-[#161108]
            "
          >
            Add To Cart
          </button>
        </div>

      </div>
    </div>
  )
}
