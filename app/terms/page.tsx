import { Metadata } from 'next'
import ContentPage from '@/components/layout/ContentPage'

export const metadata: Metadata = { title: 'Terms of Service — Herbixe' }

export default function TermsPage() {
  return (
    <ContentPage title="Terms of Service">
      <p>By using the Herbixe website and purchasing our products, you agree to these terms. All products are sold as described; results may vary by individual.</p>
      <p>Prices are listed in INR and include applicable taxes unless stated otherwise. We reserve the right to update pricing and product availability.</p>
      <p>Full terms of service will be published here. Last updated: June 2025.</p>
    </ContentPage>
  )
}
