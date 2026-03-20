"use client";

import React from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { NEWS_ARTICLES } from "@/lib/mock-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function NewsDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const article = NEWS_ARTICLES.find((a) => a.id === id);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <span className="text-5xl block mb-4">🍃</span>
          <p className="text-lam-green-700 font-medium mb-4">Không tìm thấy bài viết.</p>
          <Link href="/news" className="text-lam-terracotta-500 font-medium hover:underline">
            ← Quay lại tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lam-cream-50 pt-20">
      {/* Hero image */}
      <div className={`relative h-64 lg:h-96 bg-gradient-to-br ${article.imageGradient}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-8xl opacity-20">🍃</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-6 left-0 right-0 container-wide section-padding">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-lam-green-800">
            {article.category}
          </span>
        </div>
      </div>

      <div className="container-wide section-padding py-8 lg:py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-lam-green-700 hover:text-lam-green-900 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Quay lại tin tức
          </Link>

          <h1
            className="text-3xl lg:text-4xl xl:text-5xl font-semibold text-lam-green-900 leading-tight mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-lam-green-600/60 mb-8 pb-8 border-b border-lam-cream-200">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              3 phút đọc
            </span>
          </div>

          {/* Article body (static placeholder content based on category) */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lam-green-700/80 leading-relaxed text-base mb-6">
              {article.excerpt}
            </p>
            <p className="text-lam-green-700/80 leading-relaxed text-base mb-6">
              Tại Lam Trà, chúng tôi luôn tin rằng mỗi ly trà đều là một tác phẩm nghệ thuật.
              Từ việc lựa chọn nguyên liệu đến quy trình chế biến, mỗi bước đều được thực hiện
              với sự tận tâm và đam mê.
            </p>
            <p className="text-lam-green-700/80 leading-relaxed text-base mb-6">
              Chúng tôi không ngừng tìm kiếm những nguyên liệu tốt nhất từ các vùng trà nổi
              tiếng của Việt Nam, kết hợp với công thức độc quyền để tạo nên những thức uống
              không chỉ ngon mà còn mang đậm bản sắc Việt.
            </p>
            <p className="text-lam-green-700/80 leading-relaxed text-base">
              Hãy đến và trải nghiệm ngay hôm nay tại bất kỳ chi nhánh nào của Lam Trà.
              Chúng tôi luôn sẵn sàng phục vụ bạn những ly trà ngon nhất.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 bg-lam-green-900 rounded-2xl text-center">
            <p className="text-lam-cream-100/60 text-sm mb-2">Bạn đã sẵn sàng thử?</p>
            <h3
              className="text-xl font-semibold text-lam-cream-50 mb-4"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Đặt Hàng Ngay
            </h3>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-lam-gold-500 hover:bg-lam-gold-600 text-white font-medium text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Xem Thực Đơn
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
