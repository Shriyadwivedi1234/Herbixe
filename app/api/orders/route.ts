import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/orders?email=user@email.com
export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email')
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const db = supabaseAdmin()
    const { data, error } = await db
      .from('orders')
      .select('*')
      .eq('customer->>email', email)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST /api/orders — manual order creation (admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const db   = supabaseAdmin()
    const { data, error } = await db.from('orders').insert(body).select().single()
    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
