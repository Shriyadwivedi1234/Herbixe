import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCTS, getProductBySlug } from '@/lib/products'
import ProductDetailClient from './ProductDetailClient'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug)
  if (!product) return { title: 'Not Found' }
  return {
    title:       `${product.name} — Herbixe`,
    description: product.description,
  }
}

export async function generateStaticParams() {
  return PRODUCTS.map(p => ({ slug: p.slug }))
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}
