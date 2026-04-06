"use client";

import Image from "next/image";
import * as React from "react";
import type { EmblaCarouselType } from "embla-carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  productName: string;
};

export function ProductImageGallery({ images, productName }: Props) {
  const [api, setApi] = React.useState<EmblaCarouselType | undefined>();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (images.length === 0) {
    return null;
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-lg ring-1 ring-[#1F6559]/10">
        <Image
          src={images[0]}
          alt={productName}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start" }}
        className="w-full"
      >
        <div className="relative">
          <CarouselContent className="-ml-0">
            {images.map((src, i) => (
              <CarouselItem key={`${src}-${i}`} className="basis-full pl-0">
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-lg ring-1 ring-[#1F6559]/10">
                  <Image
                    src={src}
                    alt={`${productName} — image ${i + 1} of ${images.length}`}
                    fill
                    priority={i === 0}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            type="button"
            className="left-3 top-1/2 h-10 w-10 -translate-y-1/2 border-[#1F6559]/25 bg-white/95 text-[#1F6559] shadow-md hover:bg-white disabled:opacity-40"
          />
          <CarouselNext
            type="button"
            className="right-3 top-1/2 h-10 w-10 -translate-y-1/2 border-[#1F6559]/25 bg-white/95 text-[#1F6559] shadow-md hover:bg-white disabled:opacity-40"
          />
        </div>
      </Carousel>

      <div
        className="flex gap-2 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:thin]"
        role="tablist"
        aria-label="Product images"
      >
        {images.map((src, i) => (
          <button
            key={`${src}-thumb-${i}`}
            type="button"
            role="tab"
            aria-selected={current === i}
            aria-label={`Show image ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all md:h-20 md:w-20",
              current === i
                ? "border-[#1F6559] ring-2 ring-[#1F6559]/25"
                : "border-border/60 opacity-80 hover:border-[#1F6559]/40 hover:opacity-100",
            )}
          >
            <Image src={src} alt="" fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}
