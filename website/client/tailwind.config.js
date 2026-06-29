/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // "Case file" palette — cool fog + ink navy + brass + a muted crimson
        // for caution states. Deliberately not cream/terracotta or near-black/neon.
        ink: {
          50: "#F2F4F7",
          100: "#E5E9F0",
          200: "#C7D0DE",
          400: "#5B6B85",
          600: "#2E3B52",
          800: "#16213A",
          900: "#0B1220",
          950: "#080D17",
        },
        brass: {
          200: "#EFDFA8",
          400: "#D4B65B",
          500: "#C9A227",
          600: "#A6831C",
        },
        crimson: {
          400: "#C2554F",
          500: "#A6403B",
          600: "#8C2F2F",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["'IBM Plex Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        case: "0 1px 2px rgba(11,18,32,0.06), 0 8px 24px -8px rgba(11,18,32,0.18)",
      },
      backgroundImage: {
        "paper-lines":
          "repeating-linear-gradient(to bottom, transparent, transparent 31px, currentColor 32px)",
      },
      keyframes: {
        stamp: {
          "0%": { transform: "scale(1.6) rotate(-18deg)", opacity: "0" },
          "60%": { transform: "scale(0.95) rotate(-10deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(-8deg)", opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "page-turn-next": {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "page-turn-prev": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        stamp: "stamp 360ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "fade-up": "fade-up 300ms ease-out both",
        "page-turn-next": "page-turn-next 250ms ease-out both",
        "page-turn-prev": "page-turn-prev 250ms ease-out both",
      },
    },
  },
  plugins: [],
};
