"use client";

import { Bell, Search } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-admin-bg/90 backdrop-blur border-b border-admin-border">
      <div>
        <h1 className="text-lg font-semibold text-admin-text">{title}</h1>
        {subtitle && <p className="text-xs text-admin-muted mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-9 pr-4 py-1.5 text-sm bg-admin-surface border border-admin-border rounded-lg text-admin-text placeholder-admin-muted focus:outline-none focus:border-admin-gold/50 w-48 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg bg-admin-surface border border-admin-border flex items-center justify-center text-admin-muted hover:text-admin-text hover:border-admin-gold/40 transition-all">
          <Bell size={15} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-admin-rose text-white text-[9px] font-bold flex items-center justify-center">3</span>
        </button>
      </div>
    </header>
  );
}
