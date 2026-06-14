import { NextRequest, NextResponse } from 'next/server'
import { getAdminUserId, unauthorizedResponse } from '@/lib/requireAdmin'
import { createShiprocketOrder, type ShiprocketOrderPayload } from '@/lib/shiprocket'
import { supabaseAdmin } from '@/lib/supabase'

// POST /api/shiprocket/create — create Shiprocket order for a given order ID
export async function POST(req: NextRequest) {
  try {
    const adminId = await getAdminUserId(req)
    if (!adminId) return unauthorizedResponse()

    const { order_id, pickup_location } = await req.json()
    if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

    const db = supabaseAdmin()
    const { data: order, error } = await db.from('orders').select('*').eq('id', order_id).single()
    if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    const customer = order.customer as any
    const items = (order.items as any[]) || []

    const payload: ShiprocketOrderPayload = {
      order_id: order.id.slice(0, 8), // Shiprocket wants short order IDs
      order_date: new Date(order.created_at).toISOString().slice(0, 16).replace('T', ' '),
      pickup_location: pickup_location || 'Primary',
      billing_customer_name: customer.name || 'Customer',
      billing_address: customer.line1 || customer.address?.line1 || '',
      billing_address_2: customer.line2 || customer.address?.line2 || '',
      billing_city: customer.city || customer.address?.city || '',
      billing_state: customer.state || customer.address?.state || '',
      billing_pincode: customer.pincode || customer.address?.pincode || '',
      billing_country: 'India',
      billing_email: customer.email || 'customer@herbixe.com',
      billing_phone: customer.phone || '0000000000',
      shipping_is_billing: true,
      order_items: items.map((item: any) => ({
        name: item.product_name || item.product?.name || 'Product',
        sku: `HBX-${(item.product_id || '').slice(0, 6)}`,
        units: item.qty || 1,
        selling_price: item.price || 0,
      })),
      payment_received: order.status === 'paid' || order.status === 'processing' ? '1' : '0',
      sub_total: order.subtotal,
      weight: 0.5,
    }

    const srResult = await createShiprocketOrder(payload)

    // Store Shiprocket order ID
    const srOrderId = srResult?.order_id?.toString() || srResult?.shipment_id?.toString() || ''
    if (srOrderId) {
      await db.from('orders').update({
        shiprocket_order_id: srOrderId,
        status: 'processing',
      }).eq('id', order.id)
    }

    return NextResponse.json({ data: srResult })
  } catch (err: any) {
    console.error('Shiprocket create error:', err)
    return NextResponse.json({ error: err.message || 'Shiprocket order creation failed' }, { status: 500 })
  }
}
