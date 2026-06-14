'use client'
import { motion } from 'framer-motion'

const INGREDIENTS = [
  { icon: '🌿', name: 'Bhringraj', prop: 'Growth Activator' },
  { icon: '🫐', name: 'Amla', prop: 'Strengthener' },
  { icon: '🍃', name: 'Brahmi', prop: 'Scalp Nourisher' },
  { icon: '🌱', name: 'Methi', prop: 'Anti-Dandruff' },
  { icon: '🌺', name: 'Hibiscus', prop: 'Shine Booster' },
  { icon: '🌰', name: 'Castor Oil', prop: 'Deep Conditioning' },
  { icon: '🌾', name: 'Neem', prop: 'Scalp Purifier' },
  { icon: '🫚', name: 'Coconut Oil', prop: 'Base Carrier' },
  { icon: '🌸', name: 'Tulsi', prop: 'Anti-Microbial' },
  { icon: '🌿', name: 'Shikakai', prop: 'Natural Cleanser' },
]

export function IngredientsSection() {
  return (
    <section
      id="ingredients"
      className="py-[140px]"
      style={{
        background:
          'linear-gradient(to bottom, transparent, rgba(74,94,58,0.08), transparent)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-[60px]">

        {/* Heading */}
        <div className="text-center">
          <p
            className="uppercase text-[10px] tracking-[0.4em] text-gold mb-5 flex items-center justify-center gap-4"
          >
            <span className="w-10 h-px bg-gold inline-block" />
            Botanical Library
            <span className="w-10 h-px bg-gold inline-block" />
          </p>

          <h2
            className="font-display font-light leading-[1.1]"
            style={{
              fontSize: 'clamp(38px,4vw,60px)',
            }}
          >
            Nature's finest{' '}
            <em
              className="not-italic"
              style={{
                fontStyle: 'italic',
                color: 'var(--sage)',
              }}
            >
              active ingredients
            </em>
          </h2>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-5 gap-[35px] max-w-[1000px] mx-auto mt-20"
        >
          {INGREDIENTS.map((ing, i) => (
            <motion.div
              key={ing.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.05,
                duration: 0.6,
              }}
              className="text-center"
              style={{
                padding: '48px 24px',
                border: '1px solid rgba(201,168,76,0.08)',
                transition: 'all 0.4s ease',
              }}
            >
              <span
                style={{
                  fontSize: '40px',
                  display: 'block',
                  marginBottom: '16px',
                }}
              >
                {ing.icon}
              </span>

              <div
                className="font-display"
                style={{
                  fontSize: '18px',
                  marginBottom: '8px',
                }}
              >
                {ing.name}
              </div>

              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--sage)',
                  letterSpacing: '0.1em',
                }}
              >
                {ing.prop}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  {
    n: '01',
    title: 'Ethical Sourcing',
    desc: 'We partner with certified organic farms across India, ensuring every herb is grown without pesticides in its native soil and climate for maximum potency.',
  },
  {
    n: '02',
    title: 'Cold Press Extraction',
    desc: 'Active compounds are extracted at low temperatures to preserve delicate phytochemicals that heat-based processing would destroy — your hair gets every benefit.',
  },
  {
    n: '03',
    title: 'Formulation & Testing',
    desc: 'Each formula undergoes 6+ months of blind testing with a panel of 50 volunteers across different hair types before we approve it for launch.',
  },
  {
    n: '04',
    title: 'Small-Batch Crafting',
    desc: 'We produce in controlled small batches to guarantee freshness, potency, and quality consistency in every jar you receive.',
  },
]

export function ProcessSection() {
  return (
    <section id="process" className="py-[140px]">
      <div className="max-w-[1200px] mx-auto px-[60px]">

        {/* Heading */}
        <div className="mb-16">
          <p
            className="uppercase text-[10px] tracking-[0.4em] text-gold mb-5 flex items-center gap-4"
          >
            <span className="w-10 h-px bg-gold inline-block" />
            How We Make It
          </p>

          <h2
            className="font-display font-light leading-[1.1]"
            style={{
              fontSize: 'clamp(38px,4vw,60px)',
            }}
          >
            From root to{' '}
            <em
              className="not-italic"
              style={{
                fontStyle: 'italic',
                color: 'var(--sage)',
              }}
            >
              ritual
            </em>
          </h2>
        </div>

        {/* Steps */}
        <div>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.7,
              }}
              className="grid items-start py-12"
              style={{
                gridTemplateColumns: '80px 1fr 1fr',
                gap: '40px',
                borderBottom: '1px solid rgba(201,168,76,0.1)',
              }}
            >
              {/* Number */}
              <div
                className="font-display leading-none"
                style={{
                  fontSize: '72px',
                  fontWeight: 300,
                  color: 'rgba(201,168,76,0.15)',
                }}
              >
                {step.n}
              </div>

              {/* Title */}
              <div
                className="font-display"
                style={{
                  fontSize: '32px',
                  fontWeight: 300,
                  color: 'var(--gold)',
                  paddingTop: '16px',
                }}
              >
                {step.title}
              </div>

              {/* Description */}
              <div
                style={{
                  fontSize: '14px',
                  lineHeight: 2,
                  color: 'rgba(245,240,232,0.6)',
                  paddingTop: '20px',
                }}
              >
                {step.desc}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}

const TESTIMONIALS = [
  { stars: 5, text: 'The bhringraj paste has genuinely transformed my hair in 6 weeks. I had tried everything — this is the first product that actually worked on my severe hair fall.', name: 'Priya Sharma',   loc: 'Mumbai, Maharashtra', initial: 'P' },
  { stars: 5, text: 'The botanical oil smells divine and leaves my scalp feeling deeply nourished. No greasiness, just pure conditioning. I\'ll never return to drugstore brands.',     name: 'Ananya Krishnan', loc: 'Bangalore, Karnataka', initial: 'A' },
  { stars: 5, text: 'The packaging alone tells you this is a brand that cares. But the results — my hair texture has completely transformed. Dense, shiny, strong.',                    name: 'Riya Mehta',     loc: 'Delhi, India',        initial: 'R' },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-36">
      <div className="max-w-[1300px] mx-auto px-14">

        {/* Heading */}
        <div className="text-center mb-20">
          <div className="section-tag justify-center before:w-12 after:w-12">
            Sacred Testimonials
          </div>

          <h2
            className="font-display font-light"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            What our{' '}
            <span className="italic text-gold">
              community says
            </span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-3 gap-10">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.1,
                duration: 0.7,
              }}
              whileHover={{
                y: -8,
              }}
              className="p-12 relative text-left transition-all duration-500"
              style={{
                border: '1px solid rgba(201,168,76,0.12)',
                borderRadius: '28px',
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Quote Mark */}
              <div
                className="absolute top-0 left-6 font-display leading-none select-none"
                style={{
                  fontSize: '100px',
                  color: 'rgba(201,168,76,0.08)',
                }}
              >
                "
              </div>

              {/* Stars */}
              <div className="text-gold tracking-widest mb-5 text-sm">
                {'★'.repeat(t.stars)}
              </div>

              {/* Review */}
              <p
                className="font-display italic mb-8 relative"
                style={{
                  fontSize: '16px',
                  lineHeight: '1.9',
                  color: 'rgba(245,240,232,0.78)',
                }}
              >
                {t.text}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center font-display text-gold"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '999px',
                    border: '1px solid rgba(201,168,76,0.3)',
                    background: 'rgba(201,168,76,0.08)',
                    fontSize: '16px',
                  }}
                >
                  {t.initial}
                </div>

                <div>
                  <div className="text-sm text-cream">
                    {t.name}
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--sage)',
                      fontStyle: 'italic',
                    }}
                  >
                    {t.loc}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
