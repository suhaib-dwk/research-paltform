/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ✅ تأكد أن هذا السطر موجود ومضبوط على 'class'
  darkMode: 'class', 
  theme: {
    extend: {},
  },
  plugins: [],
}