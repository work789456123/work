import { Suspense } from "react";
import type { Metadata } from "next";
import { MarketplaceView } from "@/views/marketplace/MarketplaceView";
import { productCategories, products } from "@/data/product";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Shop feed, health supplements, grooming, and equipment for your animals — curated by PashuVaani.",
};

function MarketplaceSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-muted/30">
      <div className="h-48 bg-[#1F6559]/40 sm:h-56" />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="h-96 rounded-2xl bg-muted lg:w-80" />
          <div className="grid flex-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function MarketplacePage({ searchParams }: PageProps) {
  const { category } = await searchParams;

  return (
    <Suspense fallback={<MarketplaceSkeleton />}>
      <MarketplaceView
        categories={productCategories}
        products={products}
        initialCategory={category ?? null}
      />
    </Suspense>
  );
}
