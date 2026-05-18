// src/components/layout/StoreHeader.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StoreHeader() {
  const { totalItems, toggleCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  }

  const navLinks = [
    { href: "/products", label: "Shop" },
    { href: "/products?category=clothing", label: "Clothing" },
    { href: "/products?category=accessories", label: "Accessories" },
    { href: "/products?category=home", label: "Home" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ivory/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-display text-xl font-semibold tracking-tight">
            NexMart
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-sm text-ash hover:text-obsidian transition-colors">
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Search form */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center border border-[var(--border)] rounded-full px-3 py-1.5 gap-2 bg-white">
              <Search size={14} className="text-ash" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search…"
                className="text-sm bg-transparent outline-none w-32 placeholder:text-ash"
              />
            </form>

            {/* Cart */}
            <button onClick={toggleCart}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ShoppingBag size={20} />
              {totalItems() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-600 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {totalItems()}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2" onClick={() => setMobileOpen((o) => !o)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)] space-y-3">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className="block text-sm py-1 text-ash hover:text-obsidian transition-colors"
                onClick={() => setMobileOpen(false)}>
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
