/* eslint-disable @typescript-eslint/no-require-imports */
const plugin = require('tailwindcss/plugin')

const CONTAINER_PADDING = '1.5rem'

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    fontFamily: {
      sans: ['Inter Variable GF', 'sans-serif']
    },
    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
      '6xl': '3.815rem',
      '7xl': '4.768rem',
      '8xl': '6.210rem',
      '9xl': '8.267rem'
    },
    container: {
      center: true,
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))'
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        next: {
          DEFAULT: 'hsl(var(--next-blue))',
          secondary: 'hsl(var(--next-green))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        animatedGradient: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '100%': { backgroundPosition: '0% 0%' }
        },
        scale: {
          '0%': { scale: '1' },
          '50%': { scale: '1.3' },
          '100%': { scale: '1' }
        },
        wave: {
          '0%': { transform: 'rotate(0.0deg)' },
          '10%': { transform: 'rotate(14deg)' },
          '20%': { transform: 'rotate(-8deg)' },
          '30%': { transform: 'rotate(14deg)' },
          '40%': { transform: 'rotate(-4deg)' },
          '50%': { transform: 'rotate(10.0deg)' },
          '60%': { transform: 'rotate(0.0deg)' },
          '100%': { transform: 'rotate(0.0deg)' }
        },
        colorChange: {
          '0%': { backgroundColor: '#f59e0b' },
          '100%': { backgroundColor: '#e11d48' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        gradient: 'animatedGradient 6s ease infinite alternate',
        expand: 'expand 0.3s ease-in-out',
        collapse: 'collapse 0.3s ease-in-out',
        'brief-fade-in-for-pages-transitioning': 'fade-in 0.3s ease-out',
        'brief-fade-out-for-pages-transitioning': 'fade-out 0.3s ease-out',
        'fade-in': 'fade-in 1s ease-out ',
        'fade-out': 'fade-out 1s ease-out ',
        scale: 'scale 3.5s linear infinite',
        wave: 'wave 2s linear infinite',
        progress: 'progress var(--rotate-every) linear forwards',
        'color-change': 'colorChange 0.7s infinite alternate'
      },
      backgroundSize: {
        '300%': '300%'
      },
      screens: {
        fhd: { raw: '(min-width: 1920px) and (max-width: 2559px)' },
        '4k': { raw: '(min-width: 2560px)' }
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    plugin(({ addComponents }) => {
      addComponents({
        '.container': {
          paddingTop: CONTAINER_PADDING,
          paddingBottom: CONTAINER_PADDING,
          paddingLeft: CONTAINER_PADDING,
          paddingRight: CONTAINER_PADDING
        }
      })
    })
  ]
}
