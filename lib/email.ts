/**
 * Resend transactional email client
 * Docs: https://resend.com/docs
 */
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'herbixe@gmail.com'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://herbixe.com'

// ── Shared HTML wrapper ───────────────────────────────────────────────────
function emailShell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#1a1a18;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a18;padding:40px 20px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#222220;border:1px solid rgba(198,163,91,0.15);border-radius:2px;">
        <tr><td style="padding:40px 40px 20px;text-align:center;">
          <h1 style="margin:0;font-size:28px;font-weight:300;color:#c6a35b;letter-spacing:4px;">HERBIXE</h1>
          <p style="margin:8px 0 0;font-size:11px;color:rgba(224,219,201,0.4);letter-spacing:3px;text-transform:uppercase;">BOTANICAL HAIR RITUALS</p>
        </td></tr>
        <tr><td style="padding:20px 40px 40px;">${body}</td></tr>
        <tr><td style="padding:20px 40px;border-top:1px solid rgba(198,163,91,0.1);text-align:center;">
          <p style="margin:0;font-size:11px;color:rgba(224,219,201,0.3);">© ${new Date().getFullYear()} Herbixe · Botanical hair rituals from India</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function heading(text: string) {
  return `<h2 style="font-size:22px;font-weight:300;color:#e0dbc9;margin:0 0 16px;letter-spacing:1px;">${text}</h2>`
}
function body(text: string) {
  return `<p style="font-size:14px;color:rgba(224,219,201,0.7);line-height:1.7;margin:0 0 16px;">${text}</p>`
}
function goldBtn(text: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="background:#c6a35b;padding:12px 32px;border-radius:2px;"><a href="${href}" style="color:#1a1a18;text-decoration:none;font-size:13px;letter-spacing:2px;text-transform:uppercase;">${text}</a></td></tr></table>`
}
function kv(label: string, value: string) {
  return `<tr><td style="font-size:12px;color:rgba(224,219,201,0.4);letter-spacing:2px;text-transform:uppercase;padding:6px 0;width:120px;">${label}</td><td style="font-size:14px;color:#e0dbc9;padding:6px 0;">${value}</td></tr>`
}

// ── Email templates ────────────────────────────────────────────────────────

/**
 * Order confirmation — sent when payment is verified
 */
export async function sendOrderConfirmation(order: {
  id: string
  total: number
  customer: { name: string; email: string }
  items: Array<{ product_name: string; qty: number; price: number }>
}) {
  const itemsHtml = order.items.map(i =>
    `<tr>
      <td style="font-size:13px;color:rgba(224,219,201,0.7);padding:8px 0;border-bottom:1px solid rgba(198,163,91,0.08);">${i.product_name} × ${i.qty}</td>
      <td style="font-size:13px;color:#c6a35b;padding:8px 0;border-bottom:1px solid rgba(198,163,91,0.08);text-align:right;">₹${(i.price * i.qty).toLocaleString()}</td>
    </tr>`
  ).join('')

  const html = emailShell('Order Confirmed', `
    ${heading('Your order is confirmed ✨')}
    ${body(`Thank you, ${order.customer.name}! We've received your order and our team is preparing your botanical rituals with care.`)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      ${kv('Order ID', order.id.slice(0, 8))}
      ${kv('Total', `₹${order.total.toLocaleString()}`)}
      ${kv('Status', 'Payment Received')}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
      ${itemsHtml}
    </table>
    ${goldBtn('View Your Orders', `${APP_URL}/account`)}
    ${body('We\'ll send you another email when your order ships. For any questions, reply to this email or visit our <a href="' + APP_URL + '/contact" style="color:#c6a35b;">contact page</a>.')}
  `)

  return resend.emails.send({
    from: `Herbixe <${FROM_EMAIL}>`,
    to: order.customer.email,
    subject: `Order Confirmed — #${order.id.slice(0, 8)}`,
    html,
  })
}

/**
 * Shipping notification — sent when admin marks order as shipped
 */
export async function sendShippingNotification(order: {
  id: string
  customer: { name: string; email: string }
  shiprocket_order_id?: string
  tracking_id?: string
}) {
  const trackingLink = order.shiprocket_order_id
    ? `${APP_URL}/track-order`
    : null

  const html = emailShell('Order Shipped', `
    ${heading('Your ritual is on its way 🌿')}
    ${body(`Great news, ${order.customer.name}! Your order has been shipped and is making its way to you.`)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      ${kv('Order ID', order.id.slice(0, 8))}
      ${order.tracking_id ? kv('Tracking ID', order.tracking_id) : ''}
    </table>
    ${trackingLink ? goldBtn('Track Your Shipment', trackingLink) : ''}
    ${body('Your package should arrive within 5–7 business days. If you have any questions, just reply to this email.')}
  `)

  return resend.emails.send({
    from: `Herbixe <${FROM_EMAIL}>`,
    to: order.customer.email,
    subject: `Your Herbixe Order Has Shipped — #${order.id.slice(0, 8)}`,
    html,
  })
}

/**
 * Delivery confirmation — sent when admin marks order as delivered
 */
export async function sendDeliveryConfirmation(order: {
  id: string
  customer: { name: string; email: string }
}) {
  const html = emailShell('Order Delivered', `
    ${heading('Your ritual has arrived ✨')}
    ${body(`Your order #${order.id.slice(0, 8)} has been delivered, ${order.customer.name}! We hope you love your botanical rituals.`)}
    ${body('Remember: consistency is key. Use your Herbixe products regularly for the best results over 6–8 weeks.')}
    ${goldBtn('Shop Again', `${APP_URL}/products`)}
    ${body('Share your experience with us on Instagram <a href="https://instagram.com/herbixe" style="color:#c6a35b;">@herbixe</a> — we\'d love to hear from you!')}
  `)

  return resend.emails.send({
    from: `Herbixe <${FROM_EMAIL}>`,
    to: order.customer.email,
    subject: `Your Herbixe Order Has Been Delivered — #${order.id.slice(0, 8)}`,
    html,
  })
}

/**
 * Welcome email — sent on signup
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const html = emailShell('Welcome to Herbixe', `
    ${heading(`Welcome, ${name} 🌿`)}
    ${body('Thank you for joining the Herbixe family. We craft botanical hair rituals rooted in Ayurvedic wisdom, using wild-harvested herbs and cold-pressed oils.')}
    ${body('Here\'s what to expect:')}
    <ul style="font-size:14px;color:rgba(224,219,201,0.7);line-height:2;padding-left:20px;margin:0 0 16px;">
      <li>Handcrafted hair pastes, oils & scalp treatments</li>
      <li>Exclusive early access to new rituals</li>
      <li>Seasonal wellness tips rooted in Ayurveda</li>
    </ul>
    ${goldBtn('Explore Our Rituals', `${APP_URL}/products`)}
  `)

  return resend.emails.send({
    from: `Herbixe <${FROM_EMAIL}>`,
    to: email,
    subject: 'Welcome to Herbixe — Your Botanical Journey Begins',
    html,
  })
}
