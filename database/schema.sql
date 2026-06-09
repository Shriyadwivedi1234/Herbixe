-- ─────────────────────────────────────────────────────────────────────────────
-- Herbixe — Supabase PostgreSQL Schema
-- Run this in the Supabase SQL editor to set up your database
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── PRODUCTS ────────────────────────────────────────────────────────────────
create table if not exists products (
  id               uuid primary key default uuid_generate_v4(),
  name             text not null,
  slug             text not null unique,
  category         text not null check (category in ('hair-paste','herbal-oil','scalp-care','premium-package')),
  price            integer not null,               -- in rupees
  original_price   integer,
  size             text not null,
  description      text not null,
  long_description text,
  ingredients      text[]  default '{}',
  benefits         text[]  default '{}',
  how_to_use       text,
  badge            text,
  icon             text    default '🌿',
  stock            integer default 0,
  images           text[]  default '{}',
  rating           numeric(3,1) default 0,
  review_count     integer default 0,
  is_active        boolean default true,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- ─── CUSTOMERS ───────────────────────────────────────────────────────────────
-- Extends Supabase Auth users
create table if not exists customers (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  phone      text,
  created_at timestamptz default now()
);

-- ─── ADDRESSES ───────────────────────────────────────────────────────────────
create table if not exists addresses (
  id          uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete cascade,
  line1       text not null,
  line2       text,
  city        text not null,
  state       text not null,
  pincode     text not null,
  country     text default 'India',
  is_default  boolean default false,
  created_at  timestamptz default now()
);

-- ─── ORDERS ──────────────────────────────────────────────────────────────────
create table if not exists orders (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid references auth.users(id),
  razorpay_order_id    text unique,
  razorpay_payment_id  text,
  status               text default 'pending'
                       check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  subtotal             integer not null,
  shipping             integer default 0,
  total                integer not null,
  customer             jsonb not null,   -- snapshot of CustomerInfo
  items                jsonb not null,   -- snapshot of OrderItem[]
  shiprocket_order_id  text,
  tracking_id          text,
  paid_at              timestamptz,
  shipped_at           timestamptz,
  delivered_at         timestamptz,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────
create table if not exists reviews (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid references products(id) on delete cascade,
  user_id     uuid references auth.users(id),
  order_id    uuid references orders(id),
  rating      integer not null check (rating between 1 and 5),
  title       text,
  body        text,
  is_verified boolean default false,
  created_at  timestamptz default now()
);

-- ─── TRIGGERS — auto-update updated_at ───────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();

create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

-- ─── TRIGGER — auto-update product rating on new review ──────────────────────
create or replace function refresh_product_rating()
returns trigger as $$
begin
  update products
  set
    rating       = (select round(avg(rating)::numeric, 1) from reviews where product_id = new.product_id),
    review_count = (select count(*) from reviews where product_id = new.product_id)
  where id = new.product_id;
  return new;
end;
$$ language plpgsql;

create trigger reviews_refresh_rating after insert or update or delete on reviews
  for each row execute function refresh_product_rating();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
alter table products   enable row level security;
alter table orders     enable row level security;
alter table customers  enable row level security;
alter table addresses  enable row level security;
alter table reviews    enable row level security;

-- Products: public read, admin write
create policy "Products are publicly readable"
  on products for select using (is_active = true);

-- Orders: users see only their own
create policy "Users see own orders"
  on orders for select using (auth.uid() = user_id);

create policy "Service role can manage orders"
  on orders using (auth.role() = 'service_role');

-- Customers: own row only
create policy "Users manage own profile"
  on customers using (auth.uid() = id);

-- Addresses: own rows only
create policy "Users manage own addresses"
  on addresses using (auth.uid() = customer_id);

-- Reviews: public read, owner write
create policy "Reviews publicly readable" on reviews for select using (true);
create policy "Users write own reviews"   on reviews for insert with check (auth.uid() = user_id);

-- ─── SEED PRODUCTS ───────────────────────────────────────────────────────────
insert into products (name, slug, category, price, size, badge, icon, description, long_description, ingredients, benefits, how_to_use, stock, rating, review_count)
values
  ('Bhringraj Power Paste', 'bhringraj-power-paste', 'hair-paste', 649, '200g', 'Bestseller', '🌿',
   'Targets hair fall and promotes regrowth with the sacred trinity of Bhringraj, Amla & Methi.',
   'Our most potent formula. A rich herbal paste loaded with Bhringraj, Amla, and Methi. Apply, leave for 45 minutes, and let ancient botanical magic transform your hair in 4 weeks.',
   array['Bhringraj','Amla','Methi','Brahmi','Neem','Coconut Oil'],
   array['Reduces hair fall by up to 60%','Promotes new growth','Strengthens from root to tip'],
   'Apply from root to tip. Leave 45–60 mins. Rinse with mild shampoo. Use 2–3x weekly.', 50, 4.9, 247),

  ('Hibiscus Shine Paste', 'hibiscus-shine-paste', 'hair-paste', 599, '200g', 'New', '🌺',
   'Glass-like shine with Hibiscus and Shikakai.',
   'Hibiscus and Shikakai combine for a brilliant shine paste that smooths frizz and adds a glass-like sheen.',
   array['Hibiscus','Shikakai','Aloe Vera','Rose Water','Argan Oil'],
   array['Eliminates frizz','Adds mirror-like shine','Softens coarse hair'],
   'Apply to clean damp hair. Leave 30 mins. Rinse well.', 40, 4.7, 128),

  ('Neem Scalp Detox', 'neem-scalp-detox', 'scalp-care', 549, '150g', null, '🌱',
   'Intense scalp purification with Neem, Tulsi, and Kaolin.',
   'Eliminates dandruff, soothes irritation, and rebalances your scalp microbiome.',
   array['Neem','Tulsi','Kaolin Clay','Tea Tree','Peppermint'],
   array['Eliminates dandruff','Soothes itchy scalp','Deep pore cleansing'],
   'Apply to scalp, massage 5 mins, leave 20 mins, rinse. Use once weekly.', 60, 4.8, 89),

  ('Brahmi Growth Oil', 'brahmi-growth-oil', 'herbal-oil', 749, '100ml', 'Fan Fav', '🫚',
   'Cold-pressed carrier oils infused with Brahmi. Awakens dormant follicles.',
   'Cold-pressed carrier oils infused with Brahmi extract and 9 potent herbs.',
   array['Brahmi','Castor Oil','Sesame Oil','Amla','Bhringraj','Coconut Oil'],
   array['Awakens dormant follicles','Increases hair density','Reduces thinning'],
   'Warm drops in palms, massage scalp 10–15 mins, leave overnight. Wash out.', 35, 4.9, 312),

  ('Sandalwood Night Oil', 'sandalwood-night-oil', 'herbal-oil', 899, '100ml', null, '🌸',
   'Overnight transformation with Sandalwood, Rose and Jasmine.',
   'Transforms dry, brittle hair into silky, fragrant strands overnight.',
   array['Sandalwood','Rose','Jasmine','Argan Oil','Sweet Almond'],
   array['Deep overnight conditioning','Restores shine','Heavenly fragrance'],
   'Apply before bed, wrap in silk bonnet. Wash out in morning.', 25, 4.8, 76),

  ('Complete Ritual Kit', 'complete-ritual-kit', 'premium-package', 1799, 'Complete Set', 'Best Value', '✨',
   'The full Herbixe regimen in a handcrafted bamboo gift box.',
   'Everything you need to begin your hair transformation ritual.',
   array['Bhringraj Power Paste','Brahmi Growth Oil','Applicator Brush','Ritual Guide'],
   array['Complete hair care system','Save ₹398 vs buying separately','Premium gift packaging'],
   'Follow the included 8-week ritual guide.', 20, 5.0, 43)

on conflict (slug) do nothing;
