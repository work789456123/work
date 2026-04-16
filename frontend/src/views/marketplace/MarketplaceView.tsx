"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, LayoutGrid, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ALL_CATEGORIES_ID,
  marketplaceCallHref,
  type MarketplaceFilterId,
  type Product,
  type ProductCategory,
  isProductCategoryId,
} from "@/data/product";
import { fetchMarketplaceProducts } from "@/data/marketplace-api";

type SortKey = "featured" | "rating" | "name-asc";

type Props = {
  categories: ProductCategory[];
  products: Product[];
  initialCategory?: string | null;
};

function parseCategoryParam(value: string | null | undefined): MarketplaceFilterId {
  if (value && isProductCategoryId(value)) return value;
  return ALL_CATEGORIES_ID;
}

export function MarketplaceView({ categories, products, initialCategory }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");
  const effectiveInitial = initialCategory ?? urlCategory;

  const [category, setCategory] = useState<MarketplaceFilterId>(() =>
    parseCategoryParam(effectiveInitial),
  );
  const [sort, setSort] = useState<SortKey>("featured");
  const [liveProducts, setLiveProducts] = useState<Product[]>(products);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categoryParam = searchParams.get("category");
  useEffect(() => {
    setCategory(parseCategoryParam(categoryParam));
  }, [categoryParam]);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await fetchMarketplaceProducts();
      setLiveProducts(data);
    } catch {
      setLiveProducts([]);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
    const intervalId = window.setInterval(() => {
      void fetchProducts();
    }, 15000);
    const onFocus = () => void fetchProducts();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
    };
  }, [fetchProducts]);

  const setQueryCategory = useCallback(
    (next: MarketplaceFilterId) => {
      setCategory(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next === ALL_CATEGORIES_ID) params.delete("category");
      else params.set("category", next);
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const filtered = useMemo(() => {
    const base =
      category === ALL_CATEGORIES_ID
        ? [...liveProducts]
        : liveProducts.filter((p) => p.categoryId === category);
    const list = [...base];

    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => b.reviewCount - a.reviewCount);

    return list;
  }, [liveProducts, category, sort]);

  const activeCategoryMeta =
    category === ALL_CATEGORIES_ID
      ? null
      : categories.find((c) => c.id === category) ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-[hsl(var(--muted)/0.35)] to-background">
      <div className="relative overflow-hidden border-b border-border/60 bg-[#1F6559] text-primary-foreground">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 left-1/4 h-48 w-48 rounded-full bg-black/10 blur-2xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-white/80">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">Marketplace</span>
          </div>
          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 ring-1 ring-white/20">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                PashuVaani care collection
              </div>
              <h1 className="heading-font text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Marketplace
              </h1>
              <p className="max-w-xl text-base text-white/85 sm:text-lg">
                Trusted feed, health, grooming, and equipment — curated for healthier herds and
                happier animals.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/90">
              <LayoutGrid className="h-5 w-5 shrink-0 opacity-90" aria-hidden />
              <span>
                <strong className="font-semibold text-white">{liveProducts.length}</strong> products
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          <aside className="lg:w-80 lg:shrink-0">
            <div className="sticky top-24 space-y-8">
              <Card className="overflow-hidden border-border/70 shadow-md ring-1 ring-[#1F6559]/10">
                <div className="border-b border-border/60 bg-gradient-to-br from-[#1F6559]/8 to-transparent px-5 py-4">
                  <h2 className="heading-font text-lg font-bold text-foreground">Filters</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Narrow by category. Updates shareable via URL.
                  </p>
                </div>
                <CardContent className="space-y-6 p-5 pt-6">
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Category
                    </p>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setQueryCategory(ALL_CATEGORIES_ID)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all",
                          category === ALL_CATEGORIES_ID
                            ? "border-[#1F6559] bg-[#1F6559]/10 text-[#1F6559] shadow-sm ring-2 ring-[#1F6559]/20"
                            : "border-border/80 bg-card hover:border-[#1F6559]/40 hover:bg-muted/40",
                        )}
                      >
                        <span>All products</span>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {liveProducts.length}
                        </Badge>
                      </button>
                      {categories.map((c) => {
                        const count = liveProducts.filter((p) => p.categoryId === c.id).length;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setQueryCategory(c.id)}
                            className={cn(
                              "group flex w-full flex-col gap-1 rounded-xl border px-4 py-3 text-left transition-all",
                              category === c.id
                                ? "border-[#1F6559] bg-[#1F6559]/10 shadow-sm ring-2 ring-[#1F6559]/20"
                                : "border-border/80 bg-card hover:border-[#1F6559]/35 hover:bg-muted/40",
                            )}
                          >
                            <span className="flex w-full items-center justify-between gap-2">
                              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                <span className="text-lg" aria-hidden>
                                  {c.icon}
                                </span>
                                {c.label}
                              </span>
                              <Badge variant="outline" className="shrink-0 font-mono text-[10px]">
                                {count}
                              </Badge>
                            </span>
                            <span className="text-xs leading-snug text-muted-foreground group-hover:text-muted-foreground/90">
                              {c.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-border/60 pt-6">
                    <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <ArrowUpDown className="h-3.5 w-3.5" aria-hidden />
                      Sort
                    </p>
                    <label htmlFor="marketplace-sort" className="sr-only">
                      Sort products
                    </label>
                    <select
                      id="marketplace-sort"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as SortKey)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F6559]/40"
                    >
                      <option value="featured">Featured (popular)</option>
                      <option value="rating">Highest rated</option>
                      <option value="name-asc">Name: A–Z</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            {activeCategoryMeta && (
              <p className="text-sm text-muted-foreground">
                Showing <strong className="text-foreground">{activeCategoryMeta.label}</strong>
                {" — "}
                {activeCategoryMeta.description}
              </p>
            )}

            {isLoadingProducts ? (
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <li key={item} className="h-80 animate-pulse rounded-2xl bg-muted" />
                ))}
              </ul>
            ) : filtered.length === 0 ? (
              <Card className="border-dashed py-16 text-center">
                <CardContent>
                  <p className="heading-font text-lg font-semibold text-foreground">
                    No products in this category yet
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try another category or view all products.
                  </p>
                  <Button
                    className="mt-6 bg-[#1F6559] hover:bg-[#1F6559]/90"
                    onClick={() => setQueryCategory(ALL_CATEGORIES_ID)}
                  >
                    View all
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <li key={p.id}>
                    <Card className="group flex h-full flex-col overflow-hidden border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#1F6559]/35 hover:shadow-lg">
                      <Link
                        href={`/marketplace/${p.id}`}
                        className="relative block aspect-[4/3] overflow-hidden bg-muted outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1F6559]"
                      >
                        <Image
                          src={p.imageUrl}
                          alt={p.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                        {!p.inStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
                            <Badge variant="secondary" className="text-xs">
                              Out of stock
                            </Badge>
                          </div>
                        )}
                      </Link>
                      <CardContent className="flex flex-1 flex-col space-y-3 p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-[#1F6559]/25 text-[11px] font-semibold text-[#1F6559]"
                          >
                            {categories.find((c) => c.id === p.categoryId)?.label ?? p.categoryId}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ★ {p.rating.toFixed(1)} ({p.reviewCount})
                          </span>
                        </div>
                        <Link
                          href={`/marketplace/${p.id}`}
                          className="heading-font text-lg font-bold leading-snug text-foreground hover:text-[#1F6559]"
                        >
                          {p.name}
                        </Link>
                        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                          {p.shortDescription}
                        </p>
                        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center">
                          <Button
                            size="sm"
                            className="w-full rounded-xl bg-[#1F6559] font-semibold hover:bg-[#1F6559]/90 sm:flex-1"
                            asChild
                          >
                            <a href={marketplaceCallHref}>
                              <Phone className="h-4 w-4" aria-hidden />
                              Call now
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full rounded-xl sm:flex-1"
                            onClick={() => setSelectedProduct(p)}
                          >
                            Buy now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Buy Now</h3>
            <p className="mt-1 text-sm text-slate-600">{selectedProduct.name}</p>
            <p className="mt-3 text-sm text-slate-700">{selectedProduct.shortDescription}</p>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Contact: {selectedProduct.contact ?? "+917073041236"}
            </p>
            <div className="mt-5 flex gap-2">
              <Button className="bg-[#1F6559] hover:bg-[#1F6559]/90" asChild>
                <a href={`tel:${selectedProduct.contact ?? "+917073041236"}`}>Call Now</a>
              </Button>
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
