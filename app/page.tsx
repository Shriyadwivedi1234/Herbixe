import HeroSection from '@/components/sections/HeroSection'
import MarqueeBand from '@/components/sections/MarqueeBand'
import PhilosophySection from '@/components/sections/PhilosophySection'
import ProductsSection from '@/components/sections/ProductsSection'
import FeaturedProduct from '@/components/sections/FeaturedProduct'
import { IngredientsSection } from '@/components/sections/IngredientsSection'
import { ProcessSection } from '@/components/sections/IngredientsSection'
import { TestimonialsSection } from '@/components/sections/IngredientsSection'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeBand />
      <PhilosophySection />
      <ProductsSection />
      <FeaturedProduct />
      <IngredientsSection />
      <ProcessSection />
      <TestimonialsSection />

      {/* CTA Banner */}
      <section className="py-28 text-center" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(74,94,58,0.15) 0%, transparent 65%)' }}>
        <div className="max-w-[600px] mx-auto px-6">
          <div className="section-tag justify-center before:w-12 after:w-12 mb-6">Begin Your Ritual</div>
          <h2 className="font-display font-light mb-5" style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}>
            Ready to <span className="italic text-gold">transform</span> your hair?
          </h2>
          <p className="text-mist/60 text-sm leading-relaxed font-body mb-10">
            Take our hair quiz to find your perfect botanical match, or explore the full collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="btn-gold font-display italic">Shop Collection</Link>
            <Link href="/hair-quiz" className="btn-outline font-display italic">Take the Hair Quiz</Link>
          </div>
        </div>
      </section>
    </>
  )
}
