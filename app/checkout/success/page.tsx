'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Content() {
  const params    = useSearchParams()
  const paymentId = params.get('payment_id')

  return (
    <main className="page-main flex items-center justify-center">
      <div className="page-container max-w-[520px]">
        <div className="panel text-center !p-16 md:!p-20">
          <div className="text-6xl mb-8">🌿</div>
          <p className="section-tag-center mb-6">Ritual Complete</p>
          <h1 className="font-display font-light text-4xl md:text-5xl leading-tight mb-5 text-cream">
            Your order has been<br /><em className="italic text-gold">confirmed</em>
          </h1>
          <p className="text-sm leading-relaxed text-mist/60 font-body mb-4">
            Thank you for beginning your botanical journey with Herbixe. We&apos;re preparing your ritual with care.
          </p>
          {paymentId && (
            <p className="text-[10px] tracking-widest text-mist/25 font-body my-5">Payment ID: {paymentId}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/" className="btn-gold">Back to Home</Link>
            <Link href="/products" className="btn-outline">Shop More</Link>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<main className="page-loading">Loading…</main>}>
      <Content />
    </Suspense>
  )
}
