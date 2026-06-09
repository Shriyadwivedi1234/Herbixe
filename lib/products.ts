import { Product } from '@/types'

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bhringraj Power Paste',
    slug: 'bhringraj-power-paste',
    category: 'hair-paste',
    price: 649,
    original_price: 799,
    size: '200g',
    badge: 'Bestseller',
    icon: '🌿',
    description: 'A rich herbal paste powered by Bhringraj and Amla. Targets hair fall, promotes regrowth, and deeply nourishes the scalp.',
    long_description: 'Our signature Bhringraj Power Paste is a concentrated Ayurvedic treatment formulated with freshly ground Bhringraj, Amla, Methi, and Brahmi. Designed for weekly scalp rituals, it strengthens follicles, reduces breakage, and restores vitality to tired, thinning hair.',
    ingredients: ['Bhringraj', 'Amla', 'Methi', 'Brahmi'],
    benefits: ['Reduces hair fall within 4–6 weeks', 'Stimulates dormant follicles', 'Deeply nourishes the scalp', 'Adds natural thickness and shine'],
    how_to_use: 'Apply generously to scalp and lengths. Leave for 45 minutes under a warm towel. Rinse with lukewarm water and follow with a mild herbal cleanser. Use once or twice weekly for best results.',
    stock: 50,
    images: [],
    rating: 4.9,
    review_count: 128,
    created_at: '2024-01-15',
  },
  {
    id: '2',
    name: 'Hibiscus Shine Paste',
    slug: 'hibiscus-shine-paste',
    category: 'hair-paste',
    price: 599,
    size: '200g',
    badge: 'New',
    icon: '🌺',
    description: 'Hibiscus and shikakai combine for a brilliant shine paste that smooths frizz and adds a glass-like sheen to all hair types.',
    long_description: 'Hibiscus Shine Paste blends sun-dried hibiscus petals with shikakai and aloe vera for a smoothing, gloss-enhancing treatment. Ideal for dry, dull, or frizz-prone hair that needs luminous body without heaviness.',
    ingredients: ['Hibiscus', 'Shikakai', 'Aloe Vera', 'Rose'],
    benefits: ['Smooths frizz and flyaways', 'Boosts natural shine', 'Gentle enough for colour-treated hair', 'Softens without silicones'],
    how_to_use: 'Work through damp hair from mid-lengths to ends. Leave 30 minutes, then rinse thoroughly. For extra shine, use as a pre-wash mask before your regular shampoo.',
    stock: 40,
    images: [],
    rating: 4.8,
    review_count: 64,
    created_at: '2024-06-01',
  },
  {
    id: '3',
    name: 'Neem Scalp Detox Paste',
    slug: 'neem-scalp-detox',
    category: 'scalp-care',
    price: 549,
    size: '150g',
    icon: '🌱',
    description: 'Intense scalp purification with neem, tulsi, and kaolin. Eliminates dandruff, soothes irritation, and rebalances your scalp microbiome.',
    long_description: 'Neem Scalp Detox is a clarifying ritual paste for oily, flaky, or irritated scalps. Neem and tulsi purify while kaolin gently draws out buildup — leaving your scalp calm, balanced, and ready to absorb nourishment.',
    ingredients: ['Neem', 'Tulsi', 'Kaolin', 'Tea Tree'],
    benefits: ['Clears dandruff and buildup', 'Soothes itchiness and irritation', 'Rebalances oily scalps', 'Prepares scalp for growth treatments'],
    how_to_use: 'Massage into the scalp only — avoid lengths if hair is dry. Leave 20 minutes, rinse well. Use every 10–14 days or as needed for scalp concerns.',
    stock: 60,
    images: [],
    rating: 4.7,
    review_count: 89,
    created_at: '2024-03-10',
  },
  {
    id: '4',
    name: 'Brahmi Growth Oil',
    slug: 'brahmi-growth-oil',
    category: 'herbal-oil',
    price: 749,
    size: '100ml',
    badge: 'Fan Fav',
    icon: '🫚',
    description: 'Cold-pressed carrier oils infused with Brahmi extract and 9 potent herbs. Massages into scalp to awaken dormant follicles.',
    long_description: 'Brahmi Growth Oil is a slow-infused scalp elixir combining Brahmi, castor, sesame, and amla in a base of cold-pressed oils. Warm a few drops, massage into the scalp, and let the herbs work overnight to support density and strength.',
    ingredients: ['Brahmi', 'Castor', 'Sesame', 'Amla'],
    benefits: ['Awakens dormant follicles', 'Strengthens roots and reduces breakage', 'Non-greasy overnight formula', 'Calming herbal aroma for evening rituals'],
    how_to_use: 'Warm 5–8 drops between palms. Massage into scalp in circular motions for 5 minutes. Leave overnight or at least 2 hours before washing. Use 2–3 times per week.',
    stock: 35,
    images: [],
    rating: 4.9,
    review_count: 156,
    created_at: '2024-02-20',
  },
  {
    id: '5',
    name: 'Sandalwood Serenity Oil',
    slug: 'sandalwood-serenity-oil',
    category: 'herbal-oil',
    price: 899,
    size: '100ml',
    icon: '🌸',
    description: 'A luxurious overnight treatment oil with sandalwood, rose, and jasmine. Transforms dry, brittle hair into silky, fragrant strands.',
    long_description: 'Sandalwood Serenity Oil is our most indulgent length treatment — a fragrant blend of sandalwood, rose, jasmine, and argan that repairs dryness, seals split ends, and leaves hair impossibly soft.',
    ingredients: ['Sandalwood', 'Rose', 'Jasmine', 'Argan'],
    benefits: ['Repairs dry, brittle ends', 'Adds silkiness without weight', 'Aromatherapeutic evening ritual', 'Protects against heat and environmental stress'],
    how_to_use: 'Apply 3–5 drops to damp or dry ends and mid-lengths. Avoid the scalp if hair is fine. Can be used daily as a finishing serum or as an overnight deep treatment.',
    stock: 25,
    images: [],
    rating: 4.8,
    review_count: 72,
    created_at: '2024-04-05',
  },
  {
    id: '6',
    name: 'Herbixe Complete Kit',
    slug: 'complete-kit',
    category: 'premium-package',
    price: 1799,
    original_price: 2199,
    size: 'Complete Set',
    badge: 'Best Value',
    icon: '✨',
    description: 'The complete Herbixe regimen — one paste, one oil, and a premium handcrafted applicator brush in a giftable bamboo box.',
    long_description: 'The Herbixe Complete Kit brings together our bestseller Bhringraj Power Paste, Brahmi Growth Oil, and a handcrafted applicator brush in a sustainable bamboo gift box — everything needed to begin a full botanical hair ritual.',
    ingredients: ['Bhringraj Paste', 'Brahmi Oil', 'Applicator Brush', 'Ritual Guide'],
    benefits: ['Complete growth + nourishment system', 'Save over ₹200 vs buying separately', 'Gift-ready sustainable packaging', 'Includes step-by-step ritual guide'],
    how_to_use: 'Follow the included ritual guide: detox scalp weekly with paste, oil massage 2–3 times per week, and use the applicator brush for even distribution. Consistency over 8 weeks yields the best results.',
    stock: 20,
    images: [],
    rating: 5.0,
    review_count: 43,
    created_at: '2024-05-01',
  },
]

/** Bestsellers and highlighted picks for the home page (max 3). */
export function getFeaturedProducts(): Product[] {
  const featured = PRODUCTS.filter(p =>
    p.badge === 'Bestseller' || p.badge === 'New' || p.badge === 'Fan Fav'
  )
  return featured.slice(0, 3)
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

export function filterByCategory(category: string): Product[] {
  if (!category || category === 'all') return PRODUCTS
  return PRODUCTS.filter(p => p.category === category)
}

export const CATEGORY_LABELS: Record<string, string> = {
  all:             'All Products',
  'hair-paste':    'Hair Pastes',
  'herbal-oil':    'Herbal Oils',
  'scalp-care':    'Scalp Care',
  'premium-package': 'Gift Sets',
}
