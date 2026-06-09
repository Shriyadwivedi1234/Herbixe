import { Metadata } from 'next'
import ContentPage from '@/components/layout/ContentPage'

export const metadata: Metadata = { title: 'Contact — Herbixe' }

export default function ContactPage() {
  return (
    <ContentPage title="Contact Us" subtitle="We would love to hear from you.">
      <p><strong className="text-gold font-body">Email:</strong> herbixe@gmail.com</p>
      <p><strong className="text-gold font-body">Hours:</strong> Monday – Saturday, 10am – 6pm IST</p>
      <p>For order enquiries, please include your payment ID or the email used at checkout. We typically respond within 24 hours.</p>
    </ContentPage>
  )
}
