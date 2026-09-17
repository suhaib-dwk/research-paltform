import typography from '@tailwindcss/typography';

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
      // =====================================================================
      // ✅ هوية SOURCE — مطابقة لكتيّب الهوية (Source Brand Guidelines، إصدار 01 / 09-2026)
      //   • الخط الإنجليزي: DM Sans (العناوين Bold والمتن Medium/Regular).
      //     Helvetica Neue LT Pro خط تجاري غير قابل للتضمين على الويب بلا ترخيص،
      //     والكتيّب نفسه يعتمد DM Sans للعناوين واللافتات الرقمية.
      //   • الخط العربي: Tajawal (خط تجوال) — مجاني ومحمّل من Google Fonts.
      //   المتغيّرات --font-ar / --font-en معرّفة في src/index.css.
      // =====================================================================
      fontFamily: {
        sans: ['var(--font-ar)', 'sans-serif'],
        arabic: ['var(--font-ar)', 'sans-serif'],
        latin: ['var(--font-en)', 'sans-serif'],
      },
      colors: {
        brand: {
          // ── الألوان الرئيسية (Main color) ──
          orange: '#FF8710',          // اللون الأساسي — لا يُغيَّر (البراند بوك ص3)
          black: '#000000',
          gray: '#BCBCBC',
          // ── الألوان الثانوية (Secondary color) — للرسوم البيانية واللمسات فقط ──
          red: '#FF3600',
          sky: '#46A8D3',
          blue: '#3146DD',
          // ── درجات مشتقة من البرتقالي لحالات hover والتدرجات (ليست ألوانًا مستقلة) ──
          'orange-dark': '#E86D0B',
          'orange-light': '#FFA53D',
          // ── الخلفيات الفاتحة المحايدة (الكتيّب يعتمد الأبيض والرماديات المحايدة، لا الكريمي) ──
          cream: '#F5F5F5',
          'cream-hero': '#F0F0F0',
          'cream-footer': '#E8E8E8',
          // ── نص الهوية الداكن: البني الداكن المستخدم في عناوين الكتيّب وخلفياته ──
          ink: '#241B14',
          muted: '#6B6259',
          // ── الوضع الداكن: خلفية الكتيّب الداكنة (#191919) وبطاقات بنية داكنة (#241B14) ──
          dark: '#191919',
          'dark-soft': '#1F1D1B',
          'dark-card': '#241B14',
          'dark-border': '#3A2F27',
          'dark-hover': '#2E2620',
        },
      },
    },
  },
  // ✅ إضافة typography: صفحات المحتوى الديناميكي (/page/:slug) تعرض HTML
  // قادمًا من لوحة الأدمن داخل .prose — بدون هذه الإضافة تفقد تنسيقها.
  plugins: [typography],
}
