import { useState, useEffect, useMemo } from 'react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';
import ServicePageWrapper from './ServicePageWrapper';
 import {
     Shield, Upload, FileText, Clock,
     AlertCircle, Lightbulb, HelpCircle, ListChecks,
    CheckCircle, Loader2, XCircle, Send, ChevronDown, Lock, Info
 } from 'lucide-react';

const REVIEW_TYPES = [
    { id: 'initial', label_ar: 'تحكيم أولي', label_en: 'Initial Review', desc_ar: 'تقييم سريع لمدى جاهزية بحثك', desc_en: 'Quick readiness assessment', duration_ar: '3-5 أيام', duration_en: '3-5 days', allowedLevels: ['bachelor', 'master', 'phd'], color: 'border-blue-400 dark:border-blue-500/50', bg: 'bg-blue-50 dark:bg-blue-900/10' },
    { id: 'expert', label_ar: 'تحكيم خبير', label_en: 'Expert Review', desc_ar: 'تحكيم متعمق من متخصص — يُختار من التحكيم الأولي المكتمل', desc_en: 'In-depth specialist review — select from completed initial review', duration_ar: '7-14 يوم', duration_en: '7-14 days', allowedLevels: ['master', 'phd'], color: 'border-violet-400 dark:border-violet-500/50', bg: 'bg-violet-50 dark:bg-violet-900/10' },
    { id: 'final', label_ar: 'تحكيم نهائي', label_en: 'Final Review', desc_ar: 'مراجعة شاملة قبل التقديم — يُختار من التحكيم الخبير المكتمل', desc_en: 'Comprehensive pre-submission review — select from completed expert review', duration_ar: '5-10 أيام', duration_en: '5-10 days', allowedLevels: ['master', 'phd'], color: 'border-emerald-400 dark:border-emerald-500/50', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
];

const ACADEMIC_LEVELS = [
    { id: 'bachelor', label_ar: 'بكالوريوس', label_en: "Bachelor's", icon: '🎓' },
    { id: 'master', label_ar: 'ماجستير', label_en: "Master's", icon: '📘' },
    { id: 'phd', label_ar: 'دكتوراه', label_en: 'PhD', icon: '📕' },
];

const getReviewApiError = (serverMsg, isAr) => {
    if (!serverMsg) return isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred';
    const map = {
        'unauthorized': { ar: 'يرجى تسجيل الدخول أولاً', en: 'Please login first' },
        'research_title_required': { ar: 'عنوان البحث مطلوب', en: 'Research title is required' },
        'research_title_too_long': { ar: 'عنوان البحث طويل جداً', en: 'Title too long' },
        'invalid_review_type': { ar: 'نوع التحكيم غير صحيح', en: 'Invalid review type' },
        'invalid_academic_level': { ar: 'المرحلة الدراسية غير صحيحة', en: 'Invalid academic level' },
        'file_required': { ar: 'يرجى رفع ملف البحث', en: 'Please upload research file' },
        'invalid_file_type': { ar: 'صيغة الملف غير مقبولة. المسموح: PDF, DOC, DOCX', en: 'Invalid file type' },
        'file_mime_mismatch': { ar: 'ملف غير صالح أو تالف', en: 'Invalid or corrupted file' },
        'file_size_exceeded': { ar: 'حجم الملف يتجاوز 20 ميغابايت', en: 'File size exceeds 20MB' },
        'file_empty': { ar: 'الملف فارغ', en: 'File is empty' },
        'review_type_not_allowed_for_level': { ar: 'نوع التحكيم غير متاح لهذه المرحلة', en: 'Review type not available for your level' },
        'database_prepare_failed': { ar: 'خطأ في قاعدة البيانات', en: 'Database error' },
        'database_insert_failed': { ar: 'فشل حفظ الطلب', en: 'Failed to save request' },
        'no data received': { ar: 'لم يتم استلام بيانات. قد يتجاوز الملف الحد المسموح', en: 'No data received' },
        'parent_request_not_found': { ar: 'الطلب الأصلي غير موجود', en: 'Parent request not found' },
    };
    const lower = serverMsg.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    for (const [key, trans] of Object.entries(map)) {
        if (lower.includes(key)) return isAr ? trans.ar : trans.en;
    }
    return serverMsg;
};

const formatFileSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const ReviewServicePage = () => {
    const { currentLang, user } = useSite();
    const isAr = currentLang === 'ar';

    // ✅ المرحلة الدراسية مقفلة حسب الدور
    const roleToLevel = { undergrad: 'bachelor', grad: 'master', phd: 'phd' };
    const userLevel = roleToLevel[user?.role] || 'bachelor';
    const [selectedLevel] = useState(userLevel); // لا نحتاج setter — مقفلة

    const [selectedType, setSelectedType] = useState(null);
    const [file, setFile] = useState(null);
    const [researchTitle, setResearchTitle] = useState('');
    const [selectedParentId, setSelectedParentId] = useState('');
    const [notes, setNotes] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    const [requests, setRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [showParentDropdown, setShowParentDropdown] = useState(false);

    const availableTypes = REVIEW_TYPES.filter(rt => rt.allowedLevels.includes(selectedLevel));

    // ✅ الأبحاث المتاحة كأصل حسب نوع التحكيم المختار
    const parentOptions = useMemo(() => {
        if (!selectedType || selectedType.id === 'initial') return [];
        const sourceType = selectedType.id === 'expert' ? 'initial' : 'expert';
        return requests.filter(r => r.review_type === sourceType && r.status === 'completed');
    }, [selectedType, requests]);

    // ✅ جلب الطلبات
    const fetchRequests = async () => {
        setLoadingRequests(true);
        try {
            const formData = new FormData();
            formData.append('user_id', user?.id || '');
            const res = await fetch(`${API_BASE_URL}/get_review_requests.php`, {
                method: 'POST', body: formData, credentials: 'include',
            });
            const result = await res.json();
            if (result.status === 'success') setRequests(result.data);
        } catch (err) {
            console.error('Fetch requests error:', err);
        } finally {
            setLoadingRequests(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchRequests();
    }, [user?.id]);

    const handleTypeChange = (rt) => {
        setSelectedType(rt);
        setSubmitError(null);
        setSubmitSuccess(null);
        setResearchTitle('');
        setSelectedParentId('');
        setFile(null);
        setShowParentDropdown(false);
    };

    const handleSelectParent = (req) => {
        setSelectedParentId(String(req.id));
        setResearchTitle(req.title_ar || req.title_en || '');
        setShowParentDropdown(false);
        setSubmitError(null);
    };

    const handleRemoveFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFile(null);
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (!researchTitle.trim() || !selectedType) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
        const formData = new FormData();
        formData.append('user_id', user?.id || '');
        formData.append('research_title', researchTitle.trim());
        formData.append('review_type', selectedType.id);
        formData.append('academic_level', selectedLevel);
        formData.append('notes', notes.trim());
        
        // ✅ رفع الملف فقط للتحكيم الأولي
        if (!needsParentSelection && file) {
            formData.append('file', file);
        }
        
        if (selectedParentId) {
            formData.append('parent_request_id', selectedParentId);
        }

        const res = await fetch(`${API_BASE_URL}/submit_review.php`, {
            method: 'POST', body: formData, credentials: 'include',
        });
        const result = await res.json();

        if (result.status === 'success') {
            const d = result.data;
            const typeLabel = isAr ? d.review_type_ar : d.review_type_en;
            const levelLabel = isAr ? d.level_ar : d.level_en;

            const newRequest = {
                id: d.id,
                title_ar: d.research_title,
                title_en: d.research_title,
                review_type: d.review_type,
                academic_level: d.academic_level,
                file_name: d.file_name || null,
                file_size: d.file_size || null,
                file_ext: d.file_ext || null,
                status: d.status,
                progress: 0,
                score: null,
                info_needed_ar: null,
                info_needed_en: null,
                revision_note_ar: null,
                revision_note_en: null,
                meta_ar: `${typeLabel} · ${levelLabel}`,
                meta_en: `${typeLabel} · ${levelLabel}`,
                date: d.created_at?.split(' ')[0] || new Date().toISOString().split('T')[0],
            };
            setRequests(prev => [newRequest, ...prev]);

            setSubmitSuccess(isAr
                ? `تم إرسال طلب التحكيم بنجاح! رقم الطلب: #${d.id}`
                : `Review request submitted! Request #${d.id}`
            );

            setResearchTitle('');
            setSelectedParentId('');
            setFile(null);
            setNotes('');
        } else {
            setSubmitError(getReviewApiError(result.message, isAr));
        }
    } catch (err) {
        console.error('Review submit error:', err);
        setSubmitError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
    } finally {
        setSubmitting(false);
    }
};

        const guideSections = [
        {
            id: 'how-to', icon: ListChecks,
            title_ar: 'كيف تطلب التحكيم',
            title_en: 'How to Request a Review',
            items_ar: [
                'التحكيم الأولي: اكتب عنوان البحث وارفع ملف البحث',
                'التحكيم الخبير: اختر بحثاً من التحكيم الأولي المكتمل — لا حاجة لرفع ملف',
                'التحكيم النهائي: اختر بحثاً من التحكيم الخبير المكتمل — لا حاجة لرفع ملف',
                'بعد اكتمال التحكيم، حمّل الملف المُراجع من تبويب "طلباتي"',
            ],
            items_en: [
                'Initial: type title and upload file',
                'Expert: select from completed initial review — no file needed',
                'Final: select from completed expert review — no file needed',
                'After completion, download reviewed file from "My Requests" tab',
            ],
        },
        {
            id: 'flow', icon: Shield,
            title_ar: 'تسلسل التحكيم',
            title_en: 'Review Flow',
            items_ar: [
                'تحكيم أولي: ارفع ملف ← المحكم يراجع ويُرفع الملف المُراجع ← تحميله من "طلباتي"',
                'تحكيم خبير: اختر بحثاً مكتمل ← المحكم يراجع ويُرفع الملف ← تحميله من "طلباتي"',
                'تحكيم نهائي: اختر بحثاً مكتمل ← المحكم يراجع ويُرفع الملف ← تحميله من "طلباتي"',
            ],
            items_en: [
                'Initial: upload file → reviewer uploads reviewed file → download from "My Requests"',
                'Expert: select completed research → reviewer uploads reviewed file → download from "My Requests"',
                'Final: select completed research → reviewer uploads reviewed file → download from "My Requests"',
            ],
        },
        {
            id: 'tips', icon: Lightbulb,
            title_ar: 'نصائح',
            title_en: 'Tips',
            items_ar: [
                'طبّق ملاحظات التحكيم الأولي قبل طلب الخبير',
                'طبّق ملاحظات الخبير قبل طلب التحكيم النهائي',
                'حمّل الملف المُراجع من "طلباتي" قبل طلب التحكيم التالي',
            ],
            items_en: [
                'Apply initial review notes before requesting expert',
                'Apply expert review notes before requesting final',
                'Download reviewed file from "My Requests" before next step',
            ],
        },
        {
            id: 'faq', icon: HelpCircle,
            title_ar: 'أسئلة شائعة',
            title_en: 'FAQ',
            items_ar: [
                'المدة: الأولي 3-5 أيام، الخبير 7-14 يوم، النهائي 5-10 أيام',
                'لماذا لا أرى خيار التحكيم الخبير؟ يجب إكمال التحكيم الأولي أولاً',
                'أين أجد الملف المُراجع؟ في تبويب "طلباتي" ← خانة "مرفق الملف بعد التحكيم"',
                'هل يمكنني رفع نسخة محدّثة مع طلب التحكيم الخبير؟ لا، الملف يأتي من المحكم بعد اكتمال التحكيم',
            ],
            items_en: [
                'Duration: Initial 3-5d, Expert 7-14d, Final 5-10d',
                'Why no Expert option? Complete Initial review first',
                'Where is the reviewed file? "My Requests" → "Post-Review Attachment"',
                'Can I upload an updated version? No, file comes from the reviewer',
            ],
        },
    ];

    const needsParentSelection = selectedType && selectedType.id !== 'initial';
    // const isFormValid = researchTitle.trim() && file && selectedType && (!needsParentSelection || selectedParentId);
const isFormValid = researchTitle.trim() && selectedType && (!needsParentSelection || selectedParentId);
    const selectedParentReq = parentOptions.find(r => String(r.id) === selectedParentId);
    const lockedLevel = ACADEMIC_LEVELS.find(l => l.id === selectedLevel);

    const formContent = (
        <div className="space-y-5">

            {submitError && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{submitError}</p>
                </div>
            )}
            {submitSuccess && (
                <div className="flex items-start gap-2.5 p-3.5 bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/30 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{submitSuccess}</p>
                </div>
            )}

            {/* ─── المرحلة الدراسية — مقفلة ─── */}
            <div className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">{isAr ? 'المرحلة الدراسية' : 'Academic Level'}</h2>
                    <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 dark:bg-[#1a2744] px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        {isAr ? 'محددة حسب دورك' : 'Fixed by your role'}
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ACADEMIC_LEVELS.map(level => {
                        const isActive = selectedLevel === level.id;
                        const isLocked = !isActive;
                        return (
                            <div key={level.id}
                                className={`relative p-4 rounded-xl border-2 text-center transition-all ${isActive ? 'border-[#c8a44e] bg-[#c8a44e]/5' : 'border-gray-100 dark:border-[#1e3050]/20 opacity-35 cursor-not-allowed'}`}>
                                <span className="text-3xl block mb-2">{level.icon}</span>
                                <span className={`text-sm font-bold block ${isActive ? 'text-[#c8a44e]' : 'text-gray-500 dark:text-gray-500'}`}>
                                    {isAr ? level.label_ar : level.label_en}
                                </span>
                                {isActive && <div className="absolute top-2 end-2 w-5 h-5 bg-[#c8a44e] rounded-full flex items-center justify-center"><CheckCircle className="w-3 h-3 text-white" /></div>}
                                {isLocked && <div className="absolute inset-0 flex items-center justify-center"><div className="w-7 h-7 bg-gray-200 dark:bg-[#1e3050] rounded-full flex items-center justify-center"><Lock className="w-3 h-3 text-gray-400" /></div></div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ─── أنواع التحكيم ─── */}
            <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{isAr ? 'اختر نوع التحكيم' : 'Choose Review Type'}</h2>
                <div className={`grid gap-3 ${availableTypes.length === 1 ? 'grid-cols-1 max-w-lg' : 'grid-cols-1 md:grid-cols-3'}`}>
                    {availableTypes.map(rt => {
                        // ✅ تعطيل الخبير إذا لم يكتمل أولي، والنهائي إذا لم يكتمل خبير
                        let isDisabled = false;
                        let disableReason = '';
                        if (rt.id === 'expert') {
                            const hasInitial = requests.some(r => r.review_type === 'initial' && r.status === 'completed');
                            if (!hasInitial) { isDisabled = true; disableReason = isAr ? 'أكمل التحكيم الأولي أولاً' : 'Complete Initial Review first'; }
                        }
                        if (rt.id === 'final') {
                            const hasExpert = requests.some(r => r.review_type === 'expert' && r.status === 'completed');
                            if (!hasExpert) { isDisabled = true; disableReason = isAr ? 'أكمل التحكيم الخبير أولاً' : 'Complete Expert Review first'; }
                        }

                        return (
                            <button key={rt.id} onClick={() => !isDisabled && handleTypeChange(rt)} disabled={isDisabled}
                                className={`text-start p-4 rounded-2xl border-2 transition-all relative ${
                                    isDisabled
                                        ? 'border-gray-100 dark:border-[#1e3050]/20 opacity-40 cursor-not-allowed'
                                        : selectedType?.id === rt.id
                                            ? rt.color + ' ' + rt.bg + ' shadow-lg'
                                            : 'border-gray-200 dark:border-[#1e3050] hover:' + rt.color + ' hover:shadow-md'
                                }`}>
                                {isDisabled && <div className="absolute top-2 end-2"><Lock className="w-4 h-4 text-gray-300 dark:text-gray-600" /></div>}
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{isAr ? rt.label_ar : rt.label_en}</h3>
                                <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-2">{isAr ? rt.desc_ar : rt.desc_en}</p>
                                <span className="flex items-center gap-1 text-[11px] text-gray-400"><Clock className="w-3 h-3" />{isAr ? rt.duration_ar : rt.duration_en}</span>
                                {isDisabled && <p className="text-[10px] text-gray-400 mt-2">{disableReason}</p>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ─── النموذج ─── */}
            {selectedType && (
                <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5 space-y-4">

                    {/* ─── اختيار البحث من القائمة (خبير / نهائي) ─── */}
                    {needsParentSelection && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                {selectedType.id === 'expert'
                                    ? (isAr ? 'اختر البحث من التحكيم الأولي المكتمل' : 'Select from completed Initial Review')
                                    : (isAr ? 'اختر البحث من التحكيم الخبير المكتمل' : 'Select from completed Expert Review')
                                } <span className="text-rose-500">*</span>
                            </label>

                            {parentOptions.length === 0 ? (
                                <div className="flex items-center gap-2.5 p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628]">
                                    <AlertCircle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                                    <p className="text-sm text-gray-400">
                                        {selectedType.id === 'expert'
                                            ? (isAr ? 'لا توجد أبحاث مكتملة من التحكيم الأولي بعد' : 'No completed Initial Reviews yet')
                                            : (isAr ? 'لا توجد أبحاث مكتملة من التحكيم الخبير بعد' : 'No completed Expert Reviews yet')
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowParentDropdown(!showParentDropdown)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                                            selectedParentId
                                                ? 'border-[#c8a44e] bg-[#c8a44e]/5 text-gray-900 dark:text-white'
                                                : 'border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-400 dark:text-gray-600 hover:border-[#c8a44e]/40'
                                        }`}
                                    >
                                        <span className="truncate">
                                            {selectedParentReq
                                                ? (selectedParentReq.title_ar || selectedParentReq.title_en)
                                                : (isAr ? 'اختر البحث...' : 'Select research...')
                                            }
                                        </span>
                                        <ChevronDown className={`w-4 h-4 flex-shrink-0 ms-2 transition-transform ${showParentDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    {showParentDropdown && (
                                        <div className="absolute top-full start-0 end-0 mt-1 bg-white dark:bg-[#111d33] border border-gray-200 dark:border-[#2a3a5c] rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
                                            {parentOptions.map(req => (
                                                <button
                                                    key={req.id}
                                                    type="button"
                                                    onClick={() => handleSelectParent(req)}
                                                    className={`w-full text-start px-4 py-3 text-sm transition-colors border-b border-gray-50 dark:border-[#1e3050]/30 last:border-0 ${
                                                        String(req.id) === selectedParentId
                                                            ? 'bg-[#c8a44e]/10 text-[#c8a44e] font-semibold'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a2744]'
                                                    }`}
                                                >
                                                    <p className="truncate font-medium">{req.title_ar || req.title_en}</p>
                                                    <p className="text-[10px] text-gray-400 mt-0.5">
                                                        {req.meta_ar || req.meta_en} · {req.date}
                                                        {req.score != null && <span className="ms-2 text-[#c8a44e] font-bold">{req.score}/100</span>}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─── عنوان البحث ─── */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                            {isAr ? 'عنوان البحث' : 'Research Title'} <span className="text-rose-500">*</span>
                            {needsParentSelection && (
                                <span className="text-gray-300 dark:text-gray-600 font-normal ms-2">
                                    ({isAr ? 'تلقائي من الاختيار' : 'auto from selection'})
                                </span>
                            )}
                        </label>
                        <input
                            type="text"
                            value={researchTitle}
                            onChange={(e) => { setResearchTitle(e.target.value); setSubmitError(null); }}
                            readOnly={needsParentSelection}
                            placeholder={needsParentSelection
                                ? (isAr ? 'اختر البحث من القائمة أعلاه...' : 'Select research from above...')
                                : (isAr ? 'أدخل عنوان البحث...' : 'Enter research title...')
                            }
                            maxLength={500}
                            className={`w-full px-4 py-3 rounded-xl border text-sm transition ${
                                needsParentSelection
                                    ? 'border-gray-200 dark:border-[#1e3050] bg-gray-100 dark:bg-[#0a1628]/60 text-gray-700 dark:text-gray-400 cursor-not-allowed'
                                    : 'border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#c8a44e]/30 focus:border-[#c8a44e]'
                            }`}
                        />
                    </div>

                    {/* ─── رفع الملف ─── */}
                                        {/* ─── رفع الملف (التحكيم الأولي فقط) ─── */}
                    {!needsParentSelection && (
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                {isAr ? 'رفع الملف' : 'Upload File'} <span className="text-rose-500">*</span>
                            </label>
                            <label className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${file ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-gray-200 dark:border-[#1e3050] hover:border-[#c8a44ب]/50 hover:bg-[#c8a44e]/5'}`}>
                                <input type="file" className="hidden"
                                    onChange={(e) => {
                                        const selected = e.target.files[0];
                                        if (selected) {
                                            const ext = selected.name.split('.').pop().toLowerCase();
                                            if (!['pdf', 'doc', 'docx'].includes(ext)) {
                                                setSubmitError(isAr ? 'صيغة الملف غير مقبولة. المسموح: PDF, DOC, DOCX' : 'Invalid file type');
                                                return;
                                            }
                                            if (selected.size > 20 * 1024 * 1024) {
                                                setSubmitError(isAr ? 'حجم الملف يتجاوز 20 ميغابايت' : 'File size exceeds 20MB');
                                                return;
                                            }
                                            setFile(selected);
                                            setSubmitError(null);
                                        }
                                    }}
                                    accept=".pdf,.doc,.docx"
                                />
                                {file ? (
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                                            <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1 max-w-[200px] truncate">{file.name}</p>
                                        <p className="text-[11px] text-emerald-500/70 dark:text-emerald-500/50 mb-2">{formatFileSize(file.size)}</p>
                                        <button onClick={handleRemoveFile} className="text-[11px] text-rose-500 hover:text-rose-600 font-semibold hover:underline flex items-center gap-1">
                                            <XCircle className="w-3.5 h-3.5" />{isAr ? 'إزالة الملف' : 'Remove file'}
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-7 h-7 text-gray-300 dark:text-gray-600 group-hover:text-[#c8a44e] transition-colors mb-2" />
                                        <span className="text-xs text-gray-400 font-medium">{isAr ? 'اسحب الملف أو انقر للاختيار' : 'Drag file or click to browse'}</span>
                                        <span className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">PDF, DOC, DOCX — Max 20MB</span>
                                    </>
                                )}
                            </label>
                        </div>
                    )}

                    {/* ─── إشعار بدلاً من رفع ملف للخبير/النهائي ─── */}
                    {needsParentSelection && (
                        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30">
                            <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs font-bold text-blue-700 dark:text-blue-400">
                                    {isAr ? 'لا حاجة لرفع ملف هنا' : 'No file upload needed'}
                                </p>
                                <p className="text-[11px] text-blue-600/70 dark:text-blue-400/70 mt-0.5 leading-relaxed">
                                    {isAr
                                        ? 'الملف المُراجع من المحكم سيظهر في خانة "مرفق الملف بعد التحكيم" في تبويب "طلباتي" بعد اكتمال التحكيم.'
                                        : 'The reviewed file will appear in "Post-Review Attachment" in "My Requests" tab after review is completed.'
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ─── ملاحظات ─── */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}</label>
                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                            placeholder={isAr ? 'أي تفاصيل إضافية تود إيصالها للمحكم...' : 'Any additional details for the reviewer...'}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#c8a44e]/30 focus:border-[#c8a44e] transition resize-none"
                        />
                    </div>

                    {/* ─── ملخص الطلب ─── */}
                    <div className="bg-gray-50 dark:bg-[#0a1628] rounded-xl p-3.5 space-y-2">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{isAr ? 'ملخص الطلب' : 'Request Summary'}</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <span className="text-gray-400">{isAr ? 'النوع:' : 'Type:'}</span>
                                <span className="ms-1 font-semibold text-gray-700 dark:text-gray-300">{isAr ? selectedType.label_ar : selectedType.label_en}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">{isAr ? 'المرحلة:' : 'Level:'}</span>
                                <span className="ms-1 font-semibold text-gray-700 dark:text-gray-300">{isAr ? lockedLevel?.label_ar : lockedLevel?.label_en}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">{isAr ? 'المدة:' : 'Duration:'}</span>
                                <span className="ms-1 font-semibold text-gray-700 dark:text-gray-300">{isAr ? selectedType.duration_ar : selectedType.duration_en}</span>
                            </div>
                            <div>
                                <span className="text-gray-400">{isAr ? 'الملف:' : 'File:'}</span>
                                <span className="ms-1 font-semibold text-gray-700 dark:text-gray-300">{file ? formatFileSize(file.size) : '—'}</span>
                            </div>
                            {needsParentSelection && selectedParentReq && (
                                <div className="col-span-2">
                                    <span className="text-gray-400">{isAr ? 'مبني على:' : 'Based on:'}</span>
                                    <span className="ms-1 font-semibold text-[#c8a44e]">#{selectedParentReq.id} — {selectedParentReq.title_ar || selectedParentReq.title_en}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button type="submit" disabled={!isFormValid || submitting}
                        className="w-full py-3.5 bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] hover:from-[#b8953e] hover:to-[#d6b95e] disabled:from-gray-300 disabled:to-gray-300 disabled:dark:from-gray-600 disabled:dark:to-gray-600 text-[#0a1628] disabled:text-gray-500 dark:disabled:text-gray-500 font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#c8a44e]/25 disabled:shadow-none flex items-center justify-center gap-2.5">
                        {submitting
                            ? <><Loader2 className="w-4.5 h-4.5 animate-spin" />{isAr ? 'جارٍ الإرسال...' : 'Submitting...'}</>
                            : <><Send className="w-4 h-4" />{isAr ? 'إرسال طلب التحكيم' : 'Submit Review Request'}</>
                        }
                    </button>
                </form>
            )}
        </div>
    );

    return (
        <ServicePageWrapper
            icon={Shield}
            title={{ ar: 'خدمة التحكيم', en: 'Review Service' }}
            description={{ ar: 'احصل على تحكيم أكاديمي موثوق لبحثك من متخصصين', en: 'Get reliable academic review from specialists' }}
            gradient="from-[#c8a44e] to-[#e6c96e]"
            shadowColor="shadow-[#c8a44e]/20"
            guideSections={guideSections}
            mockRequests={requests}
            loadingRequests={loadingRequests}
        >
            {formContent}
        </ServicePageWrapper>
    );
};

export default ReviewServicePage;