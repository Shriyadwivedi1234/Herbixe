import { NextRequest, NextResponse } from 'next/server'
import { getAdminUserId, unauthorizedResponse } from '@/lib/requireAdmin'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/admin/orders — paginated order list with filters
export async function GET(req: NextRequest) {
  try {
    const adminId = await getAdminUserId(req)
    if (!adminId) return unauthorizedResponse()

    const status = req.nextUrl.searchParams.get('status')
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
    const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const db = supabaseAdmin()
    let query = db.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query
    if (error) throw error

    return NextResponse.json({ data: { orders: data, total: count, page, limit } })
  } catch (err) {
    console.error('Admin orders error:', err)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
