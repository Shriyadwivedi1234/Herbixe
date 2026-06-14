import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendWelcomeEmail } from '@/lib/email'

// POST /api/signup — create account + insert customer row + send welcome email
export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Email, password, and name are required' }, { status: 400 })
    }

    const db = supabaseAdmin()

    // Create Supabase Auth user
    const { data, error } = await db.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // Supabase will send confirmation email
      user_metadata: { full_name: name },
    })

    if (error || !data.user) {
      return NextResponse.json({ error: error?.message || 'Signup failed' }, { status: 400 })
    }

    // Insert customer row with role='customer'
    await db.from('customers').insert({
      id: data.user.id,
      name,
      role: 'customer',
    })

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail(email, name)
    } catch (e) {
      console.error('Welcome email failed:', e)
    }

    return NextResponse.json({ data: { user_id: data.user.id } })
  } catch (err: any) {
    console.error('Signup API error:', err)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}
