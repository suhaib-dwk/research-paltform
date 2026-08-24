import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, UserCheck, Microscope, Building2,
  Landmark, FlaskConical, ShieldCheck, UserCog,
  ArrowLeft, ArrowRight, Check, Eye, EyeOff,
  AlertCircle, Loader2, CheckCircle2
} from 'lucide-react';
import { API_BASE_URL } from '../api';

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
];

// ✅ الأدوار ذات الخطوتين فقط
const TWO_STEP_ROLES = ['employee', 'grad', 'phd', 'faculty', 'researcher'];

// =========================================================
// 2. خريطة ربط كل دور بجدول الملف الشخصي
// =========================================================
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
};

const getProfileTableName = (role) => ROLE_PROFILE_TABLE_MAP[role] || null;

// =========================================================
// 3. بطاقة اختيار الفئة
// =========================================================
const RoleCard = ({ icon: Icon, roleKey, label, selected, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(roleKey)}
    className={`group flex flex-col items-center justify-center p-5 border-2 rounded-2xl transition-all duration-300 cursor-pointer h-full
      ${selected === roleKey
        ? 'border-[#c8a44e] bg-[#c8a44e]/10 shadow-lg shadow-[#c8a44e]/15 scale-[1.02]'
        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
      }`}
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${selected === roleKey
        ? 'bg-gradient-to-br from-[#c8a44e] to-[#e6c96e] text-[#0a1628] shadow-md shadow-[#c8a44e]/30'
        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
      }`}>
      <Icon className="w-6 h-6" />
    </div>
    <span className={`text-xs font-bold text-center leading-tight ${selected === roleKey ? 'text-[#a8872e]' : 'text-gray-600'}`}>{label}</span>
  </button>
);

// =========================================================
// 4. مؤشر الخطوات
// =========================================================
const StepIndicator = ({ currentStep, steps, t }) => (
  <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
    {steps.map((labelKey, index) => (
      <div key={index} className="flex items-center gap-2">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${currentStep === index + 1
            ? 'bg-[#0a1628] text-white shadow-lg shadow-[#c8a44e]/10'
            : currentStep > index + 1
              ? 'bg-[#c8a44e]/15 text-[#c8a44e]'
              : 'bg-gray-100 text-gray-400'
          }`}>
          {currentStep > index + 1 ? <Check className="w-3.5 h-3.5" /> : index + 1}
          <span className="hidden sm:inline">{t(labelKey)}</span>
        </div>
        {index < steps.length - 1 && (
          <div className={`w-6 h-[2px] rounded-full transition-colors duration-300 ${currentStep > index + 1 ? 'bg-[#c8a44e]/40' : 'bg-gray-200'}`} />
        )}
      </div>
    ))}
  </div>
);

// =========================================================
// 5. رسالة خطأ الحقل
// =========================================================
const FieldError = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{message}
    </p>
  );
};

// =========================================================
// 6. مؤشر قوة كلمة المرور
// =========================================================
const PasswordStrength = ({ password }) => {
  const strength =
    password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password) ? 4
      : password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
        : password.length >= 6 && (/[A-Z]/.test(password) || /[0-9]/.test(password)) ? 2
          : 1;
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400'];
  return (
    <div className="flex gap-1.5 mt-2">
      {[1, 2, 3, 4].map((level) => (
        <div key={level} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${level <= strength ? colors[strength - 1] : 'bg-gray-100'}`} />
      ))}
    </div>
  );
};

// =========================================================
// 7. مكون الحقل
// =========================================================
const InputField = ({ t, labelKey, name, type = 'text', colSpan = '', options = [], value, onChange, onBlur, error, touched }) => {
  const [showPwd, setShowPwd] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPwd ? 'text' : 'password') : type;
  const hasError = touched && error;
  const isValid = touched && !error && value;
  const base = 'w-full bg-white border text-gray-700 text-sm rounded-xl px-4 py-3.5 transition-all duration-200 outline-none';
  const state = hasError
    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/30'
    : isValid
      ? 'border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-emerald-50/30'
      : 'border-gray-200 focus:border-[#c8a44e] focus:ring-2 focus:ring-[#c8a44e]/20';
  const dir = ['email', 'url', 'password'].includes(type) ? 'ltr' : undefined;

  const renderControl = () => {
    if (type === 'select') {
      return (
        <select value={value || ''} onChange={(e) => onChange(name, e.target.value)} onBlur={() => onBlur(name)} className={`${base} ${state} appearance-none`}>
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
    return (
      <div className="relative">
        <input type={inputType} value={value || ''} dir={dir} onChange={(e) => onChange(name, e.target.value)} onBlur={() => onBlur(name)} className={`${base} ${isPassword ? 'pe-12' : ''} ${state}`} />
        {isPassword && (
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
            {showPwd ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col ${colSpan}`}>
      <label className="text-sm font-semibold text-gray-600 mb-1.5">{t(labelKey)}</label>
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
// 8. قوالب البيانات
// =========================================================
const getFormFields = (role, step, dropdowns = {}) => {

  // ✅ موظف — خطوتين
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

  // ✅ طالب بكالوريوس — 3 خطوات
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

  // ✅ طالب ماجستير — خطوتين (الأكاديمي دُمج مع الشخصي)
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

  // ✅ طالب دكتوراه — خطوتين (نفس ماجستير)
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

  // ✅ عضو هيئة تدريسية — خطوتين
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

  // ✅ باحث — خطوتين
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

  // ✅ الكيانات — 3 خطوات
  if (['university', 'college', 'research_center', 'ministry'].includes(role)) {
    if (step === 2) return {
      titleKey: 'sections.entity_basic_data',
      loginEmailField: 'official_email',
      fields: [
        { labelKey: 'form.entity_name', name: 'entity_name', colSpan: 'md:col-span-2' },
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

  return { titleKey: '', fields: [] };
};

// =========================================================
// 9. المكون الرئيسي
// =========================================================
const RegisterPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

  const [selectedRole, setSelectedRole] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
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

  // ✅ عدد الخطوات ديناميكي
  const totalSteps = selectedRole && TWO_STEP_ROLES.includes(selectedRole) ? 2 : (selectedRole ? 3 : 1);
  const stepLabels = ['steps.category', 'steps.basic', 'steps.details'];

  const validateField = (name, value, type) => {
    if (type === 'number') { if (value === '' || value === null || value === undefined) return t('validation.required'); return ''; }
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
    const value = formData[name] || '';
    const fieldDef = getCurrentFields().find(f => f.name === name);
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
      const value = formData[field.name] || '';
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

    const { password, confirm_password, ...profileData } = formData;
    const profileTable = getProfileTableName(selectedRole);
    if (!profileTable) { setApiError(t('errors.registration_failed')); return; }

    if (selectedRole === 'grad') profileData.degree = 'master';
    if (selectedRole === 'phd')  profileData.degree = 'phd';

    const payload = { role: selectedRole, email: loginEmail, password, profile_table: profileTable, profile: profileData };
    const encodedPayload = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));

    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/register.php`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: encodedPayload });
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
      <div className="min-h-screen bg-[#f4f6fb] flex flex-col relative overflow-hidden">
        <div className="h-20" />
        <div className="absolute top-1/3 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#c8a44e]/[0.06] rounded-full blur-[120px] pointer-events-none" />
        <div className="flex-grow flex items-center justify-center px-4 relative z-10">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-sm shadow-black/[0.03] border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10" /></div>
            <h2 className="text-2xl font-black text-[#0a1628] mb-3">{t('register.success_title')}</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-8">{t('register.success_desc')}</p>
            <Link to="/login" className="inline-flex items-center gap-2 bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all duration-300">
              {t('register.go_to_login')} <ArrowLeft className={`w-4 h-4 ${isRTL ? '' : 'rotate-180'}`} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col relative overflow-hidden">
      <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-[#c8a44e]/[0.04] rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 end-0 w-[400px] h-[400px] bg-[#0a1628]/[0.03] rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="h-20" />
      <div className="flex-grow flex items-start justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-5xl">
          {selectedRole && currentStep > 1 && totalSteps > 2 && (
            <StepIndicator currentStep={currentStep - 1} steps={stepLabels.slice(1, totalSteps - 1)} t={t} />
          )}
          <div className="bg-white rounded-3xl shadow-sm shadow-black/[0.03] border border-gray-100 p-8 md:p-12">
            {currentStep === 1 && (
              <div>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-[#0a1628] mb-3">{t('register.title')}</h2>
                  <p className="text-gray-400">{t('register.subtitle')}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <RoleCard key={cat.key} icon={cat.icon} roleKey={cat.key} label={t(`roles.${cat.key}`)} selected={selectedRole} onClick={handleRoleSelect} />
                  ))}
                </div>
                <div className="mt-10 flex justify-end">
                  <button onClick={handleNext} disabled={!selectedRole} className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${selectedRole ? 'bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] hover:shadow-lg hover:shadow-[#c8a44e]/25' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                    {t('register.next')} <ForwardArrow className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {currentStep > 1 && selectedRole && (
              <div>
                {currentStep === 2 && (
                  <button onClick={handleBack} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#0a1628] transition-colors mb-6 group">
                    <BackArrow className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />{t('register.back_to_roles')}
                  </button>
                )}
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-[#c8a44e]/10 text-[#c8a44e] flex items-center justify-center">
                    {(() => { const Icon = categories.find(c => c.key === selectedRole)?.icon || UserCheck; return <Icon className="w-5 h-5" />; })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#0a1628]">{t('register.as')} <span className="text-[#c8a44e]">{t(`roles.${selectedRole}`)}</span></h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">{t(getFormFields(selectedRole, currentStep).titleKey)}</p>
                  </div>
                </div>
                {apiError && (
                  <div className="mb-6 p-3.5 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-sm font-medium border border-red-100">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />{apiError}
                  </div>
                )}
                <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {getCurrentFields().map((field) => (
                      <InputField key={field.name} t={t} labelKey={field.labelKey} name={field.name} type={field.type || 'text'} colSpan={field.colSpan || ''} options={field.options || []} value={formData[field.name]} onChange={handleFieldChange} onBlur={handleFieldBlur} error={errors[field.name]} touched={touched[field.name]} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-8">
                    <button type="button" onClick={handleBack} className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <BackArrow className="w-4 h-4" /> {t('register.prev')}
                    </button>
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>{currentStep === totalSteps ? t('register.submit') : t('register.next_step')} {currentStep < totalSteps ? <ForwardArrow className="w-4 h-4" /> : <Check className="w-4 h-4" />}</>
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