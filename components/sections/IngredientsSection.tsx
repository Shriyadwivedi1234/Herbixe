'use client'
import { motion } from 'framer-motion'

const INGREDIENTS = [
  { icon: '🌿', name: 'Bhringraj',   prop: 'Growth Awakener' },
  { icon: '🫐', name: 'Amla',        prop: 'Strength Binder' },
  { icon: '🍃', name: 'Brahmi',      prop: 'Scalp Nourisher' },
  { icon: '🌱', name: 'Methi',       prop: 'Anti-Dandruff' },
  { icon: '🌺', name: 'Hibiscus',    prop: 'Shine Ritual' },
  { icon: '🌰', name: 'Castor Oil',  prop: 'Deep Conditioner' },
  { icon: '🌾', name: 'Neem',        prop: 'Scalp Purifier' },
  { icon: '🫚', name: 'Coconut Oil', prop: 'Sacred Carrier' },
  { icon: '🌸', name: 'Tulsi',       prop: 'Anti-Microbial' },
  { icon: '🌿', name: 'Shikakai',    prop: 'Natural Cleanser' },
]

export function IngredientsSection() {
  return (
    <section id="ingredients" className="py-36"
             style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(30,58,30,0.1) 0%, transparent 70%)' }}>
      <div className="max-w-[1300px] mx-auto px-14">
        <div className="text-center mb-20">
          <div className="section-tag justify-center before:w-12 after:w-12">Botanical Library</div>
          <h2 className="font-display font-light" style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}>
            Nature's finest <span className="italic text-gold">sacred ingredients</span>
          </h2>
        </div>

        <div className="grid grid-cols-5 gap-px">
          {INGREDIENTS.map((ing, i) => (
            <motion.div key={ing.name}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }}
              className="group p-12 text-center border border-gold/7 bg-ink/70
                         hover:bg-forest/90 hover:border-gold/25 transition-all duration-400 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent
                              scale-x-0 group-hover:scale-x-100 transition-transform duration-400" />
              <span className="text-4xl block mb-3">{ing.icon}</span>
              <div className="font-display text-base mb-1.5">{ing.name}</div>
              <div className="font-display italic text-xs text-sage">{ing.prop}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { n: '01', title: 'Ethical Wild Sourcing',   desc: 'We partner with certified organic farms across India\'s most fertile lands. Every herb grown without pesticides in its native soil for maximum potency.' },
  { n: '02', title: 'Cold Press Extraction',   desc: 'Active compounds extracted at low temperatures, preserving delicate phytochemicals that heat-based processing would destroy.' },
  { n: '03', title: 'Sacred Formulation',      desc: 'Each formula undergoes 6+ months of blind testing with 50 volunteers across different hair types before we approve it for launch.' },
  { n: '04', title: 'Small Batch Crafting',    desc: 'We produce in controlled small batches to guarantee freshness, potency, and quality consistency in every jar — so the ritual remains sacred.' },
]

export function ProcessSection() {
  return (
    <section id="process" className="py-36">
      <div className="max-w-[1200px] mx-auto px-14">
        <div className="mb-20">
          <div className="section-tag">The Ritual Process</div>
          <h2 className="font-display font-light" style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}>
            From root <span className="italic text-gold">to sacred ritual</span>
          </h2>
        </div>
        {STEPS.map((step, i) => (
          <motion.div key={step.n}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
            className="grid grid-cols-[100px_1fr_1fr] gap-10 py-12 border-b border-gold/8 items-start">
            <div className="font-display text-[64px] text-gold/12 leading-none">{step.n}</div>
            <div className="font-display italic text-3xl text-gold pt-3">{step.title}</div>
            <div className="text-sm text-mist/60 leading-[2] font-body pt-5">{step.desc}</div>
          </motion.div>
        ))}
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
        <div className="text-center mb-20">
          <div className="section-tag justify-center before:w-12 after:w-12">Sacred Testimonials</div>
          <h2 className="font-display font-light" style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}>
            What our <span className="italic text-gold">community says</span>
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-px">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}
              className="p-11 border border-gold/7 hover:border-gold/30 hover:bg-forest/40
                         transition-all duration-400 relative text-left">
              <div className="absolute top-0 left-6 font-display text-[100px] text-gold/8 leading-none select-none">"</div>
              <div className="text-gold tracking-widest mb-5 text-sm">{'★'.repeat(t.stars)}</div>
              <p className="font-display italic text-base leading-[1.9] text-mist/78 mb-8 relative">{t.text}</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center
                                font-display text-gold text-base">{t.initial}</div>
                <div>
                  <div className="text-sm text-cream">{t.name}</div>
                  <div className="font-display italic text-xs text-sage">{t.loc}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
