import { NextRequest, NextResponse } from 'next/server'
import { getAdminUserId, unauthorizedResponse } from '@/lib/requireAdmin'
import { supabaseAdmin } from '@/lib/supabase'
import { sendShippingNotification, sendDeliveryConfirmation } from '@/lib/email'

// GET /api/admin/orders/[id] — single order detail
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminId = await getAdminUserId(req)
    if (!adminId) return unauthorizedResponse()

    const db = supabaseAdmin()
    const { data, error } = await db.from('orders').select('*').eq('id', params.id).single()
    if (error) throw error

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
}

// PATCH /api/admin/orders/[id] — update order status
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminId = await getAdminUserId(req)
    if (!adminId) return unauthorizedResponse()

    const { status, shiprocket_order_id, tracking_id } = await req.json()
    const db = supabaseAdmin()

    const updateData: Record<string, any> = {}
    if (status) {
      updateData.status = status
      if (status === 'shipped') updateData.shipped_at = new Date().toISOString()
      if (status === 'delivered') updateData.delivered_at = new Date().toISOString()
    }
    if (shiprocket_order_id) updateData.shiprocket_order_id = shiprocket_order_id
    if (tracking_id) updateData.tracking_id = tracking_id

    const { data, error } = await db.from('orders').update(updateData).eq('id', params.id).select().single()
    if (error) throw error

    // Send transactional emails (non-blocking)
    if (data?.customer?.email) {
      try {
        if (status === 'shipped') {
          await sendShippingNotification({
            id: data.id,
            customer: data.customer,
            shiprocket_order_id: data.shiprocket_order_id,
            tracking_id: data.tracking_id,
          })
        } else if (status === 'delivered') {
          await sendDeliveryConfirmation({ id: data.id, customer: data.customer })
        }
      } catch (e) {
        console.error('Email send failed:', e)
      }
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Admin order update error:', err)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
