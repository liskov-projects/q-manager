import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bear: {
          50: "#873E23"
        },
        bluestone: {
          50: "#ABDBE3",
          100: "#76B5C5"
        },
        indigod: {
          50: "#1E81B0",
          100: "#164C78",
          200: "#053970"
        },
        tangerine: {
          50: "#E28743"
        },
        shell: {
          50: "#EEEEE4"
        },
        licorice: {
          50: "#21130D"
        }
      }
    }
  },
  plugins: []
};
export default config;
