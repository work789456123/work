import Image from "next/image";
import Link from "next/link";
import { Check, ChevronLeft, Phone, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/data/product";
import { getCategoryById } from "@/data/product";
import { ProductImageGallery } from "@/views/marketplace/ProductImageGallery";

type Props = {
  product: Product;
  relatedProducts: Product[];
};

function uniqueGalleryImages(product: Product): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const src of [product.imageUrl, ...product.gallery]) {
    if (src && !seen.has(src)) {
      seen.add(src);
      out.push(src);
    }
  }
  return out;
}

export function ProductDetailView({ product, relatedProducts }: Props) {
  const category = getCategoryById(product.categoryId);
  const galleryImages = uniqueGalleryImages(product);
  const contactHref = `tel:${product.contact ?? "+917073041236"}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-[hsl(var(--muted)/0.25)] to-background">
      <div className="border-b border-border/60 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-[#1F6559]">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link href="/marketplace" className="hover:text-[#1F6559]">
              Marketplace
            </Link>
            <span aria-hidden>/</span>
            <span className="font-medium text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href="/marketplace"
          className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-[#1F6559] hover:underline"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Back to marketplace
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductImageGallery images={galleryImages} productName={product.name} />

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <Badge
                  variant="outline"
                  className="border-[#1F6559]/30 text-xs font-semibold text-[#1F6559]"
                >
                  {category.icon} {category.label}
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                ★ {product.rating.toFixed(1)} · {product.reviewCount} reviews
              </span>
            </div>

            <h1 className="heading-font mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {product.name}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">{product.shortDescription}</p>

            <p className="mt-6 text-sm text-muted-foreground">
              For pricing and availability, call our team — we&apos;ll help you choose the right
              product for your animals.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="rounded-xl bg-[#1F6559] text-base font-semibold hover:bg-[#1F6559]/90"
                asChild
              >
                <a href={contactHref}>
                  <Phone className="h-5 w-5" aria-hidden />
                  Call now
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl border-[#1F6559]/40 font-semibold" asChild>
                <Link href="/contact">Contact us</Link>
              </Button>
            </div>

            {!product.inStock && (
              <p className="mt-3 text-sm text-amber-800">
                This item may be temporarily unavailable — call us to confirm restock timelines.
              </p>
            )}

            <Separator className="my-8" />

            <ul className="grid gap-3 sm:grid-cols-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-foreground">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#1F6559]"
                    aria-hidden
                  />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Card className="border-border/70 bg-card/80">
                <CardContent className="flex gap-3 p-4">
                  <Truck className="h-9 w-9 shrink-0 text-[#1F6559]" aria-hidden />
                  <div>
                    <p className="font-semibold text-foreground">Reliable delivery</p>
                    <p className="text-sm text-muted-foreground">
                      Dispatch timelines confirmed when you order by phone or message.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-card/80">
                <CardContent className="flex gap-3 p-4">
                  <ShieldCheck className="h-9 w-9 shrink-0 text-[#1F6559]" aria-hidden />
                  <div>
                    <p className="font-semibold text-foreground">Quality first</p>
                    <p className="text-sm text-muted-foreground">
                      Sourced with animal welfare and vet guidance in mind.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator className="my-10" />

            <section>
              <h2 className="heading-font text-xl font-bold text-foreground">About this product</h2>
              <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </section>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-border/60 pt-14">
            <h2 className="heading-font text-2xl font-bold text-foreground">You may also like</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/marketplace/${p.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all hover:border-[#1F6559]/35 hover:shadow-md"
                  >
                    <div className="relative aspect-[5/4] bg-muted">
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <p className="heading-font line-clamp-2 font-semibold text-foreground group-hover:text-[#1F6559]">
                        {p.name}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#1F6559]">View product →</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
