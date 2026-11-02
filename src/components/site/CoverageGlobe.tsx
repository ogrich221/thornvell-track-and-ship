import { useEffect, useRef } from "react";
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { COVERAGE } from "@/lib/coverage";
import { SectionHeading } from "./Sections";

const land = feature(world as any, (world as any).objects.land) as any;
const graticule = geoGraticule10();

export function CoverageGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const gold = "#C7A66A";
    void css;
    let raf = 0;
    let rot = -20;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = (t: number) => {
      const size = canvas.clientWidth;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== size * dpr) { canvas.width = size * dpr; canvas.height = size * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const r = size / 2 - 4;
      const proj = geoOrthographic().scale(r).translate([size / 2, size / 2]).rotate([rot, -18]).clipAngle(90);
      const path = geoPath(proj, ctx);
      ctx.clearRect(0, 0, size, size);

      const g = ctx.createRadialGradient(size * 0.35, size * 0.3, r * 0.1, size / 2, size / 2, r);
      g.addColorStop(0, "#1d4470"); g.addColorStop(1, "#07182B");
      ctx.beginPath(); path({ type: "Sphere" }); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); path(graticule); ctx.strokeStyle = "rgba(220,227,234,0.08)"; ctx.lineWidth = 0.6; ctx.stroke();
      ctx.beginPath(); path(land); ctx.fillStyle = "#2a4a6e"; ctx.fill();
      ctx.strokeStyle = "rgba(220,227,234,0.35)"; ctx.lineWidth = 0.6; ctx.stroke();

      const center: [number, number] = [-rot, 18];
      COVERAGE.forEach(([name, lon, lat], i) => {
        if (geoDistance([lon, lat], center) > Math.PI / 2 - 0.05) return;
        const [x, y] = proj([lon, lat])!;
        const pulse = (Math.sin(t / 380 + i * 1.7) + 1) / 2;
        ctx.beginPath(); ctx.arc(x, y, 4 + pulse * 9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(199,166,106,${0.45 * (1 - pulse)})`; ctx.fill();
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = pulse > 0.5 ? "#f3dfb3" : gold; ctx.fill();
        if (size > 380) {
          ctx.font = "600 10px Inter, sans-serif"; ctx.fillStyle = `rgba(243,223,179,${0.5 + pulse * 0.5})`;
          ctx.fillText(name, x + 7, y - 6);
        }
      });

      const shine = ctx.createRadialGradient(size / 2, size / 2, r * 0.7, size / 2, size / 2, r);
      shine.addColorStop(0, "rgba(0,0,0,0)"); shine.addColorStop(1, "rgba(199,166,106,0.18)");
      ctx.beginPath(); path({ type: "Sphere" }); ctx.fillStyle = shine; ctx.fill();

      if (!reduce) rot += 0.15;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section className="overflow-hidden bg-navy-deep py-24 text-navy-foreground md:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Our Coverage" title="30 Countries. One Connected Network." text="From the Americas and Europe to the Middle East, Asia and Australia — the highlighted countries are where we move cargo for our clients." light />
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-navy-foreground/80 sm:grid-cols-3">
            {COVERAGE.map(([n]) => (
              <li key={n} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-gold" />{n}</li>
            ))}
          </ul>
        </div>
        <div className="mx-auto w-full max-w-[560px]">
          <canvas ref={ref} className="aspect-square w-full" aria-label="Spinning globe highlighting the 30 countries we cover" role="img" />
        </div>
      </div>
    </section>
  );
}
