"use client";

import React, { useState, useMemo } from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Star, Plus, Minus, Check } from "lucide-react";
import { PRODUCTS, TOPPINGS, SIZE_PRICES } from "@/lib/mock-data";
import { Rating } from "@lamtra/ui";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const product = PRODUCTS.find((p) => p.id === id);

  const [size, setSize] = useState<"S" | "M" | "L">("M");
  const [ice, setIce] = useState<0 | 50 | 100>(100);
  const [sugar, setSugar] = useState<0 | 50 | 100>(100);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const toggleTopping = (id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    const base = product.price + SIZE_PRICES[size];
    const toppingCost = selectedToppings.reduce((acc, tid) => {
      const t = TOPPINGS.find((t) => t.id === tid);
      return acc + (t?.price ?? 0);
    }, 0);
    return (base + toppingCost) * quantity;
  }, [product, size, selectedToppings, quantity]);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <span className="text-5xl block mb-4">🍃</span>
          <p className="text-lam-green-700 font-medium mb-4">Không tìm thấy sản phẩm.</p>
          <Link href="/menu" className="text-lam-terracotta-500 font-medium hover:underline">
            ← Quay lại thực đơn
          </Link>
        </div>
      </div>
    );
  }

  const formattedTotal = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(totalPrice);

  return (
    <div className="min-h-screen bg-lam-cream-50 pt-20">
      <div className="container-wide section-padding py-8 lg:py-12">
        {/* Back link */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-medium text-lam-green-700 hover:text-lam-green-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại thực đơn
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — Product visual */}
          <div className="sticky top-28">
            <div className="relative rounded-3xl overflow-hidden aspect-square max-w-md mx-auto lg:max-w-full">
              <div className={`absolute inset-0 bg-gradient-to-br ${product.colorAccent}`} />
              {/* Decorative circles */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2/3 h-2/3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-1/2 h-1/2 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-8xl">🧋</span>
                  </div>
                </div>
              </div>

              {/* Floating bubbles */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/20 animate-float"
                  style={{
                    width: `${[16, 10, 14, 8, 12, 18][i]}px`,
                    height: `${[16, 10, 14, 8, 12, 18][i]}px`,
                    top: `${[20, 40, 65, 15, 75, 55][i]}%`,
                    left: `${[15, 75, 20, 60, 80, 45][i]}%`,
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${4 + i}s`,
                  }}
                />
              ))}

              {product.badge && (
                <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-bold text-lam-terracotta-600 uppercase tracking-wider">
                    {product.badge === "best-seller" ? "Best Seller" :
                     product.badge === "new" ? "New" : "Seasonal"}
                  </span>
                </div>
              )}
            </div>

            {/* Reviews summary */}
            <div className="mt-6 bg-white rounded-2xl p-5 shadow-product">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p
                    className="text-4xl font-semibold text-lam-green-900"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {product.rating}
                  </p>
                  <Rating value={product.rating} size="sm" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-lam-green-700/60">
                    {product.reviewCount.toLocaleString()} đánh giá
                  </p>
                  {/* Mini rating bar */}
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-lam-green-600/40 w-3">{star}</span>
                      <div className="flex-1 h-1.5 bg-lam-cream-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-lam-gold-500 rounded-full"
                          style={{
                            width: star === 5 ? "72%" : star === 4 ? "18%" : star === 3 ? "7%" : "2%",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — Customization */}
          <div>
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-600 mb-1">
                {product.category.replace("-", " ").toUpperCase()}
              </p>
              <h1
                className="text-display text-4xl lg:text-5xl font-semibold text-lam-green-900 leading-tight mb-1"
              >
                {product.name}
              </h1>
              <p className="text-lam-green-600/60 font-medium mb-4">{product.nameVi}</p>
              <p className="text-lam-green-700/70 leading-relaxed">{product.description}</p>
            </div>

            {/* Size */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-lam-green-800 mb-3 flex items-center gap-2">
                📏 Kích Cỡ
              </p>
              <div className="flex gap-3">
                {(["S", "M", "L"] as const).map((s) => {
                  const extra = SIZE_PRICES[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                        size === s
                          ? "border-lam-green-800 bg-lam-green-800 text-white shadow-md"
                          : "border-lam-cream-300 text-lam-green-800 hover:border-lam-green-500"
                      }`}
                    >
                      <span className="block text-base">{s}</span>
                      <span className={`block text-xs font-medium mt-0.5 ${size === s ? "text-white/70" : "text-lam-green-600/50"}`}>
                        {extra === 0 ? "Gốc" : `+${(extra / 1000).toFixed(0)}k`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ice level */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-lam-green-800 mb-3">🧊 Mức Đá</p>
              <div className="flex gap-2">
                {([0, 50, 100] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setIce(level)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                      ice === level
                        ? "border-sky-400 bg-sky-50 text-sky-700"
                        : "border-lam-cream-300 text-lam-green-700 hover:border-sky-300"
                    }`}
                  >
                    {level === 0 ? "Không Đá" : level === 50 ? "Ít Đá" : "Bình Thường"}
                  </button>
                ))}
              </div>
            </div>

            {/* Sugar level */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-lam-green-800 mb-3">🍯 Độ Ngọt</p>
              <div className="flex gap-2">
                {([0, 50, 100] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setSugar(level)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                      sugar === level
                        ? "border-lam-gold-500 bg-lam-gold-400/10 text-lam-gold-700"
                        : "border-lam-cream-300 text-lam-green-700 hover:border-lam-gold-300"
                    }`}
                  >
                    {level === 0 ? "Không Ngọt" : level === 50 ? "Ít Ngọt" : "Bình Thường"}
                  </button>
                ))}
              </div>
            </div>

            {/* Toppings */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-lam-green-800 mb-3">
                ✨ Topping <span className="font-normal text-lam-green-600/50">(tùy chọn)</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TOPPINGS.map((topping) => {
                  const isSelected = selectedToppings.includes(topping.id);
                  return (
                    <button
                      key={topping.id}
                      onClick={() => toggleTopping(topping.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all duration-200 ${
                        isSelected
                          ? "border-lam-green-800 bg-lam-green-800/5 text-lam-green-900"
                          : "border-lam-cream-300 text-lam-green-700 hover:border-lam-green-400"
                      }`}
                    >
                      <span className="font-medium">{topping.nameVi}</span>
                      <span className="flex items-center gap-1">
                        {isSelected ? (
                          <Check className="w-4 h-4 text-lam-green-700" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-lam-green-600/50" />
                        )}
                        <span className={`text-xs font-semibold ${isSelected ? "text-lam-terracotta-500" : "text-lam-green-600/50"}`}>
                          +{(topping.price / 1000).toFixed(0)}k
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="sticky bottom-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-product-hover border border-lam-cream-200">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center gap-3 border border-lam-cream-300 rounded-xl px-3 py-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full hover:bg-lam-cream-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-lam-green-800" />
                  </button>
                  <span className="w-6 text-center font-semibold text-lam-green-900 text-sm">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded-full hover:bg-lam-cream-200 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-lam-green-800" />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    addedToCart
                      ? "bg-emerald-500 text-white"
                      : "bg-lam-green-800 hover:bg-lam-green-700 text-white hover:shadow-lg hover:shadow-lam-green-800/25 hover:-translate-y-0.5 active:translate-y-0"
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      Đã thêm vào giỏ!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Thêm vào giỏ · {formattedTotal}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
