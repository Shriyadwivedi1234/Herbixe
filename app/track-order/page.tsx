'use client'

import { useState } from 'react'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400/20 text-yellow-400',
  paid: 'bg-blue-400/20 text-blue-400',
  processing: 'bg-blue-300/20 text-blue-300',
  shipped: 'bg-sage/20 text-sage',
  delivered: 'bg-green-400/20 text-green-400',
  cancelled: 'bg-red-400/20 text-red-400',
}

export default function TrackOrderPage() {
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState<any[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [tracking, setTracking] = useState<Record<string, any>>({})
  const [trackingLoading, setTrackingLoading] = useState<string | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrders(null)
    setTracking({})
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

  const loadTracking = async (order: any) => {
    if (!order.shiprocket_order_id) return
    setTrackingLoading(order.id)
    try {
      const r = await fetch(`/api/shiprocket/track?order_id=${order.shiprocket_order_id}`)
      const json = await r.json()
      if (json.data) {
        setTracking(prev => ({ ...prev, [order.id]: json.data }))
      }
    } catch {
      // tracking failed silently
    } finally {
      setTrackingLoading(null)
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
            <ul className="space-y-6">
              {orders.map((o: any) => (
                <li key={o.id} className="border border-gold/15 p-5 bg-bark/30">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className={`text-xs tracking-widest uppercase font-body px-2 py-1 ${STATUS_COLORS[o.status] || ''}`}>
                        {o.status}
                      </span>
                    </div>
                    <p className="font-display text-2xl text-cream">₹{o.total?.toLocaleString()}</p>
                  </div>
                  <p className="text-mist/40 text-xs font-body mb-1">Order: {o.id.slice(0, 8)}</p>
                  <p className="text-mist/40 text-xs font-body mb-3">{new Date(o.created_at).toLocaleDateString()}</p>

                  {/* Items */}
                  {Array.isArray(o.items) && (
                    <div className="border-t border-gold/10 pt-3 mb-3">
                      {o.items.map((item: any, i: number) => (
                        <p key={i} className="text-xs text-mist/60 font-body">{item.product_name} x{item.qty}</p>
                      ))}
                    </div>
                  )}

                  {/* Shiprocket tracking */}
                  {o.shiprocket_order_id && (
                    <div className="border-t border-gold/10 pt-3 mt-3">
                      {!tracking[o.id] ? (
                        <button
                          onClick={() => loadTracking(o)}
                          disabled={trackingLoading === o.id}
                          className="text-xs text-gold font-body tracking-widest uppercase hover:underline disabled:opacity-50"
                        >
                          {trackingLoading === o.id ? 'Loading…' : 'View Live Tracking →'}
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-gold font-body tracking-widest uppercase mb-2">Shipment Tracking</p>
                          {(() => {
                            const trackData = tracking[o.id]
                            const trackArr = Array.isArray(trackData) ? trackData : [trackData]
                            return trackArr.map((t: any, i: number) => (
                              <div key={i} className="text-xs font-body">
                                {t.awb_code && <p className="text-mist/60">AWB: {t.awb_code}</p>}
                                {t.courier_name && <p className="text-mist/60">Courier: {t.courier_name}</p>}
                                {t.current_status && <p className="text-cream">Status: {t.current_status}</p>}
                                {Array.isArray(t.shipment_track_activities) && t.shipment_track_activities.length > 0 && (
                                  <div className="mt-2 space-y-1 border-l border-gold/20 pl-3">
                                    {t.shipment_track_activities.slice(0, 5).map((a: any, j: number) => (
                                      <div key={j}>
                                        <p className="text-mist/50">{a.activity}</p>
                                        <p className="text-mist/30 text-[10px]">{a.location} — {a.date}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}
