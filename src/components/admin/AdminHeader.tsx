// src/components/admin/AdminHeader.tsx
"use client";
import { useRouter } from "next/navigation";
import { LogOut, Bell } from "lucide-react";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500">
          <Bell size={18} />
        </button>
        <div className="w-px h-5 bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-medium">
            A
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors text-gray-400"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
