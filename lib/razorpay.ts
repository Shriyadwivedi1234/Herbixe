import crypto from 'crypto'

// Load Razorpay only server-side
export function getRazorpayInstance() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Razorpay = require('razorpay')
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })
}

// Verify Razorpay payment signature
export function verifySignature({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}): boolean {
  const body      = `${razorpay_order_id}|${razorpay_payment_id}`
  const expected  = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')
  return expected === razorpay_signature
}

// Convert ₹ to paise (Razorpay uses paise)
export const toPaise = (rupees: number) => Math.round(rupees * 100)

// Load Razorpay checkout script in browser
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (document.getElementById('razorpay-script')) { resolve(true); return }
    const script    = document.createElement('script')
    script.id       = 'razorpay-script'
    script.src      = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload   = () => resolve(true)
    script.onerror  = () => resolve(false)
    document.body.appendChild(script)
  })
}
