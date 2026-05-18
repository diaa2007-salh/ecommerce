// src/app/(store)/layout.tsx
// Layout for the customer-facing storefront

import StoreHeader from "@/components/layout/StoreHeader";
import CartDrawer from "@/components/store/CartDrawer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col grain">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <footer className="border-t border-[var(--border)] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-display text-lg mb-4">NexMart</h4>
              <p className="text-sm text-ash leading-relaxed">
                Curated essentials for the modern wardrobe and home.
              </p>
            </div>
            {[
              { title: "Shop", links: ["All Products", "New Arrivals", "Sale", "Collections"] },
              { title: "Company", links: ["About Us", "Sustainability", "Press", "Careers"] },
              { title: "Support", links: ["FAQ", "Shipping", "Returns", "Contact"] },
            ].map((col) => (
              <div key={col.title}>
                <h5 className="font-medium text-sm mb-4 uppercase tracking-wider">{col.title}</h5>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-ash hover:text-obsidian transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-ash">© 2025 NexMart. All rights reserved.</p>
            <p className="text-xs text-ash">Built with Next.js · Prisma · Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
