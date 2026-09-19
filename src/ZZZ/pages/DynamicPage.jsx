import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BookOpen, Users, Building2, Scale, Shield,
  Target, Eye, FileText, AlertCircle, CheckCircle
} from 'lucide-react';
import { API_BASE_URL } from '../api';

// =========================================================
// صفحة محتوى ديناميكية (/page/:slug) — تُستخدم لصفحات السياسات (الشروط
// والأحكام، سياسة الخصوصية، السياسة العامة للاستخدام…). المحتوى يبقى HTML
// واحدًا يُدار من لوحة الأدمن (جدول "محتوى الصفحات")، والصفحة تشتق منه
// بنودًا مرقّمة + فهرس جانبي لاصق تلقائيًا من عناوين h2/h3.
// =========================================================

const getIcon = (name) => {
  const icons = { BookOpen, Users, Building2, Scale, Shield, Target, Eye, FileText, AlertCircle, CheckCircle };
  return icons[name] || Shield;
};

const pad2 = (n) => String(n).padStart(2, '0');

// يقسّم HTML القادم من قاعدة البيانات إلى بنود: كل عنوان h2/h3 يبدأ بندًا
// جديدًا، وما قبل أول عنوان يبقى مقدمة بلا رقم. إن لم توجد عناوين نعيد
// المحتوى كما هو في بطاقة واحدة.
const splitIntoSections = (html) => {
  if (!html || typeof window === 'undefined') return { intro: html || '', sections: [] };
  const doc = new DOMParser().parseFromString(`<div id="root">${html}</div>`, 'text/html');
  const root = doc.getElementById('root');
  if (!root) return { intro: html, sections: [] };

  const nodes = Array.from(root.childNodes);
  const isHeading = (n) => n.nodeType === 1 && /^H[23]$/.test(n.tagName);
  if (!nodes.some(isHeading)) return { intro: html, sections: [] };

  const intro = [];
  const sections = [];
  for (const node of nodes) {
    if (isHeading(node)) {
      sections.push({ title: node.textContent.trim(), body: '' });
    } else if (sections.length) {
      sections[sections.length - 1].body += node.outerHTML ?? node.textContent ?? '';
    } else {
      intro.push(node.outerHTML ?? node.textContent ?? '');
    }
  }
  return { intro: intro.join(''), sections: sections.filter((s) => s.title) };
};

const DynamicPage = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false;
  const ArrowIcon = isRTL ? ArrowRight : ArrowLeft;
  const lang = isRTL ? 'ar' : 'en';

  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef([]);

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/get_page.php?slug=${slug}`);
        const result = await res.json();
        if (result.status === 'success') setPageData(result.data);
        else setPageData(null);
      } catch (error) {
        console.error('Error fetching page:', error);
        setPageData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPage();
    window.scrollTo(0, 0);
  }, [slug]);

  const rawContent = pageData ? (lang === 'ar' ? pageData.content_ar : pageData.content_en) : '';
  const { intro, sections } = useMemo(() => splitIntoSections(rawContent), [rawContent]);

  // ✅ تتبّع البند الظاهر حاليًا لتمييزه في الفهرس الجانبي
  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveSection(Number(visible.target.dataset.index));
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 }
    );
    sectionRefs.current.filter(Boolean).forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections.length]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-16 h-16 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin"></div>
    </div>
  );

  if (!pageData) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-6">
      <h1 className="text-5xl font-black text-gray-300 mb-4">404</h1>
      <p className="text-brand-muted mb-8">{isRTL ? 'الصفحة غير موجودة' : 'Page not found'}</p>
      <Link to="/" className="text-brand-orange font-bold hover:underline flex items-center gap-2">
        <ArrowIcon className="w-4 h-4" /> {isRTL ? 'العودة للرئيسية' : 'Back to home'}
      </Link>
    </div>
  );

  const DynamicIcon = getIcon(pageData.icon_name);
  const title = lang === 'ar' ? pageData.title_ar : pageData.title_en;
  const badge = pageData.badge_label || (isRTL ? 'سياسات المنصة' : 'Platform policies');
  const countLabel = sections.length
    ? (isRTL ? `${sections.length} بنود` : `${sections.length} clauses`)
    : null;

  const scrollToSection = (index) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ═══ الهيرو المتدرّج بحافة منحنية ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-brand-orange via-brand-orange to-brand-orange-dark pt-14 pb-32">
        {/* أشكال خلفية خفيفة */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-10 end-[8%] w-72 h-72 rounded-full bg-white/10" />
          <div className="absolute bottom-0 start-[15%] w-40 h-40 rounded-full bg-white/5" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            {/* مسار التنقل */}
            <div className="inline-flex items-center gap-2 text-[13px] bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-white/90">
              <Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link>
              <span className="opacity-60">/</span>
              <span className="font-semibold text-white">{title}</span>
            </div>

            {/* شارة نوع الصفحة */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full ps-3 pe-4 py-1.5 mb-6 border border-white/25">
              <DynamicIcon className="w-4 h-4 text-white" strokeWidth={2} />
              <span className="text-xs font-bold text-white tracking-wide">{badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-[44px] font-black text-white leading-[1.35] max-w-4xl mb-4">
              {title}
            </h1>

            {pageData.subtitle_ar || pageData.subtitle_en ? (
              <p className="text-white/85 text-base mb-6">
                {lang === 'ar' ? pageData.subtitle_ar : pageData.subtitle_en}
              </p>
            ) : null}

            {/* شارات صغيرة */}
            {countLabel && (
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <span className="text-[13px] font-semibold text-white bg-white/20 rounded-full px-4 py-1.5 border border-white/25">
                  {countLabel}
                </span>
                <span className="text-[13px] font-semibold text-white bg-white/20 rounded-full px-4 py-1.5 border border-white/25">
                  {title}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* الحافة المنحنية أسفل الهيرو */}
        <svg
          className="absolute bottom-0 inset-x-0 w-full h-[70px] text-gray-50"
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path fill="currentColor" d="M0,40 C240,72 480,72 720,50 C960,28 1200,10 1440,34 L1440,70 L0,70 Z" />
        </svg>
      </section>

      {/* ═══ المحتوى + الفهرس الجانبي ═══ */}
      <section className="py-14 md:py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* الفهرس الجانبي اللاصق */}
            {sections.length > 0 && (
              <aside className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 order-first lg:order-none">
                <nav className="bg-white rounded-2xl border border-gray-200 shadow-[0_18px_40px_-28px_rgba(31,26,23,0.35)] p-5">
                  <h2 className="text-sm font-bold text-brand-ink mb-4 pb-3 border-b border-gray-100">
                    {isRTL ? 'محتويات السياسة' : 'Policy contents'}
                  </h2>
                  <ul className="flex flex-col gap-0.5 max-h-[60vh] overflow-y-auto">
                    {sections.map((section, index) => {
                      const isActive = index === activeSection;
                      return (
                        <li key={`${section.title}-${index}`}>
                          <button
                            type="button"
                            onClick={() => scrollToSection(index)}
                            aria-current={isActive}
                            className={`w-full flex items-center gap-3 text-start rounded-xl px-3 py-2.5 transition-colors ${
                              isActive ? 'bg-brand-orange/10' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 transition-colors ${
                                isActive ? 'bg-brand-orange text-white' : 'bg-gray-100 text-brand-muted'
                              }`}
                            >
                              {pad2(index + 1)}
                            </span>
                            <span
                              className={`text-[13px] leading-snug font-semibold transition-colors ${
                                isActive ? 'text-brand-orange' : 'text-brand-ink'
                              }`}
                            >
                              {section.title}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </aside>
            )}

            {/* البنود */}
            <div className={sections.length > 0 ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'}>
              {/* مقدمة بلا رقم (ما قبل أول عنوان) */}
              {intro && intro.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-[0_18px_40px_-30px_rgba(31,26,23,0.3)] p-7 md:p-9 mb-6"
                >
                  <div
                    className={`prose prose-base max-w-none prose-p:text-brand-muted prose-p:leading-[2] prose-li:text-brand-muted prose-strong:text-brand-ink prose-a:text-brand-orange ${isRTL ? 'text-right' : 'text-left'}`}
                    dangerouslySetInnerHTML={{ __html: intro }}
                  />
                </motion.div>
              )}

              {sections.map((section, index) => (
                <motion.article
                  key={`${section.title}-${index}`}
                  ref={(el) => { sectionRefs.current[index] = el; }}
                  data-index={index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4 }}
                  className="scroll-mt-24 bg-white rounded-2xl border border-gray-200 shadow-[0_18px_40px_-30px_rgba(31,26,23,0.3)] p-7 md:p-9 mb-6 last:mb-0"
                >
                  <header className="flex items-start justify-between gap-4 pb-4 mb-5 border-b border-gray-100">
                    <h2 className="text-xl md:text-2xl font-bold text-brand-ink leading-snug">
                      {section.title}
                    </h2>
                    <span className="w-11 h-11 rounded-xl bg-brand-orange text-white flex items-center justify-center text-sm font-black flex-shrink-0">
                      {pad2(index + 1)}
                    </span>
                  </header>
                  <div
                    className={`prose prose-base max-w-none prose-p:text-brand-muted prose-p:leading-[2] prose-li:text-brand-muted prose-strong:text-brand-ink prose-a:text-brand-orange prose-headings:text-brand-ink ${isRTL ? 'text-right' : 'text-left'}`}
                    dangerouslySetInnerHTML={{ __html: section.body }}
                  />
                </motion.article>
              ))}

              {/* العودة للرئيسية */}
              <div className="mt-8">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-muted hover:text-brand-orange transition-colors"
                >
                  <ArrowIcon className="w-4 h-4" />
                  {isRTL ? 'العودة إلى الرئيسية' : 'Back to home'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DynamicPage;
