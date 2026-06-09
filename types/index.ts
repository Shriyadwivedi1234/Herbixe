// ─── Product ───────────────────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  slug: string
  category: 'hair-paste' | 'herbal-oil' | 'premium-package' | 'scalp-care'
  price: number
  original_price?: number
  size: string
  description: string
  long_description: string
  ingredients: string[]
  benefits: string[]
  how_to_use: string
  badge?: string
  icon: string
  stock: number
  images: string[]
  rating: number
  review_count: number
  created_at: string
}

// ─── Cart ──────────────────────────────────────────────────────────────────
export interface CartItem {
  product: Product
  qty: number
}

// ─── Order ────────────────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  user_id?: string
  razorpay_order_id: string
  razorpay_payment_id?: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  customer: CustomerInfo
  created_at: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  price: number
  qty: number
}

export interface CustomerInfo {
  name: string
  email: string
  phone: string
  address: Address
}

export interface Address {
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
}

// ─── API Responses ────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
}
