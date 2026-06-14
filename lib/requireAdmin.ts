import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Verify the request comes from an admin user.
 * Returns the user ID if admin, or null if not.
 */
export async function getAdminUserId(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const { createClient } = await import('@supabase/supabase-js')
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: authHeader } } }
  )
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null

  const db = supabaseAdmin()
  const { data: customer } = await db.from('customers').select('role').eq('id', user.id).maybeSingle()
  if (!customer?.role || !['admin', 'staff'].includes(customer.role)) return null

  return user.id
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized — admin access required' }, { status: 403 })
}
