'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS, CATEGORY_LABELS } from '@/lib/products'
import { useCartStore } from '@/store/cartStore'
import type { Product } from '@/types'

// ─── Quiz Questions ──────────────────────────────────────────────────────
interface QuizOption {
  label: string
  icon: string
  scores: Record<string, number> // product slug → score
}
interface QuizQuestion {
  id: string
  question: string
  subtitle: string
  options: QuizOption[]
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'hair_type',
    question: 'What is your hair type?',
    subtitle: 'This helps us choose the right botanical base for you.',
    options: [
      {
        label: 'Straight & Fine',
        icon: '〰️',
        scores: { 'hibiscus-shine-paste': 3, 'brahmi-growth-oil': 1, 'sandalwood-serenity-oil': 1 },
      },
      {
        label: 'Wavy & Medium',
        icon: '🌊',
        scores: { 'bhringraj-power-paste': 2, 'brahmi-growth-oil': 2, 'hibiscus-shine-paste': 1 },
      },
      {
        label: 'Curly & Thick',
        icon: '🌀',
        scores: { 'bhringraj-power-paste': 3, 'sandalwood-serenity-oil': 2, 'brahmi-growth-oil': 1 },
      },
      {
        label: 'Coily & Dense',
        icon: '✨',
        scores: { 'bhringraj-power-paste': 2, 'sandalwood-serenity-oil': 3, 'brahmi-growth-oil': 2 },
      },
    ],
  },
  {
    id: 'concern',
    question: 'What is your biggest hair concern?',
    subtitle: 'We\'ll target this with our most potent Ayurvedic herbs.',
    options: [
      {
        label: 'Hair fall & thinning',
        icon: '📉',
        scores: { 'bhringraj-power-paste': 4, 'brahmi-growth-oil': 3, 'complete-kit': 2 },
      },
      {
        label: 'Dullness & frizz',
        icon: '💫',
        scores: { 'hibiscus-shine-paste': 4, 'sandalwood-serenity-oil': 3, 'complete-kit': 1 },
      },
      {
        label: 'Dandruff & itchy scalp',
        icon: '🌿',
        scores: { 'neem-scalp-detox': 5, 'bhringraj-power-paste': 1, 'brahmi-growth-oil': 1 },
      },
      {
        label: 'Dryness & damage',
        icon: '🏜️',
        scores: { 'sandalwood-serenity-oil': 4, 'hibiscus-shine-paste': 2, 'complete-kit': 2 },
      },
    ],
  },
  {
    id: 'scalp',
    question: 'How would you describe your scalp?',
    subtitle: 'Scalp health is the foundation of beautiful hair.',
    options: [
      {
        label: 'Oily — washes daily',
        icon: '💧',
        scores: { 'neem-scalp-detox': 4, 'hibiscus-shine-paste': 2, 'bhringraj-power-paste': 1 },
      },
      {
        label: 'Balanced — washes 2-3x/week',
        icon: '⚖️',
        scores: { 'bhringraj-power-paste': 2, 'brahmi-growth-oil': 2, 'hibiscus-shine-paste': 2, 'complete-kit': 1 },
      },
      {
        label: 'Dry — washes weekly',
        icon: '🌾',
        scores: { 'sandalwood-serenity-oil': 3, 'bhringraj-power-paste': 2, 'brahmi-growth-oil': 2 },
      },
      {
        label: 'Sensitive & reactive',
        icon: '🌸',
        scores: { 'neem-scalp-detox': 3, 'sandalwood-serenity-oil': 2, 'hibiscus-shine-paste': 2 },
      },
    ],
  },
  {
    id: 'routine',
    question: 'How much time do you spend on hair care?',
    subtitle: 'We\'ll match products to your lifestyle.',
    options: [
      {
        label: 'Quick — 10 mins or less',
        icon: '⚡',
        scores: { 'brahmi-growth-oil': 3, 'sandalwood-serenity-oil': 2, 'hibiscus-shine-paste': 1 },
      },
      {
        label: 'Moderate — 20-30 mins',
        icon: '🕐',
        scores: { 'bhringraj-power-paste': 2, 'brahmi-growth-oil': 2, 'hibiscus-shine-paste': 2, 'complete-kit': 1 },
      },
      {
        label: 'Dedicated — full ritual',
        icon: '🧘',
        scores: { 'complete-kit': 4, 'bhringraj-power-paste': 2, 'neem-scalp-detox': 2, 'brahmi-growth-oil': 1 },
      },
      {
        label: 'I want to start a routine',
        icon: '🌱',
        scores: { 'complete-kit': 3, 'bhringraj-power-paste': 2, 'brahmi-growth-oil': 2, 'hibiscus-shine-paste': 1 },
      },
    ],
  },
  {
    id: 'preference',
    question: 'What matters most to you?',
    subtitle: 'Your values shape our recommendation.',
    options: [
      {
        label: 'Visible results fast',
        icon: '🎯',
        scores: { 'bhringraj-power-paste': 3, 'brahmi-growth-oil': 3, 'complete-kit': 1 },
      },
      {
        label: 'Luxurious self-care',
        icon: '👑',
        scores: { 'sandalwood-serenity-oil': 4, 'complete-kit': 2, 'hibiscus-shine-paste': 1 },
      },
      {
        label: 'All-natural & gentle',
        icon: '🍃',
        scores: { 'neem-scalp-detox': 2, 'hibiscus-shine-paste': 3, 'bhringraj-power-paste': 2, 'brahmi-growth-oil': 1 },
      },
      {
        label: 'Best value for money',
        icon: '💰',
        scores: { 'complete-kit': 4, 'bhringraj-power-paste': 2, 'brahmi-growth-oil': 1 },
      },
    ],
  },
]

const TOTAL_STEPS = QUESTIONS.length

// ─── Animation variants ──────────────────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
  }),
}

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 30 }

// ─── Component ────────────────────────────────────────────────────────────
export default function HairQuizPage() {
  const [step, setStep] = useState(-1) // -1 = intro, 0..N = questions, N+1 = results
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [direction, setDirection] = useState(0)
  const [addedToCart, setAddedToCart] = useState<string | null>(null)
  const addItem = useCartStore(s => s.addItem)

  // Calculate recommended products based on scores
  const recommendations = useMemo(() => {
    const scores: Record<string, number> = {}
    for (const q of QUESTIONS) {
      const selectedIdx = answers[q.id]
      if (selectedIdx !== undefined) {
        const option = q.options[selectedIdx]
        for (const [slug, score] of Object.entries(option.scores)) {
          scores[slug] = (scores[slug] || 0) + score
        }
      }
    }
    const ranked = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([slug]) => PRODUCTS.find(p => p.slug === slug))
      .filter(Boolean) as Product[]
    return ranked
  }, [answers])

  const handleSelect = (questionId: string, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIdx }))
    // Auto-advance after short delay
    setTimeout(() => {
      setDirection(1)
      setStep(prev => prev + 1)
    }, 300)
  }

  const handleNext = () => {
    setDirection(1)
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setDirection(-1)
    setStep(prev => prev - 1)
  }

  const handleAddToCart = (product: Product) => {
    addItem(product)
    setAddedToCart(product.slug)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  const currentQuestion = step >= 0 && step < TOTAL_STEPS ? QUESTIONS[step] : null
  const isResults = step >= TOTAL_STEPS
  const progress = step >= 0 ? Math.min((step / TOTAL_STEPS) * 100, 100) : 0

  return (
    <main className="page-main">
      <div className="page-container max-w-[800px]">
        <nav className="page-breadcrumb">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold">Hair Ritual Quiz</span>
        </nav>

        <AnimatePresence mode="wait" custom={direction}>
          {/* ── INTRO SCREEN ── */}
          {step === -1 && (
            <motion.div
              key="intro"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springTransition}
              className="text-center py-10 md:py-16"
            >
              <p className="section-tag-center mb-8">Discover Your Ritual</p>
              <h1 className="font-display text-4xl md:text-6xl font-light mb-6 text-cream leading-tight">
                The Hair Ritual<br />
                <span className="italic text-sage">Quiz</span>
              </h1>
              <p className="text-mist/55 text-sm font-body leading-relaxed mb-12 max-w-md mx-auto">
                Answer 5 simple questions and our Ayurvedic experts will curate
                the perfect botanical ritual for your unique hair.
              </p>

              <div className="flex flex-col items-center gap-6">
                <button onClick={() => { setDirection(1); setStep(0) }} className="btn-gold text-sm px-12">
                  Begin Your Quiz →
                </button>
                <p className="text-mist/30 text-xs font-body">Takes less than 2 minutes</p>
              </div>

              <div className="mt-16 grid grid-cols-3 gap-6 max-w-sm mx-auto">
                {['🌿', '🌺', '✨'].map((icon, i) => (
                  <div key={i} className="text-center">
                    <span className="text-3xl block mb-2">{icon}</span>
                    <p className="text-mist/40 text-[10px] tracking-widest uppercase font-body">
                      {['Personalised', 'Botanical', 'Ayurvedic'][i]}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── QUESTION SCREENS ── */}
          {currentQuestion && (
            <motion.div
              key={`q-${step}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springTransition}
              className="py-8 md:py-12"
            >
              {/* Progress bar */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[10px] tracking-widest uppercase text-gold font-body">
                    Question {step + 1} of {TOTAL_STEPS}
                  </p>
                  <p className="text-[10px] tracking-widest uppercase text-mist/40 font-body">
                    {Math.round(progress)}%
                  </p>
                </div>
                <div className="h-px bg-gold/15 w-full">
                  <motion.div
                    className="h-px bg-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Question */}
              <div className="text-center mb-10">
                <h2 className="font-display text-3xl md:text-4xl font-light mb-3 text-cream">
                  {currentQuestion.question}
                </h2>
                <p className="text-mist/50 text-sm font-body">{currentQuestion.subtitle}</p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[600px] mx-auto">
                {currentQuestion.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleSelect(currentQuestion.id, idx)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative p-5 md:p-6 text-left border transition-all duration-300 ${
                      answers[currentQuestion.id] === idx
                        ? 'border-gold bg-gold/10'
                        : 'border-gold/15 bg-bark/30 hover:border-gold/40 hover:bg-bark/50'
                    }`}
                  >
                    <span className="text-2xl block mb-3">{option.icon}</span>
                    <span className={`text-sm font-body tracking-wide ${
                      answers[currentQuestion.id] === idx ? 'text-gold' : 'text-cream/80 group-hover:text-cream'
                    }`}>
                      {option.label}
                    </span>
                    {answers[currentQuestion.id] === idx && (
                      <motion.span
                        layoutId="check"
                        className="absolute top-4 right-4 text-gold text-lg"
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Back button */}
              {step > 0 && (
                <div className="text-center mt-8">
                  <button onClick={handleBack} className="text-mist/40 text-xs font-body tracking-widest uppercase hover:text-gold transition-colors">
                    ← Previous
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── RESULTS SCREEN ── */}
          {isResults && (
            <motion.div
              key="results"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={springTransition}
              className="py-8 md:py-12"
            >
              <div className="text-center mb-12">
                <p className="section-tag-center mb-6">Your Personalised Ritual</p>
                <h2 className="font-display text-3xl md:text-5xl font-light mb-4 text-cream">
                  Curated <span className="italic text-sage">for you</span>
                </h2>
                <p className="text-mist/50 text-sm font-body max-w-md mx-auto">
                  Based on your hair profile, our Ayurvedic experts recommend these botanical rituals.
                </p>
              </div>

              {/* Recommended products */}
              <div className="space-y-6 mb-12">
                {recommendations.map((product, i) => (
                  <motion.div
                    key={product.slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.5 }}
                    className="panel relative overflow-hidden"
                  >
                    {/* Rank badge */}
                    <div className="absolute top-4 right-4 md:top-6 md:right-6">
                      <span className={`text-[10px] tracking-widest uppercase font-body px-3 py-1.5 ${
                        i === 0 ? 'bg-gold text-dark' : 'border border-gold/25 text-gold'
                      }`}>
                        {i === 0 ? 'Top Pick' : i === 1 ? 'Also Great' : 'Complete Set'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-bark/60 border border-gold/10 text-4xl">
                        {product.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-gold/60 font-body mb-1">
                          {CATEGORY_LABELS[product.category] || product.category}
                        </p>
                        <h3 className="font-display text-2xl text-cream mb-2">{product.name}</h3>
                        <p className="text-mist/55 text-xs font-body leading-relaxed mb-3">
                          {product.description}
                        </p>

                        {/* Key ingredients */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.ingredients.slice(0, 4).map(ing => (
                            <span key={ing} className="text-[9px] tracking-widest uppercase text-sage/70 border border-sage/20 px-2 py-1 font-body">
                              {ing}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="font-display text-2xl text-gold">₹{product.price}</span>
                            {product.original_price && (
                              <span className="text-mist/30 text-sm font-body line-through">₹{product.original_price}</span>
                            )}
                            <span className="text-mist/40 text-xs font-body">{product.size}</span>
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`btn-gold text-[10px] px-6 py-3 ${
                              addedToCart === product.slug ? 'opacity-70' : ''
                            }`}
                          >
                            {addedToCart === product.slug ? '✓ Added!' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Ritual guide */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="panel-moss text-center py-10"
              >
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-body mb-4">Your 8-Week Ritual Plan</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg mx-auto mb-6">
                  {[
                    { week: 'Week 1-2', tip: 'Start with scalp detox once a week' },
                    { week: 'Week 3-4', tip: 'Add oil massage 2-3 times weekly' },
                    { week: 'Week 5-8', tip: 'Full ritual: paste + oil for best results' },
                  ].map(w => (
                    <div key={w.week}>
                      <p className="text-gold text-xs font-body tracking-widest mb-2">{w.week}</p>
                      <p className="text-mist/50 text-[11px] font-body leading-relaxed">{w.tip}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
                <Link href="/products" className="btn-outline text-[10px]">
                  Browse All Products
                </Link>
                <button
                  onClick={() => { setStep(-1); setAnswers({}); setDirection(1) }}
                  className="text-mist/40 text-xs font-body tracking-widest uppercase hover:text-gold transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
