import { NextRequest, NextResponse } from 'next/server'
import { trackShipment, trackByOrderId } from '@/lib/shiprocket'

// GET /api/shiprocket/track?awb=xxx or ?order_id=xxx
export async function GET(req: NextRequest) {
  try {
    const awb = req.nextUrl.searchParams.get('awb')
    const orderId = req.nextUrl.searchParams.get('order_id')

    if (!awb && !orderId) {
      return NextResponse.json({ error: 'Provide awb or order_id' }, { status: 400 })
    }

    const result = awb ? await trackShipment(awb) : await trackByOrderId(orderId!)
    return NextResponse.json({ data: result })
  } catch (err: any) {
    console.error('Shiprocket track error:', err)
    return NextResponse.json({ error: err.message || 'Tracking failed' }, { status: 500 })
  }
}
