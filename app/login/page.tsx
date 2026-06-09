'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'

function LoginForm() {
  const { signIn, user } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get('redirect') || '/checkout'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) router.replace(redirect)
  }, [user, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const err = await signIn(email, password)
    if (err) { setError(err); setLoading(false); return }
    router.replace(redirect)
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link href="/" className="font-display text-gold text-2xl tracking-widest font-light block mb-10">
          Herb<span className="italic text-sage">ixe</span>
        </Link>
        <p className="text-[10px] tracking-[0.35em] uppercase text-gold font-body mb-2">Welcome back</p>
        <h1 className="font-display text-4xl font-light mb-8 text-cream">Sign in to continue</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="form-input" />
          </div>
          {error && <p className="text-red-400 text-xs font-body">{error}</p>}
          <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-mist/40 text-xs font-body mt-8">
          New to Herbixe?{' '}
          <Link href={`/signup?redirect=${encodeURIComponent(redirect)}`} className="text-gold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="page-loading">Loading…</main>}>
      <LoginForm />
    </Suspense>
  )
}
