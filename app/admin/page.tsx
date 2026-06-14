'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Stats {
  totalOrders: number
  totalRevenue: number
  paidOrderCount: number
  statusCounts: Record<string, number>
  recentOrders: any[]
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-400/20 text-yellow-400',
  paid: 'bg-blue-400/20 text-blue-400',
  processing: 'bg-blue-300/20 text-blue-300',
  shipped: 'bg-sage/20 text-sage',
  delivered: 'bg-green-400/20 text-green-400',
  cancelled: 'bg-red-400/20 text-red-400',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const r = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const json = await r.json()
      if (json.data) setStats(json.data)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="page-loading">Loading dashboard…</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-tag mb-3">Admin</p>
          <h1 className="page-title">Dashboard</h1>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Orders', value: stats?.totalOrders || 0, icon: '📦' },
          { label: 'Paid Orders', value: stats?.paidOrderCount || 0, icon: '💰' },
          { label: 'Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: '📈' },
          { label: 'Pending', value: stats?.statusCounts?.pending || 0, icon: '⏳' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="panel !p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg">{icon}</span>
              <span className="font-display text-3xl text-gold">{value}</span>
            </div>
            <p className="text-xs text-mist/50 font-body tracking-widest uppercase">{label}</p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <div className="panel mb-10">
        <p className="section-tag mb-5">Status Breakdown</p>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats?.statusCounts || {}).map(([status, count]) => (
            <div key={status} className={`px-4 py-2 text-sm font-body ${STATUS_COLORS[status] || 'bg-gold/10 text-gold'}`}>
              {status}: <span className="font-bold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="panel">
        <div className="flex items-center justify-between mb-5">
          <p className="section-tag">Recent Orders</p>
          <Link href="/admin/orders" className="text-xs text-gold font-body tracking-widest uppercase hover:underline">View All →</Link>
        </div>
        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <div className="space-y-3">
            {stats.recentOrders.map((order: any) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between p-4 border border-gold/10 bg-bark/30 hover:border-gold/30 transition-colors">
                <div>
                  <span className={`text-[10px] tracking-widest uppercase font-body px-2 py-0.5 ${STATUS_COLORS[order.status] || ''}`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-mist/40 ml-3">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-right">
                  <span className="font-display text-lg text-gold">₹{order.total?.toLocaleString()}</span>
                  <p className="text-[10px] text-mist/30">{order.customer?.name}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-mist/40 font-body text-sm text-center py-6">No orders yet</p>
        )}
      </div>
    </div>
  )
}
