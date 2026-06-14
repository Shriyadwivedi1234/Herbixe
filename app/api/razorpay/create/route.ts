import { NextRequest, NextResponse } from 'next/server'
import { getRazorpayInstance, toPaise } from '@/lib/razorpay'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { items, customer } = await req.json()
    if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

    const subtotal = items.reduce((s: number, i: any) => s + i.product.price * i.qty, 0)
    const shipping  = subtotal >= 999 ? 0 : 60
    const total     = subtotal + shipping
    const amount    = toPaise(total)

    if (amount < 100) {
      return NextResponse.json({ error: 'Minimum order amount is ₹1' }, { status: 400 })
    }

    const keyId = process.env.RAZORPAY_KEY_ID
    if (!keyId || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Razorpay credentials not configured' }, { status: 500 })
    }

    // Extract user_id from auth header
    let userId: string | null = null
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const { createClient: cc } = await import('@supabase/supabase-js')
      const sb = cc(supabaseUrl, supabaseAnon, {
        global: { headers: { Authorization: authHeader } },
      })
      const { data: { user } } = await sb.auth.getUser()
      userId = user?.id ?? null
    }

    const rzp      = getRazorpayInstance()
    const rzpOrder = await rzp.orders.create({ amount, currency: 'INR', receipt: `herbixe_${Date.now()}` })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && serviceRole) {
      const db = createClient(supabaseUrl, serviceRole)

      const orderRow: Record<string, any> = {
        razorpay_order_id: rzpOrder.id,
        status: 'pending',
        subtotal,
        shipping,
        total,
        customer,
        items: items.map((i: any) => ({
          product_id: i.product.id,
          product_name: i.product.name,
          price: i.product.price,
          qty: i.qty,
        })),
      }
      if (userId) orderRow.user_id = userId

      const { error } = await db.from('orders').insert(orderRow)
      if (error) {
        console.error('Supabase insert error:', error)
      }
    }

    return NextResponse.json({ data: { orderId: rzpOrder.id, amount: rzpOrder.amount, currency: rzpOrder.currency, keyId } })
  } catch (err: any) {
    console.error('Razorpay create error:', err)
    const status = err?.statusCode === 401 ? 401 : 500
    return NextResponse.json({ error: 'Failed to create order' }, { status })
  }
}
