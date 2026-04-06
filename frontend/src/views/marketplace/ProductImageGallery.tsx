"use client";

import Image from "next/image";
import * as React from "react";
import ReactDOM from "react-dom";
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

const ZOOM_LEVEL = 3.2;
const PANE_SIZE = 260; // px — small window that follows the cursor
const CURSOR_OFFSET_X = 20; // gap between cursor and pane (right side by default)
const CURSOR_OFFSET_Y = -PANE_SIZE / 2; // vertically centred on cursor

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

/** `object-cover` math: displayed bitmap size and offset inside the container. */
function getObjectCoverLayout(
  natW: number,
  natH: number,
  cw: number,
  ch: number,
): { dispW: number; dispH: number; offX: number; offY: number } {
  const containerRatio = cw / ch;
  const imageRatio = natW / natH;
  let dispW: number;
  let dispH: number;
  let offX: number;
  let offY: number;
  if (imageRatio > containerRatio) {
    dispH = ch;
    dispW = (natW / natH) * ch;
    offX = (cw - dispW) / 2;
    offY = 0;
  } else {
    dispW = cw;
    dispH = (natH / natW) * cw;
    offX = 0;
    offY = (ch - dispH) / 2;
  }
  return { dispW, dispH, offX, offY };
}

/**
 * Hover zoom: small popup that follows the cursor.
 * Portaled to document.body to escape Embla's CSS transform container.
 * Coarse-pointer / no-hover devices: image only, no zoom chrome.
 */
function EcommerceHoverZoom({
  src,
  alt,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  const [natW, setNatW] = React.useState(0);
  const [natH, setNatH] = React.useState(0);
  const [hover, setHover] = React.useState(false);
  const [cursor, setCursor] = React.useState({ x: 0, y: 0 });
  const [bg, setBg] = React.useState({ sizeW: 0, sizeH: 0, posX: 0, posY: 0 });
  const mainRef = React.useRef<HTMLDivElement>(null);
  const [finePointer, setFinePointer] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const updateFromPoint = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = mainRef.current;
      if (!el || !natW || !natH) return;

      const rect = el.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      const cw = rect.width;
      const ch = rect.height;

      const { offX, offY, dispW, dispH } = getObjectCoverLayout(natW, natH, cw, ch);
      const imgX = clamp(((mx - offX) / dispW) * natW, 0, natW);
      const imgY = clamp(((my - offY) / dispH) * natH, 0, natH);

      // Popup position: follow cursor, flip side if near viewport edge
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 8;
      let left = clientX + CURSOR_OFFSET_X;
      let top  = clientY + CURSOR_OFFSET_Y;
      // flip left if too close to right edge
      if (left + PANE_SIZE > vw - margin) left = clientX - CURSOR_OFFSET_X - PANE_SIZE;
      // clamp vertically
      top = clamp(top, margin, vh - PANE_SIZE - margin);

      setCursor({ x: left, y: top });
      setBg({
        sizeW: natW * ZOOM_LEVEL,
        sizeH: natH * ZOOM_LEVEL,
        posX: PANE_SIZE / 2 - imgX * ZOOM_LEVEL,
        posY: PANE_SIZE / 2 - imgY * ZOOM_LEVEL,
      });
    },
    [natW, natH],
  );

  const onMouseMove  = (e: React.MouseEvent) => { if (finePointer) updateFromPoint(e.clientX, e.clientY); };
  const onMouseEnter = (e: React.MouseEvent) => { if (!finePointer) return; setHover(true); updateFromPoint(e.clientX, e.clientY); };
  const onMouseLeave = () => setHover(false);

  const showZoom = finePointer && natW > 0 && natH > 0;

  return (
    <>
      {/* Main image — always full width */}
      <div
        ref={mainRef}
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-2xl border border-border/60 bg-muted shadow-lg ring-1 ring-[#1F6559]/10",
          showZoom && "cursor-zoom-in",
        )}
        onMouseEnter={onMouseEnter}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover"
          sizes={sizes}
          onLoadingComplete={(img) => {
            setNatW(img.naturalWidth);
            setNatH(img.naturalHeight);
          }}
        />
      </div>

      {/* Small popup portaled to <body> — escapes Embla's CSS transform */}
      {showZoom && hover && mounted &&
        ReactDOM.createPortal(
          <div
            className="pointer-events-none fixed overflow-hidden rounded-xl border border-border/80 shadow-2xl ring-2 ring-[#1F6559]/25"
            style={{
              zIndex: 9999,
              left: cursor.x,
              top:  cursor.y,
              width:  PANE_SIZE,
              height: PANE_SIZE,
              backgroundImage: `url(${src})`,
              backgroundRepeat:   "no-repeat",
              backgroundSize:     `${bg.sizeW}px ${bg.sizeH}px`,
              backgroundPosition: `${bg.posX}px ${bg.posY}px`,
            }}
            aria-hidden
          />,
          document.body,
        )}
    </>
  );
}

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
      <EcommerceHoverZoom
        src={images[0]}
        alt={productName}
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
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
                <EcommerceHoverZoom
                  src={src}
                  alt={`${productName} — image ${i + 1} of ${images.length}`}
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            type="button"
            className="left-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 border-[#1F6559]/25 bg-white/95 text-[#1F6559] shadow-md hover:bg-white disabled:opacity-40"
          />
          <CarouselNext
            type="button"
            className="right-3 top-1/2 z-10 h-10 w-10 -translate-y-1/2 border-[#1F6559]/25 bg-white/95 text-[#1F6559] shadow-md hover:bg-white disabled:opacity-40"
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
