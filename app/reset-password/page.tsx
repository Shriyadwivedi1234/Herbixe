'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'

function ResetPasswordForm() {
  const { user, loading, updatePassword } = useAuth()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setSubmitting(true)
    setError('')
    const err = await updatePassword(password)
    if (err) { setError(err); setSubmitting(false); return }
    setSuccess(true)
    setSubmitting(false)
    setTimeout(() => router.replace('/login'), 2500)
  }

  if (loading) {
    return <main className="page-loading">Verifying link…</main>
  }

  if (!user) {
    return (
      <main className="auth-page">
        <div className="auth-card text-center">
          <h1 className="font-display text-3xl font-light mb-4 text-cream">Link expired</h1>
          <p className="text-mist/60 text-sm font-body leading-relaxed mb-8">
            This password reset link is invalid or has expired.
          </p>
          <Link href="/forgot-password" className="btn-gold">Request a new link</Link>
        </div>
      </main>
    )
  }

  if (success) {
    return (
      <main className="auth-page">
        <div className="auth-card text-center">
          <div className="text-5xl mb-6">🌿</div>
          <h1 className="font-display text-3xl font-light mb-4 text-cream">Password updated</h1>
          <p className="text-mist/60 text-sm font-body leading-relaxed mb-8">
            Redirecting you to sign in…
          </p>
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
        <h1 className="font-display text-4xl font-light mb-8 text-cream">Set a new password</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">New Password</label>
            <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Confirm Password</label>
            <input type="password" required minLength={6} value={confirm} onChange={e => setConfirm(e.target.value)} className="form-input" />
          </div>
          {error && <p className="text-red-400 text-xs font-body">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-gold w-full disabled:opacity-50">
            {submitting ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="page-loading">Loading…</main>}>
      <ResetPasswordForm />
    </Suspense>
  )
}