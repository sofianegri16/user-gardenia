
import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"
import animatePlugin from "tailwindcss-animate"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        garden: {
          background: "#F9FAFC",
          light: "#F5F7FA",
          primary: "#4CAF50",
          secondary: "#81C784",
          accent: "#FFB74D",
          dark: "#388E3C",
          text: "#2D3748",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" },
        },
        // Animaciones personalizadas para el jardín
        "fall": {
          "0%": { transform: "translateY(0)", opacity: "0.8" },
          "80%": { opacity: "0.5" },
          "100%": { transform: "translateY(100px)", opacity: "0" }
        },
        "fly": {
          "0%": { transform: "translateX(0) translateY(0)" },
          "25%": { transform: "translateX(10px) translateY(-10px)" },
          "50%": { transform: "translateX(20px) translateY(5px)" },
          "75%": { transform: "translateX(5px) translateY(-5px)" },
          "100%": { transform: "translateX(0) translateY(0)" }
        },
        "shake": {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(1deg)" },
          "50%": { transform: "rotate(0deg)" },
          "75%": { transform: "rotate(-1deg)" },
          "100%": { transform: "rotate(0deg)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        // Nuevas animaciones interactivas
        "float": {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-5px)" },
          "100%": { transform: "translateY(0px)" }
        },
        "pulse-glow": {
          "0%": { filter: "drop-shadow(0 0 2px rgba(255,255,255,0.2))" },
          "50%": { filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" },
          "100%": { filter: "drop-shadow(0 0 2px rgba(255,255,255,0.2))" }
        },
        "sway": {
          "0%": { transform: "rotate(0deg) translateY(0)" },
          "25%": { transform: "rotate(2deg) translateY(-5px)" },
          "75%": { transform: "rotate(-2deg) translateY(5px)" },
          "100%": { transform: "rotate(0deg) translateY(0)" }
        },
        // Efectos 3D y de modal
        "slide-in-from-bottom-10": {
          "0%": { transform: "translateY(10%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        "slide-out-to-bottom-10": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(10%)", opacity: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        // Nuevas animaciones de jardín
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "sway": "sway 5s ease-in-out infinite",
        // Animaciones para modales
        "slide-in-from-bottom-10": "slide-in-from-bottom-10 0.3s ease-out",
        "slide-out-to-bottom-10": "slide-out-to-bottom-10 0.3s ease-out"
      },
    },
  },
  plugins: [animatePlugin],
} satisfies Config

export default config
