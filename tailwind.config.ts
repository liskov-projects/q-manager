import type {Config} from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    // "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        'left-bottom-lg': '-4px 4px 10px rgba(0, 0, 0, 0.5)', 
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
          400: "#1D4B5B"
        },
        brick: {
          50: "#F39678",
          100: "#E28743",
          200: "#F45B26",
          300: "#F1260A"
        },
        shell: {
          50: "#EEEEE4",
          100: "#D7DADE",
          200: "#747A82",
          300: "#505458"
        },
        tennis: {
          50: "#EEFC72",
          100: "#E5F644",
          200: "#D0E323"
        },
        licorice: {
          50: "#21130D"
        }
      }
    }
  },
  plugins: [
    plugin(function ({addComponents}) {
      addComponents({
        ".text-heading": {
          fontWeight: "700",
          color: "rgb(25, 122, 152)"
        }
      });
    })
  ]
};
export default config;
