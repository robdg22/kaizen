/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '375px',      // Mobile (standard iPhone)
        sm: '640px',      // Tablet portrait
        md: '1024px',     // Tablet landscape / Small desktop
        lg: '1280px',     // Desktop
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}
