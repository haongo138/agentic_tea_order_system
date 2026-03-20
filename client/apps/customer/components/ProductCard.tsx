"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Plus } from "lucide-react";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const BADGE_STYLES: Record<string, { label: string; className: string }> = {
  "best-seller": {
    label: "Bán Chạy",
    className: "bg-lam-terracotta-500/10 text-lam-terracotta-600 border border-lam-terracotta-500/25",
  },
  new: {
    label: "Mới",
    className: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/25",
  },
  seasonal: {
    label: "Theo Mùa",
    className: "bg-lam-gold-500/10 text-lam-gold-600 border border-lam-gold-500/25",
  },
  limited: {
    label: "Giới Hạn",
    className: "bg-purple-500/10 text-purple-700 border border-purple-500/25",
  },
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const badge = product.badge ? BADGE_STYLES[product.badge] : null;

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.price);

  return (
    <Link
      href={`/menu/${product.id}`}
      className="group block"
      style={{ animationDelay: `${index * 0.08}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-product-hover shadow-product cursor-pointer">
        {/* Image area */}
        <div className="relative h-52 overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />
          ) : (
            <>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${product.colorAccent} transition-transform duration-500 ${
                  isHovered ? "scale-110" : "scale-100"
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-4xl">🧋</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-white/30 animate-float" />
              <div className="absolute top-8 right-10 w-2 h-2 rounded-full bg-white/20 animate-float" style={{ animationDelay: "1s" }} />
              <div className="absolute bottom-6 left-5 w-2.5 h-2.5 rounded-full bg-white/25 animate-float" style={{ animationDelay: "2s" }} />
            </>
          )}

          {badge && (
            <div className="absolute top-3 left-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                {badge.label}
              </span>
            </div>
          )}

          <div
            className={`absolute inset-x-0 bottom-0 flex items-center justify-center pb-4 transition-all duration-300 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            <button
              className="flex items-center gap-2 bg-white/90 backdrop-blur-sm text-lam-green-900 hover:bg-white font-medium text-sm px-4 py-2 rounded-full shadow-lg transition-colors"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Plus className="w-4 h-4" />
              Thêm Vào Giỏ
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-1.5">
            <h3
              className="font-semibold text-lam-green-900 text-lg leading-tight group-hover:text-lam-green-700 transition-colors"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {product.name}
            </h3>
            <p className="text-xs text-lam-green-600/60 font-medium">{product.nameVi}</p>
          </div>

          <p className="text-sm text-lam-green-700/60 leading-relaxed mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-lam-green-900">
              {formattedPrice}
            </p>

            <div
              className={`w-9 h-9 rounded-full bg-lam-green-800 flex items-center justify-center transition-all duration-200 ${
                isHovered ? "bg-lam-terracotta-500 scale-110" : ""
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
