// src/components/store/HeroSection.tsx
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-obsidian text-ivory min-h-[85vh] flex items-center">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, #a855f7 0%, transparent 50%), radial-gradient(circle at 80% 20%, #7e22ce 0%, transparent 40%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.4em] text-ash mb-6 animate-fade-up opacity-0 stagger-1" style={{ animationFillMode: "forwards" }}>
            New Arrivals · SS25
          </p>
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl leading-tight mb-8 animate-fade-up opacity-0 stagger-2"
            style={{ animationFillMode: "forwards" }}
          >
            Wear what<br />
            <em className="not-italic text-brand-300">matters.</em>
          </h1>
          <p
            className="text-ash text-lg leading-relaxed mb-10 max-w-lg animate-fade-up opacity-0 stagger-3"
            style={{ animationFillMode: "forwards" }}
          >
            Timeless pieces designed to outlast trends. Every item curated
            for quality, longevity, and effortless style.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 animate-fade-up opacity-0 stagger-4"
            style={{ animationFillMode: "forwards" }}
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-ivory text-obsidian px-8 py-4 font-medium hover:bg-brand-100 transition-colors rounded-none"
            >
              Shop the Collection
            </Link>
            <Link
              href="/products?category=clothing"
              className="inline-flex items-center justify-center border border-ivory/40 text-ivory px-8 py-4 font-medium hover:border-ivory transition-colors rounded-none"
            >
              View Lookbook
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4 text-ash">
        <div className="w-px h-24 bg-ash/30" />
        <span className="text-xs tracking-widest rotate-90 origin-center translate-y-8">SCROLL</span>
      </div>
    </section>
  );
}
