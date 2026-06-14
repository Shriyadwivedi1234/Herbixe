'use client'

import Link from 'next/link'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRequireAuth } from '@/lib/requireAuth'
import { usePathname } from 'next/navigation'

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Orders', href: '/admin/orders', icon: '📦' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useRequireAuth()
  const pathname = usePathname()

  if (authLoading) return <main className="page-loading">Checking access…</main>
  if (!user) return null

  return (
    <main className="page-main">
      <div className="page-container-wide">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <div className="panel !p-5 md:sticky md:top-28">
              <p className="text-[9px] tracking-[0.4em] uppercase text-gold font-body mb-4">Admin Panel</p>
              <nav className="space-y-1">
                {ADMIN_NAV.map(({ label, href, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm font-body transition-colors ${
                      pathname === href
                        ? 'text-gold bg-gold/10 border-l-2 border-gold'
                        : 'text-mist/60 hover:text-gold hover:bg-gold/5 border-l-2 border-transparent'
                    }`}
                  >
                    <span>{icon}</span>
                    {label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-gold/10 mt-4 pt-4">
                <Link href="/" className="text-xs text-mist/40 font-body hover:text-gold transition-colors">
                  ← Back to Store
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
