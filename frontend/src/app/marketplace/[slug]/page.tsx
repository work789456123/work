import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailView } from "@/views/marketplace/ProductDetailView";
import {
  getProductBySlug,
  getRelatedProducts,
  products,
} from "@/data/product";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Product" };
  }
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function MarketplaceProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }
  const relatedProducts = getRelatedProducts(product.id, 4);

  return <ProductDetailView product={product} relatedProducts={relatedProducts} />;
}
