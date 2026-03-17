import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  accent?: "gold" | "emerald" | "rose" | "sky";
}

const ACCENT_STYLES = {
  gold: {
    icon: "text-admin-gold",
    iconBg: "bg-admin-gold/10",
    glow: "shadow-glow-gold",
  },
  emerald: {
    icon: "text-admin-emerald",
    iconBg: "bg-admin-emerald/10",
    glow: "shadow-glow-emerald",
  },
  rose: {
    icon: "text-admin-rose",
    iconBg: "bg-admin-rose/10",
    glow: "shadow-glow-rose",
  },
  sky: {
    icon: "text-admin-sky",
    iconBg: "bg-admin-sky/10",
    glow: "",
  },
};

export function StatsCard({ label, value, change, icon: Icon, accent = "gold" }: StatsCardProps) {
  const styles = ACCENT_STYLES[accent];
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="admin-card p-5 hover:border-admin-border/80 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center`}>
          <Icon size={18} className={styles.icon} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? "text-admin-emerald" : "text-admin-rose"}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{isPositive ? "+" : ""}{change}%</span>
          </div>
        )}
      </div>
      <div className="data-value text-2xl font-bold text-admin-text mb-1">{value}</div>
      <div className="admin-label">{label}</div>
    </div>
  );
}
