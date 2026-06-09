import { NextRequest, NextResponse } from 'next/server'
import { verifySignature } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 })
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'RAZORPAY_KEY_SECRET not configured' }, { status: 500 })
    }

    if (!verifySignature({ razorpay_order_id, razorpay_payment_id, razorpay_signature })) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Update order in Supabase if configured
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY
      if (url && key) {
        const { createClient } = await import('@supabase/supabase-js')
        const db = createClient(url, key)
        await db.from('orders').update({ status: 'paid', razorpay_payment_id, paid_at: new Date().toISOString() }).eq('razorpay_order_id', razorpay_order_id)
      }
    } catch {}

    return NextResponse.json({ data: { success: true, paymentId: razorpay_payment_id } })
  } catch (err) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
