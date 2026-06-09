import { Metadata } from 'next'
import ContentPage from '@/components/layout/ContentPage'

export const metadata: Metadata = { title: 'Sustainability — Herbixe' }

export default function SustainabilityPage() {
  return (
    <ContentPage title="Sustainability" subtitle="Caring for your hair and the planet we share.">
      <p>We partner with certified organic farms, use recyclable and bamboo packaging where possible, and produce in small batches to reduce waste.</p>
      <p>Our commitment to ethical sourcing and minimal environmental footprint is ongoing — more details coming soon.</p>
    </ContentPage>
  )
}
