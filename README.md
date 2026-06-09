# 🌿 Herbixe — Next.js Full Stack Setup

Premium botanical haircare brand. Built with Next.js 14, React Three Fiber, Zustand, Supabase, and Razorpay.

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Next.js 14 (App Router)           |
| 3D / Canvas | React Three Fiber + Drei          |
| Animations  | Framer Motion                     |
| Styling     | Tailwind CSS                      |
| Cart State  | Zustand (persisted to localStorage)|
| Database    | Supabase (PostgreSQL)             |
| Auth        | Supabase Auth                     |
| Payments    | Razorpay                          |
| Email       | Resend                            |
| Shipping    | Shiprocket API                    |
| Deployment  | Vercel + Supabase                 |

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Fill in your keys:
- **Supabase**: Get from https://supabase.com → Project Settings → API
- **Razorpay**: Get from https://dashboard.razorpay.com → Settings → API Keys
- **Resend**: Get from https://resend.com → API Keys

### 3. Set up database
1. Go to your Supabase project → SQL Editor
2. Paste and run the contents of `database/schema.sql`
3. This creates all tables, RLS policies, triggers, and seeds product data

### 4. Run development server
```bash
npm run dev
```
Open http://localhost:3000

---

## Project Structure

```
herbixe-nextjs/
├── app/
│   ├── page.tsx                    ← Landing page (all sections)
│   ├── layout.tsx                  ← Root layout, fonts, metadata
│   ├── globals.css                 ← Tailwind + design tokens
│   ├── products/
│   │   ├── page.tsx                ← Products listing with filters
│   │   └── [slug]/
│   │       ├── page.tsx            ← Product detail (SSG)
│   │       └── ProductDetailClient.tsx
│   ├── checkout/
│   │   ├── page.tsx                ← Checkout form + Razorpay
│   │   └── success/page.tsx        ← Order confirmation
│   └── api/
│       ├── products/route.ts       ← GET products
│       ├── orders/route.ts         ← GET/POST orders
│       └── razorpay/
│           ├── create/route.ts     ← Create Razorpay order
│           └── verify/route.ts     ← Verify payment signature ⚠️
│
├── components/
│   ├── three/
│   │   └── HeroScene.tsx           ← R3F crystal ball scene
│   ├── ui/
│   │   ├── ProductCard.tsx
│   │   ├── CartDrawer.tsx
│   │   └── CustomCursor.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── sections/
│       ├── HeroSection.tsx         ← Hero with 3D canvas
│       ├── MarqueeBand.tsx
│       ├── PhilosophySection.tsx
│       ├── ProductsSection.tsx
│       ├── FeaturedProduct.tsx
│       ├── IngredientsSection.tsx  ← Also exports Process + Testimonials
│       ├── ProcessSection.tsx
│       └── TestimonialsSection.tsx
│
├── store/
│   └── cartStore.ts                ← Zustand cart with persistence
│
├── lib/
│   ├── supabase.ts                 ← Supabase browser + admin clients
│   ├── razorpay.ts                 ← Razorpay utils + script loader
│   └── products.ts                 ← Seed data (fallback when DB empty)
│
├── types/
│   └── index.ts                    ← All TypeScript types
│
└── database/
    └── schema.sql                  ← Full Supabase schema + seed
```

---

## Payment Flow (Razorpay)

```
Customer clicks "Pay"
  → POST /api/razorpay/create
      → Creates Razorpay order (server-side)
      → Saves pending order in Supabase
      → Returns { orderId, amount, keyId }
  → Opens Razorpay modal in browser
  → Customer pays (UPI / Card / NetBanking)
  → Razorpay calls handler with signature
  → POST /api/razorpay/verify
      → Verifies HMAC signature ← CRITICAL SECURITY STEP
      → Updates order status to 'paid' in Supabase
      → (TODO) Triggers Shiprocket fulfillment
      → (TODO) Sends email via Resend
  → Redirect to /checkout/success
```

⚠️ **Never skip signature verification** — it prevents payment fraud.

---

## Database Schema

```
products     → id, name, slug, category, price, ingredients, stock, rating
orders       → id, razorpay_order_id, status, items (jsonb), customer (jsonb)
customers    → id (= auth.uid), name, phone
addresses    → id, customer_id, line1, city, state, pincode
reviews      → id, product_id, user_id, rating, body
```

---

## Deployment

### Vercel (Frontend + API)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel Dashboard → Settings → Environment Variables
```

### Supabase (Database)
- Already hosted — just run `schema.sql` once

### Custom Domain
1. Add domain in Vercel Dashboard
2. Update `NEXT_PUBLIC_APP_URL` in environment variables
3. Add domain to Razorpay allowed origins

---

## Adding New Products

**Option A — Supabase Dashboard:**
Go to Table Editor → products → Insert row

**Option B — SQL:**
```sql
insert into products (name, slug, category, price, size, description, ...)
values ('New Product', 'new-product', 'hair-paste', 499, '150g', '...', ...);
```

**Option C — Update seed file:**
Edit `lib/products.ts` (used as fallback when DB is empty)

---

## Future Roadmap
- [ ] Customer auth + order history
- [ ] Admin dashboard (order management)
- [ ] Shiprocket auto-fulfillment
- [ ] Resend transactional emails
- [ ] WhatsApp order updates (Interakt / Wati)
- [ ] Hair quiz → personalised product recommendation
- [ ] Body care expansion (new categories)
- [ ] Subscription / replenishment orders
