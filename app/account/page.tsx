'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRequireAuth } from '@/lib/requireAuth'
import { supabase } from '@/lib/supabase'
import type { Order } from '@/types'

interface AccountData {
  profile: { id: string; email: string; name: string; phone: string }
  orders: Order[]
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-yellow-400',
  paid: 'text-blue-400',
  processing: 'text-blue-300',
  shipped: 'text-sage',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
}

export default function AccountPage() {
  const { user, loading: authLoading } = useRequireAuth()
  const [data, setData] = useState<AccountData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const r = await fetch('/api/account', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const json = await r.json()
      if (json.data) {
        setData(json.data)
        setName(json.data.profile.name || '')
        setPhone(json.data.profile.phone || '')
      }
      setLoading(false)
    }
    load()
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const r = await fetch('/api/account', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ name, phone }),
    })
    const json = await r.json()
    if (json.data?.success) {
      setMsg('Profile updated')
      setEditing(false)
      setData(d => d ? { ...d, profile: { ...d.profile, name, phone } } : d)
    } else {
      setMsg('Failed to update')
    }
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (authLoading || loading) return <main className="page-loading">Loading account…</main>
  if (!user) return null

  return (
    <main className="page-main">
      <div className="page-container max-w-[900px]">
        <nav className="page-breadcrumb">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold">My Account</span>
        </nav>

        <div className="panel mb-8">
          <p className="section-tag mb-6">My Account</p>
          <h1 className="page-title">Welcome back{data?.profile.name ? `, ${data.profile.name}` : ''}</h1>
          <p className="page-subtitle mb-0">{data?.profile.email}</p>
        </div>

        {/* Profile */}
        <div className="panel mb-8">
          <div className="flex items-center justify-between mb-6">
            <p className="section-tag">Profile</p>
            {!editing && (
              <button onClick={() => setEditing(true)} className="text-gold text-xs tracking-widest uppercase font-body hover:underline">
                Edit
              </button>
            )}
          </div>
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="form-input" />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="form-input" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-gold disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save'}
                </button>
                <button type="button" onClick={() => setEditing(false)} className="btn-outline">Cancel</button>
              </div>
              {msg && <p className="text-sage text-xs font-body">{msg}</p>}
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-body">
              <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Name</span>{data?.profile.name || '—'}</div>
              <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Email</span>{data?.profile.email}</div>
              <div><span className="text-mist/40 text-xs tracking-widest uppercase block mb-1">Phone</span>{data?.profile.phone || '—'}</div>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link href="/account/addresses" className="panel flex items-center justify-between hover:border-gold/40 transition-colors">
            <span className="font-display text-lg">Saved Addresses</span>
            <span className="text-gold text-lg">→</span>
          </Link>
          <Link href="/track-order" className="panel flex items-center justify-between hover:border-gold/40 transition-colors">
            <span className="font-display text-lg">Track Order</span>
            <span className="text-gold text-lg">→</span>
          </Link>
        </div>

        {/* Order History */}
        <div className="panel">
          <p className="section-tag mb-6">Order History</p>
          {data?.orders && data.orders.length > 0 ? (
            <div className="space-y-4">
              {data.orders.map((order) => (
                <div key={order.id} className="border border-gold/12 p-5 bg-bark/30">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div>
                      <span className={`text-xs tracking-widest uppercase font-body ${STATUS_COLORS[order.status] || 'text-mist/60'}`}>
                        {order.status}
                      </span>
                      <span className="text-mist/30 text-xs font-body ml-3">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <span className="font-display text-xl text-gold">₹{order.total?.toLocaleString()}</span>
                  </div>
                  {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {(order.items as any[]).slice(0, 3).map((item, i) => (
                        <span key={i} className="text-xs text-mist/50 font-body">
                          {item.product_name || item.product?.name} × {item.qty}
                          {i < Math.min((order.items as any[]).length, 3) - 1 ? ',' : ''}
                        </span>
                      ))}
                      {(order.items as any[]).length > 3 && (
                        <span className="text-xs text-mist/30 font-body">+{order.items.length - 3} more</span>
                      )}
                    </div>
                  )}
                  {order.razorpay_payment_id && (
                    <p className="text-[10px] text-mist/25 font-body mt-2 tracking-wider">
                      Payment: {order.razorpay_payment_id}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="font-display italic text-mist/40 text-lg mb-4">No orders yet</p>
              <Link href="/products" className="btn-gold">Browse Collection</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
