import { Metadata } from 'next'
import ContentPage from '@/components/layout/ContentPage'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Hair Quiz — Herbixe' }

export default function HairQuizPage() {
  return (
    <ContentPage title="Hair Ritual Quiz" subtitle="Find your perfect botanical match.">
      <p>Our personalised hair quiz is coming soon. It will recommend the ideal paste, oil, or kit based on your hair type and concerns.</p>
      <p className="pt-4">
        <Link href="/products" className="text-gold hover:underline font-display italic text-lg">
          Browse the full collection →
        </Link>
      </p>
    </ContentPage>
  )
}
