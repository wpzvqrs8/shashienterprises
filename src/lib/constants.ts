import { StoreSettings, CategoryItem } from './types';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Shashi Enterprises",
  legalName: "Shashi Enterprises",
  tagline: "India's Trade Source for Premium Anime Collectibles",
  logoUrl: "/logo_black_bg.png",
  logoMarkUrl: "/favicon.png",
  address: "Shop No. 275, New Lajpat Rai Market, Chandni Chowk, Delhi - 110006, India",
  whatsapp: "+91-8796138389",
  email: "enterprisesshashi95@gmail.com",
  gstin: "",
  facebook: "https://www.facebook.com/profile.php?id=61589057115880",
  instagram: "https://www.instagram.com/shashienterprises5",
  minimumOrderValue: 6000,
  minimumOrderNote: "Minimum Wholesale Order Value ₹6,000 | 100% B2B Compliant GST Tax Invoice Included",
  paymentMethods: ["UPI", "Bank Transfer", "Cash on Pickup"],
  adminEmail: "admin@shashienterprises.org"
};

export const INITIAL_STORE_SETTINGS = DEFAULT_STORE_SETTINGS;

export const MARQUEE_TEXT = "NEW WHOLESALE DROPS WEEKLY  •  GST INVOICE ON EVERY ORDER  •  PAN‑INDIA DISPATCH  •  BULK PRICING TIERS  •  DEALER ONBOARDING OPEN";

export const CATEGORIES: CategoryItem[] = [
  // Shop by Series
  { id: 'cat-db', name: 'Dragon Ball', slug: 'dragon-ball', type: 'series', image: '/category-figures/fig-dragon-ball.png' },
  { id: 'cat-op', name: 'One Piece', slug: 'one-piece', type: 'series', image: '/category-figures/fig-one-piece.png' },
  { id: 'cat-naruto', name: 'Naruto', slug: 'naruto', type: 'series', image: '/category-figures/fig-naruto.png' },
  { id: 'cat-ds', name: 'Demon Slayer', slug: 'demon-slayer', type: 'series', image: '/category-figures/fig-demon-slayer.png' },
  { id: 'cat-jjk', name: 'Jujutsu Kaisen', slug: 'jujutsu-kaisen', type: 'series', image: '/category-figures/fig-jujutsu-kaisen.png' },
  { id: 'cat-solo', name: 'Solo Leveling', slug: 'solo-leveling', type: 'series', image: '/category-figures/fig-solo-leveling.png' },
  { id: 'cat-aot', name: 'Attack on Titan', slug: 'attack-on-titan', type: 'series', image: '/category-figures/fig-attack-on-titan.png' },
  { id: 'cat-hxh', name: 'Hunter x Hunter', slug: 'hunter-x-hunter', type: 'series', image: '/category-figures/fig-hunter-x-hunter.png' },
  { id: 'cat-marvel', name: 'Marvel', slug: 'marvel', type: 'series', image: '/category-figures/fig-marvel.png' },
  { id: 'cat-pop', name: 'Pop Culture', slug: 'pop-culture', type: 'series', image: '/category-figures/fig-pop-culture.png' },

  // Shop by Type
  { id: 'cat-figures', name: 'Action Figures', slug: 'action-figures', type: 'type', image: '/category-figures/fig-action-figures.png' },
  { id: 'cat-statues', name: 'Limited Statues', slug: 'limited-statues', type: 'type', image: '/category-figures/fig-limited-statues.png' },
  { id: 'cat-resin', name: 'Premium Resin Statues', slug: 'premium-resin-statues', type: 'type', image: '/category-figures/fig-premium-resin.png' },
  { id: 'cat-weapons', name: 'Katanas & Weapons', slug: 'katanas-weapons', type: 'type', image: '/category-figures/fig-katanas-weapons.png' },
];

export interface Testimonial {
  quote: string;
  author: string;
  store: string;
  city: string;
  rating: number;
}

export const TESTIMONIALS: Testimonial[] = [];

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer: "Our minimum order quantity is specified per product SKU."
  },
  {
    question: "Do you provide a GST invoice?",
    answer: "Yes! Every single wholesale dispatch comes with a 100% compliant B2B GST tax invoice containing your business GSTIN number."
  },
  {
    question: "What are your payment terms?",
    answer: "Payments are accepted via UPI, IMPS / NEFT / RTGS Bank Transfer upon order confirmation. Cash on pickup is available for Delhi warehouse order collections."
  },
  {
    question: "How is bulk tiered pricing calculated?",
    answer: "Each product features transparent volume pricing tiers. As your cart quantity increases, the per-piece wholesale price automatically recalculates."
  },
  {
    question: "How long does dispatch take pan-India?",
    answer: "Orders are processed and packed within 24–48 hours of payment receipt. Transit time typically ranges from 2 to 4 business days pan-India via express transport logistics."
  },
  {
    question: "Can I become a listed dealer?",
    answer: "Yes, submit your store details on our 'Become a Dealer' page. Verified trade accounts gain priority inventory allocation and dedicated account manager support."
  }
];
