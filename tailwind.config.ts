import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        primary: "#FF9F43",
        secondary: "#FFE8C7",
        bg: "#FFF9ED",
        text: "#4B3F2F",
        muted: "#A38B6D",
        input: "#FFF3DE",
        border: "#FFD18E",
      },
      fontFamily: {
        sans: ["'Wanted Sans'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 6px rgba(0,0,0,0.1)",
      },
    },
  },
} satisfies Config;
