"use client";

import React, { useState, useEffect, useMemo } from "react";
import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Plus, Minus, Check, Loader2 } from "lucide-react";
import { fetchProductById, fetchToppingsByCategory, fetchSizes } from "@/lib/api/products";
import { apiProductToProduct, apiToppingToTopping, apiSizeToSize } from "@/lib/transforms";
import { useCart } from "@/contexts/cart-context";
import type { Product, Topping, Size } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [ice, setIce] = useState<number>(100);
  const [sugar, setSugar] = useState<number>(100);
  const [selectedToppingIds, setSelectedToppingIds] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
          setError("Sản phẩm không hợp lệ");
          return;
        }
        const [productRes, sizesRes] = await Promise.all([
          fetchProductById(productId),
          fetchSizes(),
        ]);
        const p = apiProductToProduct(productRes.data);
        const s = sizesRes.data.map(apiSizeToSize);
        // Fetch toppings allowed for this product's category
        const toppingsRes = await fetchToppingsByCategory(p.categoryId);
        const t = toppingsRes.data.map(apiToppingToTopping);
        setProduct(p);
        setToppings(t);
        setSizes(s);
        // Default to medium size if available
        const medium = s.find((sz) => sz.name === "M") ?? s[0] ?? null;
        setSelectedSize(medium);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải sản phẩm");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const toggleTopping = (toppingId: number) => {
    setSelectedToppingIds((prev) =>
      prev.includes(toppingId) ? prev.filter((t) => t !== toppingId) : [...prev, toppingId],
    );
  };

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    const base = product.price + (selectedSize?.additionalPrice ?? 0);
    const toppingCost = selectedToppingIds.reduce((acc, tid) => {
      const t = toppings.find((t) => t.id === tid);
      return acc + (t?.price ?? 0);
    }, 0);
    return (base + toppingCost) * quantity;
  }, [product, selectedSize, selectedToppingIds, toppings, quantity]);

  const handleAddToCart = () => {
    if (!product) return;
    const selectedToppingNames = selectedToppingIds
      .map((tid) => toppings.find((t) => t.id === tid)?.name ?? "")
      .filter(Boolean);

    addItem({
      productId: product.id,
      product,
      sizeId: selectedSize?.id ?? null,
      sizeName: selectedSize?.name ?? "",
      iceLevel: ice,
      sugarLevel: sugar,
      toppingIds: selectedToppingIds,
      toppingNames: selectedToppingNames,
      quantity,
      unitPrice: totalPrice / quantity,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-lam-green-600/40" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <span className="text-5xl block mb-4">🍃</span>
          <p className="text-lam-green-700 font-medium mb-4">{error ?? "Không tìm thấy sản phẩm."}</p>
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
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <>
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.colorAccent}`} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2/3 h-2/3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-1/2 h-1/2 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-8xl">🧋</span>
                      </div>
                    </div>
                  </div>

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
                </>
              )}

              {product.badge && (
                <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-xs font-bold text-lam-terracotta-600 uppercase tracking-wider">
                    {product.badge === "best-seller" ? "Bán Chạy" :
                     product.badge === "new" ? "Mới" : "Theo Mùa"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right — Customization */}
          <div>
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-600 mb-1">
                {product.category}
              </p>
              <h1 className="text-display text-4xl lg:text-5xl font-semibold text-lam-green-900 leading-tight mb-1">
                {product.name}
              </h1>
              <p className="text-lam-green-700/70 leading-relaxed mt-4">{product.description}</p>
            </div>

            {/* Size */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-lam-green-800 mb-3 flex items-center gap-2">
                  📏 Kích Cỡ
                </p>
                <div className="flex gap-3">
                  {sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s)}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                        selectedSize?.id === s.id
                          ? "border-lam-green-800 bg-lam-green-800 text-white shadow-md"
                          : "border-lam-cream-300 text-lam-green-800 hover:border-lam-green-500"
                      }`}
                    >
                      <span className="block text-base">{s.name}</span>
                      <span className={`block text-xs font-medium mt-0.5 ${selectedSize?.id === s.id ? "text-white/70" : "text-lam-green-600/50"}`}>
                        {s.additionalPrice === 0 ? "Gốc" : `+${(s.additionalPrice / 1000).toFixed(0)}k`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
            {toppings.length > 0 && (
              <div className="mb-8">
                <p className="text-sm font-semibold text-lam-green-800 mb-3">
                  ✨ Topping <span className="font-normal text-lam-green-600/50">(tùy chọn)</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {toppings.map((topping) => {
                    const isSelected = selectedToppingIds.includes(topping.id);
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
                        <span className="font-medium">{topping.name}</span>
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
            )}

            {/* Quantity + Add to cart */}
            <div className="sticky bottom-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-product-hover border border-lam-cream-200">
              <div className="flex items-center gap-4">
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
