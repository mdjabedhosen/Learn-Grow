import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Font Families
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        playpen: ["var(--font-playpen)", "sans-serif"],
        siliguri: ["var(--font-hind-siliguri)", "sans-serif"],
        atma: ["var(--font-atma)", "sans-serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
        // Headline font - Poppins for strong contrast
        headline: ["var(--font-poppins)", "sans-serif"],
      },

      // Modern Color Palette
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          DEFAULT: '#3b82f6',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          DEFAULT: '#7c3aed',
        },
        accent: {
          50: '#FFFBEA',
          100: '#FFF8E1',
          200: '#FFE082',
          300: '#FFD54F',
          400: '#FFCA28',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          DEFAULT: '#F59E0B',
        },
      },

      // Gradient Utilities
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'gradient-warm': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        'gradient-cool': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        'gradient-robotics': 'linear-gradient(135deg, #EAF4FB 0%, #D7EAF7 100%)',
        'gradient-coding': 'linear-gradient(135deg, #FFF2ED 0%, #FFE4D6 100%)',
        'gradient-math': 'linear-gradient(135deg, #F4F6FF 0%, #E6E9FF 100%)',
        'gradient-science': 'linear-gradient(135deg, #FFF8E1 0%, #FFE082 100%)',
      },

      // Box Shadows with Glow Effects
      boxShadow: {
        'glow-primary': '0 20px 40px -12px rgba(14, 165, 233, 0.3)',
        'glow-secondary': '0 20px 40px -12px rgba(217, 70, 239, 0.3)',
        'glow-accent': '0 20px 40px -12px rgba(245, 158, 11, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },

      // Animation Keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },

      // Animation Classes
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.5s ease-out',
        slideDown: 'slideDown 0.5s ease-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        float: 'float 3s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
      },

      // Border Radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

