import { Metadata } from 'next'
import ContentPage from '@/components/layout/ContentPage'

export const metadata: Metadata = { title: 'Refund Policy — Herbixe' }

export default function RefundPage() {
  return (
    <ContentPage title="Refund Policy">
      <p>Refunds are processed within 5–7 business days after we receive and inspect returned items. Refunds are issued to the original payment method via Razorpay.</p>
      <p>Damaged or incorrect items are eligible for a full refund or replacement — contact us within 48 hours of delivery with photos.</p>
      <p>Full refund policy details will be published here. Last updated: June 2025.</p>
    </ContentPage>
  )
}
