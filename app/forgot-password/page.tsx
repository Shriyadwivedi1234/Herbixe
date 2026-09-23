'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'

export default function ForgotPasswordPage() {
  const { user, loading, resetPassword } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user) router.replace('/')
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const err = await resetPassword(email)
    if (err) { setError(err); setSubmitting(false); return }
    setSuccess(true)
    setSubmitting(false)
  }

  if (success) {
    return (
      <main className="auth-page">
        <div className="auth-card text-center">
          <div className="text-5xl mb-6">🌿</div>
          <h1 className="font-display text-3xl font-light mb-4 text-cream">Check your email</h1>
          <p className="text-mist/60 text-sm font-body leading-relaxed mb-8">
            We sent a password reset link to <span className="text-gold">{email}</span>.
          </p>
          <Link href="/login" className="btn-gold">
            Back to Sign In
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="font-display text-gold text-2xl tracking-widest font-light block mb-10">
          Herb<span className="italic text-sage">ixe</span>
        </Link>
        <p className="text-[10px] tracking-[0.35em] uppercase text-gold font-body mb-2">Reset access</p>
        <h1 className="font-display text-4xl font-light mb-8 text-cream">Forgot your password?</h1>
        <p className="text-mist/50 text-sm font-body mb-8">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="form-input" />
          </div>
          {error && <p className="text-red-400 text-xs font-body">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-gold w-full disabled:opacity-50">
            {submitting ? 'Sending link…' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-mist/40 text-xs font-body mt-8">
          Remembered it?{' '}
          <Link href="/login" className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}