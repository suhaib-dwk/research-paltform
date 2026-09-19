import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Landmark, Building2, GraduationCap, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// =========================================================
// اختيار فئة التسجيل — ثلاث فئات رئيسية فقط (الوزارة / الجامعات / الباحثون
// والطلبة) بدل عرض كل أنواع الحسابات دفعة واحدة. كل فئة تفتح صفحتها
// التعريفية العامة (/audience/…) ليقرأ المستخدم ما تقدمه له المنصة، ومن
// هناك زر "إنشاء حساب" يفتح نموذج التسجيل الخاص بدوره (/register?role=…).
// يُستخدم كنافذة منبثقة في صفحة الدخول، وكمحتوى مباشر في /register بلا دور.
// =========================================================

export const REGISTER_CATEGORIES = [
  { key: 'ministry', icon: Landmark, to: '/audience/ministry', ar: 'الوزارة', en: 'Ministry', desc_ar: 'لوحات وطنية، أولويات بحثية، شراكات، وفرص تمويل.', desc_en: 'National dashboards, research priorities, partnerships and funding.' },
  { key: 'university', icon: Building2, to: '/audience/university', ar: 'الجامعات والمؤسسات', en: 'Universities & institutions', desc_ar: 'جامعة، كلية، أو مركز بحثي: الجودة والاعتماد والتصنيف.', desc_en: 'University, college or research centre: quality, accreditation and rankings.' },
  { key: 'researchers', icon: GraduationCap, to: '/audience/undergrad', ar: 'الباحثون والطلبة', en: 'Researchers & students', desc_ar: 'من طالب البكالوريوس إلى عضو هيئة التدريس: خدمات البحث والنشر.', desc_en: 'From undergraduate to faculty: research and publication services.' },
];

export const RegisterCategoryChooser = ({ onPick, compact = false }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.toLowerCase().startsWith('ar') ?? false;
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  return (
    <div className={`grid gap-3 ${compact ? '' : 'sm:grid-cols-3'}`}>
      {REGISTER_CATEGORIES.map((c) => (
        <Link
          key={c.key}
          to={c.to}
          onClick={onPick}
          className="group flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200 bg-white hover:border-brand-orange hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
        >
          <span className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0 group-hover:bg-brand-orange group-hover:text-white transition-colors">
            <c.icon className="w-6 h-6" strokeWidth={1.75} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="flex items-center justify-between gap-2">
              <span className="text-base font-black text-brand-ink">{isAr ? c.ar : c.en}</span>
              <ArrowIcon className="w-4 h-4 text-gray-300 group-hover:text-brand-orange transition-colors flex-shrink-0" />
            </span>
            <span className="block text-xs leading-relaxed text-brand-muted mt-1">{isAr ? c.desc_ar : c.desc_en}</span>
          </span>
        </Link>
      ))}
    </div>
  );
};

// ── النافذة المنبثقة (صفحة الدخول) ──
const RegisterCategoryModal = ({ open, onClose }) => {
  const { i18n } = useTranslation();
  const isAr = i18n.language?.toLowerCase().startsWith('ar') ?? false;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="w-full max-w-lg bg-white rounded-[28px] shadow-2xl p-7 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={onClose} aria-label="close" className="absolute top-5 end-5 w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-2xl font-black text-brand-ink mb-1.5">{isAr ? 'من أنت في منظومة البحث؟' : 'Who are you in the research ecosystem?'}</h2>
            <p className="text-sm text-brand-muted mb-6">{isAr ? 'اختر فئتك لتقرأ ما تقدمه لك المنصة، ثم أنشئ حسابك من هناك.' : 'Pick your category to see what the platform offers you, then create your account from there.'}</p>
            <RegisterCategoryChooser compact onPick={onClose} />
            <p className="text-center text-xs text-brand-muted mt-5">
              {isAr ? 'موظف في المنصة أو مقدّم خدمة؟' : 'Platform staff or a service provider?'}{' '}
              <Link to="/staff" onClick={onClose} className="text-brand-orange font-bold hover:text-brand-orange-dark">{isAr ? 'التسجيل من هنا' : 'Register here'}</Link>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterCategoryModal;
