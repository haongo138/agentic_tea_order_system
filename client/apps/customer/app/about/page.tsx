"use client";

import React from "react";
import Link from "next/link";
import { Leaf, Heart, Award, Users, MapPin, Coffee, ArrowRight } from "lucide-react";

const MILESTONES = [
  { year: "2020", title: "Khởi Nguồn", description: "Lam Trà ra đời từ tình yêu với trà Việt Nam tại một con hẻm nhỏ ở Quận 1, TP.HCM." },
  { year: "2021", title: "Mở Rộng", description: "Khai trương chi nhánh thứ hai tại Quận 7, đánh dấu bước phát triển đầu tiên." },
  { year: "2023", title: "Công Nhận", description: "Đạt giải 'Thương Hiệu Trà Sữa Yêu Thích' do cộng đồng bình chọn." },
  { year: "2024", title: "Đổi Mới", description: "Ra mắt hệ thống đặt hàng online và chương trình khách hàng thân thiết." },
  { year: "2026", title: "Hiện Tại", description: "5 chi nhánh, hơn 50 thức uống, và một cộng đồng yêu trà ngày càng lớn mạnh." },
];

const VALUES = [
  {
    icon: Leaf,
    title: "Nguyên Liệu Tươi Chọn Lọc",
    description: "Trà từ vùng cao Lâm Đồng, sữa tươi nguyên chất, trái cây theo mùa — tất cả đều được tuyển chọn kỹ lưỡng mỗi ngày.",
  },
  {
    icon: Heart,
    title: "Pha Chế Bằng Đam Mê",
    description: "Mỗi ly trà là một tác phẩm. Đội ngũ barista được đào tạo bài bản, luôn đặt chất lượng lên hàng đầu.",
  },
  {
    icon: Users,
    title: "Cộng Đồng Là Gia Đình",
    description: "Lam Trà không chỉ là nơi bán trà — đó là không gian để gặp gỡ, chia sẻ, và tạo nên những kỷ niệm đẹp.",
  },
  {
    icon: Award,
    title: "Bản Sắc Việt Nam",
    description: "Từ hương vị đến cách phục vụ, chúng tôi tự hào mang đậm bản sắc văn hóa trà Việt trong mỗi sản phẩm.",
  },
];

const TEAM_MEMBERS = [
  { name: "Nguyễn Minh Lam", role: "Sáng Lập & CEO", emoji: "👨‍💼", bio: "Người đặt nền móng cho Lam Trà với hơn 10 năm kinh nghiệm trong ngành F&B." },
  { name: "Trần Thu Hà", role: "Giám Đốc Sản Phẩm", emoji: "👩‍🍳", bio: "Sáng tạo nên hơn 50 công thức đặc biệt, kết hợp giữa truyền thống và hiện đại." },
  { name: "Lê Hoàng Phúc", role: "Giám Đốc Vận Hành", emoji: "👨‍💻", bio: "Đảm bảo mọi chi nhánh vận hành trơn tru và mang lại trải nghiệm tốt nhất." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-lam-cream-50 pt-20">
      {/* Hero */}
      <div className="bg-lam-green-900 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-96 h-96 rounded-full bg-lam-green-800/60 blur-3xl" />
          <div className="absolute bottom-0 left-20 w-72 h-72 rounded-full bg-lam-gold-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-lam-green-800/30 blur-3xl" />
        </div>
        <div className="container-wide section-padding relative z-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-400 mb-4">
            Về Chúng Tôi
          </p>
          <h1
            className="text-display text-5xl lg:text-6xl xl:text-7xl font-semibold text-lam-cream-50 mb-6 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Câu Chuyện{" "}
            <span className="italic font-medium text-lam-gold-400">Lam Trà</span>
          </h1>
          <p className="text-lam-cream-100/70 max-w-lg mx-auto text-base lg:text-lg leading-relaxed">
            Sinh ra từ tình yêu với trà Việt Nam, Lam Trà mang đến những ly trà
            được chế tác tỉ mỉ từ nguyên liệu tươi chọn lọc.
          </p>
        </div>
      </div>

      {/* Origin story */}
      <section className="container-wide section-padding py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-lam-green-800 via-emerald-700 to-lam-green-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-8xl block mb-4">🍃</span>
                  <span className="text-white/40 text-sm font-medium tracking-wider uppercase">Est. 2020</span>
                </div>
              </div>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/10 animate-float"
                  style={{
                    width: `${[14, 10, 18, 8, 12][i]}px`,
                    height: `${[14, 10, 18, 8, 12][i]}px`,
                    top: `${[15, 45, 70, 25, 80][i]}%`,
                    left: `${[20, 70, 30, 80, 50][i]}%`,
                    animationDelay: `${i * 0.7}s`,
                    animationDuration: `${4 + i}s`,
                  }}
                />
              ))}
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-2xl bg-lam-gold-500/10 -z-10" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-600 mb-3">
              Khởi Nguồn
            </p>
            <h2
              className="text-3xl lg:text-4xl font-semibold text-lam-green-900 mb-6 leading-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Từ Một Ly Trà,
              <br />
              Nên Một Hành Trình
            </h2>
            <div className="space-y-4 text-lam-green-700/80 leading-relaxed">
              <p>
                Lam Trà bắt đầu từ năm 2020, khi người sáng lập Nguyễn Minh Lam
                nhận ra rằng giữa hàng trăm thương hiệu trà sữa, vẫn thiếu đi một
                nơi thực sự tôn vinh hương vị trà Việt Nam.
              </p>
              <p>
                Từ một quán nhỏ trong con hẻm ở Quận 1, với chỉ 10 loại thức uống
                và một giấc mơ lớn, Lam Trà dần chinh phục khách hàng bằng sự chân
                thành trong từng ly trà — nguyên liệu tươi mỗi ngày, không chất bảo
                quản, không hương liệu nhân tạo.
              </p>
              <p>
                Đến nay, Lam Trà đã có 5 chi nhánh khắp thành phố, phục vụ hơn
                10.000 khách hàng thân thiết, nhưng cam kết ban đầu vẫn không thay
                đổi: <span className="font-semibold text-lam-green-900">mỗi ly trà phải là một tác phẩm.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-wide section-padding">
          <div className="text-center mb-12 lg:mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-600 mb-3">
              Giá Trị Cốt Lõi
            </p>
            <h2
              className="text-3xl lg:text-4xl font-semibold text-lam-green-900"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Điều Làm Nên Lam Trà
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((item) => (
              <div
                key={item.title}
                className="bg-lam-cream-50 rounded-2xl p-6 hover:shadow-product-hover transition-shadow group"
              >
                <div className="w-12 h-12 rounded-xl bg-lam-green-800/8 flex items-center justify-center mb-4 group-hover:bg-lam-green-800 transition-colors">
                  <item.icon className="w-5 h-5 text-lam-green-800 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-lam-green-900 mb-2">{item.title}</h3>
                <p className="text-sm text-lam-green-700/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-wide section-padding py-16 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-600 mb-3">
            Hành Trình
          </p>
          <h2
            className="text-3xl lg:text-4xl font-semibold text-lam-green-900"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Những Cột Mốc Quan Trọng
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          {MILESTONES.map((item, i) => (
            <div key={item.year} className="flex gap-6 relative">
              {/* Vertical line */}
              {i < MILESTONES.length - 1 && (
                <div className="absolute left-[23px] top-12 bottom-0 w-px bg-lam-cream-300" />
              )}

              {/* Dot */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-lam-green-800 flex items-center justify-center z-10">
                <span className="text-white text-xs font-bold">{item.year}</span>
              </div>

              {/* Content */}
              <div className="pb-10">
                <h3 className="font-semibold text-lam-green-900 text-lg mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-lam-green-700/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-lam-green-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-lam-green-800/60 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-lam-gold-500/10 blur-3xl" />
        </div>

        <div className="container-wide section-padding relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-lam-gold-400 mb-3">
              Đội Ngũ
            </p>
            <h2
              className="text-3xl lg:text-4xl font-semibold text-lam-cream-50"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Những Con Người Đằng Sau Lam Trà
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:border-white/20 transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-lam-green-800 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{member.emoji}</span>
                </div>
                <h3 className="font-semibold text-lam-cream-50 mb-0.5">{member.name}</h3>
                <p className="text-xs font-medium text-lam-gold-400 mb-3">{member.role}</p>
                <p className="text-sm text-lam-cream-100/50 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-white py-12 lg:py-16 border-b border-lam-cream-200">
        <div className="container-wide section-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "5", label: "Chi Nhánh", icon: MapPin },
              { value: "50+", label: "Thức Uống", icon: Coffee },
              { value: "10k+", label: "Khách Hàng", icon: Users },
              { value: "4.8★", label: "Đánh Giá", icon: Award },
            ].map((stat) => (
              <div key={stat.label}>
                <stat.icon className="w-5 h-5 text-lam-gold-500 mx-auto mb-2" />
                <p
                  className="text-3xl lg:text-4xl font-semibold text-lam-green-900 mb-1"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-lam-green-700/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-wide section-padding py-16 lg:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-5xl block mb-6">🧋</span>
          <h2
            className="text-3xl lg:text-4xl font-semibold text-lam-green-900 mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Sẵn Sàng Thưởng Thức?
          </h2>
          <p className="text-lam-green-700/60 mb-8 max-w-md mx-auto leading-relaxed">
            Ghé thăm cửa hàng gần nhất hoặc đặt hàng online — ly trà yêu thích
            của bạn chỉ cách một cú nhấp chuột.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 bg-lam-green-800 hover:bg-lam-green-700 text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-lam-green-800/25 hover:-translate-y-0.5"
            >
              Xem Thực Đơn
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/branches"
              className="inline-flex items-center justify-center gap-2 border-2 border-lam-green-800 text-lam-green-800 hover:bg-lam-green-800 hover:text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-all"
            >
              Tìm Cửa Hàng
              <MapPin className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
