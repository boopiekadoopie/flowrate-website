"use client";
import { useRef, useEffect } from "react";

export function LawnReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const smoothRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    if (!container || !canvas || !layer) return;

    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = Math.round(width) || 1920;
      canvas.height = Math.round(height) || 1080;
    };
    resizeCanvas();

    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(container);

    // Attach listeners to the parent <section> so the hit area covers the full hero
    const section = container.closest("section") ?? container.parentElement;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
      smoothRef.current = { x: -999, y: -999 };
    };

    section?.addEventListener("mousemove", onMove);
    section?.addEventListener("mouseleave", onLeave);

    const draw = () => {
      const { x: mx, y: my } = mouseRef.current;

      if (mx === -999) {
        smoothRef.current = { x: -999, y: -999 };
      } else {
        smoothRef.current.x += (mx - smoothRef.current.x) * 0.1;
        smoothRef.current.y += (my - smoothRef.current.y) * 0.1;
      }

      const sx = smoothRef.current.x;
      const sy = smoothRef.current.y;
      const ctx = canvas.getContext("2d");
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (sx !== -999) {
        const R = 280;
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, R);
        g.addColorStop(0,    "rgba(255,255,255,1)");
        g.addColorStop(0.4,  "rgba(255,255,255,1)");
        g.addColorStop(0.6,  "rgba(255,255,255,0.75)");
        g.addColorStop(0.75, "rgba(255,255,255,0.4)");
        g.addColorStop(0.88, "rgba(255,255,255,0.12)");
        g.addColorStop(1,    "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        try {
          const url = canvas.toDataURL("image/png");
          layer.style.maskImage = `url(${url})`;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (layer.style as any).webkitMaskImage = `url(${url})`;
        } catch { /* tainted canvas guard */ }
      } else {
        layer.style.maskImage = "none";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (layer.style as any).webkitMaskImage = "none";
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      ro.disconnect();
      section?.removeEventListener("mousemove", onMove);
      section?.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="hidden" />
      <div
        ref={layerRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: "url(/green-lawn.jpg)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      />
    </div>
  );
}
