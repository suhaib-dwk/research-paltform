import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Target, Eye, Shield, RefreshCw, Home, Users, ClipboardCheck } from 'lucide-react';

const AboutUsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const currentLang = i18n.language;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { value: '2026', label: t('about.stat_founded') },
    { value: '85+', label: t('about.stat_universities') },
    { value: '12,500+', label: t('about.stat_researchers') },
  ];

  const timeline = [
    { month: t('about.milestone1_month'), title: t('about.milestone1_title'), desc: t('about.milestone1_desc') },
    { month: t('about.milestone2_month'), title: t('about.milestone2_title'), desc: t('about.milestone2_desc') },
    { month: t('about.milestone3_month'), title: t('about.milestone3_title'), desc: t('about.milestone3_desc') },
    { month: t('about.milestone4_month'), title: t('about.milestone4_title'), desc: t('about.milestone4_desc') },
  ];

  const coreValues = [
    { icon: Shield, title: t('about.value1_title'), desc: t('about.value1_desc') },
    { icon: RefreshCw, title: t('about.value2_title'), desc: t('about.value2_desc') },
    { icon: Home, title: t('about.value3_title'), desc: t('about.value3_desc') },
    { icon: Target, title: t('about.value4_title'), desc: t('about.value4_desc') },
    { icon: Users, title: t('about.value5_title'), desc: t('about.value5_desc') },
    { icon: ClipboardCheck, title: t('about.value6_title'), desc: t('about.value6_desc') },
  ];

  return (
    <>
      {/* ✅ قسم الهيرو */}
      <section className="bg-brand-cream-hero py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-4"
              >
                {t('about.hero_label')}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-brand-ink leading-tight mb-4"
              >
                {t('about.hero_title_line1')}{' '}
                <span className="text-brand-orange block">{t('about.hero_title_line2')}</span>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '4rem' }}
                transition={{ delay: 0.3 }}
                className="h-1 bg-brand-ink"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <p className="text-brand-muted italic leading-relaxed">
                {t('about.hero_quote')}
              </p>
              <p className="text-brand-muted leading-relaxed">
                {t('about.hero_desc')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ✅ صورة + إحصائيات */}
      <section className="relative">
        <div className="h-72 md:h-96 w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2069&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-x-0 -bottom-10 md:-bottom-12 px-6">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-brand-ink rounded-2xl py-6 px-4 text-center shadow-lg"
              >
                <p className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-wide text-brand-orange">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ رسالتنا ورؤيتنا */}
      <section className="bg-brand-ink pt-24 pb-16 md:pt-28 md:pb-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <span className="flex items-center gap-2 text-brand-orange text-xs font-bold tracking-[0.15em] uppercase mb-4">
                <Target className="w-4 h-4" /> {t('about.mission_label')}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-snug">
                {t('about.mission_title')}
              </h2>
              <p className="text-white/60 leading-relaxed">
                {t('about.mission_desc')}
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-6 md:p-8">
              <span className="flex items-center gap-2 text-brand-orange text-xs font-bold tracking-[0.15em] uppercase mb-4">
                <Eye className="w-4 h-4" /> {t('about.vision_label')}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-snug">
                {t('about.vision_title')}
              </h2>
              <p className="text-white/60 leading-relaxed">
                {t('about.vision_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ قصتنا (الخط الزمني) */}
      <section className="py-16 md:py-20 bg-brand-cream-hero">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <span className="inline-block text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-4">
                {t('about.story_label')}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-brand-ink leading-tight mb-4">
                {t('about.story_title')}
              </h2>
              <div className="w-16 h-1 bg-brand-ink mb-6" />
              <p className="text-brand-muted leading-relaxed max-w-md">
                {t('about.story_desc')}
              </p>
            </div>

            <div className="relative ps-8">
              <div className="absolute top-2 bottom-2 start-[7px] w-px bg-brand-orange/30" />
              <div className="space-y-10">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative"
                  >
                    <span className="absolute -start-8 top-1 w-4 h-4 rounded-full bg-brand-orange ring-4 ring-brand-cream-hero" />
                    <p className="text-xs font-bold text-brand-orange uppercase tracking-wide mb-1">
                      {item.month}
                    </p>
                    <h3 className="font-bold text-brand-ink mb-1.5">{item.title}</h3>
                    <p className="text-sm text-brand-muted leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ قيمنا الأساسية */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-4">
                {t('about.values_label')}
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-brand-ink">
                {t('about.values_title')}
              </h2>
            </div>
            <p className="text-brand-muted max-w-md">
              {t('about.values_desc')}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 border-t border-brand-ink/10 pt-10">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
              >
                <value.icon className="w-6 h-6 text-brand-orange mb-3" />
                <h3 className="font-bold text-brand-ink mb-2">{value.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUsPage;
