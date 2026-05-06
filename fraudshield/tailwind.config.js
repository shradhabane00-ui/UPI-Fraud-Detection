/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        mono: ["DM Mono", "monospace"],
        sans: ["DM Sans", "sans-serif"],
      },
      colors: {
        surface: "#0e1118",
        card:    "#131720",
        card2:   "#181e2b",
        border:  "#1e2535",
        fraud:   "#ef4444",
        suspect: "#f59e0b",
        safe:    "#22c55e",
      }
    },
  },
  plugins: [],
}