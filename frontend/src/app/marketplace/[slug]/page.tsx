import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailView } from "@/views/marketplace/ProductDetailView";
import { fetchMarketplaceProducts } from "@/data/marketplace-api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const products = await fetchMarketplaceProducts();

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

  const products = await fetchMarketplaceProducts();

  const product = products.find((item) => String(item.id) === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(
      (item) =>
        item.id !== product.id &&
        String(item.categoryId).toLowerCase() === String(product.categoryId).toLowerCase()
    )
    .slice(0, 4);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}