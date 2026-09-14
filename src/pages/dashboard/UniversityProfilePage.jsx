import { useState, useEffect, useCallback } from 'react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';
import {
    Building2, MapPin, School, Layers, FlaskConical, Trash2, Plus,
    Save, Check, Loader2, XCircle, Sparkles, Info, AlertTriangle, TrendingUp,
} from 'lucide-react';

// =========================================================
// أدوات مساعدة
// =========================================================
let tempIdCounter = 0;
const newTempId = () => `tmp_${Date.now()}_${tempIdCounter++}`;

const textareaToArray = (text) =>
    text.split('\n').map((s) => s.trim()).filter(Boolean);

const arrayToTextarea = (arr) => (Array.isArray(arr) ? arr.join('\n') : '');

const inputCls = "w-full bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-[#e8623a] transition-colors";
const labelCls = "text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block";
const cardCls = "bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 p-6";

const statusBadge = (status, isAr) => {
    const map = {
        met: { label: isAr ? 'مُحقَّق' : 'Met', cls: 'bg-emerald-50 dark:bg-emerald-900/15 text-emerald-600 dark:text-emerald-400' },
        partial: { label: isAr ? 'جزئي' : 'Partial', cls: 'bg-amber-50 dark:bg-amber-900/15 text-amber-600 dark:text-amber-400' },
        not_met: { label: isAr ? 'غير مُحقَّق' : 'Not Met', cls: 'bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400' },
    };
    return map[status] || map.not_met;
};

// =========================================================
// صف قابل للحذف عام (يُستخدم للحرم/الكليات/الأقسام/المراكز البحثية)
// =========================================================
const RowRemoveButton = ({ onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/15 transition-colors flex-shrink-0"
    >
        <Trash2 className="w-4 h-4" />
    </button>
);

const AddButton = ({ onClick, label }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-1.5 text-xs font-bold text-[#e8623a] hover:text-[#d4502a] transition-colors"
    >
        <Plus className="w-3.5 h-3.5" /> {label}
    </button>
);

// =========================================================
// المكون الرئيسي
// =========================================================
const UniversityProfilePage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [loadError, setLoadError] = useState(null);

    const [entityName, setEntityName] = useState('');
    const [form, setForm] = useState({
        arabic_name: '', country: '', type: '', official_domains: '',
        research_strategy: '', profile_status: 'draft',
    });
    const [priorityAreasText, setPriorityAreasText] = useState('');
    const [researchGoalsText, setResearchGoalsText] = useState('');

    const [campuses, setCampuses] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [researchCenters, setResearchCenters] = useState([]);

    const [assessment, setAssessment] = useState(null);
    const [assessmentLoading, setAssessmentLoading] = useState(false);
    const [assessmentError, setAssessmentError] = useState(null);

    // ===== تحميل الملف + آخر تقييم محفوظ (بلا استدعاء ذكاء اصطناعي جديد) =====
    const loadProfile = useCallback(async () => {
        if (!entityId) return;
        setLoading(true);
        setLoadError(null);
        try {
            const [profRes, histRes] = await Promise.all([
                fetch(`${API_BASE_URL}/get_university_profile.php?user_id=${entityId}`).then((r) => r.json()),
                fetch(`${API_BASE_URL}/get_readiness_assessment_history.php?user_id=${entityId}`).then((r) => r.json()).catch(() => null),
            ]);

            if (profRes.status !== 'success') {
                setLoadError(profRes.message || (isAr ? 'تعذّر تحميل ملف الجامعة' : 'Failed to load university profile'));
                setLoading(false);
                return;
            }

            const d = profRes.data;
            setEntityName(d.entity_name || '');
            setForm({
                arabic_name: d.arabic_name || '',
                country: d.country || '',
                type: d.type || '',
                official_domains: d.official_domains || '',
                research_strategy: d.research_strategy || '',
                profile_status: d.profile_status || 'draft',
            });
            setPriorityAreasText(arrayToTextarea(d.priority_areas));
            setResearchGoalsText(arrayToTextarea(d.research_goals));

            setCampuses((d.campuses || []).map((c) => ({ ...c, tempId: c.id })));
            setColleges((d.colleges || []).map((c) => ({ ...c, tempId: c.id })));
            setDepartments((d.departments || []).map((c) => ({ ...c, tempId: c.id })));
            setResearchCenters((d.research_centers || []).map((c) => ({ ...c, tempId: c.id, research_areas_text: arrayToTextarea(c.research_areas) })));

            if (histRes && histRes.status === 'success' && histRes.data) {
                setAssessment(histRes.data);
            }
        } catch (err) {
            setLoadError(isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    }, [entityId, isAr]);

    useEffect(() => { loadProfile(); }, [loadProfile]);

    // ===== حفظ الملف =====
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const payload = {
                user_id: entityId,
                ...form,
                priority_areas: textareaToArray(priorityAreasText),
                research_goals: textareaToArray(researchGoalsText),
                campuses: campuses.map((c) => ({ id: c.tempId, name: c.name, location: c.location })),
                colleges: colleges.map((c) => ({ id: c.tempId, campus_id: c.campus_id, name: c.name })),
                departments: departments.map((c) => ({ id: c.tempId, college_id: c.college_id, name: c.name })),
                research_centers: researchCenters.map((c) => ({
                    id: c.tempId,
                    parent_unit_type: c.parent_unit_type || 'university',
                    parent_unit_id: c.parent_unit_id || null,
                    name: c.name,
                    research_areas: textareaToArray(c.research_areas_text || ''),
                })),
            };

            const res = await fetch(`${API_BASE_URL}/save_university_profile.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const result = await res.json();

            if (result.status === 'success') {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
                await loadProfile(); // إعادة التحميل لجلب المعرّفات الحقيقية الجديدة من قاعدة البيانات
            } else {
                setError(isAr ? 'فشل حفظ البيانات' : 'Failed to save data');
            }
        } catch (err) {
            setError(isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setSaving(false);
        }
    };

    // ===== تشغيل تقييم الجاهزية بالذكاء الاصطناعي =====
    const runAssessment = async () => {
        setAssessmentLoading(true);
        setAssessmentError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/ai_readiness_assessment.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: entityId }),
            });
            const result = await res.json();
            if (result.status === 'success') {
                setAssessment(result.data);
            } else if (result.message === 'ai_not_configured') {
                setAssessmentError({ type: 'info', text: isAr ? 'ميزة الذكاء الاصطناعي غير مُفعّلة بعد على هذا الخادم (لم يُضبط مفتاح OpenRouter).' : 'AI features are not configured on this server yet (OpenRouter key missing).' });
            } else {
                setAssessmentError({ type: 'error', text: isAr ? 'تعذّر إجراء تقييم الجاهزية، حاول مرة أخرى لاحقًا.' : 'Failed to run readiness assessment, please try again later.' });
            }
        } catch (err) {
            setAssessmentError({ type: 'error', text: isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server' });
        } finally {
            setAssessmentLoading(false);
        }
    };

    // ===== دوال إدارة الصفوف الفرعية =====
    const addCampus = () => setCampuses((p) => [...p, { tempId: newTempId(), name: '', location: '' }]);
    const removeCampus = (tempId) => setCampuses((p) => p.filter((c) => c.tempId !== tempId));
    const updateCampus = (tempId, field, value) => setCampuses((p) => p.map((c) => (c.tempId === tempId ? { ...c, [field]: value } : c)));

    const addCollege = () => setColleges((p) => [...p, { tempId: newTempId(), campus_id: '', name: '' }]);
    const removeCollege = (tempId) => setColleges((p) => p.filter((c) => c.tempId !== tempId));
    const updateCollege = (tempId, field, value) => setColleges((p) => p.map((c) => (c.tempId === tempId ? { ...c, [field]: value } : c)));

    const addDepartment = () => setDepartments((p) => [...p, { tempId: newTempId(), college_id: '', name: '' }]);
    const removeDepartment = (tempId) => setDepartments((p) => p.filter((c) => c.tempId !== tempId));
    const updateDepartment = (tempId, field, value) => setDepartments((p) => p.map((c) => (c.tempId === tempId ? { ...c, [field]: value } : c)));

    const addResearchCenter = () => setResearchCenters((p) => [...p, { tempId: newTempId(), parent_unit_type: 'university', parent_unit_id: '', name: '', research_areas_text: '' }]);
    const removeResearchCenter = (tempId) => setResearchCenters((p) => p.filter((c) => c.tempId !== tempId));
    const updateResearchCenter = (tempId, field, value) => setResearchCenters((p) => p.map((c) => (c.tempId === tempId ? { ...c, [field]: value } : c)));

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-6 h-6 text-[#e8623a] animate-spin" />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="p-6">
                <div className="flex items-start gap-2.5 p-4 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{loadError}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-[#e8623a]" />
                    {isAr ? 'ملف الجامعة البحثية' : 'University Research Profile'}
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {entityName || (isAr ? 'أكمل بيانات جامعتك الأساسية وهيكلها الأكاديمي' : 'Complete your university\'s basic information and academic structure')}
                </p>
            </div>

            {error && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ===== البيانات الأساسية ===== */}
                <div className={cardCls}>
                    <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Info className="w-4 h-4 text-[#e8623a]" />
                        {isAr ? 'البيانات الأساسية' : 'Basic Information'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={labelCls}>{isAr ? 'الاسم بالعربية' : 'Arabic Name'}</label>
                            <input type="text" value={form.arabic_name} onChange={(e) => setForm((p) => ({ ...p, arabic_name: e.target.value }))} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>{isAr ? 'البلد' : 'Country'}</label>
                            <input type="text" value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>{isAr ? 'نوع الجامعة' : 'University Type'}</label>
                            <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className={inputCls}>
                                <option value="">{isAr ? 'اختر...' : 'Select...'}</option>
                                <option value="gov">{isAr ? 'حكومية' : 'Government'}</option>
                                <option value="private">{isAr ? 'خاصة' : 'Private'}</option>
                                <option value="international">{isAr ? 'دولية' : 'International'}</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelCls}>{isAr ? 'النطاقات الرسمية' : 'Official Domains'}</label>
                            <input type="text" dir="ltr" placeholder="example.edu.iq" value={form.official_domains} onChange={(e) => setForm((p) => ({ ...p, official_domains: e.target.value }))} className={inputCls} />
                        </div>
                    </div>
                </div>

                {/* ===== الملف البحثي ===== */}
                <div className={cardCls}>
                    <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FlaskConical className="w-4 h-4 text-[#e8623a]" />
                        {isAr ? 'الملف البحثي' : 'Research Profile'}
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label className={labelCls}>{isAr ? 'استراتيجية البحث العلمي' : 'Research Strategy'}</label>
                            <textarea rows={3} value={form.research_strategy} onChange={(e) => setForm((p) => ({ ...p, research_strategy: e.target.value }))} className={`${inputCls} resize-none`} />
                        </div>
                        <div>
                            <label className={labelCls}>{isAr ? 'مجالات الأولوية البحثية (سطر لكل مجال)' : 'Priority Research Areas (one per line)'}</label>
                            <textarea rows={3} value={priorityAreasText} onChange={(e) => setPriorityAreasText(e.target.value)} className={`${inputCls} resize-none`} />
                        </div>
                        <div>
                            <label className={labelCls}>{isAr ? 'أهداف البحث (سطر لكل هدف)' : 'Research Goals (one per line)'}</label>
                            <textarea rows={3} value={researchGoalsText} onChange={(e) => setResearchGoalsText(e.target.value)} className={`${inputCls} resize-none`} />
                        </div>
                        <div>
                            <label className={labelCls}>{isAr ? 'حالة الملف' : 'Profile Status'}</label>
                            <select value={form.profile_status} onChange={(e) => setForm((p) => ({ ...p, profile_status: e.target.value }))} className={`${inputCls} md:w-64`}>
                                <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
                                <option value="submitted">{isAr ? 'مُقدَّم' : 'Submitted'}</option>
                                <option value="under_review">{isAr ? 'قيد المراجعة' : 'Under Review'}</option>
                                <option value="approved">{isAr ? 'مُعتمَد' : 'Approved'}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ===== الحرم الجامعي ===== */}
                <div className={cardCls}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#e8623a]" />
                            {isAr ? 'الحرم الجامعي' : 'Campuses'}
                        </h2>
                        <AddButton onClick={addCampus} label={isAr ? 'إضافة حرم جامعي' : 'Add Campus'} />
                    </div>
                    <div className="space-y-3">
                        {campuses.length === 0 && <p className="text-xs text-gray-400">{isAr ? 'لا توجد سجلات بعد' : 'No records yet'}</p>}
                        {campuses.map((c) => (
                            <div key={c.tempId} className="flex items-center gap-2">
                                <input type="text" placeholder={isAr ? 'اسم الحرم الجامعي' : 'Campus name'} value={c.name} onChange={(e) => updateCampus(c.tempId, 'name', e.target.value)} className={`${inputCls} flex-1`} />
                                <input type="text" placeholder={isAr ? 'الموقع' : 'Location'} value={c.location || ''} onChange={(e) => updateCampus(c.tempId, 'location', e.target.value)} className={`${inputCls} flex-1`} />
                                <RowRemoveButton onClick={() => removeCampus(c.tempId)} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== الكليات ===== */}
                <div className={cardCls}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <School className="w-4 h-4 text-[#e8623a]" />
                            {isAr ? 'الكليات' : 'Colleges'}
                        </h2>
                        <AddButton onClick={addCollege} label={isAr ? 'إضافة كلية' : 'Add College'} />
                    </div>
                    <div className="space-y-3">
                        {colleges.length === 0 && <p className="text-xs text-gray-400">{isAr ? 'لا توجد سجلات بعد' : 'No records yet'}</p>}
                        {colleges.map((c) => (
                            <div key={c.tempId} className="flex items-center gap-2">
                                <input type="text" placeholder={isAr ? 'اسم الكلية' : 'College name'} value={c.name} onChange={(e) => updateCollege(c.tempId, 'name', e.target.value)} className={`${inputCls} flex-1`} />
                                <select value={c.campus_id || ''} onChange={(e) => updateCollege(c.tempId, 'campus_id', e.target.value)} className={`${inputCls} flex-1`}>
                                    <option value="">{isAr ? 'بدون حرم محدد' : 'No specific campus'}</option>
                                    {campuses.map((cam) => (
                                        <option key={cam.tempId} value={cam.tempId}>{cam.name || (isAr ? '(بدون اسم)' : '(unnamed)')}</option>
                                    ))}
                                </select>
                                <RowRemoveButton onClick={() => removeCollege(c.tempId)} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== الأقسام ===== */}
                <div className={cardCls}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Layers className="w-4 h-4 text-[#e8623a]" />
                            {isAr ? 'الأقسام' : 'Departments'}
                        </h2>
                        <AddButton onClick={addDepartment} label={isAr ? 'إضافة قسم' : 'Add Department'} />
                    </div>
                    <div className="space-y-3">
                        {departments.length === 0 && <p className="text-xs text-gray-400">{isAr ? 'لا توجد سجلات بعد' : 'No records yet'}</p>}
                        {departments.map((c) => (
                            <div key={c.tempId} className="flex items-center gap-2">
                                <input type="text" placeholder={isAr ? 'اسم القسم' : 'Department name'} value={c.name} onChange={(e) => updateDepartment(c.tempId, 'name', e.target.value)} className={`${inputCls} flex-1`} />
                                <select value={c.college_id || ''} onChange={(e) => updateDepartment(c.tempId, 'college_id', e.target.value)} className={`${inputCls} flex-1`}>
                                    <option value="">{isAr ? 'اختر الكلية' : 'Select college'}</option>
                                    {colleges.map((col) => (
                                        <option key={col.tempId} value={col.tempId}>{col.name || (isAr ? '(بدون اسم)' : '(unnamed)')}</option>
                                    ))}
                                </select>
                                <RowRemoveButton onClick={() => removeDepartment(c.tempId)} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== المراكز البحثية ===== */}
                <div className={cardCls}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FlaskConical className="w-4 h-4 text-[#e8623a]" />
                            {isAr ? 'المراكز البحثية' : 'Research Centers'}
                        </h2>
                        <AddButton onClick={addResearchCenter} label={isAr ? 'إضافة مركز بحثي' : 'Add Research Center'} />
                    </div>
                    <div className="space-y-4">
                        {researchCenters.length === 0 && <p className="text-xs text-gray-400">{isAr ? 'لا توجد سجلات بعد' : 'No records yet'}</p>}
                        {researchCenters.map((c) => (
                            <div key={c.tempId} className="border border-gray-100 dark:border-[#3a322c]/50 rounded-xl p-3.5 space-y-2.5">
                                <div className="flex items-center gap-2">
                                    <input type="text" placeholder={isAr ? 'اسم المركز البحثي' : 'Research center name'} value={c.name} onChange={(e) => updateResearchCenter(c.tempId, 'name', e.target.value)} className={`${inputCls} flex-1`} />
                                    <RowRemoveButton onClick={() => removeResearchCenter(c.tempId)} />
                                </div>
                                <textarea rows={2} placeholder={isAr ? 'مجالات البحث (سطر لكل مجال)' : 'Research areas (one per line)'} value={c.research_areas_text || ''} onChange={(e) => updateResearchCenter(c.tempId, 'research_areas_text', e.target.value)} className={`${inputCls} resize-none`} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={saving} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-50 ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-l from-[#e8623a] to-[#f0916d] text-white hover:shadow-lg hover:shadow-[#e8623a]/25'}`}>
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saved ? (isAr ? 'تم الحفظ' : 'Saved') : (isAr ? 'حفظ الملف' : 'Save Profile')}
                    </button>
                </div>
            </form>

            {/* ===== تقييم الجاهزية بالذكاء الاصطناعي ===== */}
            <div className={cardCls}>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#e8623a]" />
                        {isAr ? 'تقييم الجاهزية بالذكاء الاصطناعي' : 'AI Readiness Assessment'}
                    </h2>
                    <button
                        type="button"
                        onClick={runAssessment}
                        disabled={assessmentLoading}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#e8623a] to-[#f0916d] text-white text-sm font-bold hover:shadow-lg hover:shadow-[#e8623a]/25 disabled:opacity-60 transition-all"
                    >
                        {assessmentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {assessmentLoading
                            ? (isAr ? 'جارٍ التحليل... (قد يستغرق حتى 30 ثانية)' : 'Analyzing... (may take up to 30s)')
                            : (isAr ? 'تشغيل تقييم الجاهزية' : 'Run Readiness Assessment')}
                    </button>
                </div>

                {assessmentError && (
                    <div className={`flex items-start gap-2.5 p-3.5 mb-4 rounded-xl border ${
                        assessmentError.type === 'info'
                            ? 'bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-800/30'
                            : 'bg-red-50 dark:bg-red-900/15 border-red-200 dark:border-red-800/30'
                    }`}>
                        {assessmentError.type === 'info' ? <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />}
                        <p className={`text-sm font-medium ${assessmentError.type === 'info' ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>{assessmentError.text}</p>
                    </div>
                )}

                {!assessment && !assessmentError && (
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        {isAr ? 'لم يتم إجراء أي تقييم بعد. اضغط الزر أعلاه لتحليل ملف جامعتك وتقدير مدى جاهزيتها البحثية.' : 'No assessment has been run yet. Click the button above to analyze your university profile and estimate its research readiness.'}
                    </p>
                )}

                {assessment && (
                    <div className="space-y-5">
                        {/* النسبة الإجمالية */}
                        <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-[#e8623a]/10 rounded-2xl">
                            <TrendingUp className="w-8 h-8 text-[#e8623a] flex-shrink-0" />
                            <div>
                                <p className="text-3xl font-black text-gray-900 dark:text-white">{assessment.overall_readiness_percent}%</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{isAr ? 'الجاهزية الإجمالية' : 'Overall Readiness'}</p>
                            </div>
                        </div>

                        {/* أبعاد الجاهزية */}
                        {Array.isArray(assessment.dimensions) && assessment.dimensions.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {assessment.dimensions.map((d, i) => {
                                    const badge = statusBadge(d.status, isAr);
                                    return (
                                        <div key={i} className="border border-gray-100 dark:border-[#3a322c]/50 rounded-xl p-3.5">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{isAr ? d.label_ar : d.label_en}</p>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 dark:bg-[#1a1613] rounded-full overflow-hidden">
                                                <div className="h-full bg-[#e8623a] rounded-full" style={{ width: `${d.percent}%` }} />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1.5">{d.percent}%</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* الفجوات الحرجة والفرص */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.isArray(assessment.critical_gaps) && assessment.critical_gaps.length > 0 && (
                                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/20 rounded-xl p-4">
                                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5 mb-2.5">
                                        <AlertTriangle className="w-4 h-4" /> {isAr ? 'الفجوات الحرجة' : 'Critical Gaps'}
                                    </h3>
                                    <ul className="space-y-1.5 list-disc ps-4">
                                        {assessment.critical_gaps.map((g, i) => (
                                            <li key={i} className="text-xs text-gray-600 dark:text-gray-300">{isAr ? g.ar : g.en}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {Array.isArray(assessment.opportunities) && assessment.opportunities.length > 0 && (
                                <div className="bg-orange-50 dark:bg-[#e8623a]/10 border border-orange-100 dark:border-[#e8623a]/20 rounded-xl p-4">
                                    <h3 className="text-sm font-bold text-[#d4502a] dark:text-[#f0916d] flex items-center gap-1.5 mb-2.5">
                                        <Sparkles className="w-4 h-4" /> {isAr ? 'فرص التحسين' : 'Opportunities'}
                                    </h3>
                                    <ul className="space-y-1.5 list-disc ps-4">
                                        {assessment.opportunities.map((o, i) => (
                                            <li key={i} className="text-xs text-gray-600 dark:text-gray-300">{isAr ? o.ar : o.en}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {assessment.generated_at && (
                            <p className="text-[11px] text-gray-400">
                                {isAr ? 'تاريخ التقييم: ' : 'Generated at: '}{new Date(assessment.generated_at).toLocaleString(isAr ? 'ar' : 'en')}
                                {assessment.model && ` · ${assessment.model}`}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversityProfilePage;
