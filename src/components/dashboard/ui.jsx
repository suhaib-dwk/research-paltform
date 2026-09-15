import { Link } from 'react-router-dom';
import { ChevronDown, TrendingUp, TrendingDown, SlidersHorizontal } from 'lucide-react';

// =========================================================
// لبنات واجهة لوحات التحكم (التصميم المرجعي الجديد): بطاقات بيضاء بلا حدود
// بظل ناعم على خلفية خوخية متدرجة، شرائح اتجاه (أخضر/أحمر)، شارات حالة،
// أزرار كبسولية خوخية، وبطاقة مؤشر (KPI). تُستخدم في DashboardHome وأي
// صفحة داشبورد تريد نفس المظهر — ما عدا صفحات الوزارة (لها تصميمها).
// =========================================================

export const Card = ({ children, className = '', as: Tag = 'div', ...rest }) => (
  <Tag
    className={`bg-white dark:bg-brand-dark-card rounded-[20px] shadow-[0_12px_40px_-18px_rgba(31,26,23,0.22)] dark:shadow-none dark:border dark:border-brand-dark-border/60 transition-colors duration-300 ${className}`}
    {...rest}
  >
    {children}
  </Tag>
);

export const CardHeader = ({ title, subtitle, actions, className = '' }) => (
  <div className={`flex flex-wrap items-center justify-between gap-3 mb-5 ${className}`}>
    <div>
      <h2 className="text-gray-900 dark:text-white text-lg font-black leading-tight">{title}</h2>
      {subtitle && <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
  </div>
);

// ✅ شريحة اتجاه: قيمة موجبة → نعناعي/أخضر، سالبة → وردي/أحمر
export const TrendChip = ({ value, suffix = '%' }) => {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  const up = value >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
        up ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400'
      }`}
      dir="ltr"
    >
      <Icon className="w-3 h-3" strokeWidth={2.5} />
      {Math.abs(value).toFixed(1)}{suffix}
    </span>
  );
};

const PILL_TONES = {
  mint: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  gray: 'bg-gray-100 text-gray-600 dark:bg-brand-dark-border dark:text-gray-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  orange: 'bg-brand-orange/10 text-brand-orange',
};

export const StatusPill = ({ tone = 'gray', children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap ${PILL_TONES[tone] || PILL_TONES.gray} ${className}`}>
    {children}
  </span>
);

// ✅ زر كبسولي خوخي (نمط "Filter & Short" في المرجع)
export const PillButton = ({ children, icon: Icon = SlidersHorizontal, className = '', ...rest }) => (
  <button
    type="button"
    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold hover:bg-brand-orange hover:text-white transition-colors ${className}`}
    {...rest}
  >
    {children}
    {Icon && <Icon className="w-3.5 h-3.5" />}
  </button>
);

// ✅ قائمة منسدلة شكلية (نمط "This Month ▾")
export const SelectPill = ({ label, className = '', ...rest }) => (
  <button
    type="button"
    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gray-100 dark:bg-brand-dark-hover text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-200 dark:hover:bg-brand-dark-border transition-colors ${className}`}
    {...rest}
  >
    {label}
    <ChevronDown className="w-3.5 h-3.5" />
  </button>
);

// ✅ بطاقة مؤشر: عنوان + شريحة اتجاه على نفس السطر، رقم كبير، وصف صغير
export const KpiCard = ({ label, value, sub, trend, icon: Icon, to, delay = 0 }) => {
  const body = (
    <Card className="p-6 h-full hover:-translate-y-0.5 transition-transform duration-200" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-gray-900 dark:text-white text-[15px] font-bold leading-snug flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-brand-orange flex-shrink-0" strokeWidth={2} />}
          {label}
        </span>
        <TrendChip value={trend} />
      </div>
      <p className="text-gray-900 dark:text-white text-3xl lg:text-[34px] font-black leading-none mb-2" dir="ltr">
        <span className="block text-start">{value}</span>
      </p>
      {sub && <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">{sub}</p>}
    </Card>
  );
  return to ? <Link to={to} className="block h-full">{body}</Link> : body;
};

// ✅ صورة رمزية بالحرف الأول
export const Avatar = ({ name, size = 'md', className = '' }) => {
  const initial = (name || 'U').trim().charAt(0).toUpperCase();
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-brand-orange text-white font-black flex-shrink-0 ${sizes[size] || sizes.md} ${className}`}>
      {initial}
    </span>
  );
};

// ✅ رأس صفحة داخل الداشبورد (عنوان + وصف + إجراءات)
export const PageTitle = ({ title, subtitle, actions }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
    <div>
      <h1 className="text-gray-900 dark:text-white text-2xl lg:text-3xl font-black leading-tight">{title}</h1>
      {subtitle && <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
  </div>
);
