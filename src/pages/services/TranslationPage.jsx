import { useState, useEffect } from 'react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';
import ServicePageWrapper from './ServicePageWrapper';
import {
    Languages, Upload, ArrowRightLeft, FileText, Clock,
    ListChecks, Lightbulb, HelpCircle, CheckCircle, Loader2,
    XCircle, Send, ChevronDown, Globe
} from 'lucide-react';

const LANGS = [
    { code: 'ar', label_ar: 'العربية', label_en: 'Arabic', flag: '🇸🇦' },
    { code: 'en', label_ar: 'الإنجليزية', label_en: 'English', flag: '🌐' },
];

const EN_VARIANTS = [
    { code: 'us', label_ar: 'الإنجليزية الأمريكية', label_en: 'American English', short_ar: 'أمريكية', short_en: 'US', flag: '🇺🇸' },
    { code: 'uk', label_ar: 'الإنجليزية البريطانية', label_en: 'British English', short_ar: 'بريطانية', short_en: 'UK', flag: '🇬🇧' },
    { code: 'au', label_ar: 'الإنجليزية الأسترالية', label_en: 'Australian English', short_ar: 'أسترالية', short_en: 'AU', flag: '🇦🇺' },
    { code: 'ca', label_ar: 'الإنجليزية الكندية', label_en: 'Canadian English', short_ar: 'كندية', short_en: 'CA', flag: '🇨🇦' },
];

const URGENCY_OPTIONS = [
    { k: 'normal', ar: 'عادي', en: 'Normal', d_ar: '3-5 أيام', d_en: '3-5 days' },
    { k: 'fast', ar: 'سريع', en: 'Fast', d_ar: '1-2 يوم', d_en: '1-2 days' },
    { k: 'urgent', ar: 'عاجل', en: 'Urgent', d_ar: 'أقل من يوم', d_en: '< 1 day' },
];

const getTranslationApiError = (serverMsg, isAr) => {
    if (!serverMsg) return isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred';
    const map = {
        'unauthorized': { ar: 'يرجى تسجيل الدخول أولاً', en: 'Please login first' },
        'invalid_source_lang': { ar: 'لغة المصدر غير صحيحة', en: 'Invalid source language' },
        'invalid_target_lang': { ar: 'لغة الهدف غير صحيحة', en: 'Invalid target language' },
        'same_lang_not_allowed': { ar: 'لا يمكن اختيار نفس اللغة للمصدر والهدف', en: 'Source and target must be different' },
        'invalid_english_variant': { ar: 'نوع الإنجليزية غير صحيح', en: 'Invalid English variant' },
        'english_variant_required': { ar: 'يرجى اختيار نوع الإنجليزية', en: 'Please select an English variant' },
        'invalid_urgency': { ar: 'مستوى زمن الإستجابة غير صحيح', en: 'Invalid urgency level' },
        'file_required': { ar: 'يرجى رفع الملف', en: 'Please upload a file' },
        'invalid_file_type': { ar: 'صيغة الملف غير مقبولة. المسموح: PDF, DOC, DOCX, TXT, RTF', en: 'Invalid file type. Allowed: PDF, DOC, DOCX, TXT, RTF' },
        'file_mime_mismatch': { ar: 'ملف غير صالح أو تالف', en: 'Invalid or corrupted file' },
        'file_size_exceeded': { ar: 'حجم الملف يتجاوز 20 ميغابايت', en: 'File size exceeds 20MB' },
        'file_empty': { ar: 'الملف فارغ', en: 'File is empty' },
        'database_prepare_failed': { ar: 'خطأ في قاعدة البيانات', en: 'Database error' },
        'database_insert_failed': { ar: 'فشل حفظ الطلب', en: 'Failed to save request' },
        'no data received': { ar: 'لم يتم استلام بيانات', en: 'No data received' },
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

const TranslationPage = () => {
    const { currentLang, isRTL, user } = useSite();
    const isAr = currentLang === 'ar';

    const [sourceLang, setSourceLang] = useState('ar');
    const [targetLang, setTargetLang] = useState('en');
    const [englishVariant, setEnglishVariant] = useState('');
    const [showVariantDropdown, setShowVariantDropdown] = useState(false);
    const [file, setFile] = useState(null);
    const [notes, setNotes] = useState('');
    const [urgency, setUrgency] = useState('normal');

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(null);

    const [requests, setRequests] = useState([]);
    const [loadingRequests, setLoadingRequests] = useState(true);

    const showVariantSelector = targetLang === 'en';
    const selectedVariant = EN_VARIANTS.find(v => v.code === englishVariant);
    const getLabel = (c) => { const l = LANGS.find(l => l.code === c); return l ? (isAr ? l.label_ar : l.label_en) : c; };

    const isFormValid = sourceLang !== targetLang && file && (!showVariantSelector || englishVariant);

    // ✅ جلب الطلبات
    const fetchRequests = async () => {
        setLoadingRequests(true);
        try {
            const formData = new FormData();
            formData.append('user_id', user?.id || '');
            const res = await fetch(`${API_BASE_URL}/get_translation_requests.php`, {
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

    // ✅ تبديل اللغات مع إعادة تعيين النوع
    const handleSwapLangs = () => {
        const prevTarget = targetLang;
        setSourceLang(prevTarget);
        setTargetLang(sourceLang);
        setEnglishVariant('');
        setShowVariantDropdown(false);
    };

    // ✅ إزالة الملف
    const handleRemoveFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFile(null);
    };

    // ✅ إرسال الطلب
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        setSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            const formData = new FormData();
            formData.append('user_id', user?.id || '');
            formData.append('source_lang', sourceLang);
            formData.append('target_lang', targetLang);
            formData.append('urgency', urgency);
            formData.append('notes', notes.trim());
            formData.append('file', file);

            if (showVariantSelector && englishVariant) {
                formData.append('english_variant', englishVariant);
            }

            const res = await fetch(`${API_BASE_URL}/submit_translation.php`, {
                method: 'POST', body: formData, credentials: 'include',
            });
            const result = await res.json();

            if (result.status === 'success') {
                const d = result.data;
                const newRequest = {
                    id: d.id,
                    title_ar: d.title_ar,
                    title_en: d.title_en,
                    source_lang: d.source_lang,
                    target_lang: d.target_lang,
                    english_variant: d.english_variant,
                    urgency: d.urgency,
                    file_name: d.file_name,
                    file_size: d.file_size,
                    file_ext: d.file_ext,
                    status: d.status,
                    progress: 0,
                    score: null,
                    info_needed_ar: null,
                    info_needed_en: null,
                    revision_note_ar: null,
                    revision_note_en: null,
                    translated_file_name: null,
                    translated_file_path: null,
                    translated_file_size: null,
                    meta_ar: d.meta_ar,
                    meta_en: d.meta_en,
                    date: d.created_at?.split(' ')[0] || new Date().toISOString().split('T')[0],
                };
                setRequests(prev => [newRequest, ...prev]);

                setSubmitSuccess(isAr
                    ? `تم إرسال طلب الترجمة بنجاح! رقم الطلب: #${d.id}`
                    : `Translation request submitted! Request #${d.id}`
                );

                setFile(null);
                setNotes('');
                setUrgency('normal');
                setEnglishVariant('');
                setShowVariantDropdown(false);
            } else {
                setSubmitError(getTranslationApiError(result.message, isAr));
            }
        } catch (err) {
            console.error('Translation submit error:', err);
            setSubmitError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setSubmitting(false);
        }
    };

    const guideSections = [
        {
            id: 'how', icon: ListChecks,
            title_ar: 'خطوات الترجمة', title_en: 'Translation Steps',
            items_ar: ['اختر لغة المصدر والهدف', 'إذا كانت الهدف إنجليزية اختر النوع (أمريكية، بريطانية...)', 'ارفع المستند (PDF, DOC, DOCX, TXT, RTF)', 'حدد مستوى زمن الإستجابة', 'أضف ملاحظات عن المصطلحات الخاصة إن وجدت', 'إرسال الطلب'],
            items_en: ['Select source & target language', 'If target is English, choose variant (US, UK...)', 'Upload document (PDF, DOC, DOCX, TXT, RTF)', 'Set urgency level', 'Add special terminology notes', 'Submit'],
        },
        {
            id: 'features', icon: Lightbulb,
            title_ar: 'مزايا الخدمة', title_en: 'Service Features',
            items_ar: ['مترجمون أكاديميون متخصصون', 'مراجعة لغوية بعد الترجمة', 'الحفاظ على المصطلحات التقنية', 'تنسيق يتطابق مع الأصل', 'سرية تامة للمحتوى', 'دعم الإنجليزية الأمريكية والبريطانية والأسترالية والكندية'],
            items_en: ['Academic specialist translators', 'Post-translation language review', 'Technical term preservation', 'Format matching original', 'Full content confidentiality', 'US, UK, Australian & Canadian English support'],
        },
        {
            id: 'faq', icon: HelpCircle,
            title_ar: 'أسئلة شائعة', title_en: 'FAQ',
            items_ar: ['ما الصيغ المدعومة؟ PDF, DOC, DOCX, TXT, RTF', 'هل يمكنني طلب تعديل بعد التسليم؟ نعم خلال 3 أيام مجاناً', 'كيف يتم التعامل مع المصطلحات الخاصة؟ أدرجها في خانة الملاحظات', 'ما الفرق بين الإنجليزية الأمريكية والبريطانية؟ اختلاف في الإملاء وبعض المصطلحات (مثل: color/colour)', 'أين أجد الملف المترجم؟ في تبويب "طلباتي" بعد اكتمال الترجمة'],
            items_en: ['Supported formats? PDF, DOC, DOCX, TXT, RTF', 'Free revisions? Yes within 3 days', 'Special terms? List them in notes', 'US vs UK English? Spelling and some terms differ (e.g. color/colour)', 'Where is translated file? "My Requests" tab after completion'],
        },
    ];

    const form = (
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

            <div className="bg-white dark:bg-[#0c1425] rounded-2xl border border-gray-200 dark:border-[#1e3050]/50 p-5 space-y-4">

                {/* ─── اللغات ─── */}
                <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{isAr ? 'اختر اللغات' : 'Choose Languages'}</h2>
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'لغة المصدر' : 'Source'}</label>
                            <select
                                value={sourceLang}
                                onChange={(e) => { setSourceLang(e.target.value); setSubmitError(null); }}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                            >
                                {LANGS.map(l => (
                                    <option key={l.code} value={l.code}>{l.flag} {isAr ? l.label_ar : l.label_en}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={handleSwapLangs}
                            className="mt-5 p-2.5 rounded-xl bg-gray-100 dark:bg-[#1a2744] text-gray-500 hover:bg-gray-200 dark:hover:bg-[#243352] hover:text-blue-500 transition-colors"
                            title={isAr ? 'تبديل اللغتين' : 'Swap languages'}
                        >
                            <ArrowRightLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                        </button>

                        <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'لغة الهدف' : 'Target'}</label>
                            <select
                                value={targetLang}
                                onChange={(e) => {
                                    setTargetLang(e.target.value);
                                    setEnglishVariant('');
                                    setShowVariantDropdown(false);
                                    setSubmitError(null);
                                }}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
                            >
                                {LANGS.filter(l => l.code !== sourceLang).map(l => (
                                    <option key={l.code} value={l.code}>{l.flag} {isAr ? l.label_ar : l.label_en}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* ─── نوع الإنجليزية ─── */}
                {showVariantSelector && (
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" />{isAr ? 'نوع الإنجليزية' : 'English Variant'}</span>
                            <span className="text-rose-500"> *</span>
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowVariantDropdown(!showVariantDropdown)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                                    englishVariant
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-gray-900 dark:text-white'
                                        : 'border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-400 dark:text-gray-600 hover:border-blue-400'
                                }`}
                            >
                                <span className="flex items-center gap-2 truncate">
                                    {selectedVariant
                                        ? <>{selectedVariant.flag} <span className="font-semibold">{isAr ? selectedVariant.label_ar : selectedVariant.label_en}</span></>
                                        : (isAr ? 'اختر نوع الإنجليزية...' : 'Select English variant...')
                                    }
                                </span>
                                <ChevronDown className={`w-4 h-4 flex-shrink-0 ms-2 transition-transform ${showVariantDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showVariantDropdown && (
                                <div className="absolute top-full start-0 end-0 mt-1 bg-white dark:bg-[#111d33] border border-gray-200 dark:border-[#2a3a5c] rounded-xl shadow-xl z-30">
                                    {EN_VARIANTS.map(v => (
                                        <button
                                            key={v.code}
                                            type="button"
                                            onClick={() => {
                                                setEnglishVariant(v.code);
                                                setShowVariantDropdown(false);
                                                setSubmitError(null);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b border-gray-50 dark:border-[#1e3050]/30 last:border-0 ${
                                                v.code === englishVariant
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a2744]'
                                            }`}
                                        >
                                            <span className="text-xl">{v.flag}</span>
                                            <div className="text-start">
                                                <p className="font-medium">{isAr ? v.label_ar : v.label_en}</p>
                                                <p className="text-[10px] text-gray-400">{isAr ? v.short_en : v.short_en}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── رفع الملف ─── */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        {isAr ? 'رفع الملف' : 'Upload File'} <span className="text-rose-500">*</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${
                        file
                            ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10'
                            : 'border-gray-200 dark:border-[#1e3050] hover:border-blue-400/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                    }`}>
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                                const selected = e.target.files[0];
                                if (selected) {
                                    const ext = selected.name.split('.').pop().toLowerCase();
                                    if (!['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext)) {
                                        setSubmitError(isAr ? 'صيغة الملف غير مقبولة. المسموح: PDF, DOC, DOCX, TXT, RTF' : 'Invalid file type. Allowed: PDF, DOC, DOCX, TXT, RTF');
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
                            accept=".pdf,.doc,.docx,.txt,.rtf"
                        />
                        {file ? (
                            <div className="text-center">
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                                    <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1 max-w-[220px] truncate">{file.name}</p>
                                <p className="text-[11px] text-emerald-500/70 dark:text-emerald-500/50 mb-2">{formatFileSize(file.size)}</p>
                                <button onClick={handleRemoveFile} className="text-[11px] text-rose-500 hover:text-rose-600 font-semibold hover:underline flex items-center gap-1">
                                    <XCircle className="w-3.5 h-3.5" />{isAr ? 'إزالة الملف' : 'Remove file'}
                                </button>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-7 h-7 text-gray-300 dark:text-gray-600 group-hover:text-blue-400 transition-colors mb-2" />
                                <span className="text-xs text-gray-400 font-medium">{isAr ? 'اسحب الملف أو انقر للاختيار' : 'Drag file or click to browse'}</span>
                                <span className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">PDF, DOC, DOCX, TXT, RTF — Max 20MB</span>
                            </>
                        )}
                    </label>
                </div>

                {/* ─── زمن الإستجابة ─── */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">{isAr ? 'مستوى زمن الإستجابة' : 'Urgency'}</label>
                    <div className="flex gap-2">
                        {URGENCY_OPTIONS.map(o => (
                            <button
                                key={o.k}
                                type="button"
                                onClick={() => setUrgency(o.k)}
                                className={`flex-1 py-2.5 px-3 rounded-xl border text-center transition-all ${
                                    urgency === o.k
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                        : 'border-gray-200 dark:border-[#1e3050] text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-[#2a3a5c]'
                                }`}
                            >
                                <span className="block text-sm font-semibold">{isAr ? o.ar : o.en}</span>
                                <span className="flex items-center justify-center gap-1 text-[10px] opacity-70 mt-0.5">
                                    <Clock className="w-3 h-3" />{isAr ? o.d_ar : o.d_en}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ─── ملاحظات ─── */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'ملاحظات (اختياري)' : 'Notes (Optional)'}</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={2}
                        placeholder={isAr ? 'مصطلحات خاصة أو متطلبات تنسيق...' : 'Special terms or formatting requirements...'}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0a1628] text-gray-900 dark:text-white text-sm placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition resize-none"
                    />
                </div>

                {/* ─── ملخص الطلب ─── */}
                <div className="bg-gray-50 dark:bg-[#0a1628] rounded-xl p-3.5 space-y-2">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{isAr ? 'ملخص الطلب' : 'Request Summary'}</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span className="text-gray-400">{isAr ? 'من:' : 'From:'}</span>
                            <span className="ms-1 font-semibold text-gray-700 dark:text-gray-300">{LANGS.find(l => l.code === sourceLang)?.flag} {getLabel(sourceLang)}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">{isAr ? 'إلى:' : 'To:'}</span>
                            <span className="ms-1 font-semibold text-gray-700 dark:text-gray-300">
                                {LANGS.find(l => l.code === targetLang)?.flag} {getLabel(targetLang)}
                                {selectedVariant && <span className="text-blue-500"> ({isAr ? selectedVariant.short_ar : selectedVariant.short_en})</span>}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-400">{isAr ? 'زمن الإستجابة:' : 'Urgency:'}</span>
                            <span className="ms-1 font-semibold text-gray-700 dark:text-gray-300">{isAr ? URGENCY_OPTIONS.find(u => u.k === urgency)?.ar : URGENCY_OPTIONS.find(u => u.k === urgency)?.en}</span>
                        </div>
                        <div>
                            <span className="text-gray-400">{isAr ? 'الملف:' : 'File:'}</span>
                            <span className="ms-1 font-semibold text-gray-700 dark:text-gray-300">{file ? formatFileSize(file.size) : '—'}</span>
                        </div>
                    </div>
                </div>

                {/* ─── زر الإرسال ─── */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isFormValid || submitting}
                    className="w-full py-3.5 bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-300 disabled:dark:from-gray-600 disabled:dark:to-gray-600 text-white disabled:text-gray-500 dark:disabled:text-gray-500 font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/25 disabled:shadow-none flex items-center justify-center gap-2.5"
                >
                    {submitting
                        ? <><Loader2 className="w-4.5 h-4.5 animate-spin" />{isAr ? 'جارٍ الإرسال...' : 'Submitting...'}</>
                        : <><Send className="w-4 h-4" />{isAr ? 'إرسال طلب الترجمة' : 'Submit Translation Request'}</>
                    }
                </button>
            </div>
        </div>
    );

    return (
        <ServicePageWrapper
            icon={Languages}
            title={{ ar: 'خدمة الترجمة', en: 'Translation Service' }}
            description={{ ar: 'ترجمة أكاديمية دقيقة بأيدي متخصصين', en: 'Accurate academic translation by specialists' }}
            gradient="from-blue-500 to-blue-600"
            shadowColor="shadow-blue-500/20"
            guideSections={guideSections}
            mockRequests={requests}
            loadingRequests={loadingRequests}
        >
            {form}
        </ServicePageWrapper>
    );
};

export default TranslationPage;