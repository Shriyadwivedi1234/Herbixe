import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { PRODUCTS } from '@/lib/products'

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category')
  const active = req.nextUrl.searchParams.get('active')

  try {
    const db = supabaseAdmin()
    let query = db.from('products').select('*')

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    if (active !== 'false') {
      query = query.eq('is_active', true)
    }

    query = query.order('created_at', { ascending: false })
    const { data, error } = await query

    if (!error && data?.length) {
      return NextResponse.json({ data, source: 'db' })
    }
  } catch {}

  // Fallback to seed data
  let products = PRODUCTS
  if (category && category !== 'all') {
    products = products.filter(p => p.category === category)
  }
  return NextResponse.json({ data: products, source: 'static' })
}
