import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050507",
        obsidian: "#0a0b10",
        pearl: "#f6eee2",
        champagne: "#d9b873",
        ember: "#ff9d48",
        roseglass: "#f7b8a8",
        aurora: "#9ce6e6"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        aureole: "0 0 80px rgba(217,184,115,.22), 0 0 180px rgba(156,230,230,.08)"
      },
      animation: {
        grain: "grain 8s steps(10) infinite"
      },
      keyframes: {
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-3%, 2%)" },
          "40%": { transform: "translate(2%, -3%)" },
          "60%": { transform: "translate(-2%, -1%)" },
          "80%": { transform: "translate(3%, 3%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
