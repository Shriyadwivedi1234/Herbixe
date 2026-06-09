/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:   '#f5f0e8',
        bark:    '#2c1f0e',
        moss:    '#4a5e3a',
        gold:    '#c9a84c',
        'gold-lt': '#e8c96a',
        'gold-dk': '#8b6914',
        sage:    '#7a9e6e',
        earth:   '#8b6914',
        mist:    '#d4e0ca',
        dark:    '#1a1208',
        ink:     '#0a0f0a',
        forest:  '#0d1f0e',
        fern:    '#2d5a2d',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body:    ['Jost', 'sans-serif'],
      },
      animation: {
        'fade-up':    'fadeUp 0.9s ease forwards',
        'float':      'float 4s ease-in-out infinite',
        'spin-slow':  'spin 20s linear infinite',
        'marquee':    'marquee 30s linear infinite',
        'breathe':    'breathe 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(28px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-16px)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        breathe: { '0%,100%': { opacity: 0.3 }, '50%': { opacity: 1 } },
      },
    },
  },
  plugins: [],
}
