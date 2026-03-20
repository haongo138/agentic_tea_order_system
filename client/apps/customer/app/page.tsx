"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Leaf, Award, Users, MapPin, Star, ChevronRight, Loader2 } from "lucide-react";
import { NEWS_ARTICLES } from "@/lib/mock-data";
import { ProductCard } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/api/products";
import { fetchCategories } from "@/lib/api/products";
import { apiProductToProduct } from "@/lib/transforms";
import type { Product, ApiCategory } from "@/lib/types";

const STATS = [
  { value: "5", label: "Cửa Hàng", icon: MapPin },
  { value: "50+", label: "Thức Uống", icon: Leaf },
  { value: "10k+", label: "Khách Hàng", icon: Users },
  { value: "4.8★", label: "Đánh Giá TB", icon: Award },
];

const TIER_INFO = [
  { tier: "Bronze", color: "from-amber-700 to-amber-500", points: "0 - 50 điểm", perk: "Giảm 5% mỗi đơn" },
  { tier: "Silver", color: "from-slate-500 to-slate-300", points: "50 - 200 điểm", perk: "Giảm 10% + 1 ly miễn phí/tháng" },
  { tier: "Gold", color: "from-yellow-500 to-yellow-300", points: "200+ điểm", perk: "Giảm 15% + giao hàng miễn phí" },
];

const HERO_FLOATERS = [
  { name: "Matcha Latte", price: "45k", emoji: "🍵", color: "from-emerald-700 to-lime-400", delay: "0s" },
  { name: "Brown Sugar", price: "45k", emoji: "🧋", color: "from-amber-800 to-amber-400", delay: "0.8s" },
  { name: "Peach Tea", price: "40k", emoji: "🍑", color: "from-rose-500 to-amber-300", delay: "1.6s" },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productsRes, catsRes] = await Promise.all([
          fetchProducts({ limit: 6, status: "available" }),
          fetchCategories(),
        ]);
        setFeaturedProducts(productsRes.data.map(apiProductToProduct));
        setCategories(catsRes.data);
      } catch {
        // Silently degrade — homepage still renders static sections
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-lam-cream-50">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-lam-green-200/30 blur-3xl" />
          <div className="absolute -bottom-48 -left-24 w-[500px] h-[500px] rounded-full bg-lam-gold-300/20 blur-3xl" />
          <div className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full bg-lam-cream-300/40 blur-2xl" />

          <svg className="absolute top-20 right-[38%] w-16 h-16 text-lam-green-300/25 rotate-12 animate-spin-slow" viewBox="0 0 64 64" fill="none">
            <path d="M32 4C32 4 4 20 4 40C4 52 16 60 32 60C48 60 60 52 60 40C60 20 32 4 32 4Z" fill="currentColor"/>
          </svg>
          <svg className="absolute bottom-32 right-[30%] w-10 h-10 text-lam-green-400/20 -rotate-20 animate-float" viewBox="0 0 64 64" fill="none">
            <path d="M32 4C32 4 4 20 4 40C4 52 16 60 32 60C48 60 60 52 60 40C60 20 32 4 32 4Z" fill="currentColor"/>
          </svg>
          <svg className="absolute top-40 left-[15%] w-12 h-12 text-lam-gold-300/20 rotate-45 animate-float" viewBox="0 0 64 64" fill="none" style={{ animationDelay: "3s" }}>
            <path d="M32 4C32 4 4 20 4 40C4 52 16 60 32 60C48 60 60 52 60 40C60 20 32 4 32 4Z" fill="currentColor"/>
          </svg>
        </div>

        <div className="container-wide section-padding w-full pt-24 pb-12 lg:pt-20 lg:pb-0">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-5rem)]">
            {/* Left — Text */}
            <div className="flex flex-col justify-center py-12">
              <div className="inline-flex items-center gap-2 bg-lam-green-800/8 border border-lam-green-800/15 text-lam-green-700 px-4 py-2 rounded-full text-sm font-medium mb-8 w-fit animate-on-load animate-fade-in stagger-1">
                <span className="w-1.5 h-1.5 rounded-full bg-lam-gold-500 animate-pulse" />
                Artisan Vietnamese Tea · Est. 2020
              </div>

              <h1 className="text-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-semibold leading-[0.9] text-lam-green-900 mb-6 animate-on-load animate-fade-up stagger-2">
                The Art of Tea,{" "}
                <span className="italic text-lam-gold-500">Perfected.</span>
              </h1>

              <p className="text-base lg:text-lg text-lam-green-700/70 leading-relaxed max-w-lg mb-10 animate-on-load animate-fade-up stagger-3">
                Premium milk tea, fruit infusions, and blended creations — each cup crafted from the finest Vietnamese tea leaves and the freshest ingredients.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-12 animate-on-load animate-fade-up stagger-4">
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2.5 bg-lam-terracotta-500 hover:bg-lam-terracotta-600 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-lam-terracotta-500/25 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Đặt Ngay
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 text-lam-green-800 hover:text-lam-green-900 font-medium px-4 py-3.5 transition-colors group"
                >
                  Xem Thực Đơn
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 animate-on-load animate-fade-up stagger-5">
                {STATS.map(({ value, label }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-2xl font-semibold text-lam-green-900" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {value}
                    </span>
                    <span className="text-xs text-lam-green-600/60 font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual showcase */}
            <div className="relative flex items-center justify-center h-[500px] lg:h-auto animate-on-load animate-slide-in-right stagger-2">
              <div className="relative w-72 h-72 lg:w-80 lg:h-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-lam-green-200 to-lam-cream-200 shadow-2xl" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-700 via-lam-green-600 to-lam-green-800 flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <span className="text-7xl block mb-2">🧋</span>
                    <span className="text-lam-cream-50 text-lg font-medium" style={{ fontFamily: "var(--font-cormorant)" }}>
                      Signature
                    </span>
                    <span className="text-lam-gold-400 text-2xl font-semibold block" style={{ fontFamily: "var(--font-cormorant)" }}>
                      Collection
                    </span>
                  </div>
                </div>
                <div className="absolute inset-[-20px] rounded-full border-2 border-dashed border-lam-green-300/30 animate-spin-slow" />
              </div>

              {HERO_FLOATERS.map((item, i) => {
                const positions = [
                  "absolute -top-4 -left-8 lg:-left-16",
                  "absolute top-1/2 -translate-y-1/2 -right-4 lg:-right-12",
                  "absolute -bottom-4 left-4 lg:left-0",
                ];
                return (
                  <div key={item.name} className={`${positions[i]} animate-float`} style={{ animationDelay: item.delay }}>
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-lam-cream-200 flex items-center gap-3 min-w-[130px]">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-lg">{item.emoji}</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-lam-green-900">{item.name}</p>
                        <p className="text-xs text-lam-terracotta-500 font-bold">{item.price}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div
                className="absolute top-8 right-0 lg:right-[-40px] bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg border border-lam-cream-200 animate-float"
                style={{ animationDelay: "2.4s" }}
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-lam-gold-500 text-lam-gold-500" />
                  <span className="text-sm font-bold text-lam-green-900">4.8</span>
                  <span className="text-xs text-lam-green-600/50">/ 5.0</span>
                </div>
                <p className="text-[10px] text-lam-green-600/50 mt-0.5">10,000+ reviews</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-lam-cream-50 to-transparent" />
      </section>

      {/* CATEGORY STRIP */}
      <section className="py-8 bg-white border-y border-lam-cream-200 overflow-x-auto">
        <div className="container-wide section-padding">
          <div className="flex items-center gap-3 min-w-max">
            <span className="text-xs font-semibold uppercase tracking-widest text-lam-green-600/50 mr-2">
              Khám Phá
            </span>
            <Link
              href="/menu"
              className="flex-shrink-0 px-5 py-2 rounded-full border border-lam-cream-300 text-sm font-medium text-lam-green-700 hover:bg-lam-green-800 hover:text-white hover:border-lam-green-800 transition-all duration-200"
            >
              Tất Cả
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/menu?cat=${cat.id}`}
                className="flex-shrink-0 px-5 py-2 rounded-full border border-lam-cream-300 text-sm font-medium text-lam-green-700 hover:bg-lam-green-800 hover:text-white hover:border-lam-green-800 transition-all duration-200"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 lg:py-28">
        <div className="container-wide section-padding">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-600 mb-3">
                Best Sellers
              </p>
              <h2 className="text-display text-4xl lg:text-5xl xl:text-6xl font-semibold text-lam-green-900 leading-tight">
                Signature
                <br />
                <span className="italic font-medium text-lam-green-600">Collection</span>
              </h2>
            </div>
            <Link
              href="/menu"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-lam-green-700 hover:text-lam-green-900 transition-colors group"
            >
              Xem Tất Cả
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-lam-green-600/40" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2.5 border-2 border-lam-green-800 text-lam-green-800 hover:bg-lam-green-800 hover:text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-200"
            >
              Xem Toàn Bộ Thực Đơn
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CUSTOMIZE TEASER */}
      <section className="py-20 lg:py-28 bg-lam-green-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-lam-green-800/50 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-lam-gold-500/10 blur-3xl" />
        </div>

        <div className="container-wide section-padding relative z-10">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-400 mb-3">
              Your Drink, Your Way
            </p>
            <h2 className="text-display text-4xl lg:text-5xl xl:text-6xl font-semibold text-lam-cream-50 leading-tight">
              Craft Your{" "}
              <span className="italic text-lam-gold-400">Perfect Cup</span>
            </h2>
            <p className="text-lam-cream-100/60 mt-4 max-w-lg mx-auto">
              Customize size, ice level, sweetness, and pick from premium toppings.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
            {[
              { icon: "📏", label: "Kích Cỡ", options: "S · M · L" },
              { icon: "🧊", label: "Đá", options: "0% · 50% · 100%" },
              { icon: "🍯", label: "Đường", options: "0% · 50% · 100%" },
              { icon: "✨", label: "Topping", options: "Nhiều Lựa Chọn" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-lam-green-800/60 border border-lam-green-700/40 rounded-2xl p-5 text-center backdrop-blur-sm"
              >
                <span className="text-3xl block mb-3">{item.icon}</span>
                <p className="text-lam-cream-50 font-semibold text-sm mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {item.label}
                </p>
                <p className="text-lam-cream-100/50 text-xs">{item.options}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2.5 bg-lam-gold-500 hover:bg-lam-gold-600 text-lam-green-950 font-bold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-lam-gold-500/30 hover:-translate-y-0.5"
            >
              Tùy Chỉnh Ngay
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* LOYALTY PROGRAM */}
      <section className="py-20 lg:py-28 bg-lam-cream-100">
        <div className="container-wide section-padding">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                {TIER_INFO.map((tier, i) => (
                  <div key={tier.tier} className="relative mb-4 last:mb-0 animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
                    <div className="bg-white rounded-2xl p-5 shadow-product flex items-center gap-5 hover:shadow-product-hover transition-shadow">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-lam-green-900 text-lg" style={{ fontFamily: "var(--font-cormorant)" }}>
                            {tier.tier}
                          </p>
                          <span className="text-xs text-lam-green-600/50">{tier.points}</span>
                        </div>
                        <p className="text-sm text-lam-green-700/60">{tier.perk}</p>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-6 bg-white rounded-2xl p-4 shadow-product flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-lam-gold-400/20 flex items-center justify-center">
                    <span className="text-lg">🪙</span>
                  </div>
                  <div>
                    <p className="text-xs text-lam-green-600/50 font-medium">Tích điểm mỗi đơn</p>
                    <p className="text-sm font-semibold text-lam-green-900">1 điểm / 10.000₫</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-600 mb-4">
                Lam Tra Loyalty
              </p>
              <h2 className="text-display text-4xl lg:text-5xl xl:text-6xl font-semibold text-lam-green-900 leading-tight mb-6">
                Sip More,{" "}
                <span className="italic text-lam-green-600">Earn More.</span>
              </h2>
              <p className="text-lam-green-700/70 leading-relaxed mb-8 text-lg">
                Every purchase earns you points toward exclusive rewards. Climb through Bronze, Silver, and Gold tiers for bigger discounts and special perks.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  "Tích điểm cho mọi đơn hàng",
                  "Đổi điểm lấy ly miễn phí",
                  "Ưu đãi sinh nhật đặc biệt",
                  "Thông báo sản phẩm mới sớm nhất",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-lam-green-700">
                    <div className="w-5 h-5 rounded-full bg-lam-green-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/account"
                className="inline-flex items-center gap-2.5 bg-lam-terracotta-500 hover:bg-lam-terracotta-600 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-lam-terracotta-500/20 hover:-translate-y-0.5"
              >
                Tham Gia Ngay — Miễn Phí
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS & PROMOTIONS */}
      <section className="py-20 lg:py-28">
        <div className="container-wide section-padding">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-600 mb-3">
                Tin Tức
              </p>
              <h2 className="text-display text-4xl lg:text-5xl font-semibold text-lam-green-900">
                Stories &{" "}
                <span className="italic font-medium text-lam-green-600">Updates</span>
              </h2>
            </div>
            <Link
              href="/news"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-lam-green-700 hover:text-lam-green-900 transition-colors group"
            >
              Tất Cả Tin
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {NEWS_ARTICLES.map((article, i) => (
              <Link key={article.id} href={`/news/${article.id}`} className={`group block ${i === 0 ? "lg:col-span-2 lg:row-span-1" : ""}`}>
                <article className="bg-white rounded-2xl overflow-hidden shadow-product hover:shadow-product-hover transition-all duration-300 h-full">
                  <div className={`bg-gradient-to-br ${article.imageGradient} ${i === 0 ? "h-56 lg:h-64" : "h-44"} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-4 left-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/80 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-lam-green-600/50 mb-2">
                      {new Date(article.publishedAt).toLocaleDateString("vi-VN", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </p>
                    <h3
                      className={`font-semibold text-lam-green-900 group-hover:text-lam-green-700 transition-colors leading-tight mb-2 ${
                        i === 0 ? "text-xl lg:text-2xl" : "text-lg"
                      }`}
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {article.title}
                    </h3>
                    <p className="text-sm text-lam-green-700/60 leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-lam-terracotta-500 to-lam-terracotta-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 left-16 w-48 h-48 rounded-full bg-lam-gold-400/20 blur-xl" />
        </div>
        <div className="container-wide section-padding relative z-10 text-center">
          <h2 className="text-display text-4xl lg:text-5xl font-semibold text-white mb-4">
            Thưởng thức ngay hôm nay
          </h2>
          <p className="text-white/80 mb-8 max-w-md mx-auto">
            Đặt hàng online, nhận tại cửa hàng gần nhất — không cần chờ đợi.
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2.5 bg-white text-lam-terracotta-600 hover:bg-lam-cream-50 font-bold px-8 py-4 rounded-full transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            Đặt Hàng Ngay
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
