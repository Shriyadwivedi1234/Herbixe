'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'

function SignupForm() {
  const { signUp, user } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/checkout'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) router.replace(redirect)
  }, [user, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError('')
    const err = await signUp(email, password, name)
    if (err) { setError(err); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="auth-page">
        <div className="auth-card text-center">
          <div className="text-5xl mb-6">🌿</div>
          <h1 className="font-display text-3xl font-light mb-4 text-cream">Check your email</h1>
          <p className="text-mist/60 text-sm font-body leading-relaxed mb-8">
            We sent a confirmation link to <span className="text-gold">{email}</span>.
            Once verified, sign in to complete your order.
          </p>
          <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="btn-gold">
            Go to Sign In
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
        <p className="text-[10px] tracking-[0.35em] uppercase text-gold font-body mb-2">Join the ritual</p>
        <h1 className="font-display text-4xl font-light mb-8 text-cream">Create your account</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Full Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="form-input" />
          </div>
          {error && <p className="text-red-400 text-xs font-body">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-mist/40 text-xs font-body mt-8">
          Already have an account?{' '}
          <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-gold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<main className="page-loading">Loading…</main>}>
      <SignupForm />
    </Suspense>
  )
}
