import React from "react";
import Link from "next/link";
import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react";

const FOOTER_LINKS = {
  menu: [
    { label: "Trà Sữa", href: "/menu?cat=milk-tea" },
    { label: "Trà Trái Cây", href: "/menu?cat=fruit-tea" },
    { label: "Cold Brew", href: "/menu?cat=cold-brew" },
    { label: "Kem Cheese", href: "/menu?cat=cheese-foam" },
  ],
  company: [
    { label: "Về Lam Trà", href: "/about" },
    { label: "Tin Tức", href: "/news" },
    { label: "Tuyển Dụng", href: "/careers" },
    { label: "Liên Hệ", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-lam-green-900 text-lam-cream-100">
      <div className="container-wide section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-full bg-lam-gold-500 flex items-center justify-center">
                <span className="text-lam-green-950 text-sm font-bold" style={{ fontFamily: "var(--font-cormorant)" }}>
                  L
                </span>
              </div>
              <span
                className="text-2xl font-semibold text-lam-cream-50"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Lam Trà
              </span>
            </div>
            <p className="text-sm text-lam-cream-200/70 leading-relaxed mb-6">
              Artisan Vietnamese tea crafted with the finest ingredients. 5 locations across Ho Chi Minh City.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-lam-cream-100/10 hover:bg-lam-gold-500/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4 text-lam-cream-100/80" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-lam-cream-100/10 hover:bg-lam-gold-500/20 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4 text-lam-cream-100/80" />
              </a>
            </div>
          </div>

          {/* Menu links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-lam-gold-400 mb-5">
              Thực Đơn
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.menu.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-lam-cream-200/70 hover:text-lam-cream-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-lam-gold-400 mb-5">
              Công Ty
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-lam-cream-200/70 hover:text-lam-cream-50 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-lam-gold-400 mb-5">
              Liên Hệ
            </h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5 text-sm text-lam-cream-200/70">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-lam-gold-400/60" />
                <span>123 Lê Lợi, Quận 1, TP. HCM</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-lam-cream-200/70">
                <Phone className="w-4 h-4 flex-shrink-0 text-lam-gold-400/60" />
                <span>028 3823 1234</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-lam-cream-200/70">
                <Clock className="w-4 h-4 flex-shrink-0 text-lam-gold-400/60" />
                <span>07:00 – 22:30 hàng ngày</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-lam-cream-100/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-lam-cream-200/40">
            © 2026 Lam Trà. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="text-xs text-lam-cream-200/40 hover:text-lam-cream-200/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-lam-cream-200/40 hover:text-lam-cream-200/70 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
