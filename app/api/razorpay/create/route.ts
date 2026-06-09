import { NextRequest, NextResponse } from 'next/server'
import { getRazorpayInstance, toPaise } from '@/lib/razorpay'

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
    console.log({
      keyId: process.env.RAZORPAY_KEY_ID,
      hasSecret: !!process.env.RAZORPAY_KEY_SECRET,
    })
    const rzp      = getRazorpayInstance()
    const rzpOrder = await rzp.orders.create({ amount, currency: 'INR', receipt: `herbixe_${Date.now()}` })
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && serviceRole) {
      const { createClient } = await import('@supabase/supabase-js')

      const db = createClient(supabaseUrl, serviceRole)

      const { error } = await db.from('orders').insert({
        razorpay_order_id: rzpOrder.id,
        status: 'pending',
        subtotal,
        shipping,
        total,
        customer,
        items,
      })

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
