"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Check, ShoppingBag } from "lucide-react";
import { useNotifications } from "@/contexts/notification-context";
import { useSocket } from "@/contexts/socket-context";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "Vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  return `${hours} giờ trước`;
}

export function TopBar({ title, subtitle }: TopBarProps) {
  const router = useRouter();
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications();
  const { connected } = useSocket();
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    if (panelOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [panelOpen]);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-admin-bg/90 backdrop-blur border-b border-admin-border">
      <div>
        <h1 className="text-lg font-semibold text-admin-text">{title}</h1>
        {subtitle && (
          <p className="text-xs text-admin-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted"
          />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-9 pr-4 py-1.5 text-sm bg-admin-surface border border-admin-border rounded-lg text-admin-text placeholder-admin-muted focus:outline-none focus:border-admin-gold/50 w-48 transition-colors"
          />
        </div>

        {/* Connection indicator */}
        <div
          className={`w-2 h-2 rounded-full ${
            connected ? "bg-admin-emerald" : "bg-admin-muted"
          }`}
          title={connected ? "Kết nối realtime" : "Mất kết nối"}
        />

        {/* Notifications */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setPanelOpen((prev) => !prev)}
            className="relative w-8 h-8 rounded-lg bg-admin-surface border border-admin-border flex items-center justify-center text-admin-muted hover:text-admin-text hover:border-admin-gold/40 transition-all"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-admin-rose text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification panel */}
          {panelOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-admin-surface border border-admin-border rounded-xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-admin-border">
                <span className="text-xs font-semibold text-admin-text">
                  Thông Báo
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[10px] text-admin-gold hover:underline font-medium"
                  >
                    <Check size={10} />
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-admin-border">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-admin-muted">
                    Chưa có thông báo
                  </div>
                ) : (
                  notifications.slice(0, 20).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        markRead(n.id);
                        setPanelOpen(false);
                        router.push(`/orders/${n.orderId}`);
                      }}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-admin-surface2 transition-colors ${
                        !n.read ? "bg-admin-gold/5" : ""
                      }`}
                    >
                      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-admin-gold/15 flex items-center justify-center mt-0.5">
                        <ShoppingBag size={13} className="text-admin-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-admin-text">
                            {n.title}
                          </span>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-admin-gold flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-admin-muted mt-0.5 truncate">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-admin-muted/60 mt-1">
                          {timeAgo(n.timestamp)}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
