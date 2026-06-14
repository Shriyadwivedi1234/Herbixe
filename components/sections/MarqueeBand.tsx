export default function MarqueeBand() {
  const items = [
    'Herbal Hair Paste',
    'Premium Hair Oil',
    'Botanical Extracts',
    '100% Natural',
    'Cruelty Free',
    'Handcrafted',
  ]

  const doubled = [...items, ...items]

  return (
    <div
      style={{
        background: 'var(--moss)',
        padding: '16px 0',
        overflow: 'hidden',
        borderTop: '1px solid rgba(201,168,76,0.2)',
        borderBottom: '1px solid rgba(201,168,76,0.2)',
      }}
    >
      <div
        className="flex whitespace-nowrap animate-marquee"
        style={{
          animationDuration: '20s',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              padding: '0 40px',
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--mist)',
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
            }}
          >
            {item}

            <span
              style={{
                color: 'var(--gold)',
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

