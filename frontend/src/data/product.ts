/**
 * Marketplace catalog — types, categories, and product records.
 * Replace or extend `products` when wiring to a real API.
 */

export type ProductCategoryId = "feed" | "health" | "grooming" | "equipment";

export const ALL_CATEGORIES_ID = "all" as const;
export type MarketplaceFilterId = typeof ALL_CATEGORIES_ID | ProductCategoryId;

export type ProductCategory = {
  id: ProductCategoryId;
  label: string;
  description: string;
  icon: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  categoryId: ProductCategoryId;
  imageUrl: string;
  gallery: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  highlights: string[];
  contact?: string;
};

/** Dial target for marketplace “Call now” (matches contact page). */
export const marketplaceCallHref = "tel:+917073041236";

export const productCategories: ProductCategory[] = [
  {
    id: "feed",
    label: "Feed & fodder",
    description: "Balanced nutrition for cattle, buffalo, and small ruminants.",
    icon: "🌾",
  },
  {
    id: "health",
    label: "Health & supplements",
    description: "Minerals, vitamins, and vet-recommended support.",
    icon: "💊",
  },
  {
    id: "grooming",
    label: "Grooming & care",
    description: "Coat, skin, and everyday hygiene essentials.",
    icon: "✨",
  },
  {
    id: "equipment",
    label: "Equipment",
    description: "Durable tools and housing accessories for your animals.",
    icon: "🛠️",
  },
];

export const products: Product[] = [
  {
    id: "pv-102",
    slug: "masti-care-60gms-1kg",
    name: "Masti-Care — 60gms / 1kg",
    shortDescription: "Feed supplement for preventing and managing subclinical mastitis.",
    description:
      "Formulated with Vitamin A, Lactobacillus spores, amino nitrogen, and essential chelated minerals. Helps overcome subclinical mastitis, supports udder health, and restores normal milk production. Suitable for cattle and buffaloes. Use as per veterinary guidance.",
    categoryId: "feed",
    imageUrl:
      "/images/Masti-Care-1kg-scaled.webp",
    gallery: [
      "/images/Masti-Care-1kg-scaled.webp",
      "/images/Masti-Care-60gms-1-scaled.webp",
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 64,
    highlights: [
      "Supports udder health",
      "Helps prevent mastitis",
      "Mineral enriched formula",
    ],
  },
  {
    id: "pv-103",
    slug: "apthocare-60gms",
    name: "Apthocare — 60gms",
    shortDescription: "Nutritional supplement for mouth lesions and recovery after infections.",
    description:
      "Contains Vitamin C, Potassium iodate, and Glutamic Acid in a fortified base. Used for managing aphthous lesions, thyroid imbalance, and post FMD recovery symptoms like panting and infertility. Suitable for cattle, buffaloes, sheep, goats, and horses.",
    categoryId: "feed",
    imageUrl:
      "/images/Apthocare-60gms-1-scaled.webp",
    gallery: [
      "/images/Apthocare-60gms-1-scaled.webp",
      "/images/Apthocare-60gms-2-scaled.webp",
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 41,
    highlights: [
      "Supports FMD recovery",
      "Rich in Vitamin C",
      "Multi-species usage",
    ],
  }, {
    id: "pv-104",
    slug: "mastizyme-250gms-1kg",
    name: "Mastizyme — 250gms / 1kg",
    shortDescription: "Vitamin and mineral supplement for improved milk production and health.",
    description:
      "A feed supplement enriched with Vitamins A, D3, E and essential trace minerals like Zinc, Iodine, and Cobalt. Supports overall health, immunity, and productivity in dairy animals. Ideal for improving milk yield and maintaining body condition.",
    categoryId: "feed",
    imageUrl:
      "/images/Mastizyme-1kg-1-scaled.webp",
    gallery: [
      "/images/Mastizyme-1kg-1-scaled.webp",
      "/images/Mastizyme-1kg-3-1-scaled.webp",
      "/images/Mastizyme-250gms-1-scaled.webp",
    ],
    inStock: true,
    rating: 4.6,
    reviewCount: 29,
    highlights: [
      "Vitamin enriched",
      "Improves productivity",
      "Supports immunity",
    ],
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategoryById(id: ProductCategoryId): ProductCategory | undefined {
  return productCategories.find((c) => c.id === id);
}

export function getRelatedProducts(productId: string, limit: number): Product[] {
  const current = products.find((p) => p.id === productId);
  if (!current) return [];
  return products
    .filter((p) => p.id !== productId && p.categoryId === current.categoryId)
    .slice(0, limit);
}

export function isProductCategoryId(value: string): value is ProductCategoryId {
  return productCategories.some((c) => c.id === value);
}
