'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRequireAuth } from '@/lib/requireAuth'
import { supabase } from '@/lib/supabase'

interface Address {
  id: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
  is_default: boolean
}

export default function AddressesPage() {
  const { user, loading: authLoading } = useRequireAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ line1: '', line2: '', city: '', state: '', pincode: '', is_default: false })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const r = await fetch('/api/account', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const json = await r.json()
      if (json.data?.addresses) setAddresses(json.data.addresses)
      setLoading(false)
    }
    load()
  }, [user])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const r = await fetch('/api/account/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(form),
    })
    const json = await r.json()
    if (json.data) {
      setAddresses(prev => [json.data, ...prev.filter(a => !form.is_default || !a.is_default)])
      setShowForm(false)
      setForm({ line1: '', line2: '', city: '', state: '', pincode: '', is_default: false })
    } else {
      setError(json.error || 'Failed to add address')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const r = await fetch(`/api/account/addresses?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    const json = await r.json()
    if (json.data?.success) {
      setAddresses(prev => prev.filter(a => a.id !== id))
    }
  }

  if (authLoading || loading) return <main className="page-loading">Loading…</main>
  if (!user) return null

  return (
    <main className="page-main">
      <div className="page-container max-w-[800px]">
        <nav className="page-breadcrumb">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <span>/</span>
          <Link href="/account" className="hover:text-gold transition-colors">Account</Link>
          <span>/</span>
          <span className="text-gold">Addresses</span>
        </nav>

        <div className="panel mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="section-tag mb-4">Saved Addresses</p>
              <h1 className="page-title">Your Addresses</h1>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-gold text-xs">
              {showForm ? 'Cancel' : '+ Add New'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAdd} className="mb-8 p-6 border border-gold/15 bg-bark/40 space-y-4">
              <div>
                <label className="form-label">Address Line 1 *</label>
                <input required value={form.line1} onChange={e => setForm(f => ({ ...f, line1: e.target.value }))} className="form-input" />
              </div>
              <div>
                <label className="form-label">Address Line 2</label>
                <input value={form.line2} onChange={e => setForm(f => ({ ...f, line2: e.target.value }))} className="form-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">City *</label>
                  <input required value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="form-input" />
                </div>
                <div>
                  <label className="form-label">State *</label>
                  <input required value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="form-input" />
                </div>
              </div>
              <div>
                <label className="form-label">Pincode *</label>
                <input required value={form.pincode} onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))} className="form-input" />
              </div>
              <label className="flex items-center gap-2 text-sm font-body text-mist/70 cursor-pointer">
                <input type="checkbox" checked={form.is_default} onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))} className="accent-gold" />
                Set as default address
              </label>
              {error && <p className="text-red-400 text-xs font-body">{error}</p>}
              <button type="submit" disabled={saving} className="btn-gold disabled:opacity-50">
                {saving ? 'Saving…' : 'Save Address'}
              </button>
            </form>
          )}

          {addresses.length > 0 ? (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="border border-gold/12 p-5 bg-bark/30 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-body text-cream leading-relaxed">
                      {addr.line1}
                      {addr.line2 && <><br />{addr.line2}</>}
                      <br />{addr.city}, {addr.state} — {addr.pincode}
                    </p>
                    {addr.is_default && (
                      <span className="inline-block mt-2 text-[9px] tracking-widest uppercase text-gold border border-gold/40 px-2 py-0.5">Default</span>
                    )}
                  </div>
                  <button onClick={() => handleDelete(addr.id)} className="text-red-400/60 hover:text-red-400 text-xs font-body transition-colors flex-shrink-0">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !showForm && (
              <p className="text-center text-mist/40 font-display italic text-lg py-8">No saved addresses yet</p>
            )
          )}
        </div>
      </div>
    </main>
  )
}
