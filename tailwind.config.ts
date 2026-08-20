import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          dark: "#1d4ed8",
          light: "#60a5fa",
          lighter: "#dbeafe",
          bg: "#eff6ff",
        },
        secondary: {
          DEFAULT: "#06b6d4",
          soft: "#e0f7fe",
        },
        ink: {
          DEFAULT: "#0a1a2e",
          muted: "#64748b",
        },
      },
      borderRadius: {
        xl: "16px",
        lg: "10px",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(37, 99, 235, 0.12)",
        softLg: "0 12px 48px rgba(37, 99, 235, 0.18)",
      },
      fontFamily: {
        sans: ["Segoe UI", "system-ui", "-apple-system", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.5s ease forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
