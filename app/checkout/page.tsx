'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore, useCartHydrated } from '@/store/cartStore'
import { useRouter } from 'next/navigation'
import { loadRazorpayScript } from '@/lib/razorpay'
import { useRequireAuth } from '@/lib/requireAuth'

export default function CheckoutPage() {
  const hydrated = useCartHydrated()
  const { user, loading: authLoading } = useRequireAuth()
  const { items, subtotal, clearCart } = useCartStore()
  const router = useRouter()

  const cartItems = hydrated ? items : []
  const sub     = hydrated ? subtotal() : 0
  const shipping = sub >= 999 ? 0 : 60
  const total   = sub + shipping

  const [form, setForm] = useState({ name: '', email: '', phone: '', line1: '', city: '', state: '', pincode: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        email: user.email || f.email,
        name: (user.user_metadata?.full_name as string) || f.name,
      }))
    }
  }, [user])

  if (!hydrated || authLoading) {
    return <main className="page-loading">Preparing checkout…</main>
  }

  if (!user) return null

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handlePay = async () => {
    if (!form.name || !form.email || !form.phone) { setError('Please fill all required fields.'); return }
    setLoading(true); setError('')
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) { setError('Failed to load payment gateway. Please try again.'); setLoading(false); return }

      const r = await fetch('/api/razorpay/create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer: form }),
      })
      const { data, error: apiErr } = await r.json()
      if (apiErr || !data?.orderId) { setError(apiErr || 'Failed to create order.'); setLoading(false); return }

      const rzp = new (window as any).Razorpay({
        key: data.keyId, amount: data.amount, currency: data.currency,
        order_id: data.orderId, name: 'Herbixe',
        description: 'Botanical Haircare Ritual',
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#c9a84c' },
        handler: async (response: any) => {
          const vr = await fetch('/api/razorpay/verify', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
          const { error: vErr } = await vr.json()
          if (vErr) { setError('Payment verification failed.'); setLoading(false); return }
          clearCart()
          router.push(`/checkout/success?payment_id=${response.razorpay_payment_id}`)
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment cancelled.')
          },
        },
      })
      rzp.on('payment.failed', (response: any) => {
        setLoading(false)
        setError(response?.error?.description || 'Payment failed. Please try again.')
      })
      rzp.open()
    } catch { setError('Something went wrong. Please try again.'); setLoading(false) }
  }

  return (
    <main className="page-main">
      <div className="page-container max-w-[1000px]">
        <nav className="page-breadcrumb mb-12">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gold">Checkout</span>
        </nav>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 panel">
            <p className="font-display italic text-2xl text-mist/40 mb-8">Your cart is empty</p>
            <Link href="/products" className="btn-gold">Browse Collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
            <div>
              <p className="section-tag mb-8">Delivery Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[['Full Name *','name','text'],['Email *','email','email'],['Phone *','phone','tel'],['Pincode *','pincode','text']].map(([l,k,t]) => (
                  <div key={k}>
                    <label className="form-label">{l}</label>
                    <input type={t} value={(form as any)[k]} onChange={e => set(k, e.target.value)} className="form-input" />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="form-label">Address Line 1 *</label>
                  <input value={form.line1} onChange={e => set('line1', e.target.value)} className="form-input" />
                </div>
                {[['City *','city'],['State *','state']].map(([l,k]) => (
                  <div key={k}>
                    <label className="form-label">{l}</label>
                    <input value={(form as any)[k]} onChange={e => set(k, e.target.value)} className="form-input" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="section-tag mb-6">Order Summary</p>
              <div className="panel !p-7">
                {cartItems.map(({ product, qty }) => (
                  <div key={product.id} className="flex justify-between py-3 border-b border-gold/10 text-sm">
                    <span className="text-mist/70">{product.icon} {product.name} × {qty}</span>
                    <span className="text-gold font-display text-base">₹{(product.price * qty).toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex justify-between py-3 text-sm text-mist/50">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="text-sage">Free</span> : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between py-4 border-t border-gold/20 font-display text-2xl">
                  <span>Total</span>
                  <span className="text-gold">₹{total.toLocaleString()}</span>
                </div>
                {error && <p className="text-red-400 text-xs font-body mb-3">{error}</p>}
                <button onClick={handlePay} disabled={loading}
                        className="btn-gold w-full disabled:opacity-50">
                  {loading ? 'Processing…' : '✦ Pay with Razorpay'}
                </button>
                <p className="text-center text-[9px] text-mist/30 mt-3 tracking-widest">UPI · Cards · Net Banking · EMI</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
