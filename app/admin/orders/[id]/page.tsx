'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const ALL_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400/20 text-yellow-400',
  paid: 'bg-blue-400/20 text-blue-400',
  processing: 'bg-blue-300/20 text-blue-300',
  shipped: 'bg-sage/20 text-sage',
  delivered: 'bg-green-400/20 text-green-400',
  cancelled: 'bg-red-400/20 text-red-400',
}

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [msg, setMsg] = useState('')
  const [creatingShipment, setCreatingShipment] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const r = await fetch(`/api/admin/orders/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const json = await r.json()
      if (json.data) setOrder(json.data)
      setLoading(false)
    }
    load()
  }, [id])

  const createShipment = async () => {
    setCreatingShipment(true)
    setMsg('')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    try {
      const r = await fetch('/api/shiprocket/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ order_id: order.id }),
      })
      const json = await r.json()
      if (json.data) {
        setMsg('Shiprocket shipment created!')
        // Reload order to get updated shiprocket_order_id
        const r2 = await fetch(`/api/admin/orders/${id}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        const json2 = await r2.json()
        if (json2.data) setOrder(json2.data)
      } else {
        setMsg(`Shiprocket error: ${json.error || 'Unknown error'}`)
      }
    } catch {
      setMsg('Failed to create Shiprocket shipment')
    }
    setCreatingShipment(false)
    setTimeout(() => setMsg(''), 5000)
  }

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    setMsg('')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const r = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    })
    const json = await r.json()
    if (json.data) {
      setOrder({ ...order, ...json.data })
      setMsg(`Status updated to ${newStatus}`)
    } else {
      setMsg('Failed to update')
    }
    setUpdating(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return <div className="page-loading">Loading order…</div>
  if (!order) return <div className="text-center py-10 text-mist/40 font-body">Order not found</div>

  const customer = order.customer || {}
  const items = order.items || []

  return (
    <div>
      <Link href="/admin/orders" className="text-xs text-gold font-body tracking-widest uppercase hover:underline mb-6 inline-block">
        ← Back to Orders
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <p className="section-tag mb-2">Order Detail</p>
          <h1 className="font-display text-3xl font-light text-cream">
            ₹{order.total?.toLocaleString()}
          </h1>
          <p className="text-xs text-mist/40 font-body mt-1">{order.id}</p>
        </div>
        <span className={`text-xs tracking-widest uppercase font-body px-3 py-1.5 self-start ${STATUS_COLORS[order.status] || ''}`}>
          {order.status}
        </span>
      </div>

      {/* Status update */}
      <div className="panel mb-8">
        <p className="section-tag mb-5">Update Status</p>
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              disabled={updating || s === order.status}
              className={`px-4 py-2 text-[10px] tracking-widest uppercase font-body transition-all disabled:opacity-30 ${
                s === order.status ? 'bg-gold text-dark' : 'border border-gold/25 text-mist/60 hover:border-gold hover:text-gold'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {msg && <p className="text-sage text-xs font-body mt-3">{msg}</p>}
      </div>

      {/* Customer info */}
      <div className="panel mb-8">
        <p className="section-tag mb-5">Customer</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body">
          <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Name</span>{customer.name || '—'}</div>
          <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Email</span>{customer.email || '—'}</div>
          <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Phone</span>{customer.phone || '—'}</div>
          <div>
            <span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Address</span>
            {customer.address ? (
              <span>{customer.address.line1}, {customer.address.city}, {customer.address.state} — {customer.address.pincode}</span>
            ) : (
              <span>{customer.line1 ? `${customer.line1}, ${customer.city}, ${customer.state} — ${customer.pincode}` : '—'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Order items */}
      <div className="panel mb-8">
        <p className="section-tag mb-5">Items</p>
        <div className="space-y-3">
          {Array.isArray(items) && items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between py-3 border-b border-gold/10">
              <div>
                <p className="text-sm text-cream font-body">{item.product_name || item.product?.name}</p>
                <p className="text-xs text-mist/40 font-body">Qty: {item.qty}</p>
              </div>
              <span className="font-display text-gold">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 text-sm font-body text-mist/50">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping}`}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gold/15 font-display text-xl">
            <span>Total</span>
            <span className="text-gold">₹{order.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Shiprocket shipment */}
      {!order.shiprocket_order_id && order.status !== 'cancelled' && (
        <div className="panel mb-8">
          <p className="section-tag mb-5">Shiprocket Fulfillment</p>
          <button
            onClick={createShipment}
            disabled={creatingShipment}
            className="btn-gold disabled:opacity-50"
          >
            {creatingShipment ? 'Creating Shipment…' : 'Create Shiprocket Shipment'}
          </button>
          {msg && <p className="text-sage text-xs font-body mt-3">{msg}</p>}
        </div>
      )}

      {/* Payment & shipping info */}
      <div className="panel">
        <p className="section-tag mb-5">Payment & Shipping</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body">
          <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Razorpay Order</span>{order.razorpay_order_id || '—'}</div>
          <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Payment ID</span>{order.razorpay_payment_id || '—'}</div>
          <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Shiprocket Order</span>{order.shiprocket_order_id || '—'}</div>
          <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Tracking ID</span>{order.tracking_id || '—'}</div>
          <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Created</span>{new Date(order.created_at).toLocaleString()}</div>
          <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Paid At</span>{order.paid_at ? new Date(order.paid_at).toLocaleString() : '—'}</div>
        </div>
      </div>
    </div>
  )
}
