import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function getUserFromAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authHeader } } }
  )
  const { data: { user } } = await sb.auth.getUser()
  return user
}

// POST /api/account/addresses — add new address
export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromAuth(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const db = supabaseAdmin()

    // If setting as default, unset other defaults first
    if (body.is_default) {
      await db.from('addresses').update({ is_default: false }).eq('customer_id', user.id)
    }

    const { data, error } = await db.from('addresses').insert({
      customer_id: user.id,
      line1: body.line1,
      line2: body.line2 || null,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      country: body.country || 'India',
      is_default: body.is_default ?? false,
    }).select().single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('Add address error:', err)
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 })
  }
}

// DELETE /api/account/addresses?id=xxx
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserFromAuth(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = req.nextUrl.searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Address ID required' }, { status: 400 })

    const db = supabaseAdmin()
    const { error } = await db.from('addresses').delete().eq('id', id).eq('customer_id', user.id)
    if (error) throw error

    return NextResponse.json({ data: { success: true } })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}
