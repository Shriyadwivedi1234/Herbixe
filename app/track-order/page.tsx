'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TrackOrderPage() {
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState<any[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrders(null)
    try {
      const r = await fetch(`/api/orders?email=${encodeURIComponent(email)}`)
      const json = await r.json()
      if (json.error) { setError(json.error); return }
      setOrders(json.data || [])
    } catch {
      setError('Unable to fetch orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-main">
      <div className="page-container max-w-[760px]">
        <nav className="page-breadcrumb">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold">Track Order</span>
        </nav>

        <div className="panel mb-8">
          <p className="section-tag mb-6">Track Order</p>
          <h1 className="page-title">Where is my ritual?</h1>
          <p className="page-subtitle mb-0">Enter the email used at checkout to view your orders.</p>
        </div>

        <div className="panel-moss">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 mb-8">
            <input type="email" required placeholder="your@email.com" value={email}
                   onChange={e => setEmail(e.target.value)} className="form-input flex-1" />
            <button type="submit" disabled={loading} className="btn-gold sm:px-10 disabled:opacity-50">
              {loading ? '…' : 'Track'}
            </button>
          </form>
          {error && <p className="text-red-400 text-sm font-body mb-4">{error}</p>}
          {orders && orders.length === 0 && (
            <p className="text-mist/50 font-body text-sm">No orders found for this email.</p>
          )}
          {orders && orders.length > 0 && (
            <ul className="space-y-4">
              {orders.map((o: any) => (
                <li key={o.id} className="border border-gold/15 p-5 bg-bark/30">
                  <p className="text-gold text-xs tracking-widest uppercase font-body mb-1">{o.status}</p>
                  <p className="font-display text-2xl text-cream">₹{o.total?.toLocaleString()}</p>
                  <p className="text-mist/40 text-xs font-body mt-2">{new Date(o.created_at).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
