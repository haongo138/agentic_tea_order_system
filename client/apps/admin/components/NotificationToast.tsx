"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, X } from "lucide-react";
import { useNotifications, type Notification } from "@/contexts/notification-context";

const TOAST_DURATION = 6000;

function Toast({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(notification.id), 300);
    }, TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const handleClick = () => {
    router.push(`/orders/${notification.orderId}`);
    onDismiss(notification.id);
  };

  return (
    <div
      className={`relative flex items-start gap-3 p-4 rounded-xl bg-admin-surface border border-admin-border shadow-lg max-w-sm cursor-pointer transition-all duration-300 hover:border-admin-gold/40 ${
        exiting
          ? "opacity-0 translate-x-4"
          : "opacity-100 translate-x-0 animate-slide-in"
      }`}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-admin-gold/15 flex items-center justify-center">
        <ShoppingBag size={15} className="text-admin-gold" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-admin-text">
          {notification.title}
        </p>
        <p className="text-[11px] text-admin-muted mt-0.5 truncate">
          {notification.message}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setExiting(true);
          setTimeout(() => onDismiss(notification.id), 300);
        }}
        className="flex-shrink-0 text-admin-muted hover:text-admin-text transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function NotificationToast() {
  const { notifications, dismiss, markRead } = useNotifications();
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read);
    const newIds = unread
      .slice(0, 5)
      .map((n) => n.id)
      .filter((id) => !visibleIds.has(id));

    if (newIds.length > 0) {
      setVisibleIds((prev) => {
        const next = new Set(prev);
        for (const id of newIds) next.add(id);
        return next;
      });
    }
  }, [notifications, visibleIds]);

  const handleDismiss = (id: string) => {
    markRead(id);
    setVisibleIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toasts = notifications.filter((n) => visibleIds.has(n.id) && !n.read);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((n) => (
        <Toast key={n.id} notification={n} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}
