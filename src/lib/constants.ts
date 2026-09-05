import { StoreSettings, CategoryItem } from './types';

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: "Shashi Enterprises",
  legalName: "Shashi Enterprises",
  tagline: "India's Trade Source for Premium Anime Collectibles",
  logoUrl: "/logo_black_bg.png",
  logoMarkUrl: "/logo_black_bg.png",
  address: "Delhi, India",
  whatsapp: "+91-8796138389",
  email: "enterprisesshashi5@gmail.com",
  gstin: "",
  facebook: "https://www.facebook.com/profile.php?id=61589057115880",
  instagram: "https://www.instagram.com/shashienterprises5",
  minimumOrderValue: 0,
  minimumOrderNote: "50 pcs minimum order quantity",
  paymentMethods: ["UPI", "Bank Transfer", "Cash on Pickup"],
  adminEmail: "admin@shashienterprises.org"
};

export const INITIAL_STORE_SETTINGS = DEFAULT_STORE_SETTINGS;

export const MARQUEE_TEXT = "NEW WHOLESALE DROPS WEEKLY  •  GST INVOICE ON EVERY ORDER  •  PAN‑INDIA DISPATCH  •  BULK PRICING TIERS  •  DEALER ONBOARDING OPEN";

export const CATEGORIES: CategoryItem[] = [
  // Shop by Series
  { id: 'cat-db', name: 'Dragon Ball', slug: 'dragon-ball', type: 'series', image: '/hero-featured/cat-dragon-ball.jpeg' },
  { id: 'cat-op', name: 'One Piece', slug: 'one-piece', type: 'series', image: '/hero-featured/cat-one-piece.jpeg' },
  { id: 'cat-naruto', name: 'Naruto', slug: 'naruto', type: 'series', image: '/hero-featured/cat-naruto.jpeg' },
  { id: 'cat-ds', name: 'Demon Slayer', slug: 'demon-slayer', type: 'series', image: '/hero-featured/cat-demon-slayer.jpeg' },
  { id: 'cat-jjk', name: 'Jujutsu Kaisen', slug: 'jujutsu-kaisen', type: 'series', image: '/hero-featured/cat-jujutsu-kaisen.jpeg' },
  { id: 'cat-solo', name: 'Solo Leveling', slug: 'solo-leveling', type: 'series', image: '/hero-featured/cat-solo-leveling.jpeg' },
  { id: 'cat-aot', name: 'Attack on Titan', slug: 'attack-on-titan', type: 'series', image: '/hero-featured/cat-attack-on-titan.jpeg' },
  { id: 'cat-hxh', name: 'Hunter x Hunter', slug: 'hunter-x-hunter', type: 'series', image: '/hero-featured/cat-hunter-x-hunter.jpeg' },
  { id: 'cat-tj', name: 'Tom & Jerry', slug: 'tom-jerry', type: 'series', image: '/hero-featured/cat-tom-jerry.jpeg' },
  { id: 'cat-pop', name: 'Pop Culture', slug: 'pop-culture', type: 'series', image: '/hero-featured/cat-pop-culture.jpeg' },

  // Shop by Type
  { id: 'cat-figures', name: 'Action Figures', slug: 'action-figures', type: 'type', image: '/hero-featured/cat-action-figures.jpeg' },
  { id: 'cat-statues', name: 'Limited Statues', slug: 'limited-statues', type: 'type', image: '/hero-featured/cat-limited-statues.jpeg' },
  { id: 'cat-resin', name: 'Premium Resin Statues', slug: 'premium-resin-statues', type: 'type', image: '/hero-featured/cat-premium-resin.jpeg' },
  { id: 'cat-imports', name: 'Rare Imports', slug: 'rare-imports', type: 'type', image: '/hero-featured/cat-rare-imports.jpeg' },
  { id: 'cat-weapons', name: 'Katanas & Weapons', slug: 'katanas-weapons', type: 'type', image: '/hero-featured/cat-katanas-weapons.jpeg' },
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
    answer: "Our minimum order quantity is 50 pcs per purchase order across our wholesale catalog."
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
