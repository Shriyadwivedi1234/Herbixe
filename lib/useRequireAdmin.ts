'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/components/providers/AuthProvider'
import { supabase } from '@/lib/supabase'

export function useRequireAdmin() {
  const { user, loading } = useAuth()

  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingRole, setCheckingRole] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkAdmin() {
      if (loading) return

      if (!user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error(error)
        router.replace('/')
        return
      }

      const role = data?.role?.toLowerCase()

      if (role === 'admin' || role === 'staff') {
        setIsAdmin(true)
      } else {
        router.replace('/')
      }

      setCheckingRole(false)
    }

    checkAdmin()
  }, [user, loading, router, pathname])

  return {
    user,
    loading: loading || checkingRole,
    isAdmin
  }
}