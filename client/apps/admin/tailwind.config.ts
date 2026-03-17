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
        admin: {
          bg: "#0a0f14",
          surface: "#111923",
          surface2: "#18243a",
          border: "#1f2e42",
          text: "#dce8f4",
          muted: "#6b7f96",
          gold: "#d4952a",
          emerald: "#2ed47e",
          rose: "#f4637a",
          sky: "#4db6e8",
          amber: "#f59e0b",
        },
        // Re-export lam colors for shared ui components
        "lam-cream": {
          50: "#fdfaf3",
          100: "#faf6ec",
          200: "#f5edda",
          300: "#ead9b8",
        },
        "lam-green": {
          800: "#172e17",
          900: "#0f1f0f",
          950: "#081408",
        },
        "lam-gold": {
          400: "#e8b44a",
          500: "#d4952a",
          600: "#b87818",
        },
        "lam-terracotta": {
          500: "#bf5e3b",
          600: "#a04a2d",
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        body: ["var(--font-sora)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "slide-in": "slideIn 0.3s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "count-up": "countUp 1s ease-out forwards",
        "glow": "glow 2s ease-in-out infinite",
        "order-in": "orderIn 0.4s ease-out forwards",
      },
      keyframes: {
        slideIn: {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        orderIn: {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 8px 2px rgba(46, 212, 126, 0.3)" },
          "50%": { boxShadow: "0 0 16px 4px rgba(46, 212, 126, 0.5)" },
        },
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.2)",
        "card-hover": "0 4px 16px 0 rgba(0,0,0,0.4), 0 2px 6px -1px rgba(0,0,0,0.3)",
        "glow-gold": "0 0 20px rgba(212, 149, 42, 0.3)",
        "glow-emerald": "0 0 20px rgba(46, 212, 126, 0.3)",
        "glow-rose": "0 0 20px rgba(244, 99, 122, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
