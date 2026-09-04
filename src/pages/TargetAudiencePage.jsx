import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const TargetAudiencePage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const audiences = [
    {
      key: 'academics',
      tabLabel: t('audience.tab1'),
      number: '01',
      title: t('audience.a1_title'),
      subtitle: t('audience.a1_subtitle'),
      desc: t('audience.a1_desc'),
      stat: '12,500+',
      statLabel: t('audience.a1_stat_label'),
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop',
      points: [
        t('audience.a1_p1'), t('audience.a1_p2'), t('audience.a1_p3'),
        t('audience.a1_p4'), t('audience.a1_p5'), t('audience.a1_p6'),
      ],
    },
    {
      key: 'universities',
      tabLabel: t('audience.tab2'),
      number: '02',
      title: t('audience.a2_title'),
      subtitle: t('audience.a2_subtitle'),
      desc: t('audience.a2_desc'),
      stat: '85+',
      statLabel: t('audience.a2_stat_label'),
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop',
      points: [
        t('audience.a2_p1'), t('audience.a2_p2'), t('audience.a2_p3'),
        t('audience.a2_p4'), t('audience.a2_p5'), t('audience.a2_p6'),
      ],
    },
    {
      key: 'scientifics',
      tabLabel: t('audience.tab3'),
      number: '03',
      title: t('audience.a3_title'),
      subtitle: t('audience.a3_subtitle'),
      desc: t('audience.a3_desc'),
      stat: '320+',
      statLabel: t('audience.a3_stat_label'),
      image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop',
      points: [
        t('audience.a3_p1'), t('audience.a3_p2'), t('audience.a3_p3'),
        t('audience.a3_p4'), t('audience.a3_p5'),
      ],
    },
    {
      key: 'ministrys',
      tabLabel: t('audience.tab4'),
      number: '04',
      title: t('audience.a4_title'),
      subtitle: t('audience.a4_subtitle'),
      desc: t('audience.a4_desc'),
      stat: '93+',
      statLabel: t('audience.a4_stat_label'),
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
      points: [
        t('audience.a4_p1'), t('audience.a4_p2'), t('audience.a4_p3'),
        t('audience.a4_p4'), t('audience.a4_p5'),
      ],
    },
  ];

  return (
    <>
      {/* ✅ قسم الهيرو */}
      <section className="bg-brand-cream-hero py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center mb-10">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-brand-orange text-xs font-bold tracking-[0.2em] uppercase mb-4"
              >
                {t('audience.hero_label')}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-black text-brand-ink leading-tight mb-4"
              >
                {t('audience.hero_title_line1')}{' '}
                <span className="text-brand-orange block">{t('audience.hero_title_line2')}</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-brand-muted leading-relaxed"
            >
              {t('audience.hero_desc')}
            </motion.p>
          </div>

          {/* أزرار التبويب */}
          <div className="flex flex-wrap gap-3">
            {audiences.map((aud, index) => (
              <button
                key={aud.key}
                onClick={() => setActiveTab(index)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  activeTab === index
                    ? 'bg-brand-orange text-white border-brand-orange'
                    : 'bg-white text-brand-ink border-brand-ink/15 hover:border-brand-orange/40'
                }`}
              >
                {aud.tabLabel}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ شريط الأرقام الداكن */}
      <section className="bg-brand-ink">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {audiences.map((aud, index) => (
              <button
                key={aud.key}
                onClick={() => setActiveTab(index)}
                className={`text-start py-8 px-4 md:px-6 border-t-2 transition-colors ${
                  activeTab === index ? 'border-brand-orange' : 'border-transparent'
                }`}
              >
                <span className={`text-3xl font-black block mb-2 ${activeTab === index ? 'text-brand-orange' : 'text-white/30'}`}>
                  {aud.number}
                </span>
                <p className="text-white font-bold text-sm mb-1">{aud.title}</p>
                <p className="text-white/50 text-xs">{aud.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ الأقسام التفصيلية لكل فئة */}
      {audiences.map((aud, index) => (
        <section
          key={aud.key}
          className={index % 2 === 0 ? 'bg-white' : 'bg-brand-cream-hero'}
        >
          <div className="container mx-auto px-6 py-16 md:py-20">
            <div className={`grid lg:grid-cols-2 gap-10 items-center ${index % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}>
              <div className={index % 2 === 1 ? 'lg:[direction:ltr]' : ''}>
                <span className="text-brand-orange text-sm font-black mb-2 block">{aud.number}</span>
                <h2 className="text-3xl font-black text-brand-ink mb-1">{aud.title}</h2>
                <p className="text-brand-muted text-sm mb-6">{aud.subtitle}</p>

                <p className="text-brand-muted leading-relaxed mb-6">{aud.desc}</p>

                <div className="bg-brand-ink rounded-2xl px-6 py-4 inline-block mb-6">
                  <p className="text-2xl font-black text-white">{aud.stat}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-brand-orange">{aud.statLabel}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {aud.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                      <span className="text-brand-muted text-sm">{point}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/register"
                  className="inline-block bg-brand-orange text-white px-8 py-3 rounded-full font-bold hover:bg-brand-orange-dark transition-all duration-300"
                >
                  {t('nav.register')}
                </Link>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`h-72 md:h-96 rounded-2xl overflow-hidden ${index % 2 === 1 ? 'lg:[direction:ltr]' : ''}`}
              >
                <img src={aud.image} alt={aud.title} className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default TargetAudiencePage;
