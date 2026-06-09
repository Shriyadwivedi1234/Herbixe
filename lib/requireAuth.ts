'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'

/** Redirects unauthenticated users to login with a return URL. */
export function useRequireAuth() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [user, loading, router, pathname])

  return { user, loading, isAuthenticated: !!user }
}
