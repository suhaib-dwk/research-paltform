import React, { useState } from 'react';
import { Landmark, Building2, GraduationCap, UserCog, ArrowLeft, ArrowRight } from 'lucide-react';

const LEVELS = [
  {
    key: 'ministry',
    Icon: Landmark,
    title: { ar: 'الوزارة', en: 'Ministry' },
    description: {
      ar: 'رؤية إشرافية شاملة تتيح مقارنة أداء الجامعات لحظيًا وبناء تقارير جاهزية وطنية دقيقة تدعم القرار.',
      en: 'A national oversight view that compares every university side by side and turns readiness data into decisions.',
    },
    items: {
      ar: [
        'لوحة مقارنة شاملة بين الجامعات',
        'تقارير الجاهزية الوطنية',
        'متابعة مؤشرات الاعتماد والتصنيف',
        'اعتماد الأطر والمعايير الوطنية',
      ],
      en: [
        'Full cross-university comparison dashboard',
        'National readiness reports',
        'Accreditation and ranking indicator tracking',
        'National frameworks and standards approval',
      ],
    },
  },
  {
    key: 'university',
    Icon: Building2,
    title: { ar: 'الجامعة', en: 'University' },
    description: {
      ar: 'المحرك المركزي للبيانات البحثية والأدلة، حيث تُدار الجاهزية للاعتماد والتصنيف من مصدر واحد موثوق.',
      en: 'The core engine for research data, evidence, and readiness — a single source of truth for accreditation and ranking.',
    },
    items: {
      ar: [
        'قاعدة بيانات بحثية موحدة',
        'محرك الجاهزية للاعتماد والتصنيف',
        'إدارة الأدلة والمطابقة الذكية',
        'خطط تحسين قابلة للتتبع',
      ],
      en: [
        'Unified research database',
        'Accreditation and ranking readiness engine',
        'Smart evidence and compliance management',
        'Trackable improvement plans',
      ],
    },
  },
  {
    key: 'researcher',
    Icon: GraduationCap,
    title: { ar: 'الباحث والطالب', en: 'Researcher & Student' },
    description: {
      ar: 'أدوات شخصية جاهزة اليوم: مساعد ذكي أكاديمي، تقييم جاهزية فوري، ومساحة للتعاون والنشر البحثي.',
      en: 'Personal tools already live: an academic AI assistant, instant readiness checks, and a space to collaborate and publish.',
    },
    items: {
      ar: [
        'مساعد ذكي أكاديمي',
        'تقييم الجاهزية الشخصي',
        'طلبات المراجعة والنشر',
        'التعاون البحثي',
      ],
      en: [
        'Academic AI assistant',
        'Personal readiness self-check',
        'Review and publishing requests',
        'Research collaboration',
      ],
    },
  },
  {
    key: 'staff',
    Icon: UserCog,
    title: { ar: 'الموظف', en: 'Staff' },
    description: {
      ar: 'تحكم كامل بإدارة المنصة، من أطر التقييم إلى صلاحيات المستخدمين، بواجهة واحدة منظمة وآمنة.',
      en: 'Full control over platform administration — from evaluation frameworks to user permissions — in one secure interface.',
    },
    items: {
      ar: [
        'إدارة أطر التقييم والاعتماد',
        'مراجعة الجامعات والموافقات',
        'إعدادات المنصة العامة',
        'إدارة المستخدمين والصلاحيات',
      ],
      en: [
        'Manage evaluation and accreditation frameworks',
        'University review and approvals',
        'General platform settings',
        'User and permission management',
      ],
    },
  },
];

const ArrowIcon = ({ isAr, className }) => {
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  return <Arrow className={className} />;
};

const ArrowBadge = ({ isAr }) => (
  <span className="w-8 h-8 rounded-full border border-brand-orange flex items-center justify-center flex-shrink-0 hover:bg-brand-orange hover:text-white transition-colors group/arrow">
    <ArrowIcon isAr={isAr} className="w-4 h-4 text-brand-orange group-hover/arrow:text-white transition-colors" />
  </span>
);

const SubItem = ({ text }) => (
  <li className="flex items-start">
    <span className="w-2.5 h-2.5 bg-brand-orange flex-shrink-0 inline-block me-2 mt-1"></span>
    <span className="text-sm font-medium text-brand-ink">{text}</span>
  </li>
);

export default function FourLevelsSection({ isAr }) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  return (
    <section id="levels" className="bg-brand-cream-hero py-24 md:py-32">
      <div className="container mx-auto px-6">
        {/* Section title */}
        <div className="max-w-3xl mb-14 md:mb-20 text-start">
          <p className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-4">
            {isAr ? 'من يستخدم المنصة' : 'Who uses the platform'}
          </p>
          <h2
            className="font-normal text-3xl md:text-5xl text-brand-ink leading-tight mb-5"
            style={{ fontFamily: "var(--font-ar)" }}
          >
            {isAr ? 'من يستخدم المنصة؟' : 'Who is the platform for?'}
          </h2>
          <p className="text-brand-muted text-base md:text-lg leading-relaxed">
            {isAr
              ? 'أربعة مستويات تنظيمية، ونظام بيئي واحد يربطها ببيانات موحدة وأدوات مصممة خصيصًا لكل دور.'
              : 'Four organizational levels, one connected ecosystem — unified data and tools purpose-built for every role.'}
          </p>
        </div>

        {/* Desktop: interactive hover-expand row */}
        <div className="hidden lg:flex gap-0 border border-gray-200 rounded-lg overflow-hidden bg-white divide-x divide-gray-200">
          {LEVELS.map((level, index) => {
            const isExpanded = expandedIndex === index;
            const { Icon } = level;
            return (
              <div
                key={level.key}
                onMouseEnter={() => setExpandedIndex(index)}
                onClick={() => setExpandedIndex(index)}
                className={`relative bg-white cursor-pointer transition-all duration-500 ease-in-out overflow-hidden ${
                  isExpanded ? 'flex-[3]' : 'flex-1'
                }`}
                style={{ minWidth: 0 }}
              >
                {isExpanded ? (
                  <div className="p-8 xl:p-10 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-full bg-brand-cream-hero flex items-center justify-center">
                        <Icon className="w-6 h-6 text-brand-orange" />
                      </div>
                      <ArrowBadge isAr={isAr} />
                    </div>
                    <h3
                      className="text-xl md:text-2xl text-brand-ink font-normal mb-3"
                      style={{ fontFamily: "var(--font-ar)" }}
                    >
                      {isAr ? level.title.ar : level.title.en}
                    </h3>
                    <p className="text-sm text-brand-muted leading-relaxed mb-6">
                      {isAr ? level.description.ar : level.description.en}
                    </p>
                    <ul className="space-y-3 mt-auto">
                      {(isAr ? level.items.ar : level.items.en).map((item, i) => (
                        <SubItem key={i} text={item} />
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-6 h-full flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-cream-hero flex items-center justify-center">
                      <Icon className="w-6 h-6 text-brand-orange" />
                    </div>
                    <span className="text-sm font-bold text-brand-ink whitespace-nowrap">
                      {isAr ? level.title.ar : level.title.en}
                    </span>
                    <ArrowBadge isAr={isAr} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile / tablet: always-expanded stacked cards */}
        <div className="flex lg:hidden flex-col gap-4">
          {LEVELS.map((level) => {
            const { Icon } = level;
            return (
              <div
                key={level.key}
                className="bg-white border border-gray-200 rounded-lg p-6 w-full"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-full bg-brand-cream-hero flex items-center justify-center">
                    <Icon className="w-6 h-6 text-brand-orange" />
                  </div>
                  <ArrowBadge isAr={isAr} />
                </div>
                <h3
                  className="text-xl text-brand-ink font-normal mb-2"
                  style={{ fontFamily: "var(--font-ar)" }}
                >
                  {isAr ? level.title.ar : level.title.en}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed mb-5">
                  {isAr ? level.description.ar : level.description.en}
                </p>
                <ul className="space-y-3">
                  {(isAr ? level.items.ar : level.items.en).map((item, i) => (
                    <SubItem key={i} text={item} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
