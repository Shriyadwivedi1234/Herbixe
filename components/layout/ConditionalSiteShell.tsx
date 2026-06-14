'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '@/components/ui/CartDrawer'
import CustomCursor from '@/components/ui/CustomCursor'

const BARE_PATHS = ['/login', '/signup']

export default function ConditionalSiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bare = BARE_PATHS.includes(pathname)

  return (
    <>
      <CustomCursor />
      {bare ? (
        children
      ) : (
        <>
          <Navbar />
          <CartDrawer />
          {children}
          <Footer />
        </>
      )}
    </>
  )
}
