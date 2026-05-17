import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#002147",
          light: "#003366",
          soft: "#e8edf2",
          50: "#f0f4f8",
          100: "#d9e2ec",
          200: "#bccde0",
          300: "#9fb3d4",
          400: "#8299c8",
          500: "#6680bc",
          600: "#4d6bb3",
          700: "#3355a9",
          800: "#1a409f",
          900: "#002147",
        },
        accent: {
          DEFAULT: "#cc8800",
          soft: "#fff8e8",
          50: "#fffdf5",
          100: "#fff8e0",
          200: "#ffedb3",
          300: "#ffe08a",
          400: "#ffd461",
          500: "#f5c542",
          600: "#e6b020",
          700: "#cc8800",
          800: "#996600",
          900: "#664400",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f8fafc",
          hover: "#f1f5f9",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,33,71,0.06), 0 1px 2px rgba(0,33,71,0.04)",
        "card-hover": "0 4px 20px rgba(0,33,71,0.08), 0 1px 4px rgba(0,33,71,0.04)",
        "card-lg": "0 12px 40px rgba(0,33,71,0.1), 0 4px 12px rgba(0,33,71,0.05)",
      },
      borderRadius: {
        card: "24px",
        "card-sm": "14px",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease both",
        "slide-up": "slideUp 0.5s ease both",
        "scale-in": "scaleIn 0.3s ease both",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
