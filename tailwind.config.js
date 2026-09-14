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
          // ✅ مطابقة دقيقة للون شعار SOURCE الفعلي (#F15A24، مُستخرج من بكسلات الشعار
          // نفسه) بدل اللون القديم #e8623a الذي كان مختلفًا بشكل ملحوظ عنه بصريًا.
          // درجتا dark/light محسوبتان بنفس نسب التغميق/التفتيح المستخدمة سابقًا حتى
          // يبقى التدرّج بين الدرجات متسقًا كما كان.
          orange: '#F15A24',
          'orange-dark': '#DC491A',
          'orange-light': '#F98543',
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
