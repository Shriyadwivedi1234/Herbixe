import { Metadata } from 'next'
import ContentPage from '@/components/layout/ContentPage'

export const metadata: Metadata = { title: 'Privacy Policy — Herbixe' }

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy Policy">
      <p>Herbixe respects your privacy. We collect only the information needed to process orders and improve your experience — name, email, phone, and shipping address.</p>
      <p>Payment data is handled securely by Razorpay and is never stored on our servers. We do not sell your personal information to third parties.</p>
      <p>This policy will be expanded with full legal details. Last updated: June 2025.</p>
    </ContentPage>
  )
}
