"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  BarChart3,
  Newspaper,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Tổng Quan", icon: LayoutDashboard },
  { href: "/orders", label: "Đơn Hàng", icon: ShoppingBag },
  { href: "/menu", label: "Thực Đơn", icon: Coffee },
  { href: "/analytics", label: "Phân Tích", icon: BarChart3 },
  { href: "/news", label: "Tin Tức", icon: Newspaper },
  { href: "/staff", label: "Nhân Viên", icon: Users },
];

const BOTTOM_ITEMS = [
  { href: "/settings", label: "Cài Đặt", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-admin-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-admin-gold to-amber-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">LT</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-admin-text leading-none">Lam Trà</div>
            <div className="text-[10px] text-admin-muted mt-0.5 uppercase tracking-wider">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`nav-item-active flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                active
                  ? "bg-admin-surface2 text-admin-text"
                  : "text-admin-muted hover:bg-admin-surface hover:text-admin-text"
              }`}
            >
              <Icon
                size={16}
                className={`flex-shrink-0 transition-colors ${
                  active ? "text-admin-gold" : "text-admin-muted group-hover:text-admin-text"
                }`}
              />
              <span>{label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-admin-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-3 border-t border-admin-border pt-3 space-y-0.5">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-admin-muted hover:bg-admin-surface hover:text-admin-text transition-all duration-150 group"
          >
            <Icon size={16} className="flex-shrink-0 group-hover:text-admin-text transition-colors" />
            <span>{label}</span>
          </Link>
        ))}

        {/* User profile */}
        <div className="mt-2 px-3 py-2.5 rounded-lg bg-admin-surface border border-admin-border">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-admin-gold to-amber-700 flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-bold text-white">SA</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-admin-text truncate">Super Admin</div>
              <div className="text-[10px] text-admin-muted truncate">admin@lamtra.vn</div>
            </div>
            <button className="text-admin-muted hover:text-admin-rose transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-lg bg-admin-surface border border-admin-border flex items-center justify-center text-admin-text"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-[240px] bg-admin-surface border-r border-admin-border transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-admin-muted hover:text-admin-text"
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-[240px] bg-admin-surface border-r border-admin-border z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
