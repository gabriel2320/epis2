import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          50: "#f6f7f8",
          100: "#e7eaee",
          200: "#cdd3da",
          500: "#66717f",
          700: "#36404c",
          900: "#121820",
          950: "#080c11"
        },
        pulse: {
          teal: "#0f9f9a",
          amber: "#e0a21a",
          rose: "#d4486f"
        }
      },
      boxShadow: {
        cockpit: "0 24px 80px rgba(8, 12, 17, 0.16)",
        rail: "0 18px 60px rgba(15, 159, 154, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
