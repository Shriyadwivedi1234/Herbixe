import { Metadata } from 'next'
import ContentPage from '@/components/layout/ContentPage'

export const metadata: Metadata = { title: 'Our Story — Herbixe' }

export default function OurStoryPage() {
  return (
    <ContentPage title="Our Story" subtitle="Ancient herbs. Sacred science. Extraordinary hair.">
      <p>Herbixe was born from a simple belief: centuries of Ayurvedic wisdom hold solutions that no laboratory can replicate alone.</p>
      <p>We source herbs from trusted growers across India — from the tulsi of Mathura to the bhringraj of Bengal — and process them with cold-press techniques that preserve every active compound.</p>
      <p>Every jar is a ritual. Every drop, a secret from the earth. This page will grow as we share more of our journey with you.</p>
    </ContentPage>
  )
}
