/**
 * Shiprocket API client
 * Docs: https://apidocs.shiprocket.in
 */

const BASE_URL = 'https://apiv2.shiprocket.in/v1/external'

let cachedToken: { token: string; expiresAt: number } | null = null

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Shiprocket login failed: ${res.status} ${text}`)
  }

  const data = await res.json()
  if (!data.token) throw new Error('Shiprocket: no token in response')

  // Token valid for ~9 days (Shiprocket tokens expire in 10 days)
  cachedToken = { token: data.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 }
  return data.token
}

async function shiprocketFetch(path: string, options: RequestInit = {}) {
  const token = await getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Shiprocket API error: ${res.status} ${text}`)
  }

  return res.json()
}

export interface ShiprocketOrderPayload {
  order_id: string           // Our internal order ID
  order_date: string         // YYYY-MM-DD HH:MM
  pickup_location: string
  billing_customer_name: string
  billing_last_name?: string
  billing_address: string
  billing_address_2?: string
  billing_city: string
  billing_state: string
  billing_pincode: string
  billing_country: string
  billing_email: string
  billing_phone: string
  shipping_is_billing: boolean
  order_items: Array<{
    name: string
    sku: string
    units: number
    selling_price: number
    discount?: number
    tax?: string
    hsn?: string
  }>
  payment_received: '1' | '0'
  sub_total: number
  length?: number
  breadth?: number
  height?: number
  weight?: number
}

/**
 * Create a shipment order in Shiprocket
 */
export async function createShiprocketOrder(payload: ShiprocketOrderPayload) {
  return shiprocketFetch('/orders/create/adhoc', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Track a shipment by AWB number
 */
export async function trackShipment(awb: string) {
  return shiprocketFetch(`/courier/track/awb/${awb}`)
}

/**
 * Track a shipment by Shiprocket order ID
 */
export async function trackByOrderId(orderId: string) {
  return shiprocketFetch(`/courier/track/order/${orderId}`)
}

/**
 * Get available pickup locations
 */
export async function getPickupLocations() {
  return shiprocketFetch('/settings/company/pickup')
}

/**
 * Check serviceability for a pincode
 */
export async function checkServiceability(pincode: string) {
  return shiprocketFetch(`/courier/serviceability/?pickup_postcode=110001&delivery_postcode=${pincode}&weight=0.5&cod=0`)
}
