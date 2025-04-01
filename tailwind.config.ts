import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import path from "path";

console.log("🧵 Tailwind scanning:", path.resolve(__dirname));

const config: Config = {
  mode: "jit",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx,css}", // ✅ Include CSS files
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx,css}", // ✅ Include CSS files
    "./src/app/**/*.{js,ts,jsx,tsx,mdx,css}", // ✅ Include CSS files
  ],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-4px)" },
          "40%": { transform: "translateX(4px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
      },
      boxShadow: {
        "left-bottom-lg": "-4px 4px 10px rgba(0, 0, 0, 0.5)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // NEW:
        bluestone: {
          50: "#ABDBE3",
          100: "#76B5C5",
          200: "#197A98",
          300: "#266176",
          400: "#1D4B5B",
        },
        brick: {
          50: "#F39678",
          100: "#E28743",
          200: "#F45B26",
          300: "#F1260A",
        },
        shell: {
          50: "#EEEEE4",
          75: "#e7e0ca",
          100: "#D7DADE",
          200: "#747A82",
          300: "#505458",
        },
        tennis: {
          50: "#EEFC72",
          100: "#E5F644",
          200: "#D0E323",
        },
        licorice: {
          50: "#21130D",
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".text-heading": {
          fontWeight: "700",
          color: "rgb(25, 122, 152)",
        },
      });
    }),
  ],
};
export default config;
