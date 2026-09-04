/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ✅ تأكد أن هذا السطر موجود ومضبوط على 'class'
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#e8623a',
          'orange-dark': '#d4502a',
          'orange-light': '#f0916d',
          cream: '#f0e8e0',
          'cream-hero': '#f0e6dd',
          'cream-footer': '#ede4da',
          ink: '#1f1a17',
          muted: '#6b6058',
          // ✅ درجات dark mode الخاصة بالداشبورد — متناسقة مع brand.orange بدل الكحلي/الذهبي القديم
          dark: '#1a1613',
          'dark-soft': '#1f1a17',
          'dark-card': '#211c18',
          'dark-border': '#3a322c',
          'dark-hover': '#2a231e',
        },
      },
    },
  },
  plugins: [],
}
