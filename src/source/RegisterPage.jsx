import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  GraduationCap, BookOpen, UserCheck, Microscope, Building2,
  Landmark, FlaskConical, ShieldCheck, UserCog, Briefcase,
  ArrowLeft, ArrowRight, Check, Eye, EyeOff,
  AlertCircle, Loader2, CheckCircle2, Upload, FileText, X, Info
} from 'lucide-react';
import { API_BASE_URL } from '../api';
import { getAllServices } from './S02_Services/servicesConfig';
import { RegisterCategoryChooser } from './S01_Register/RegisterCategoryChooser';

// =========================================================
// 1. الفئات
// =========================================================
const categories = [
  { key: 'undergrad', icon: GraduationCap },
  { key: 'grad',      icon: BookOpen },
  { key: 'phd',       icon: ShieldCheck },
  { key: 'faculty',    icon: UserCheck },
  { key: 'researcher', icon: Microscope },
  { key: 'university', icon: Building2 },
  { key: 'college',    icon: Building2 },
  { key: 'research_center', icon: FlaskConical },
  { key: 'ministry',   icon: Landmark },
  { key: 'employee',   icon: UserCog },
  { key: 'service_provider', icon: Briefcase },
];

const TWO_STEP_ROLES = ['employee', 'grad', 'phd', 'faculty', 'researcher'];
const PROVIDER_EXCLUDED_SLUGS = ['initial-review', 'expert-review', 'final-review', 'ai-assistant'];
const getProviderServiceOptions = () =>
  getAllServices()
    .filter(s => !PROVIDER_EXCLUDED_SLUGS.includes(s.slug))
    .map(s => ({ value: s.slug, label_ar: s.title_ar, label_en: s.title_en }));

const ROLE_PROFILE_TABLE_MAP = {
  undergrad:       'profiles_undergrad',
  grad:            'profiles_grad',
  phd:             'profiles_grad',
  faculty:         'profiles_faculty',
  researcher:      'profiles_researcher',
  university:      'profiles_entity',
  college:         'profiles_entity',
  research_center: 'profiles_entity',
  ministry:        'profiles_entity',
  employee:        'profiles_system',
  service_provider: 'profiles_service_provider',
};

const getProfileTableName = (role) => ROLE_PROFILE_TABLE_MAP[role] || null;

// =========================================================
// 2. بطاقة اختيار الفئة (بتصميم محسن)
// =========================================================
const RoleCard = ({ icon: Icon, roleKey, label, selected, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(roleKey)}
    className={`group flex flex-col items-center justify-center p-6 border-2 rounded-3xl transition-all duration-300 cursor-pointer h-full relative overflow-hidden ${
      selected === roleKey
        ? 'border-brand-orange bg-orange-50/50 shadow-[0_8px_30px_rgba(249,115,22,0.15)] scale-[1.02]'
        : 'border-gray-100 bg-white hover:border-brand-orange/30 hover:shadow-lg hover:bg-gray-50'
    }`}
  >
    {/* زخرفة خلفية خفيفة */}
    {selected === roleKey && <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>}
    
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 relative z-10 ${
      selected === roleKey
        ? 'bg-brand-orange text-white shadow-lg scale-110'
        : 'bg-gray-100 text-gray-400 group-hover:bg-brand-orange/10 group-hover:text-brand-orange'
    }`}>
      <Icon className="w-7 h-7" />
      {selected === roleKey && <Check className="absolute top-2 right-2 w-4 h-4 text-white bg-green-500 rounded-full p-0.5" />}
    </div>
    <span className={`text-xs font-bold text-center leading-snug relative z-10 ${
      selected === roleKey ? 'text-brand-orange-dark' : 'text-gray-600 group-hover:text-brand-ink'
    }`}>{label}</span>
  </button>
);

// =========================================================
// 3. مؤشر الخطوات (بتصميم متصل)
// =========================================================
const StepIndicator = ({ currentStep, steps, t }) => (
  <div className="flex items-center justify-center gap-1 sm:gap-4 mb-10 flex-wrap">
    {steps.map((labelKey, index) => {
      const isActive = currentStep === index + 1;
      const isCompleted = currentStep > index + 1;
      return (
        <div key={index} className="flex items-center gap-2 sm:gap-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 border ${
            isActive ? 'bg-brand-orange border-brand-orange text-white shadow-lg shadow-brand-orange/40 scale-110' : 
            isCompleted ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 
            'bg-white border-gray-200 text-gray-400'
          }`}>
            {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
          </div>
          <span className={`hidden sm:block text-xs font-medium transition-colors ${
            isActive ? 'text-brand-orange font-bold' : isCompleted ? 'text-gray-500' : 'text-gray-300'
          }`}>{t(labelKey)}</span>
          {index < steps.length - 1 && (
            <div className={`w-6 h-0.5 sm:w-12 rounded-full transition-colors duration-500 ${
              isCompleted ? 'bg-brand-orange' : 'bg-gray-200'
            }`} />
          )}
        </div>
      );
    })}
  </div>
);

// =========================================================
// 4. رسالة خطأ الحقل
// =========================================================
const FieldError = ({ message }) => {
  if (!message) return null;
  return (
    <div className="mt-2 flex items-center gap-1.5 text-red-500 text-xs bg-red-50 p-2 rounded-lg border border-red-100 animate-pulse">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> <span>{message}</span>
    </div>
  );
};

// =========================================================
// 5. مؤشر قوة كلمة المرور
// =========================================================
const PasswordStrength = ({ password }) => {
  const strength =
    password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password) ? 4
      : password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
        : password.length >= 6 && (/[A-Z]/.test(password) || /[0-9]/.test(password)) ? 2
          : 1;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];
  return (
    <div className="flex gap-1.5 mt-3 h-1.5">
      {[1, 2, 3, 4].map((level) => (
        <div key={level} className={`flex-1 rounded-full transition-all duration-500 ${level <= strength ? colors[strength - 1] : 'bg-gray-100'}`} />
      ))}
    </div>
  );
};

// =========================================================
// 6. مكون الحقل (بتصميم Inputs حديث)
// =========================================================
const InputField = ({ t, isAr, labelKey, name, type = 'text', colSpan = '', options = [], accept, value, onChange, onBlur, error, touched }) => {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPwd ? 'text' : 'password') : type;
  const hasError = touched && error;
  const isValid = touched && !error && value;
  
  // تصميم الحالة الأساسية
  const base = 'w-full bg-white text-gray-700 text-sm border-2 rounded-2xl px-4 py-3.5 transition-all duration-200 outline-none shadow-sm';
  
  // حالات الحقل (تركيز، خطأ، صحيح)
  const state = hasError
    ? 'border-red-200 bg-red-50/50 focus:border-red-400 focus:ring-4 focus:ring-red-100'
    : isValid
      ? 'border-emerald-200 bg-emerald-50/50 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100'
      : 'border-gray-200 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 hover:border-brand-orange/50';
      
  // ✅ يتبع اتجاه اللغة الحالية بدل LTR ثابت دائمًا — يبقى RTL في الصفحة العربية
  const dir = ['email', 'url', 'password'].includes(type) ? (isAr ? 'rtl' : 'ltr') : undefined;

  const renderControl = () => {
    if (type === 'select') {
      return (
        <select value={value || ''} onChange={(e) => onChange(name, e.target.value)} onBlur={() => onBlur(name)} className={`${base} ${state} appearance-none cursor-pointer`}>
          <option value="">{t('form.select')}</option>
          {options.map((opt, i) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const lbl = typeof opt === 'string' ? opt : opt.label;
            const displayText = lbl.startsWith('form.') || lbl.startsWith('ranks.') || lbl.startsWith('uni.') || lbl.startsWith('col.') ? t(lbl) : lbl;
            return <option key={i} value={val}>{displayText}</option>;
          })}
        </select>
      );
    }
    if (type === 'textarea') {
      return <textarea rows={3} value={value || ''} onChange={(e) => onChange(name, e.target.value)} onBlur={() => onBlur(name)} className={`${base} ${state} resize-none`} />;
    }
    if (type === 'multiselect') {
      const selected = Array.isArray(value) ? value : [];
      const toggle = (val) => {
        const next = selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val];
        onChange(name, next);
        onBlur(name);
      };
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            const label = isAr ? opt.label_ar : opt.label_en;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggle(opt.value)}
                className={`text-xs font-bold px-3 py-3 rounded-xl border-2 transition-all duration-200 text-center hover:scale-[1.02] ${
                  isSelected
                    ? 'border-brand-orange bg-brand-orange text-white shadow-md shadow-brand-orange/20'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-brand-orange/40 hover:text-brand-orange'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      );
    }
    if (type === 'file') {
      const file = value instanceof File ? value : null;
      return (
        <div>
          <input
            id={`file-${name}`}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => { onChange(name, e.target.files?.[0] || null); onBlur(name); }}
          />
          {!file ? (
            <label htmlFor={`file-${name}`} className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all duration-300 group hover:bg-gray-50 ${
              hasError ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-brand-orange'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${hasError ? 'bg-red-100 text-red-400' : 'bg-brand-orange/10 text-brand-orange group-hover:bg-brand-orange group-hover:text-white'}`}>
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-700">{t('form.choose_file')}</span>
            </label>
          ) : (
            <div className="flex items-center justify-between gap-3 border border-emerald-200 bg-emerald-50/50 rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-gray-700 truncate">{file.name}</span>
              </div>
              <button type="button" onClick={() => { onChange(name, null); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="relative">
        <input type={inputType} value={value || ''} dir={dir} onChange={(e) => onChange(name, e.target.value)} onBlur={() => onBlur(name)} className={`${base} ${isPassword ? 'pe-12' : ''} ${state}`} placeholder=" " />
        {isPassword && (
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute end-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${colSpan}`}>
      <label className="text-sm font-bold text-brand-ink mb-2 flex items-center gap-2">
        {t(labelKey)}
        {name === 'password' && <span className="text-[10px] font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{t('form.required')}</span>}
      </label>
      {renderControl()}
      {hasError && <FieldError message={error} />}
      {name === 'password' && value && <PasswordStrength password={value} />}
    </div>
  );
};

const passwordFields = [
  { labelKey: 'form.password', name: 'password', type: 'password' },
  { labelKey: 'form.confirm_password', name: 'confirm_password', type: 'password' },
];

// =========================================================
// 7. قوالب البيانات (نفس المنطق السابق)
// =========================================================
const getFormFields = (role, step, dropdowns = {}) => {
  if (role === 'employee') {
    if (step === 2) return {
      titleKey: 'sections.basic_data',
      loginEmailField: 'email',
      fields: [
        { labelKey: 'form.full_name', name: 'full_name', colSpan: 'md:col-span-2' },
        { labelKey: 'form.job_title', name: 'job_title' },
        { labelKey: 'form.department', name: 'department' },
        { labelKey: 'form.email', name: 'email', type: 'email' },
        { labelKey: 'form.phone', name: 'phone', type: 'tel' },
        ...passwordFields,
      ]
    };
  }
  if (role === 'undergrad') {
    if (step === 2) return {
      titleKey: 'sections.personal_data',
      loginEmailField: 'personal_email',
      loginEmailFallback: 'uni_email',
      fields: [
        { labelKey: 'form.full_name', name: 'full_name', colSpan: 'md:col-span-2' },
        { labelKey: 'form.uni_id', name: 'uni_id' },
        { labelKey: 'form.national_id', name: 'national_id' },
        { labelKey: 'form.uni_email', name: 'uni_email', type: 'email' },
        { labelKey: 'form.personal_email', name: 'personal_email', type: 'email' },
        { labelKey: 'form.phone', name: 'phone', type: 'tel' },
        { labelKey: 'form.gender', name: 'gender', type: 'select', options: [{ value: 'male', label: 'form.male' }, { value: 'female', label: 'form.female' }] },
        { labelKey: 'form.dob', name: 'dob', type: 'date' },
        ...passwordFields,
      ]
    };
    if (step === 3) return {
      titleKey: 'sections.academic_data',
      fields: [
        { labelKey: 'form.university', name: 'university', type: 'select', options: dropdowns.universities || [] },
        { labelKey: 'form.college', name: 'college', type: 'select', options: dropdowns.colleges || [] },
        { labelKey: 'form.department', name: 'department' },
        { labelKey: 'form.major', name: 'major' },
        { labelKey: 'form.study_year', name: 'study_year', type: 'select', options: [{ value: 'year1', label: 'form.year1' }, { value: 'year2', label: 'form.year2' }, { value: 'year3', label: 'form.year3' }, { value: 'year4', label: 'form.year4' }] },
      ]
    };
  }
  if (role === 'grad') {
    if (step === 2) return {
      titleKey: 'sections.personal_data',
      loginEmailField: 'personal_email',
      loginEmailFallback: 'uni_email',
      fields: [
        { labelKey: 'form.full_name', name: 'full_name', colSpan: 'md:col-span-2' },
        { labelKey: 'form.uni_id', name: 'uni_id' },
        { labelKey: 'form.uni_email', name: 'uni_email', type: 'email' },
        { labelKey: 'form.personal_email', name: 'personal_email', type: 'email' },
        { labelKey: 'form.phone', name: 'phone', type: 'tel' },
        { labelKey: 'form.gender', name: 'gender', type: 'select', options: [{ value: 'male', label: 'form.male' }, { value: 'female', label: 'form.female' }] },
        { labelKey: 'form.dob', name: 'dob', type: 'date' },
        ...passwordFields,
        { labelKey: 'form.university', name: 'university', type: 'select', options: dropdowns.universities || [] },
        { labelKey: 'form.college', name: 'college', type: 'select', options: dropdowns.colleges || [] },
        { labelKey: 'form.department', name: 'department' },
        { labelKey: 'form.major', name: 'major' },
      ]
    };
  }
  if (role === 'phd') {
    if (step === 2) return {
      titleKey: 'sections.personal_data',
      loginEmailField: 'personal_email',
      loginEmailFallback: 'uni_email',
      fields: [
        { labelKey: 'form.full_name', name: 'full_name', colSpan: 'md:col-span-2' },
        { labelKey: 'form.uni_id', name: 'uni_id' },
        { labelKey: 'form.uni_email', name: 'uni_email', type: 'email' },
        { labelKey: 'form.personal_email', name: 'personal_email', type: 'email' },
        { labelKey: 'form.phone', name: 'phone', type: 'tel' },
        { labelKey: 'form.gender', name: 'gender', type: 'select', options: [{ value: 'male', label: 'form.male' }, { value: 'female', label: 'form.female' }] },
        { labelKey: 'form.dob', name: 'dob', type: 'date' },
        ...passwordFields,
        { labelKey: 'form.university', name: 'university', type: 'select', options: dropdowns.universities || [] },
        { labelKey: 'form.college', name: 'college', type: 'select', options: dropdowns.colleges || [] },
        { labelKey: 'form.department', name: 'department' },
        { labelKey: 'form.major', name: 'major' },
      ]
    };
  }
  if (role === 'faculty') {
    if (step === 2) return {
      titleKey: 'sections.basic_data',
      loginEmailField: 'uni_email',
      fields: [
        { labelKey: 'form.name', name: 'name' },
        { labelKey: 'form.academic_rank', name: 'academic_rank', type: 'select', options: [{ value: 'asst_lecturer', label: 'ranks.asst_lecturer' }, { value: 'lecturer', label: 'ranks.lecturer' }, { value: 'asst_prof', label: 'ranks.asst_prof' }, { value: 'assoc_prof', label: 'ranks.assoc_prof' }, { value: 'prof', label: 'ranks.prof' }] },
        { labelKey: 'form.university', name: 'university', type: 'select', options: dropdowns.universities || [] },
        { labelKey: 'form.college', name: 'college', type: 'select', options: dropdowns.colleges || [] },
        { labelKey: 'form.department', name: 'department' },
        { labelKey: 'form.uni_email', name: 'uni_email', type: 'email' },
        { labelKey: 'form.phone', name: 'phone', type: 'tel' },
        ...passwordFields,
      ]
    };
  }
  if (role === 'researcher') {
    if (step === 2) return {
      titleKey: 'sections.basic_data',
      loginEmailField: 'email',
      fields: [
        { labelKey: 'form.full_name', name: 'full_name', colSpan: 'md:col-span-2' },
        { labelKey: 'form.email', name: 'email', type: 'email' },
        { labelKey: 'form.phone', name: 'phone', type: 'tel' },
        { labelKey: 'form.institution', name: 'institution' },
        { labelKey: 'form.department', name: 'department' },
        { labelKey: 'form.major', name: 'major' },
        ...passwordFields,
      ]
    };
  }
  if (['university', 'college', 'research_center', 'ministry'].includes(role)) {
    if (step === 2) return {
      titleKey: 'sections.entity_basic_data',
      loginEmailField: 'official_email',
      fields: [
        { labelKey: 'form.entity_name', name: 'entity_name', colSpan: 'md:col-span-2' },
        // ✅ الكلية تابعة لجامعة: تختار جامعتها الأم عند التسجيل (يُحفظ في
        // profiles_entity.parent_university_id ← ref_universities.id)
        ...(role === 'college' ? [{ labelKey: 'form.parent_university', name: 'parent_university_id', type: 'select', options: dropdowns.universities || [], colSpan: 'md:col-span-2' }] : []),
        { labelKey: 'form.entity_type', name: 'entity_type', type: 'select', options: [{ value: 'gov', label: 'form.gov' }, { value: 'private', label: 'form.private' }, { value: 'international', label: 'form.international' }] },
        { labelKey: 'form.website', name: 'website', type: 'url' },
        { labelKey: 'form.official_email', name: 'official_email', type: 'email' },
        { labelKey: 'form.phone', name: 'phone', type: 'tel' },
        { labelKey: 'form.address', name: 'address', colSpan: 'md:col-span-2' },
        ...passwordFields,
      ]
    };
    if (step === 3) return {
      titleKey: 'sections.admin_details',
      fields: [
        { labelKey: 'form.director_name', name: 'director_name' },
        { labelKey: 'form.position', name: 'position' },
        { labelKey: 'form.director_phone', name: 'director_phone', type: 'tel' },
        { labelKey: 'form.director_email', name: 'director_email', type: 'email' },
        { labelKey: 'form.additional_notes', name: 'additional_notes', type: 'textarea', colSpan: 'md:col-span-2' },
      ]
    };
  }
  if (role === 'service_provider') {
    if (step === 2) return {
      titleKey: 'sections.basic_data',
      loginEmailField: 'email',
      fields: [
        { labelKey: 'form.full_name', name: 'full_name', colSpan: 'md:col-span-2' },
        { labelKey: 'form.email', name: 'email', type: 'email' },
        { labelKey: 'form.phone', name: 'phone', type: 'tel' },
        ...passwordFields,
      ]
    };
    if (step === 3) return {
      titleKey: 'sections.provider_details',
      fields: [
        { labelKey: 'form.provider_services', name: 'service_slugs', type: 'multiselect', colSpan: 'md:col-span-2', options: getProviderServiceOptions() },
        { labelKey: 'form.qualifications', name: 'qualifications', type: 'textarea', colSpan: 'md:col-span-2' },
        { labelKey: 'form.bio', name: 'bio', type: 'textarea', colSpan: 'md:col-span-2' },
        { labelKey: 'form.cv_file', name: 'cv', type: 'file', accept: '.pdf,.doc,.docx', colSpan: 'md:col-span-2' },
      ]
    };
  }
  return { titleKey: '', fields: [] };
};

// =========================================================
// 8. المكون الرئيسي (بتصميم محسن)
// =========================================================
const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false; // مقارنة بادئة اللغة (يدعم ar-IQ ونحوها)
  const isAr = i18n.language === 'ar';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

  // ✅ الدور يأتي من الرابط (/register?role=undergrad) عبر صفحة الفئة التعريفية —
  // فيُفتح نموذج هذا الدور مباشرة بلا عرض كل أنواع الحسابات. بدون دور صالح
  // تُعرض الفئات الثلاث الرئيسية فقط.
  const [searchParams] = useSearchParams();
  // نص الجانب الخاص بمقدّمي الخدمة وفريق التشغيل (Source.docx)
  const STAFF_ROLES = ['service_provider', 'employee'];
  const navigate = useNavigate();
  const roleParam = searchParams.get('role');
  const presetRole = categories.some((c) => c.key === roleParam) ? roleParam : null;
  const [selectedRole, setSelectedRole] = useState(presetRole);
  const [currentStep, setCurrentStep] = useState(presetRole ? 2 : 1);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const [universities, setUniversities] = useState([]);
  const [colleges, setColleges] = useState([]);

  const formatOptions = (data) => {
    if (!data) return [];
    const lang = i18n.language === 'ar' ? 'name_ar' : 'name_en';
    return data.map(item => ({ value: String(item.id), label: item[lang] }));
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_dropdowns.php?type=universities`)
      .then(res => res.json())
      .then(res => { if (res.status === 'success') setUniversities(formatOptions(res.data)); })
      .catch(() => { });
  }, [i18n.language]);

  const totalSteps = selectedRole && TWO_STEP_ROLES.includes(selectedRole) ? 2 : (selectedRole ? 3 : 1);
  const stepLabels = ['steps.category', 'steps.basic', 'steps.details'];

  const validateField = (name, value, type) => {
    if (type === 'number') { if (value === '' || value === null || value === undefined) return t('validation.required'); return ''; }
    if (type === 'file') { if (!value) return t('validation.required'); return ''; }
    if (type === 'multiselect') { if (!Array.isArray(value) || value.length === 0) return t('validation.required'); return ''; }
    if (name === 'qualifications' || name === 'bio') return '';
    if (!value || (typeof value === 'string' && !value.trim())) return t('validation.required');
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t('validation.invalid_email');
    if (name === 'password' && value.length < 8) return t('validation.password_min');
    if (type === 'url' && !/^https?:\/\/.+/.test(value)) return t('validation.invalid_url');
    return '';
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setApiError(null);
    if (touched[name]) {
      const fieldDef = getCurrentFields().find(f => f.name === name);
      setErrors(prev => ({ ...prev, [name]: validateField(name, value, fieldDef?.type || 'text') }));
    }
    if (name === 'university') {
      setColleges([]);
      setFormData(prev => ({ ...prev, college: '' }));
      if (value) {
        fetch(`${API_BASE_URL}/get_dropdowns.php?type=colleges&university_id=${value}`)
          .then(res => res.json())
          .then(res => { if (res.status === 'success') setColleges(formatOptions(res.data)); })
          .catch(() => { });
      }
    }
  };

  const handleFieldBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldDef = getCurrentFields().find(f => f.name === name);
    const value = fieldDef?.type === 'file' || fieldDef?.type === 'multiselect' ? formData[name] : (formData[name] || '');
    setErrors(prev => ({ ...prev, [name]: validateField(name, value, fieldDef?.type || 'text') }));
  };

  const getCurrentFields = () => {
    if (!selectedRole || currentStep === 1) return [];
    const dropdowns = { universities, colleges };
    return getFormFields(selectedRole, currentStep, dropdowns).fields;
  };

  const validateCurrentStep = () => {
    const fields = getCurrentFields();
    const newErrors = {};
    const newTouched = {};
    fields.forEach(field => {
      newTouched[field.name] = true;
      const value = field.type === 'file' || field.type === 'multiselect' ? formData[field.name] : (formData[field.name] || '');
      const err = validateField(field.name, value, field.type || 'text');
      if (err) newErrors[field.name] = err;
    });
    if (formData.password && formData.confirm_password && formData.password !== formData.confirm_password) newErrors.confirm_password = t('validation.password_mismatch');
    if (!formData.password && formData.confirm_password) newErrors.password = t('validation.required');
    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const getLoginEmail = () => {
    if (!selectedRole) return '';
    const step2 = getFormFields(selectedRole, 2);
    const email = formData[step2.loginEmailField]?.trim();
    if (email) return email;
    return formData[step2.loginEmailFallback]?.trim() || '';
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    if (currentStep < totalSteps) { setCurrentStep(prev => prev + 1); setApiError(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else handleSubmit();
  };

  const handleBack = () => {
    // ✅ مع دور محدد من الرابط، الرجوع من الخطوة الأولى يعيد إلى صفحة الفئة (لا إلى شبكة الأدوار)
    if (currentStep === 2 && presetRole) { if (window.history.length > 1) navigate(-1); else navigate('/login'); return; }
    if (currentStep === 2) setCurrentStep(1);
    else if (currentStep > 2) setCurrentStep(prev => prev - 1);
    setApiError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    const loginEmail = getLoginEmail();
    if (!loginEmail) { setApiError(t('validation.login_email_missing')); return; }
    if (!formData.password || formData.password.length < 8) { setApiError(t('validation.password_min')); return; }
    if (formData.password !== formData.confirm_password) { setApiError(t('validation.password_mismatch')); return; }

    const { password, confirm_password, cv, service_slugs, ...profileData } = formData;
    const profileTable = getProfileTableName(selectedRole);
    if (!profileTable) { setApiError(t('errors.registration_failed')); return; }

    if (selectedRole === 'grad') profileData.degree = 'master';
    if (selectedRole === 'phd')  profileData.degree = 'phd';

    const fd = new FormData();
    fd.append('role', selectedRole);
    fd.append('email', loginEmail);
    fd.append('password', password);
    fd.append('profile_table', profileTable);
    fd.append('profile', JSON.stringify(profileData));
    if (selectedRole === 'service_provider') {
      if (cv instanceof File) fd.append('cv', cv);
      fd.append('service_slugs', JSON.stringify(Array.isArray(service_slugs) ? service_slugs : []));
    }

    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/register.php`, { method: 'POST', body: fd });
      const result = await res.json();
      if (result.debug) {
        console.error('PHP DEBUG:', result.debug, 'FILE:', result.file, 'LINE:', result.line);
        setApiError(result.debug);
      } else if (result.status === 'success') {
        setRegistrationSuccess(true);
      } else {
        setApiError(result.message || t('errors.registration_failed'));
      }
    } catch (err) {
      console.error('FETCH ERROR:', err.message);
      setApiError(t('errors.server_connection'));
    } finally { setLoading(false); }
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setCurrentStep(1);
    setFormData({});
    setErrors({});
    setTouched({});
    setApiError(null);
    setColleges([]);
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-brand-cream-hero flex flex-col items-center justify-center px-4 py-12">
        <Link to="/" className="mb-8">
          <img src="/logo/logo1.png" alt="SOURCE" className="h-24 w-auto object-contain" />
        </Link>
        <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-12 text-center animate-[scale-in_0.5s_ease-out]">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-200">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-brand-ink mb-4">{t('register.success_title')}</h2>
          <p className="text-base text-gray-600 leading-relaxed mb-10 max-w-sm mx-auto">{t('register.success_desc')}</p>
          <Link to="/login" className="inline-flex items-center gap-3 bg-brand-ink text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-brand-orange transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            {t('register.go_to_login')} <ArrowLeft className={`w-5 h-5 ${isRTL ? '' : 'rotate-180'}`} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream-hero flex flex-col lg:flex-row overflow-hidden">
      {/* عمود الصورة الجانبي */}
      <div className="hidden lg:flex relative w-1/2 bg-brand-ink items-center justify-center p-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-ink via-brand-ink/80 to-brand-orange/20"></div>
        </div>
        <div className="relative z-10 text-white max-w-lg">
          <h1 className="text-5xl font-black leading-tight mb-6 drop-shadow-2xl">
            {t(STAFF_ROLES.includes(selectedRole) ? 'register.side_title_staff' : 'register.side_title')}
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed font-light">
            {t(STAFF_ROLES.includes(selectedRole) ? 'register.side_desc_staff' : 'register.side_desc')}
          </p>
        </div>
      </div>

      {/* عمود النموذج */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-xl relative">

          {/* ✅ الشعار فوق الفورم (الصفحة بدون هيدر/فوتر) */}
          <div className="flex justify-center mb-8">
            <Link to="/">
              <img src="/logo/logo1.png" alt="SOURCE" className="h-24 w-auto object-contain" />
            </Link>
          </div>

          {/* مؤشر الخطوات */}
          {selectedRole && currentStep > 1 && (
            <div className="mb-8">
               <StepIndicator currentStep={currentStep - 1} steps={stepLabels.slice(1, totalSteps)} t={t} />
            </div>
          )}

          {/* حاوية البطاقة الرئيسية */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white p-8 md:p-12 relative overflow-hidden">
            {/* زخرفة خلفية خفيفة */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-orange to-orange-400"></div>

            {currentStep === 1 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-black text-brand-ink mb-3">{t('register.title')}</h2>
                  <p className="text-brand-muted text-sm">{isAr ? 'اختر فئتك لتقرأ ما تقدمه لك المنصة، ثم أنشئ حسابك من صفحتها.' : 'Pick your category to see what the platform offers you, then create your account from its page.'}</p>
                </div>

                {/* ✅ ثلاث فئات رئيسية فقط — كل فئة تفتح صفحتها التعريفية ومنها نموذج الدور */}
                <RegisterCategoryChooser compact />

                <p className="text-center text-sm text-gray-500 mt-8">
                  <Link to="/login" className="text-brand-orange font-bold hover:text-brand-orange-dark transition-colors">
                    {t('register.go_to_login')}
                  </Link>
                </p>
              </div>
            )}

            {currentStep > 1 && selectedRole && (
              <div>
                {currentStep === 2 && (
                  <button onClick={handleBack} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-brand-orange mb-8 group transition-colors">
                    <BackArrow className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{t('register.back_to_roles')}
                  </button>
                )}

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center shadow-sm">
                    {(() => { const Icon = categories.find(c => c.key === selectedRole)?.icon || UserCheck; return <Icon className="w-6 h-6" />; })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-brand-ink">{t('register.as')} <span className="text-brand-orange">{t(`roles.${selectedRole}`)}</span></h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400 font-medium px-2 py-1 bg-gray-100 rounded-md border border-gray-200">
                        {t(getFormFields(selectedRole, currentStep).titleKey)}
                      </span>
                    </div>
                  </div>
                </div>

                {apiError && (
                  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100 animate-[shake_0.5s_ease-in-out]">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />{apiError}
                  </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getCurrentFields().map((field) => (
                      <InputField key={field.name} t={t} isAr={isAr} labelKey={field.labelKey} name={field.name} type={field.type || 'text'} colSpan={field.colSpan || ''} options={field.options || []} accept={field.accept} value={formData[field.name]} onChange={handleFieldChange} onBlur={handleFieldBlur} error={errors[field.name]} touched={touched[field.name]} />
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-gray-100 mt-8">
                    <button type="button" onClick={handleBack} className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 hover:text-brand-ink transition-all">
                      <BackArrow className="w-4 h-4" /> {t('register.prev')}
                    </button>
                    <button type="submit" disabled={loading} className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-brand-orange to-orange-500 text-white rounded-full text-sm font-bold hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-1">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          {currentStep === totalSteps ? t('register.submit') : t('register.next_step')} 
                          {currentStep < totalSteps ? <ForwardArrow className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
