'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const STATUSES = ['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400/20 text-yellow-400',
  paid: 'bg-blue-400/20 text-blue-400',
  processing: 'bg-blue-300/20 text-blue-300',
  shipped: 'bg-sage/20 text-sage',
  delivered: 'bg-green-400/20 text-green-400',
  cancelled: 'bg-red-400/20 text-red-400',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const r = await fetch(`/api/admin/orders?status=${status}&page=${page}&limit=20`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const json = await r.json()
      if (json.data) {
        setOrders(json.data.orders || [])
        setTotal(json.data.total || 0)
      }
      setLoading(false)
    }
    load()
  }, [status, page])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-tag mb-3">Admin</p>
          <h1 className="page-title">Orders ({total})</h1>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setStatus(s); setPage(1) }}
            className={`px-4 py-2 text-[10px] tracking-widest uppercase font-body transition-all ${
              status === s ? 'bg-gold text-dark' : 'border border-gold/25 text-mist/60 hover:border-gold/50 hover:text-gold'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="text-center py-10 text-mist/40 font-body text-sm">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-mist/40 font-body text-sm">No orders found</div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => (
            <Link key={order.id} href={`/admin/orders/${order.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-gold/10 bg-bark/30 hover:border-gold/30 transition-colors">
              <div className="mb-2 sm:mb-0">
                <span className={`text-[10px] tracking-widest uppercase font-body px-2 py-0.5 ${STATUS_COLORS[order.status] || ''}`}>
                  {order.status}
                </span>
                <span className="text-xs text-mist/40 ml-3">{new Date(order.created_at).toLocaleString()}</span>
                <p className="text-xs text-mist/60 mt-1 font-body">
                  {order.customer?.name} · {order.customer?.email}
                </p>
              </div>
              <div className="text-right">
                <span className="font-display text-xl text-gold">₹{order.total?.toLocaleString()}</span>
                <p className="text-[10px] text-mist/30">{order.items?.length || 0} items</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 20 && (
        <div className="flex justify-center gap-3 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline disabled:opacity-30 text-xs">← Prev</button>
          <span className="text-sm text-mist/50 font-body flex items-center">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={orders.length < 20} className="btn-outline disabled:opacity-30 text-xs">Next →</button>
        </div>
      )}
    </div>
  )
}
