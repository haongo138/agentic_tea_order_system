"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { NEWS_ARTICLES } from "@/lib/mock-data";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function NewsPage() {
  const featured = NEWS_ARTICLES.find((a) => a.featured);
  const rest = NEWS_ARTICLES.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-lam-cream-50 pt-20">
      {/* Header */}
      <div className="bg-lam-green-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-lam-green-800/60 blur-3xl" />
          <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full bg-lam-gold-500/10 blur-3xl" />
        </div>
        <div className="container-wide section-padding relative z-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-400 mb-3">
            Tin Tức & Sự Kiện
          </p>
          <h1
            className="text-display text-5xl lg:text-6xl font-semibold text-lam-cream-50 mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Tin Tức <span className="italic font-medium text-lam-gold-400">Lam Trà</span>
          </h1>
          <p className="text-lam-cream-100/60 max-w-md mx-auto">
            Cập nhật những điều mới nhất từ Lam Trà
          </p>
        </div>
      </div>

      <div className="container-wide section-padding py-10 lg:py-14">
        {/* Featured article */}
        {featured && (
          <Link href={`/news/${featured.id}`} className="group block mb-10">
            <article className="bg-white rounded-3xl overflow-hidden shadow-product hover:shadow-product-hover transition-shadow">
              <div className="grid lg:grid-cols-2">
                <div
                  className={`relative h-64 lg:h-auto bg-gradient-to-br ${featured.imageGradient}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl opacity-30">🍃</span>
                  </div>
                  <div className="absolute top-5 left-5">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-lam-green-800">
                      Nổi Bật
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lam-gold-500/10 text-lam-gold-600 border border-lam-gold-500/25">
                      {featured.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-lam-green-600/50">
                      <Calendar className="w-3 h-3" />
                      {formatDate(featured.publishedAt)}
                    </span>
                  </div>
                  <h2
                    className="text-2xl lg:text-3xl font-semibold text-lam-green-900 mb-3 group-hover:text-lam-green-700 transition-colors leading-tight"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {featured.title}
                  </h2>
                  <p className="text-sm text-lam-green-700/60 leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-lam-terracotta-500 group-hover:gap-3 transition-all">
                    Đọc thêm
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* Other articles */}
        {rest.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article) => (
              <Link key={article.id} href={`/news/${article.id}`} className="group block">
                <article className="bg-white rounded-2xl overflow-hidden shadow-product hover:shadow-product-hover transition-all">
                  <div
                    className={`relative h-48 bg-gradient-to-br ${article.imageGradient}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl opacity-20">🍃</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-lam-cream-100 text-lam-green-700">
                        {article.category}
                      </span>
                      <span className="text-xs text-lam-green-600/50">
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    <h3
                      className="font-semibold text-lam-green-900 text-lg leading-tight mb-2 group-hover:text-lam-green-700 transition-colors"
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
        )}
      </div>
    </div>
  );
}
