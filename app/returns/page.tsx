import { Metadata } from 'next'
import ContentPage from '@/components/layout/ContentPage'

export const metadata: Metadata = { title: 'Returns — Herbixe' }

export default function ReturnsPage() {
  return (
    <ContentPage title="Returns & Exchanges" subtitle="We want you to love every ritual.">
      <p>Unopened products may be returned within 7 days of delivery. Opened products are non-returnable for hygiene reasons unless damaged in transit.</p>
      <p>To initiate a return, contact us at herbixe@gmail.com with your order ID. Full policy details will be published here soon.</p>
    </ContentPage>
  )
}
