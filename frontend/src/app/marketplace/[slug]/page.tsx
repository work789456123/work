import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailView } from "@/views/marketplace/ProductDetailView";
import { fetchMarketplaceProducts } from "@/data/marketplace-api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  let products: Awaited<ReturnType<typeof fetchMarketplaceProducts>> = [];
  try {
    products = await fetchMarketplaceProducts();
  } catch {
    return { title: "Product" };
  }

  const product = products.find((item) => String(item.id) === slug);

  if (!product) {
    return { title: "Product" };
  }

  return {
    title: product.name,
    description: product.description || "Product details",
  };
}

export default async function MarketplaceProductPage({ params }: PageProps) {
  const { slug } = await params;

  let products: Awaited<ReturnType<typeof fetchMarketplaceProducts>> = [];
  try {
    products = await fetchMarketplaceProducts();
  } catch {
    notFound();
  }

  const product = products.find((item) => String(item.id) === slug);

  if (!product) {
    notFound();
  }

  // TypeScript narrowing: notFound() throws, so product is defined here
  const foundProduct = product;

  const relatedProducts = products
    .filter(
      (item) =>
        item.id !== foundProduct.id &&
        String(item.categoryId).toLowerCase() === String(foundProduct.categoryId).toLowerCase()
    )
    .slice(0, 4);

  return (
    <ProductDetailView
      product={foundProduct}
      relatedProducts={relatedProducts}
    />
  );
}