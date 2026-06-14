import { NextRequest, NextResponse } from 'next/server'
import { getAdminUserId, unauthorizedResponse } from '@/lib/requireAdmin'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/stats
export async function GET(req: NextRequest) {
  try {
    const adminId = await getAdminUserId(req)
    if (!adminId) return unauthorizedResponse()

    const db = supabaseAdmin()

    // Total orders count
    const { count: totalOrders } = await db.from('orders').select('*', { count: 'exact', head: true })

    // Paid/delivered orders for revenue
    const { data: paidOrders } = await db.from('orders').select('total, status').in('status', ['paid', 'processing', 'shipped', 'delivered'])

    const totalRevenue = (paidOrders || []).reduce((sum, o) => sum + (o.total || 0), 0)
    const orderCount = paidOrders?.length || 0

    // Recent orders (last 5)
    const { data: recent } = await db.from('orders').select('*').order('created_at', { ascending: false }).limit(5)

    // Status breakdown
    const statusCounts: Record<string, number> = {}
    const { data: allOrders } = await db.from('orders').select('status');
    (allOrders || []).forEach((o: any) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
    })

    return NextResponse.json({
      data: {
        totalOrders: totalOrders || 0,
        totalRevenue,
        paidOrderCount: orderCount,
        statusCounts,
        recentOrders: recent || [],
      },
    })
  } catch (err) {
    console.error('Admin stats error:', err)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
