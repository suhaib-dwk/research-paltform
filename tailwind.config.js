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
          // ✅ لون البراند الموحَّد لكامل الموقع (الصفحة الرئيسية + الداشبورد + لوحة
          // الأدمن) — بطلب صريح، بعد توحيد كل الاستخدامات المتفرقة (#e8623a الثابتة
          // بـ29 ملف داشبورد/أدمن، و#F15A24 بالتوكن القديم للصفحة الرئيسية فقط) على
          // هذا التوكن المركزي الواحد. لتغيير لون البراند مستقبلاً: غيّر orange هنا
          // فقط — كل الموقع (350+ استخدام) يتحدّث تلقائيًا بلا أي تعديل ملفات إضافي.
          // درجتا dark/light محسوبتان بنفس نسب التغميق/التفتيح المستخدمة تاريخيًا.
          orange: '#FF8710',
          'orange-dark': '#E86D0B',
          'orange-light': '#FFC71D',
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
