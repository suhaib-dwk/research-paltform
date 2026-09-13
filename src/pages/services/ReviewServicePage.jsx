import { useState, useEffect, useMemo } from 'react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';
import ServicePageWrapper from './ServicePageWrapper';
import {
    Shield, Upload, FileText, Clock,
    AlertCircle, Lightbulb, HelpCircle, ListChecks,
    CheckCircle, Loader2, XCircle, Send, ChevronDown, Lock, Info, X,
    // أيقونات الخدمات الجديدة
    FileSearch, Scan, Bot, GitBranch, CheckSquare, Cpu, UserCheck, Zap
} from 'lucide-react';

// =========================================================
// 1. أنواع التحكيم والمراحل (كما في الكود الأصلي)
// =========================================================
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

// =========================================================
// 2. بيانات خدمات البكالوريوس (U01 - U06)
// =========================================================
const UNDERGRAD_SERVICES = [
    {
        id: 'u01',
        code: 'U01',
        icon: FileSearch,
        title_ar: 'التقييم البحثي الأولي',
        title_en: 'Preliminary Research Assessment',
        desc_ar: 'تقييم مبكر للبحث أو المقترح يساعد طالب البكالوريوس على معرفة مستوى جاهزية بحثه قبل الانتقال إلى مراحل متقدمة.',
        desc_en: 'Early assessment of research or proposal to help undergraduate students know their research readiness level.',
        deliverables_ar: ['Research Readiness Score', 'درجات فرعية للموضوع والمنهجية', 'قائمة أولويات للتحسين'],
        deliverables_en: ['Research Readiness Score', 'Sub-scores for Topic & Methodology', 'Prioritized Improvement List'],
        inputs_ar: ['ملف البحث أو المقترح', 'موضوع البحث والتخصص', 'المراجع المتاحة'],
        inputs_en: ['Research or Proposal File', 'Topic & Specialization', 'Available References'],
        execution_type: 'hybrid', // ai, human, hybrid
        duration_ar: 'مباشر',
        duration_en: 'Instant',
        disclaimer_ar: 'القرار الأكاديمي النهائي يبقى للباحث أو الجهة الأكاديمية. هذه الخدمة وقائية وتعليمية.',
        disclaimer_en: 'The final academic decision remains with the researcher or academic authority. This service is preventive and educational.'
    },
    {
        id: 'u02',
        code: 'U02',
        icon: Scan,
        title_ar: 'فحص الاقتباس والتشابه',
        title_en: 'Citation & Similarity Screening',
        desc_ar: 'فحص أولي للتشابه النصي وسلامة الإسناد المرجعي والتنبيه إلى المواضع التي تحتاج إلى مراجعة.',
        desc_en: 'Initial screening for text similarity, citation integrity, and alerting to areas needing review.',
        deliverables_ar: ['Similarity Indicator', 'Citation Integrity Alerts', 'قائمة المراجع غير المتسقة'],
        deliverables_en: ['Similarity Indicator', 'Citation Integrity Alerts', 'List of Inconsistent References'],
        inputs_ar: ['البحث بصيغة Word أو PDF', 'قائمة المراجع'],
        inputs_en: ['Research (Word/PDF)', 'Reference List'],
        execution_type: 'ai',
        duration_ar: 'مباشر',
        duration_en: 'Instant',
        disclaimer_ar: 'فحص وقائي وتعليمي وليس كقرار اتهام نهائي.',
        disclaimer_en: 'Preventive and educational screening, not a final accusation verdict.'
    },
    {
        id: 'u03',
        code: 'U03',
        icon: Bot,
        title_ar: 'مؤشر استخدام الذكاء الاصطناعي',
        title_en: 'AI Content Indicator',
        desc_ar: 'مؤشر تحليلي يساعد على تحديد المقاطع التي قد تستحق مراجعة إضافية بسبب احتمال استخدام أدوات توليد آلية.',
        desc_en: 'Analytical indicator to identify sections that may need additional review due to possible use of generative tools.',
        deliverables_ar: ['AI Content Indicator', 'AI Risk Flags', 'تنبيه المقاطع المشبوهة'],
        deliverables_en: ['AI Content Indicator', 'AI Risk Flags', 'Suspicious Section Alerts'],
        inputs_ar: ['النص أو البحث'],
        inputs_en: ['Text or Research'],
        execution_type: 'ai',
        duration_ar: 'مباشر',
        duration_en: 'Instant',
        disclaimer_ar: 'لا يقدم كإثبات قطعي على استخدام الذكاء الاصطناعي، بل كمؤشر مخاطر.',
        disclaimer_en: 'Not provided as conclusive proof of AI usage, but as a risk indicator.'
    },
    {
        id: 'u04',
        code: 'U04',
        icon: GitBranch,
        title_ar: 'مراجعة منهجية البحث',
        title_en: 'Research Methodology Review',
        desc_ar: 'مراجعة مبكرة لمدى توافق مشكلة البحث وأهدافه وأسئلته ومنهجيته وأدواته معًا.',
        desc_en: 'Early review of the alignment between the research problem, objectives, questions, methodology, and tools.',
        deliverables_ar: ['Methodology Readiness Score', 'مواطن عدم الاتساق', 'توصيات تطوير'],
        deliverables_en: ['Methodology Readiness Score', 'Inconsistencies', 'Development Recommendations'],
        inputs_ar: ['مشكلة البحث', 'الأهداف والأسئلة', 'المنهجية والعينة'],
        inputs_en: ['Research Problem', 'Objectives & Questions', 'Methodology & Sample'],
        execution_type: 'hybrid',
        duration_ar: '1-2 يوم',
        duration_en: '1-2 days',
        disclaimer_ar: 'المراجعة تعليمية لتطوير البحث وليست قراراً أكاديمياً.',
        disclaimer_en: 'Review is educational for research development, not an academic decision.'
    },
    {
        id: 'u05',
        code: 'U05',
        icon: Lightbulb,
        title_ar: 'تقييم موضوع البحث',
        title_en: 'Research Topic Assessment',
        desc_ar: 'فحص أولي لوضوح موضوع البحث وأهميته وإمكانية تطويره إلى دراسة قابلة للتنفيذ.',
        desc_en: 'Initial check for topic clarity, importance, and feasibility of developing it into an executable study.',
        deliverables_ar: ['Topic Assessment', 'ملاحظات على الوضوح', 'اقتراحات لتحسين النطاق'],
        deliverables_en: ['Topic Assessment', 'Clarity Notes', 'Scope Improvement Suggestions'],
        inputs_ar: ['العنوان', 'وصف مختصر للفكرة', 'التخصص'],
        inputs_en: ['Title', 'Brief Idea Description', 'Specialization'],
        execution_type: 'ai',
        duration_ar: 'مباشر',
        duration_en: 'Instant',
        disclaimer_ar: 'الموضوع النهائي يعتمد على مشرف البحث والجهة الأكاديمية.',
        disclaimer_en: 'Final topic depends on the research supervisor and academic authority.'
    },
    {
        id: 'u06',
        code: 'U06',
        icon: CheckSquare,
        title_ar: 'تقييم قابلية التطبيق',
        title_en: 'Applicability Assessment',
        desc_ar: 'فحص ما إذا كانت فكرة البحث قابلة للتنفيذ عمليًا من حيث البيانات والعينة والأدوات والوقت.',
        desc_en: 'Check if the research idea is practically feasible regarding data, sample, tools, and time.',
        deliverables_ar: ['Applicability Score', 'Execution Risks', 'قائمة المتطلبات'],
        deliverables_en: ['Applicability Score', 'Execution Risks', 'Requirements List'],
        inputs_ar: ['نوع البيانات', 'العينة المستهدفة', 'الأدوات والمدة'],
        inputs_en: ['Data Type', 'Target Sample', 'Tools & Duration'],
        execution_type: 'hybrid',
        duration_ar: 'مباشر',
        duration_en: 'Instant',
        disclaimer_ar: 'التقييم مبني على المدخلات المقدمة فقط.',
        disclaimer_en: 'Assessment is based solely on provided inputs.'
    }
];

// =========================================================
// Helpers
// =========================================================
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

// =========================================================
// المكون الرئيسي
// =========================================================
const ReviewServicePage = () => {
    const { currentLang, user } = useSite();
    const isAr = currentLang === 'ar';

    // State للنموذج
    const roleToLevel = { undergrad: 'bachelor', grad: 'master', phd: 'phd' };
    const userLevel = roleToLevel[user?.role] || 'bachelor';
    const [selectedLevel] = useState(userLevel);
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

    // State للدليل التفاعلي (Guide)
    const [activeServiceModal, setActiveServiceModal] = useState(null);

    const availableTypes = REVIEW_TYPES.filter(rt => rt.allowedLevels.includes(selectedLevel));
    const parentOptions = useMemo(() => {
        if (!selectedType || selectedType.id === 'initial') return [];
        const sourceType = selectedType.id === 'expert' ? 'initial' : 'expert';
        return requests.filter(r => r.review_type === sourceType && r.status === 'completed');
    }, [selectedType, requests]);

    // جلب الطلبات (بقي كما هو)
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

    const needsParentSelection = selectedType && selectedType.id !== 'initial';
    const isFormValid = researchTitle.trim() && selectedType && (!needsParentSelection || selectedParentId);
    const selectedParentReq = parentOptions.find(r => String(r.id) === selectedParentId);
    const lockedLevel = ACADEMIC_LEVELS.find(l => l.id === selectedLevel);

    // ─── دالة مساعدة لعرض نوع التنفيذ ───
    const renderExecutionType = (type) => {
        const baseClass = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border";
        const types = {
            ai: { label_ar: 'ذكاء اصطناعي', label_en: 'AI-Assisted', icon: Cpu, class: "bg-blue-50/50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700" },
            human: { label_ar: 'خبير بشري', label_en: 'Human Expert', icon: UserCheck, class: "bg-emerald-50/50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700" },
            hybrid: { label_ar: 'نموذج هجين', label_en: 'Hybrid Model', icon: Zap, class: "bg-orange-50/50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700" }
        };
        const t = types[type] || types.ai;
        const Icon = t.icon;
        return (
            <span className={`${baseClass} ${t.class}`}>
                <Icon className="w-3 h-3" />
                {isAr ? t.label_ar : t.label_en}
            </span>
        );
    };

    // ─── تصميم النافذة المنبثقة للخدمة (Modal) ───
    const ServiceModal = ({ service, onClose }) => {
        if (!service) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-[#211c18] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-[#3a322c] overflow-hidden animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="relative p-6 bg-gradient-to-r from-[#e8623a]/10 to-transparent border-b border-gray-100 dark:border-white/5">
                        <button onClick={onClose} className="absolute top-4 end-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#e8623a] text-white flex items-center justify-center shadow-lg shadow-[#e8623a]/20">
                                <service.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 pt-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-[#e8623a] bg-[#e8623a]/10 px-2 py-0.5 rounded">{service.code}</span>
                                    {renderExecutionType(service.execution_type)}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {isAr ? service.title_ar : service.title_en}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        
                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                {isAr ? 'عن الخدمة' : 'About Service'}
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {isAr ? service.desc_ar : service.desc_en}
                            </p>
                        </div>

                        {/* Grid: Inputs & Outputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-[#1a1613] p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">
                                    <Upload className="w-3.5 h-3.5" />
                                    {isAr ? 'ما تحتاج لتقديمه' : 'Required Inputs'}
                                </h4>
                                <ul className="space-y-2">
                                    {(isAr ? service.inputs_ar : service.inputs_en).map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            <span className="w-1 h-1 rounded-full bg-[#e8623a] mt-1.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gray-50 dark:bg-[#1a1613] p-4 rounded-xl border border-gray-100 dark:border-white/5">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-3">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                    {isAr ? 'ما ستحصل عليه' : 'Deliverables'}
                                </h4>
                                <ul className="space-y-2">
                                    {(isAr ? service.deliverables_ar : service.deliverables_en).map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-white/5">
                            <span className="text-xs font-semibold text-gray-500">
                                {isAr ? 'المدة المتوقعة' : 'Expected Duration'}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                                <Clock className="w-3.5 h-3.5 text-[#e8623a]" />
                                {isAr ? service.duration_ar : service.duration_en}
                            </div>
                        </div>

                        {/* Disclaimer Box */}
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h5 className="text-xs font-bold text-amber-800 dark:text-amber-400 mb-1">
                                        {isAr ? 'تنبيه أكاديمي هام' : 'Important Academic Notice'}
                                    </h5>
                                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                                        {isAr ? service.disclaimer_ar : service.disclaimer_en}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const formContent = (
        <div className="space-y-6">
            
            {/* ─── قسم الخدمات (دليل الخدمات الجديد) ─── */}
            <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            {isAr ? 'خدمات البكالوريوس' : 'Undergraduate Services'}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            {isAr ? 'تصفح الخدمات التعليمية والوقائية المتاحة' : 'Browse available educational and preventive services'}
                        </p>
                    </div>
                    <div className="hidden sm:block">
                         <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                            {UNDERGRAD_SERVICES.length} {isAr ? 'خدمة متاحة' : 'Services Available'}
                         </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {UNDERGRAD_SERVICES.map(svc => (
                        <button 
                            key={svc.id} 
                            onClick={() => setActiveServiceModal(svc)}
                            className="group text-start p-4 rounded-xl border border-gray-100 dark:border-[#3a322c] hover:border-[#e8623a]/50 hover:shadow-lg hover:shadow-[#e8623a]/10 transition-all bg-gray-50/50 dark:bg-[#1a1613]/50"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#2a231e] flex items-center justify-center border border-gray-200 dark:border-[#3a322c] text-gray-600 dark:text-gray-300 group-hover:text-[#e8623a] group-hover:border-[#e8623a]/20 transition-colors">
                                    <svc.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-mono font-bold text-gray-400">{svc.code}</span>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#e8623a] transition-colors line-clamp-1">
                                {isAr ? svc.title_ar : svc.title_en}
                            </h3>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                {isAr ? svc.desc_ar : svc.desc_en}
                            </p>
                            <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
                                <Clock className="w-3 h-3" />
                                {isAr ? svc.duration_ar : svc.duration_en}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* ─── نموذج طلب التحكيم (الجزء الأصلي) ─── */}
            <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 p-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#e8623a]" />
                    {isAr ? 'طلب تحكيم بحثي' : 'Research Review Request'}
                </h2>

                {/* Alerts */}
                {submitError && (
                    <div className="flex items-start gap-2.5 p-3.5 mb-6 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 rounded-xl">
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">{submitError}</p>
                    </div>
                )}
                {submitSuccess && (
                    <div className="flex items-start gap-2.5 p-3.5 mb-6 bg-emerald-50 dark:bg-emerald-900/15 border border-emerald-200 dark:border-emerald-800/30 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{submitSuccess}</p>
                    </div>
                )}

                {/* Level Locked */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white">{isAr ? 'المرحلة الدراسية' : 'Academic Level'}</h3>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 dark:bg-[#2a231e] px-2 py-0.5 rounded-full">
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
                                    className={`relative p-4 rounded-xl border-2 text-center transition-all ${isActive ? 'border-[#e8623a] bg-[#e8623a]/5' : 'border-gray-100 dark:border-[#3a322c]/20 opacity-35 cursor-not-allowed'}`}>
                                    <span className="text-3xl block mb-2">{level.icon}</span>
                                    <span className={`text-sm font-bold block ${isActive ? 'text-[#e8623a]' : 'text-gray-500 dark:text-gray-500'}`}>
                                        {isAr ? level.label_ar : level.label_en}
                                    </span>
                                    {isActive && <div className="absolute top-2 end-2 w-5 h-5 bg-[#e8623a] rounded-full flex items-center justify-center"><CheckCircle className="w-3 h-3 text-white" /></div>}
                                    {isLocked && <div className="absolute inset-0 flex items-center justify-center"><div className="w-7 h-7 bg-gray-200 dark:bg-[#3a322c] rounded-full flex items-center justify-center"><Lock className="w-3 h-3 text-gray-400" /></div></div>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Review Types */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{isAr ? 'اختر نوع التحكيم' : 'Choose Review Type'}</h3>
                    <div className={`grid gap-3 ${availableTypes.length === 1 ? 'grid-cols-1 max-w-lg' : 'grid-cols-1 md:grid-cols-3'}`}>
                        {availableTypes.map(rt => {
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
                                            ? 'border-gray-100 dark:border-[#3a322c]/20 opacity-40 cursor-not-allowed'
                                            : selectedType?.id === rt.id
                                                ? rt.color + ' ' + rt.bg + ' shadow-lg'
                                                : 'border-gray-200 dark:border-[#3a322c] hover:' + rt.color + ' hover:shadow-md'
                                    }`}>
                                    {isDisabled && <div className="absolute top-2 end-2"><Lock className="w-4 h-4 text-gray-300 dark:text-gray-600" /></div>}
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{isAr ? rt.label_ar : rt.label_en}</h4>
                                    <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-2">{isAr ? rt.desc_ar : rt.desc_en}</p>
                                    <span className="flex items-center gap-1 text-[11px] text-gray-400"><Clock className="w-3 h-3" />{isAr ? rt.duration_ar : rt.duration_en}</span>
                                    {isDisabled && <p className="text-[10px] text-gray-400 mt-2">{disableReason}</p>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Form Input Area */}
                {selectedType && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        
                        {/* Parent Selection */}
                        {needsParentSelection && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    {selectedType.id === 'expert'
                                        ? (isAr ? 'اختر البحث من التحكيم الأولي المكتمل' : 'Select from completed Initial Review')
                                        : (isAr ? 'اختر البحث من التحكيم الخبير المكتمل' : 'Select from completed Expert Review')
                                    } <span className="text-rose-500">*</span>
                                </label>

                                {parentOptions.length === 0 ? (
                                    <div className="flex items-center gap-2.5 p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-[#3a322c] bg-gray-50 dark:bg-[#1a1613]">
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
                                                    ? 'border-[#e8623a] bg-[#e8623a]/5 text-gray-900 dark:text-white'
                                                    : 'border-gray-200 dark:border-[#3a322c] bg-gray-50 dark:bg-[#1a1613] text-gray-400 dark:text-gray-600 hover:border-[#e8623a]/40'
                                            }`}>
                                            <span className="truncate">
                                                {selectedParentReq
                                                    ? (selectedParentReq.title_ar || selectedParentReq.title_en)
                                                    : (isAr ? 'اختر البحث...' : 'Select research...')
                                                }
                                            </span>
                                            <ChevronDown className={`w-4 h-4 flex-shrink-0 ms-2 transition-transform ${showParentDropdown ? 'rotate-180' : ''}`} />
                                        </button>

                                        {showParentDropdown && (
                                            <div className="absolute top-full start-0 end-0 mt-1 bg-white dark:bg-[#211c18] border border-gray-200 dark:border-[#4a4038] rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto">
                                                {parentOptions.map(req => (
                                                    <button
                                                        key={req.id}
                                                        type="button"
                                                        onClick={() => handleSelectParent(req)}
                                                        className={`w-full text-start px-4 py-3 text-sm transition-colors border-b border-gray-50 dark:border-[#3a322c]/30 last:border-0 ${
                                                            String(req.id) === selectedParentId
                                                                ? 'bg-[#e8623a]/10 text-[#e8623a] font-semibold'
                                                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2a231e]'
                                                        }`}>
                                                        <p className="truncate font-medium">{req.title_ar || req.title_en}</p>
                                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                                            {req.meta_ar || req.meta_en} · {req.date}
                                                            {req.score != null && <span className="ms-2 text-[#e8623a] font-bold">{req.score}/100</span>}
                                                        </p>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Title */}
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
                                        ? 'border-gray-200 dark:border-[#3a322c] bg-gray-100 dark:bg-[#1a1613]/60 text-gray-700 dark:text-gray-400 cursor-not-allowed'
                                        : 'border-gray-200 dark:border-[#3a322c] bg-gray-50 dark:bg-[#1a1613] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e8623a]/30 focus:border-[#e8623a]'
                                }`}
                            />
                        </div>

                        {/* Upload (Initial Only) */}
                        {!needsParentSelection && (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    {isAr ? 'رفع الملف' : 'Upload File'} <span className="text-rose-500">*</span>
                                </label>
                                <label className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${file ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-gray-200 dark:border-[#3a322c] hover:border-[#e8623a]/50 hover:bg-[#e8623a]/5'}`}>
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
                                            <Upload className="w-7 h-7 text-gray-300 dark:text-gray-600 group-hover:text-[#e8623a] transition-colors mb-2" />
                                            <span className="text-xs text-gray-400 font-medium">{isAr ? 'اسحب الملف أو انقر للاختيار' : 'Drag file or click to browse'}</span>
                                            <span className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">PDF, DOC, DOCX — Max 20MB</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        )}

                        {/* Info for Expert/Final */}
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

                        {/* Notes */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}</label>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                                placeholder={isAr ? 'أي تفاصيل إضافية تود إيصالها للمحكم...' : 'Any additional details for the reviewer...'}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#3a322c] bg-gray-50 dark:bg-[#1a1613] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#e8623a]/30 focus:border-[#e8623a] transition resize-none"
                            />
                        </div>

                        {/* Summary */}
                        <div className="bg-gray-50 dark:bg-[#1a1613] rounded-xl p-3.5 space-y-2">
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
                                        <span className="ms-1 font-semibold text-[#e8623a]">#{selectedParentReq.id} — {selectedParentReq.title_ar || selectedParentReq.title_en}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" disabled={!isFormValid || submitting}
                            className="w-full py-3.5 bg-gradient-to-l from-[#e8623a] to-[#f0916d] hover:from-[#b8953e] hover:to-[#d6b95e] disabled:from-gray-300 disabled:to-gray-300 disabled:dark:from-gray-600 disabled:dark:to-gray-600 text-white disabled:text-gray-500 dark:disabled:text-gray-500 font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#e8623a]/25 disabled:shadow-none flex items-center justify-center gap-2.5">
                            {submitting
                                ? <><Loader2 className="w-4.5 h-4.5 animate-spin" />{isAr ? 'جارٍ الإرسال...' : 'Submitting...'}</>
                                : <><Send className="w-4 h-4" />{isAr ? 'إرسال طلب التحكيم' : 'Submit Review Request'}</>
                            }
                        </button>
                    </form>
                )}
            </div>
        </div>
    );

    return (
        <>
            <ServicePageWrapper
                icon={Shield}
                title={{ ar: 'خدمة التحكيم', en: 'Review Service' }}
                description={{ ar: 'احصل على تحكيم أكاديمي موثوق لبحثك من متخصصين', en: 'Get reliable academic review from specialists' }}
                gradient="from-[#e8623a] to-[#f0916d]"
                shadowColor="shadow-[#e8623a]/20"
                // تمرير دليل فارغ أو بسيط لأننا صممنا دليلنا الخاص (U01-U06) داخل formContent
                guideSections={[]} 
                mockRequests={requests}
                loadingRequests={loadingRequests}
            >
                {formContent}
            </ServicePageWrapper>

            {/* عرض النافذة المنبثقة للخدمة */}
            {activeServiceModal && (
                <ServiceModal 
                    service={activeServiceModal} 
                    onClose={() => setActiveServiceModal(null)} 
                />
            )}
        </>
    );
};

export default ReviewServicePage;
