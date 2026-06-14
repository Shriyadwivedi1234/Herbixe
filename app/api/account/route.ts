import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET /api/account — fetch customer profile + order history
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const db = supabaseAdmin()

    // Fetch customer profile
    const { data: customer } = await db.from('customers').select('*').eq('id', user.id).maybeSingle()

    // Fetch addresses
    const { data: addresses } = await db.from('addresses').select('*').eq('customer_id', user.id).order('is_default', { ascending: false })

    // Fetch orders
    const { data: orders } = await db.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })

    return NextResponse.json({
      data: {
        profile: {
          id: user.id,
          email: user.email,
          name: (user.user_metadata?.full_name as string) || customer?.name || '',
          phone: customer?.phone || '',
        },
        addresses: addresses || [],
        orders: orders || [],
      },
    })
  } catch (err) {
    console.error('Account fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch account' }, { status: 500 })
  }
}

// PATCH /api/account — update name/phone
export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { createClient } = await import('@supabase/supabase-js')
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user } } = await sb.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, phone } = await req.json()
    const db = supabaseAdmin()

    // Upsert customer record
    const { error } = await db.from('customers').upsert({
      id: user.id,
      name: name || null,
      phone: phone || null,
    })
    if (error) throw error

    // Update auth metadata
    if (name) {
      await sb.auth.updateUser({ data: { full_name: name } })
    }

    return NextResponse.json({ data: { success: true } })
  } catch (err) {
    console.error('Account update error:', err)
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}
