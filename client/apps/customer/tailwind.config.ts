import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "lam-cream": {
          50: "#fdfaf3",
          100: "#faf6ec",
          200: "#f5edda",
          300: "#ead9b8",
          400: "#d9c498",
        },
        "lam-green": {
          50: "#f0f7ee",
          100: "#dff0db",
          200: "#bde0b6",
          300: "#8aba82",
          400: "#5d9851",
          500: "#3d7a35",
          600: "#2d5a28",
          700: "#214020",
          800: "#172e17",
          900: "#0f1f0f",
          950: "#081408",
        },
        "lam-gold": {
          300: "#f0c86a",
          400: "#e8b44a",
          500: "#d4952a",
          600: "#b87818",
          700: "#8f5c10",
        },
        "lam-terracotta": {
          400: "#d4795a",
          500: "#bf5e3b",
          600: "#a04a2d",
          700: "#7d3620",
        },
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-figtree)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.5s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "product": "0 4px 24px -4px rgba(23, 46, 23, 0.12), 0 1px 4px -1px rgba(23, 46, 23, 0.06)",
        "product-hover": "0 16px 48px -8px rgba(23, 46, 23, 0.18), 0 4px 12px -2px rgba(23, 46, 23, 0.1)",
        "navbar": "0 1px 0 0 rgba(23, 46, 23, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
