import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendWelcomeEmail } from '@/lib/email'

// POST /api/signup/welcome — insert customer row + send welcome email
// Called fire-and-forget from client after supabase.auth.signUp()
export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json()
    if (!email || !name) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const db = supabaseAdmin()

    // Look up the auth user by email
    const { data: users } = await db.auth.admin.listUsers()
    const authUser = users?.users?.find(u => u.email === email)
    if (!authUser) return NextResponse.json({ ok: true }) // not an error, just skip

    // Insert customer row (ignore if already exists)
    await db.from('customers').upsert({
      id: authUser.id,
      name,
      role: 'customer',
    }, { onConflict: 'id' })

    // Send welcome email (non-blocking)
    try {
      await sendWelcomeEmail(email, name)
    } catch (e) {
      console.error('Welcome email failed:', e)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Welcome API error:', err)
    return NextResponse.json({ ok: true }) // never block signup
  }
}
