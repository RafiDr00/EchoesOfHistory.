/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'mono': ['Space Mono', 'monospace'],
      },
      colors: {
        // Enhanced cyberpunk neon palette
        'cyber': {
          'blue': '#00f5ff',
          'purple': '#8a2be2',
          'pink': '#ff1493',
          'green': '#39ff14',
          'orange': '#ff6600',
          'yellow': '#ffff00',
          'red': '#ff073a',
        },
        'neon': {
          'blue': '#00f5ff',
          'purple': '#8a2be2',
          'pink': '#ff1493',
          'green': '#39ff14',
        },
        
        // Enhanced dark theme with depth
        'dark': {
          '950': '#000000',
          '900': '#0a0a0a',
          '850': '#111111',
          '800': '#1a1a1a',
          '750': '#222222',
          '700': '#2a2a2a',
          '650': '#333333',
          '600': '#3a3a3a',
          '550': '#444444',
          '500': '#4a4a4a',
          '400': '#666666',
          '300': '#888888',
        },
        
        // Glassmorphism colors
        'glass': {
          'white': 'rgba(255, 255, 255, 0.1)',
          'dark': 'rgba(0, 0, 0, 0.3)',
          'blue': 'rgba(0, 245, 255, 0.1)',
          'purple': 'rgba(138, 43, 226, 0.1)',
          'pink': 'rgba(255, 20, 147, 0.1)',
        }
      },
      animation: {
        // Enhanced animations
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'bounce-slow': 'bounceSlow 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'particle-float': 'particleFloat 8s ease-in-out infinite',
        'cyber-scan': 'cyberScan 3s ease-in-out infinite',
        'data-stream': 'dataStream 2s linear infinite',
        'hologram': 'hologram 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            filter: 'brightness(1)'
          },
          '100%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            filter: 'brightness(1.2)'
          }
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor',
            opacity: '0.8'
          },
          '50%': { 
            boxShadow: '0 0 20px currentColor, 0 0 30px currentColor, 0 0 40px currentColor',
            opacity: '1'
          }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-10px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' }
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        rotateSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        particleFloat: {
          '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-20px) translateX(10px) rotate(90deg)' },
          '50%': { transform: 'translateY(-10px) translateX(-10px) rotate(180deg)' },
          '75%': { transform: 'translateY(-30px) translateX(5px) rotate(270deg)' }
        },
        cyberScan: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' }
        },
        dataStream: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' }
        },
        hologram: {
          '0%, 100%': { 
            opacity: '0.8',
            filter: 'hue-rotate(0deg) brightness(1)'
          },
          '25%': { 
            opacity: '0.9',
            filter: 'hue-rotate(90deg) brightness(1.1)'
          },
          '50%': { 
            opacity: '1',
            filter: 'hue-rotate(180deg) brightness(1.2)'
          },
          '75%': { 
            opacity: '0.9',
            filter: 'hue-rotate(270deg) brightness(1.1)'
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neural-network': 'radial-gradient(circle at 25% 25%, #00f5ff 0%, transparent 50%), radial-gradient(circle at 75% 75%, #8a2be2 0%, transparent 50%)',
        'cyber-grid': 'linear-gradient(rgba(0,245,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.1) 1px, transparent 1px)',
        'data-stream': 'linear-gradient(180deg, transparent 0%, rgba(0,245,255,0.1) 50%, transparent 100%)',
        'hologram-lines': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.1) 2px, rgba(0,245,255,0.1) 4px)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 245, 255, 0.5)',
        'glow-lg': '0 0 40px rgba(0, 245, 255, 0.6)',
        'glow-purple': '0 0 20px rgba(138, 43, 226, 0.5)',
        'glow-pink': '0 0 20px rgba(255, 20, 147, 0.5)',
        'glow-green': '0 0 20px rgba(57, 255, 20, 0.5)',
        'cyber': '0 0 30px rgba(0, 245, 255, 0.3), inset 0 0 30px rgba(0, 245, 255, 0.1)',
        'depth': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        'depth-lg': '0 35px 60px -12px rgba(0, 0, 0, 0.9)',
      },
      backgroundSize: {
        'grid': '50px 50px',
        'shimmer': '200% 100%',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      }
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'background': 'rgba(0, 0, 0, 0.3)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.glass-cyber': {
          'background': 'rgba(0, 245, 255, 0.1)',
          'backdrop-filter': 'blur(15px)',
          'border': '1px solid rgba(0, 245, 255, 0.3)',
          'box-shadow': '0 0 20px rgba(0, 245, 255, 0.2)',
        },
        '.text-glow': {
          'text-shadow': '0 0 10px currentColor',
        },
        '.text-glow-lg': {
          'text-shadow': '0 0 20px currentColor, 0 0 30px currentColor',
        },
        '.perspective': {
          'perspective': '1000px',
        },
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.rotate-y-180': {
          'transform': 'rotateY(180deg)',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
