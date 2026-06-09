import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/products'

export async function GET() {
  try {
    // Try Supabase first if configured
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (url && key) {
      const { createClient } = await import('@supabase/supabase-js')
      const db = createClient(url, key)
      const { data, error } = await db.from('products').select('*').eq('is_active', true).order('created_at', { ascending: false })
      if (!error && data?.length) return NextResponse.json({ data })
    }
  } catch {}
  // Fallback to seed data
  return NextResponse.json({ data: PRODUCTS })
}
