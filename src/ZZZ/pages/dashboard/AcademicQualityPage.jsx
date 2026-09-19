import { useState, useEffect, useCallback } from 'react';
import { useSite } from '../../../SiteContext';
import { API_BASE_URL } from '../../../api';
import {
    Award, ChevronDown, ChevronUp, Loader2, XCircle, CheckCircle2,
    Paperclip, UploadCloud, FileText,
} from 'lucide-react';

// =========================================================
// ثوابت وأدوات مساعدة
// =========================================================
const COMPLIANCE_LEVELS = ['none', 'partial', 'full'];
const MATURITY_LEVELS = [0, 25, 50, 75, 100];

const complianceLabel = (v, isAr) => ({
    none: isAr ? 'غير موجود' : 'None',
    partial: isAr ? 'جزئي' : 'Partial',
    full: isAr ? 'كلي' : 'Full',
}[v] || v);

const indicatorTypeLabel = (t, isAr) => ({
    compliance: isAr ? 'امتثال' : 'Compliance',
    quantitative: isAr ? 'كمّي' : 'Quantitative',
    percentage: isAr ? 'نسبة' : 'Percentage',
    maturity: isAr ? 'نضج' : 'Maturity',
}[t] || t);

// ⚠️ score/maxScore نقاط فعلية من سقف حقيقي مختلف لكل مؤشر (نظام الدرجات الموزون)،
// لذا نقارن بالنسبة المئوية (score/maxScore) وليس بقيمة score الخام.
const scoreClasses = (score, maxScore, hasResponse) => {
    if (!hasResponse) return 'bg-gray-100 dark:bg-brand-dark-hover text-gray-500 dark:text-gray-400';
    const pct = maxScore > 0 ? (score / maxScore) * 100 : 0;
    if (pct >= 75) return 'bg-orange-50 dark:bg-brand-orange/10 text-brand-orange-dark dark:text-brand-orange-light';
    if (pct >= 40) return 'bg-orange-50 dark:bg-amber-900/15 text-amber-600 dark:text-amber-400';
    return 'bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400';
};

const defaultPeriod = () => {
    const y = new Date().getFullYear();
    return `${y}-${y + 1}`;
};

const periodOptions = () => {
    const y = new Date().getFullYear();
    const opts = [];
    for (let i = -2; i <= 1; i++) opts.push(`${y + i}-${y + i + 1}`);
    return opts;
};

// =========================================================
// نموذج مؤشر واحد (قابل للطي)
// =========================================================
const IndicatorForm = ({ indicator, isAr, period, onSaved }) => {
    const r = indicator.response || {};
    const [complianceLevel, setComplianceLevel] = useState(r.compliance_level || '');
    const [maturityLevel, setMaturityLevel] = useState(r.maturity_level ?? '');
    const [actualValue, setActualValue] = useState(r.actual_value ?? '');
    const [targetValue, setTargetValue] = useState(r.target_value ?? '');
    const [assessment, setAssessment] = useState(r.assessment || 'not_verified');
    const [evidenceQuality, setEvidenceQuality] = useState(r.evidence_quality ?? '');
    const [gapNotes, setGapNotes] = useState(r.gap_notes || '');
    const [correctiveAction, setCorrectiveAction] = useState(r.corrective_action || '');
    const [ownerName, setOwnerName] = useState(r.owner_name || '');
    const [dueDate, setDueDate] = useState(r.due_date ? r.due_date.substring(0, 10) : '');

    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [saveMsg, setSaveMsg] = useState(null); // { ok: bool, text: string }
    const [evidenceFiles, setEvidenceFiles] = useState(indicator.evidence_files || []);

    const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-brand-dark-border bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition";
    const labelCls = "block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1";

    const handleSave = async () => {
        setSaving(true);
        setSaveMsg(null);

        const payload = {
            indicator_id: indicator.id,
            reporting_period: period,
            assessment,
            evidence_quality: evidenceQuality,
            gap_notes: gapNotes,
            corrective_action: correctiveAction,
            owner_name: ownerName,
            due_date: dueDate,
            status: 'submitted',
        };

        if (indicator.indicator_type === 'compliance') {
            payload.compliance_level = complianceLevel;
        } else if (indicator.indicator_type === 'maturity') {
            payload.maturity_level = maturityLevel;
        } else {
            payload.actual_value = actualValue;
            payload.target_value = targetValue;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/quality_save.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',
            });
            const result = await res.json();
            if (result.status === 'success') {
                setSaveMsg({ ok: true, text: isAr ? `تم الحفظ — الدرجة: ${result.data.score}/${result.data.max_score}` : `Saved — Score: ${result.data.score}/${result.data.max_score}` });
                onSaved?.();
            } else {
                setSaveMsg({ ok: false, text: (isAr ? 'خطأ: ' : 'Error: ') + (result.message || (isAr ? 'فشل الحفظ' : 'Save failed')) });
            }
        } catch (err) {
            setSaveMsg({ ok: false, text: isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpload = async (file) => {
        if (!file) return;
        setUploading(true);
        setSaveMsg(null);
        try {
            const fd = new FormData();
            fd.append('indicator_id', indicator.id);
            fd.append('reporting_period', period);
            fd.append('evidence', file);

            const res = await fetch(`${API_BASE_URL}/quality_upload_evidence.php`, { method: 'POST', body: fd, credentials: 'include' });
            const result = await res.json();
            if (result.status === 'success') {
                setEvidenceFiles(prev => [...prev, result.data]);
                setSaveMsg({ ok: true, text: isAr ? 'تم رفع الدليل بنجاح' : 'Evidence uploaded successfully' });
                onSaved?.();
            } else {
                setSaveMsg({ ok: false, text: (isAr ? 'خطأ رفع: ' : 'Upload error: ') + (result.message || '') });
            }
        } catch (err) {
            setSaveMsg({ ok: false, text: isAr ? 'تعذّر رفع الملف' : 'Failed to upload file' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-4 border-t border-gray-100 dark:border-brand-dark-border/50 space-y-4">
            {/* معلومات المؤشر */}
            <div className="bg-gray-50 dark:bg-brand-dark rounded-xl p-3.5 space-y-1.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                <div><b className="text-gray-700 dark:text-gray-300">{isAr ? 'الدرجة القصوى لهذا المؤشر: ' : 'Maximum score for this indicator: '}</b>{indicator.max_score}</div>
                <div><b className="text-gray-700 dark:text-gray-300">{isAr ? 'معنى المؤشر: ' : 'Meaning: '}</b>{indicator.description || '—'}</div>
                {indicator.required_inputs && <div><b className="text-gray-700 dark:text-gray-300">{isAr ? 'البيانات المطلوبة: ' : 'Required data: '}</b>{indicator.required_inputs}</div>}
                {indicator.required_evidence && <div><b className="text-gray-700 dark:text-gray-300">{isAr ? 'الأدلة المطلوبة: ' : 'Required evidence: '}</b>{indicator.required_evidence}</div>}
                {indicator.module_name && <div><b className="text-gray-700 dark:text-gray-300">{isAr ? 'الوحدة البرمجية المرجعية: ' : 'Reference module: '}</b>{indicator.module_name}</div>}
            </div>

            {/* حقول حسب النوع */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {indicator.indicator_type === 'compliance' && (
                    <div className="sm:col-span-2">
                        <label className={labelCls}>{isAr ? 'حالة الامتثال' : 'Compliance status'}</label>
                        <div className="flex gap-2 flex-wrap">
                            {COMPLIANCE_LEVELS.map(v => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => setComplianceLevel(v)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                        complianceLevel === v
                                            ? 'border-brand-orange bg-orange-50 dark:bg-brand-orange/10 text-brand-orange-dark dark:text-brand-orange-light'
                                            : 'border-gray-200 dark:border-brand-dark-border text-gray-500 dark:text-gray-400 hover:border-gray-300'
                                    }`}
                                >
                                    {complianceLabel(v, isAr)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {indicator.indicator_type === 'maturity' && (
                    <div className="sm:col-span-2">
                        <label className={labelCls}>{isAr ? 'مستوى النضج المؤسسي' : 'Institutional maturity level'}</label>
                        <div className="flex gap-2 flex-wrap">
                            {MATURITY_LEVELS.map(v => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => setMaturityLevel(v)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                                        String(maturityLevel) === String(v)
                                            ? 'border-brand-orange bg-orange-50 dark:bg-brand-orange/10 text-brand-orange-dark dark:text-brand-orange-light'
                                            : 'border-gray-200 dark:border-brand-dark-border text-gray-500 dark:text-gray-400 hover:border-gray-300'
                                    }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {(indicator.indicator_type === 'quantitative' || indicator.indicator_type === 'percentage') && (
                    <>
                        <div>
                            <label className={labelCls}>{isAr ? 'القيمة الفعلية (Actual)' : 'Actual value'}</label>
                            <input type="number" step="any" value={actualValue} onChange={e => setActualValue(e.target.value)} className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>{isAr ? 'المستهدف (Target)' : 'Target value'}</label>
                            <input type="number" step="any" value={targetValue} onChange={e => setTargetValue(e.target.value)} className={inputCls} />
                        </div>
                    </>
                )}

                <div>
                    <label className={labelCls}>{isAr ? 'حالة التحقق' : 'Verification status'}</label>
                    <select value={assessment} onChange={e => setAssessment(e.target.value)} className={inputCls}>
                        <option value="not_verified">{isAr ? 'غير متحقق' : 'Not verified'}</option>
                        <option value="partial">{isAr ? 'جزئي' : 'Partial'}</option>
                        <option value="full">{isAr ? 'كلي' : 'Full'}</option>
                    </select>
                </div>
                <div>
                    <label className={labelCls}>{isAr ? 'جودة الأدلة (0–100)' : 'Evidence quality (0–100)'}</label>
                    <input type="number" min="0" max="100" value={evidenceQuality} onChange={e => setEvidenceQuality(e.target.value)} className={inputCls} />
                </div>

                <div className="sm:col-span-2">
                    <label className={labelCls}>{isAr ? 'الفجوة' : 'Gap'}</label>
                    <textarea rows={2} value={gapNotes} onChange={e => setGapNotes(e.target.value)} className={`${inputCls} resize-none`} />
                </div>
                <div className="sm:col-span-2">
                    <label className={labelCls}>{isAr ? 'الإجراء التصحيحي / التحسيني' : 'Corrective / improvement action'}</label>
                    <textarea rows={2} value={correctiveAction} onChange={e => setCorrectiveAction(e.target.value)} className={`${inputCls} resize-none`} />
                </div>
                <div>
                    <label className={labelCls}>{isAr ? 'المسؤول' : 'Owner'}</label>
                    <input type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>{isAr ? 'موعد الإنجاز' : 'Due date'}</label>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputCls} />
                </div>
            </div>

            {/* الأدلة */}
            <div className="border border-dashed border-gray-200 dark:border-brand-dark-border rounded-xl p-3.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    <Paperclip className="w-3.5 h-3.5" />{isAr ? 'الأدلة المرفوعة' : 'Uploaded evidence'}
                </label>
                <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors w-fit ${
                    uploading
                        ? 'border-gray-200 dark:border-brand-dark-border text-gray-400 cursor-wait'
                        : 'border-gray-200 dark:border-brand-dark-border text-gray-600 dark:text-gray-300 hover:border-brand-orange/50 hover:bg-orange-50/50 dark:hover:bg-brand-orange/5'
                }`}>
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UploadCloud className="w-3.5 h-3.5" />}
                    {uploading ? (isAr ? 'جارٍ الرفع...' : 'Uploading...') : (isAr ? 'رفع ملف' : 'Upload file')}
                    <input type="file" className="hidden" disabled={uploading} onChange={e => handleUpload(e.target.files[0])} />
                </label>
                <ul className="mt-2.5 space-y-1.5">
                    {evidenceFiles.length === 0 && (
                        <li className="text-xs text-gray-400">{isAr ? 'لا توجد أدلة مرفوعة بعد' : 'No evidence uploaded yet'}</li>
                    )}
                    {evidenceFiles.map((f, i) => (
                        <li key={f.id || i} className="flex items-center justify-between gap-2 text-xs">
                            {/* ✅ Stage A.5: رابط عبر نقطة تنزيل مُصادَق عليها (تتحقق من ملكية
                                الجامعة عند كل وصول) بدل رابط عام دائم مباشر لملف الرفع */}
                            <a href={`${API_BASE_URL}/quality_evidence_download.php?id=${f.id}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-500 hover:underline truncate">
                                <FileText className="w-3.5 h-3.5 flex-shrink-0" /><span className="truncate">{f.file_name}</span>
                            </a>
                            {f.uploaded_at && <span className="text-gray-400 flex-shrink-0">{f.uploaded_at}</span>}
                        </li>
                    ))}
                </ul>
            </div>

            {/* أزرار وحالة الحفظ */}
            <div className="flex items-center justify-end gap-3">
                {saveMsg && (
                    <span className={`text-xs font-medium flex items-center gap-1 ${saveMsg.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                        {saveMsg.ok ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {saveMsg.text}
                    </span>
                )}
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2 rounded-lg bg-gradient-to-l from-brand-orange to-brand-orange-light text-white text-xs font-bold hover:brightness-105 disabled:opacity-60 transition flex items-center gap-2"
                >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {isAr ? 'حفظ المؤشر' : 'Save indicator'}
                </button>
            </div>
        </div>
    );
};

// =========================================================
// المكون الرئيسي
// =========================================================
const AcademicQualityPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';

    const [period, setPeriod] = useState(defaultPeriod());
    const [framework, setFramework] = useState(null); // { standard, elements }
    const [summary, setSummary] = useState(null);
    const [activeElementId, setActiveElementId] = useState(null);
    const [openIndicatorId, setOpenIndicatorId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // ✅ Stage A.5: university_id يُحلّ من الجلسة على الخادم — لا يُرسَل
            // أي معرّف هوية في الطلب سوى period (مرشِّح ضمن نطاق المتصل نفسه)
            const [fwRes, smRes] = await Promise.all([
                fetch(`${API_BASE_URL}/quality_get.php?${new URLSearchParams({ period })}`, { credentials: 'include' }).then(r => r.json()),
                fetch(`${API_BASE_URL}/quality_summary.php?${new URLSearchParams({ period })}`, { credentials: 'include' }).then(r => r.json()),
            ]);

            if (fwRes.status !== 'success') {
                setError(fwRes.message || (isAr ? 'تعذّر تحميل إطار المعيار' : 'Failed to load standard framework'));
                setLoading(false);
                return;
            }

            setFramework(fwRes.data);
            setSummary(smRes.status === 'success' ? smRes.data : null);
            setActiveElementId(prev => prev ?? fwRes.data.elements[0]?.id ?? null);
        } catch (err) {
            setError(isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    }, [period, isAr]);

    useEffect(() => { loadAll(); }, [loadAll]);

    // بوابة صلاحية: نفس منطق quality-academic.php الأصلي
    const ALLOWED_ROLES = ['university', 'college', 'research_center'];
    if (!user || !ALLOWED_ROLES.includes(user.role)) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[60vh]">
                <div className="max-w-md text-center bg-white dark:bg-brand-dark-card border border-gray-200 dark:border-brand-dark-border/50 rounded-2xl p-8">
                    <Award className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{isAr ? 'جودة الأكاديمية' : 'Academic Quality'}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {isAr
                            ? 'هذه الصفحة مخصصة لحسابات الجهات الأكاديمية (جامعة / كلية / مركز بحثي).'
                            : 'This page is available for institutional accounts (university / college / research center) only.'}
                    </p>
                </div>
            </div>
        );
    }

    if (loading && !framework) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="flex items-start gap-2.5 p-4 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!framework) return null;

    const std = framework.standard;
    const scoreSummary = summary || {
        standard_score: 0, contribution_to_institutional_quality: 0,
        completion_rate_percent: 0, answered_indicators: 0, total_indicators: std.indicators_count,
        elements: [],
    };
    const elementScoreMap = {};
    (scoreSummary.elements || []).forEach(e => { elementScoreMap[e.element_id] = e; });

    const activeElement = framework.elements.find(e => e.id === activeElementId);

    const statCards = [
        // ⚠️ standard_score نسبة مئوية محسوبة (مجموع النقاط الفعلية / مجموع السقوف)×100، وليست نقاطاً خاماً من 240
        { label: isAr ? 'درجة معيار البحث العلمي' : 'Research standard score', value: scoreSummary.standard_score, suffix: '/100' },
        { label: isAr ? 'المساهمة في الجودة المؤسسية' : 'Contribution to institutional quality', value: scoreSummary.contribution_to_institutional_quality, suffix: `/${std.weight_percent}` },
        { label: isAr ? 'نسبة إكمال المؤشرات' : 'Indicators completion rate', value: scoreSummary.completion_rate_percent, suffix: '%' },
        { label: isAr ? 'المؤشرات المُدخلة' : 'Answered indicators', value: scoreSummary.answered_indicators, suffix: `/${scoreSummary.total_indicators}` },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* رأس الصفحة */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Award className="w-6 h-6 text-brand-orange" />
                        {isAr ? 'جودة الأكاديمية — معيار البحث العلمي' : 'Academic Quality — Scientific Research Standard'}
                    </h1>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        {isAr
                            ? `المعيار ${std.code} · الوزن في الاعتماد المؤسسي ${std.weight_percent}% · ${std.indicators_count} مؤشرًا ضمن 8 عناصر`
                            : `Standard ${std.code} · Weight in institutional accreditation ${std.weight_percent}% · ${std.indicators_count} indicators across 8 elements`}
                    </p>
                </div>
                <select
                    value={period}
                    onChange={e => { setOpenIndicatorId(null); setPeriod(e.target.value); }}
                    className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-brand-dark-border bg-white dark:bg-brand-dark-card text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30"
                >
                    {periodOptions().map(p => (
                        <option key={p} value={p}>{(isAr ? 'الفترة ' : 'Period ') + p}</option>
                    ))}
                </select>
            </div>

            {/* بطاقات الإحصائيات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map((s, i) => (
                    <div key={i} className="bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-200 dark:border-brand-dark-border/50 p-5">
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{s.label}</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">
                            {s.value}<small className="text-sm font-medium text-gray-400 dark:text-gray-500">{s.suffix}</small>
                        </p>
                    </div>
                ))}
            </div>

            {/* التخطيط: قائمة العناصر + لوحة المؤشرات */}
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">
                <nav className="bg-white dark:bg-brand-dark-card border border-gray-200 dark:border-brand-dark-border/50 rounded-2xl p-2.5 space-y-1 lg:sticky lg:top-6">
                    {framework.elements.map(el => {
                        const es = elementScoreMap[el.id];
                        const badge = es && es.answered_indicators > 0 ? `${es.element_score}/100` : `0/${el.indicators.length}`;
                        const active = el.id === activeElementId;
                        return (
                            <button
                                key={el.id}
                                type="button"
                                onClick={() => { setActiveElementId(el.id); setOpenIndicatorId(null); }}
                                className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-start transition-all ${
                                    active
                                        ? 'bg-orange-50 dark:bg-brand-orange/10 text-brand-orange-dark dark:text-brand-orange-light'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-brand-dark-hover/60'
                                }`}
                            >
                                <span className="truncate">{isAr ? el.name_ar : (el.name_en || el.name_ar)}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                                    active ? 'bg-brand-orange/20 text-brand-orange-dark dark:text-brand-orange-light' : 'bg-gray-100 dark:bg-brand-dark-hover text-gray-500 dark:text-gray-400'
                                }`}>{badge}</span>
                            </button>
                        );
                    })}
                </nav>

                <section className="bg-white dark:bg-brand-dark-card border border-gray-200 dark:border-brand-dark-border/50 rounded-2xl p-5 min-h-[300px]">
                    {activeElement && (
                        <>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">{isAr ? activeElement.name_ar : (activeElement.name_en || activeElement.name_ar)}</h2>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                                {isAr
                                    ? `${activeElement.indicators.length} مؤشرًا ضمن هذا العنصر — الفترة المرجعية ${period}`
                                    : `${activeElement.indicators.length} indicators in this element — reporting period ${period}`}
                            </p>

                            <div className="space-y-2.5">
                                {activeElement.indicators.map(ind => {
                                    const r = ind.response;
                                    const hasResponse = !!r;
                                    const score = r ? r.score : 0;
                                    const isOpen = openIndicatorId === ind.id;
                                    return (
                                        <div key={ind.id} className="border border-gray-100 dark:border-brand-dark-border/50 rounded-xl overflow-hidden">
                                            <button
                                                type="button"
                                                onClick={() => setOpenIndicatorId(isOpen ? null : ind.id)}
                                                className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-gray-50/70 dark:bg-brand-dark/60 text-start"
                                            >
                                                <span className="flex items-baseline gap-2.5 min-w-0">
                                                    <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">{ind.code}</span>
                                                    <span className="text-sm text-gray-900 dark:text-white truncate">{isAr ? ind.title_ar : (ind.title_en || ind.title_ar)}</span>
                                                </span>
                                                <span className="flex items-center gap-2 flex-shrink-0">
                                                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${scoreClasses(score, ind.max_score, hasResponse)}`}>
                                                        {hasResponse ? `${score}/${ind.max_score}` : (isAr ? 'لم يُدخل بعد' : 'Not entered')} · {indicatorTypeLabel(ind.indicator_type, isAr)}
                                                    </span>
                                                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                </span>
                                            </button>
                                            {isOpen && (
                                                <IndicatorForm
                                                    indicator={ind}
                                                    isAr={isAr}
                                                    period={period}
                                                    onSaved={loadAll}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AcademicQualityPage;
