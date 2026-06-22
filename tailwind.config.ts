import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        paw: {
          primary: "#C67C4E",
          secondary: "#F6E7D8",
          accent: "#8AA67A",
          background: "#FAF8F5",
          text: "#2D2D2D"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(88, 58, 34, 0.12)"
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem"
      }
    }
  },
  plugins: []
};

export default config;
