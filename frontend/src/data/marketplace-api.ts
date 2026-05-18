import type { Product } from "@/data/product";

export type BackendProduct = {
  id: number;
  category: "Feed & Fodder" | "Health & Supplements" | "Grooming & Care" | "Equipment";
  name: string;
  description: string | null;
  image1: string | null;
  image2: string | null;
  contact: string;
};

const FALLBACK_IMAGE = "/images/Masti-Care-1kg-scaled.webp";

export function getBackendUrl() {
  // Server-side (SSR/RSC): prefer internal Docker URL, then public URL
  if (typeof window === "undefined") {
    const internal = process.env.BACKEND_INTERNAL_URL;
    if (internal && internal.trim() !== "") return internal.trim();
    const pub = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (pub && pub.trim() !== "") return pub.trim();
    return "http://localhost:8000";
  }
  // Browser: always use relative paths — Next.js proxy rewrites handle routing
  return "";
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function buildProductSlug(name: string, id: number): string {
  return `${slugify(name)}-${id}`;
}

export function resolveImageUrl(imageUrl: string | null): string {
  if (!imageUrl) return FALLBACK_IMAGE;
  imageUrl = imageUrl.replace("https://dev.pashuvaani.com", "https://pashuvaani.com");
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
  return `${getBackendUrl()}${imageUrl}`;
}

export function mapBackendProductToProduct(product: BackendProduct, index: number): Product {
  const description = product.description?.trim() || "No description provided.";
  const mappedImage1 = resolveImageUrl(product.image1);
  const mappedImage2 = resolveImageUrl(product.image2);
  const categoryMap = {
    "Feed & Fodder": "feed",
    "Health & Supplements": "health",
    "Grooming & Care": "grooming",
    Equipment: "equipment",
  } as const;

  return {
    id: String(product.id),
    slug: buildProductSlug(product.name, product.id),
    name: product.name,
    shortDescription: description,
    description,
    categoryId: categoryMap[product.category],
    imageUrl: mappedImage1,
    gallery: [mappedImage1, mappedImage2],
    inStock: true,
    rating: Number((4.2 + ((index % 7) * 0.1)).toFixed(1)),
    reviewCount: 12 + index * 3,
    highlights: ["Vet guided quality", "Trusted marketplace product", "Call for availability"],
    contact: product.contact,
  };
}

export async function fetchMarketplaceProducts(): Promise<Product[]> {
  const response = await fetch(`${getBackendUrl()}/api/products`, { cache: "no-store" });
  if (!response.ok) return [];
  const data = (await response.json()) as BackendProduct[];
  return data.map(mapBackendProductToProduct);
}
