export default function MarqueeBand() {
  const items = [
    'Herbal Hair Paste', 'Premium Botanical Oils', 'Sacred Formulations',
    '100% Natural Ingredients', 'Cruelty Free Rituals', 'Ancient Ayurvedic Wisdom',
  ]
  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden border-y border-gold/20 py-3.5"
         style={{ background: 'linear-gradient(to right, #1e3a1e, #4a5e3a, #1e3a1e)' }}>
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="px-8 font-display italic text-mist text-sm flex items-center gap-8">
            {item}
            <span className="text-gold not-italic">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
