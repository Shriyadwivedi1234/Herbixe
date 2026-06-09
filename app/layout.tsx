import type { Metadata } from 'next'
import Script from 'next/script'
import { AuthProvider } from '@/components/providers/AuthProvider'
import ConditionalSiteShell from '@/components/layout/ConditionalSiteShell'
// @ts-ignore: CSS module types are not declared in this project
import './globals.css'

export const metadata: Metadata = {
  title: 'Herbixe — Nature\'s Intelligence for Your Hair',
  description: 'Ancient botanical wisdom meets modern formulation science. Premium herbal hair pastes, oils and ritual kits crafted in India.',
  keywords: ['herbal hair care', 'ayurvedic hair oil', 'bhringraj paste', 'natural hair growth', 'herbixe'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
          strategy="beforeInteractive"
        />
        <AuthProvider>
          <ConditionalSiteShell>{children}</ConditionalSiteShell>
        </AuthProvider>
      </body>
    </html>
  )
}
