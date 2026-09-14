import { useState, useEffect } from 'react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL, resolveUploadUrl } from '../../api';
import { Briefcase, Clock, FileText, Filter, Loader2, X, Send, XCircle, CheckCircle, Download, Inbox } from 'lucide-react';

// ===== أسماء الخدمات (تطابق servicesConfig.js) =====
const SERVICE_LABELS = {
    translation: { ar: 'الترجمة', en: 'Translation' },
    proofreading: { ar: 'التدقيق اللغوي', en: 'Language Editing' },
    consultation: { ar: 'الاستشارة', en: 'Consultation' },
    'journal-selection': { ar: 'اختيار مجلة', en: 'Journal Selection' },
    'journal-evaluation': { ar: 'تقييم مجلة', en: 'Journal Evaluation' },
    template: { ar: 'قوالب البحث', en: 'Research Templates' },
    correspondence: { ar: 'المراسلات', en: 'Correspondence' },
    publication: { ar: 'النشر', en: 'Publication' },
};

const statusConfig = {
    pending: { label_ar: 'قيد الانتظار', label_en: 'Pending', cls: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
    assigned: { label_ar: 'مُسنَد إليك', label_en: 'Assigned to you', cls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' },
    in_progress: { label_ar: 'قيد التنفيذ', label_en: 'In Progress', cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
    completed: { label_ar: 'مكتمل', label_en: 'Completed', cls: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
    rejected: { label_ar: 'مرفوض', label_en: 'Rejected', cls: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' },
};

const getApiError = (serverMsg, isAr) => {
    if (!serverMsg) return isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred';
    const map = {
        already_assigned: { ar: 'تم استلام هذا الطلب من قِبل مقدّم خدمة آخر بالفعل', en: 'This request has already been claimed by another provider' },
        not_qualified_for_service: { ar: 'أنت غير مختص بهذه الخدمة', en: 'You are not qualified for this service' },
        not_assigned_to_you: { ar: 'هذا الطلب غير مُسنَد إليك', en: 'This request is not assigned to you' },
    };
    const lower = serverMsg.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    for (const [key, trans] of Object.entries(map)) {
        if (lower.includes(key)) return isAr ? trans.ar : trans.en;
    }
    return serverMsg;
};

// ===== نموذج رفع نتيجة الخدمة (Modal) =====
const SubmitResultForm = ({ request, isAr, providerId, onDone, onClose }) => {
    const [resultNotes, setResultNotes] = useState('');
    const [resultFile, setResultFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setSaving(true);
        setError(null);
        try {
            const fd = new FormData();
            fd.append('provider_id', providerId);
            fd.append('service_slug', request.service_slug);
            fd.append('request_id', request.id);
            fd.append('result_notes', resultNotes.trim());
            if (resultFile) fd.append('result_file', resultFile);
            const res = await fetch(`${API_BASE_URL}/submit_service_result.php`, { method: 'POST', body: fd });
            const result = await res.json();
            if (result.status === 'success') {
                onDone(request.id);
            } else {
                setError(getApiError(result.message, isAr));
            }
        } catch (err) {
            setError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-[#3a322c]/50">
                    <h3 className="font-bold text-gray-900 dark:text-white">{isAr ? 'رفع نتيجة الخدمة' : 'Submit Service Result'}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-5 space-y-4">
                    {error && (
                        <div className="flex items-center gap-2 text-xs text-red-500"><XCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}</div>
                    )}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'ملاحظات النتيجة' : 'Result Notes'}</label>
                        <textarea rows={4} value={resultNotes} onChange={e => setResultNotes(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#3a322c] bg-gray-50 dark:bg-[#1a1613] text-sm text-gray-900 dark:text-white outline-none focus:border-[#e8623a] resize-none" placeholder={isAr ? 'اكتب ملاحظاتك للطالب...' : 'Write your notes for the requester...'} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'ملف النتيجة (اختياري)' : 'Result File (optional)'}</label>
                        <label className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 dark:border-[#3a322c] rounded-xl cursor-pointer hover:border-[#e8623a]/50 hover:bg-[#e8623a]/5 transition-all">
                            <input type="file" className="hidden" accept=".pdf,.doc,.docx,.zip" onChange={e => setResultFile(e.target.files?.[0] || null)} />
                            {resultFile ? (
                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2"><CheckCircle className="w-4 h-4" />{resultFile.name}</span>
                            ) : (
                                <span className="text-xs text-gray-400">{isAr ? 'اختر ملفاً (PDF, DOC, DOCX, ZIP)' : 'Choose a file (PDF, DOC, DOCX, ZIP)'}</span>
                            )}
                        </label>
                    </div>
                    <button onClick={handleSubmit} disabled={saving} className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-l from-[#e8623a] to-[#f0916d] text-white text-sm font-bold hover:brightness-105 disabled:opacity-60 transition">
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        {isAr ? 'إرسال النتيجة' : 'Submit Result'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProviderRequestsPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

    const [activeTab, setActiveTab] = useState('available'); // available | mine
    const [serviceFilter, setServiceFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [data, setData] = useState({ qualified_services: [], available_requests: [], my_requests: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accepting, setAccepting] = useState(null);
    const [resultTarget, setResultTarget] = useState(null);
    const [actionError, setActionError] = useState(null);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append('provider_id', entityId || '');
            const res = await fetch(`${API_BASE_URL}/get_provider_dashboard.php`, { method: 'POST', body: fd });
            const result = await res.json();
            if (result.status === 'success') {
                setData(result.data);
                setError(null);
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (entityId) fetchDashboard(); }, [entityId]);

    const handleAccept = async (req) => {
        setAccepting(req.id + req.service_slug);
        setActionError(null);
        try {
            const fd = new FormData();
            fd.append('provider_id', entityId);
            fd.append('service_slug', req.service_slug);
            fd.append('request_id', req.id);
            const res = await fetch(`${API_BASE_URL}/accept_service_request.php`, { method: 'POST', body: fd });
            const result = await res.json();
            if (result.status === 'success') {
                fetchDashboard();
            } else {
                setActionError(getApiError(result.message, isAr));
            }
        } catch (err) {
            setActionError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setAccepting(null);
        }
    };

    const handleResultDone = () => {
        setResultTarget(null);
        fetchDashboard();
    };

    const list = activeTab === 'available' ? data.available_requests : data.my_requests;
    const filteredList = list
        .filter(r => serviceFilter === 'all' || r.service_slug === serviceFilter)
        .filter(r => activeTab === 'mine' ? (statusFilter === 'all' || r.status === statusFilter) : true);

    const serviceLabel = (slug) => SERVICE_LABELS[slug] ? (isAr ? SERVICE_LABELS[slug].ar : SERVICE_LABELS[slug].en) : slug;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-[#e8623a]" />
                    {isAr ? 'طلبات الخدمة' : 'Service Requests'}
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{isAr ? 'إدارة طلبات الخدمات التي تقدّمها' : 'Manage requests for the services you provide'}</p>
            </div>

            {actionError && (
                <div className="flex items-center gap-2 p-3.5 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium">
                    <XCircle className="w-5 h-5 flex-shrink-0" />{actionError}
                </div>
            )}

            {/* ---- تبويبات ---- */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-[#1a1613] rounded-xl w-fit">
                {[
                    { key: 'available', label_ar: 'الطلبات المتاحة', label_en: 'Available Requests', count: data.available_requests.length },
                    { key: 'mine', label_ar: 'طلباتي', label_en: 'My Requests', count: data.my_requests.length },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => { setActiveTab(tab.key); setStatusFilter('all'); }}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-white dark:bg-[#211c18] text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        {isAr ? tab.label_ar : tab.label_en}
                        <span className={`ms-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-[#e8623a]/15 text-[#e8623a]' : 'bg-gray-200 dark:bg-[#3a322c] text-gray-500 dark:text-gray-400'}`}>{tab.count}</span>
                    </button>
                ))}
            </div>

            {/* ---- فلاتر ---- */}
            <div className="flex flex-wrap items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-[#3a322c] bg-white dark:bg-[#211c18] text-gray-600 dark:text-gray-300 outline-none">
                    <option value="all">{isAr ? 'كل الخدمات' : 'All Services'}</option>
                    {data.qualified_services.map(slug => (
                        <option key={slug} value={slug}>{serviceLabel(slug)}</option>
                    ))}
                </select>
                {activeTab === 'mine' && (
                    <div className="flex gap-1">
                        {[
                            { key: 'all', label_ar: 'الكل', label_en: 'All' },
                            { key: 'assigned', label_ar: 'مُسنَد', label_en: 'Assigned' },
                            { key: 'completed', label_ar: 'مكتمل', label_en: 'Completed' },
                        ].map(f => (
                            <button key={f.key} onClick={() => setStatusFilter(f.key)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${statusFilter === f.key ? 'bg-[#e8623a]/10 text-[#e8623a]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a231e]'}`}>
                                {isAr ? f.label_ar : f.label_en}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 text-[#e8623a] animate-spin" />
                </div>
            ) : error ? (
                <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 p-12 text-center">
                    <XCircle className="w-10 h-10 text-red-300 dark:text-red-700 mx-auto mb-3" />
                    <p className="text-gray-400 dark:text-gray-500">{error}</p>
                </div>
            ) : filteredList.length === 0 ? (
                <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 p-12 text-center">
                    <Inbox className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 dark:text-gray-500">{isAr ? 'لا توجد طلبات' : 'No requests found'}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredList.map(req => {
                        const sc = statusConfig[req.status] || statusConfig.pending;
                        return (
                            <div key={`${req.service_slug}-${req.id}`} className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 p-5 hover:border-[#e8623a]/30 dark:hover:border-[#e8623a]/20 transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-[#2a231e] rounded-xl flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 truncate">{req.meta || serviceLabel(req.service_slug)}</h3>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400 dark:text-gray-500">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{req.created_at?.split(' ')[0]}</span>
                                                <span className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-[#2a231e] font-semibold">{serviceLabel(req.service_slug)}</span>
                                            </div>
                                            {req.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">{req.notes}</p>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${sc.cls}`}>{isAr ? sc.label_ar : sc.label_en}</span>
                                        {activeTab === 'available' && (
                                            <button onClick={() => handleAccept(req)} disabled={accepting === req.id + req.service_slug} className="px-3 py-1.5 rounded-lg bg-[#e8623a]/10 text-[#e8623a] text-xs font-bold hover:bg-[#e8623a]/20 disabled:opacity-50 transition-colors flex items-center gap-1.5">
                                                {accepting === req.id + req.service_slug ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                                                {isAr ? 'استلام' : 'Accept'}
                                            </button>
                                        )}
                                        {activeTab === 'mine' && (req.status === 'assigned' || req.status === 'in_progress') && (
                                            <button onClick={() => setResultTarget(req)} className="px-3 py-1.5 rounded-lg bg-[#e8623a]/10 text-[#e8623a] text-xs font-bold hover:bg-[#e8623a]/20 transition-colors">
                                                {isAr ? 'رفع النتيجة' : 'Submit Result'}
                                            </button>
                                        )}
                                        {activeTab === 'mine' && req.status === 'completed' && req.result_file_path && (
                                            <a href={resolveUploadUrl(req.result_file_path)} download className="p-2 rounded-xl text-gray-400 hover:text-[#e8623a] hover:bg-[#e8623a]/10 transition-all">
                                                <Download className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                {activeTab === 'mine' && req.status === 'completed' && req.result_notes && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#3a322c]/30 text-xs text-gray-600 dark:text-gray-400">
                                        <span className="font-semibold text-gray-500 dark:text-gray-400">{isAr ? 'ملاحظاتك: ' : 'Your notes: '}</span>{req.result_notes}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {resultTarget && (
                <SubmitResultForm request={resultTarget} isAr={isAr} providerId={entityId} onDone={handleResultDone} onClose={() => setResultTarget(null)} />
            )}
        </div>
    );
};

export default ProviderRequestsPage;
