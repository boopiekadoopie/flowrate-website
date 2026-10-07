import Image from "next/image";
import type { ReactNode } from "react";

/*
 * One 1080×1350 (4:5) social slide in the website's system: Archivo uppercase headline, no
 * eyebrow, Jakarta subline, a stage that takes the remaining height, mascot wordmark bottom-left.
 * Screenshot at deviceScaleFactor 3 for 3240×4050.
 */
export const SLIDE_W = 1080;
export const SLIDE_H = 1350;

export function Slide({
  title,
  sub,
  children,
  wash = false,
  canvas = false,
}: {
  title: ReactNode;
  sub?: ReactNode;
  children: ReactNode;
  wash?: boolean;
  canvas?: boolean;
}) {
  return (
    <div
      data-slide
      className={`relative overflow-hidden flex flex-col px-[80px] pt-[92px] pb-[60px] ${canvas ? "bg-canvas" : "bg-paper"}`}
      style={{ width: SLIDE_W, height: SLIDE_H }}
    >
      {wash && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[38%] h-[62%] bg-[linear-gradient(100deg,rgba(153,229,140,0.22)_0%,rgba(191,219,254,0.26)_50%,rgba(254,240,199,0.22)_100%)] [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_75%,transparent)]"
        />
      )}
      <h1 className="relative font-display uppercase text-[78px] leading-[0.98] tracking-[-0.025em] text-heading [text-wrap:balance]">
        {title}
      </h1>
      {sub && <p className="relative mt-7 text-[31px] leading-[1.42] text-body max-w-[900px] [text-wrap:pretty]">{sub}</p>}
      <div className="relative flex-1 min-h-0 mt-12 flex items-center justify-center">{children}</div>
      <footer className="relative mt-10 flex items-center gap-4">
        <Image src="/mascot.png" alt="" width={1002} height={1530} priority className="h-[76px] w-auto drop-shadow-[0_4px_8px_rgba(16,24,40,0.18)]" />
        <span className="font-extrabold text-[32px] tracking-tight leading-none text-heading">Flowrate</span>
      </footer>
    </div>
  );
}

/* Render a fixed-size website component at a scale, reserving the scaled box in layout. */
export function Scaled({ k, w, h, children, className = "" }: { k: number; w: number; h: number; children: ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`} style={{ width: w * k, height: h * k }}>
      {/* zoom, not transform: Chrome rasterises big blurred shadows in tiles under a scale transform */}
      <div className="absolute left-0 top-0" style={{ width: w, height: h, zoom: k }}>
        {children}
      </div>
    </div>
  );
}
