import { useState, useEffect } from 'react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';
import { ShieldCheck, Clock, FileText, Eye, Filter, Loader2, X, Save, XCircle } from 'lucide-react';

const REVIEW_TYPES = [
    { id: 'initial', label_ar: 'تحكيم أولي', label_en: 'Initial Review', desc_ar: 'تقييم أولي سريع لمدى ملاءمة البحث', desc_en: 'Quick initial assessment of research suitability', color: 'from-blue-500 to-blue-600', shadowColor: 'shadow-blue-500/20' },
    { id: 'expert', label_ar: 'تحكيم خبير', label_en: 'Expert Review', desc_ar: 'تحكيم متعمق من متخصص في المجال', desc_en: 'In-depth review by a field specialist', color: 'from-violet-500 to-violet-600', shadowColor: 'shadow-violet-500/20' },
    { id: 'final', label_ar: 'تحكيم نهائي', label_en: 'Final Review', desc_ar: 'مراجعة نهائية شاملة قبل النشر', desc_en: 'Comprehensive final review before publication', color: 'from-emerald-500 to-emerald-600', shadowColor: 'shadow-emerald-500/20' },
];

const statusConfig = {
    completed: { label_ar: 'مكتمل', label_en: 'Completed', cls: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
    in_progress: { label_ar: 'قيد التنفيذ', label_en: 'In Progress', cls: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
    pending: { label_ar: 'قيد الانتظار', label_en: 'Pending', cls: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
};

// ✅ نموذج إنهاء التحكيم (درجة + تعليقات) — يظهر فقط للسجلات in_progress
const SubmitReviewForm = ({ review, isAr, reviewerId, onDone }) => {
    const [score, setScore] = useState('');
    const [comments, setComments] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        if (score === '' || Number(score) < 0 || Number(score) > 100) {
            setError(isAr ? 'أدخل درجة صحيحة بين 0 و100' : 'Enter a valid score between 0 and 100');
            return;
        }
        setSaving(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('review_id', review.id);
            formData.append('reviewer_id', reviewerId);
            formData.append('score', score);
            formData.append('comments', comments);
            const res = await fetch(`${API_BASE_URL}/submit_review_score.php`, { method: 'POST', body: formData });
            const result = await res.json();
            if (result.status === 'success') {
                onDone(review.id, result.data.score);
            } else {
                setError(isAr ? 'فشل حفظ التحكيم' : 'Failed to submit review');
            }
        } catch (err) {
            setError(isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#3a322c]/50 space-y-3">
            {error && (
                <div className="flex items-center gap-2 text-xs text-red-500"><XCircle className="w-3.5 h-3.5" />{error}</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'الدرجة (0-100)' : 'Score (0-100)'}</label>
                    <input type="number" min="0" max="100" value={score} onChange={e => setScore(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#3a322c] bg-gray-50 dark:bg-[#1a1613] text-sm text-gray-900 dark:text-white outline-none focus:border-[#e8623a]" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'التعليقات' : 'Comments'}</label>
                    <textarea rows={2} value={comments} onChange={e => setComments(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-[#3a322c] bg-gray-50 dark:bg-[#1a1613] text-sm text-gray-900 dark:text-white outline-none focus:border-[#e8623a] resize-none" />
                </div>
            </div>
            <div className="flex justify-end">
                <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-l from-[#e8623a] to-[#f0916d] text-white text-xs font-bold hover:brightness-105 disabled:opacity-60 transition">
                    {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    {isAr ? 'إنهاء التحكيم' : 'Complete Review'}
                </button>
            </div>
        </div>
    );
};

const ReviewsPage = ({ statusFilter = null }) => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

    const [activeTab, setActiveTab] = useState('initial');
    const [filterStatus, setFilterStatus] = useState('all');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [detailsId, setDetailsId] = useState(null);
    const [details, setDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        if (!entityId) return;
        setLoading(true);
        // ✅ statusFilter (prop) يُستخدم بـ ReviewsHistoryPage لجلب completed فقط؛ الافتراضي هنا pending+in_progress
        const statusParam = statusFilter || 'pending,in_progress';
        fetch(`${API_BASE_URL}/get_reviews.php?reviewer_id=${entityId}&status=${statusParam}`)
            .then(r => r.json())
            .then(r => { if (r.status === 'success') setReviews(r.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [entityId, statusFilter]);

    const reviewsByType = statusFilter ? reviews : reviews.filter(r => r.review_type === activeTab);
    const filteredReviews = filterStatus === 'all' ? reviewsByType : reviewsByType.filter(r => r.status === filterStatus);

    const openDetails = (researchId) => {
        setDetailsId(researchId);
        setLoadingDetails(true);
        fetch(`${API_BASE_URL}/get_research_details.php?research_id=${researchId}&user_id=${entityId}`)
            .then(r => r.json())
            .then(r => { if (r.status === 'success') setDetails(r.data); })
            .catch(() => {})
            .finally(() => setLoadingDetails(false));
    };

    const handleReviewDone = (reviewId, score) => {
        setReviews(prev => statusFilter
            ? prev.filter(r => r.id !== reviewId) // اختفاء من قائمة الحالية بعد الإكمال (لا تُعرض هنا)
            : prev.map(r => r.id === reviewId ? { ...r, status: 'completed', score } : r)
        );
        setExpandedId(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-[#e8623a]" />
                    {isAr ? 'التحكيم' : 'Review'}
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{isAr ? 'إدارة طلبات التحكيم ومتابعتها' : 'Manage and track review requests'}</p>
            </div>

            {!statusFilter && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {REVIEW_TYPES.map(rt => {
                        const count = reviews.filter(r => r.review_type === rt.id).length;
                        const isActive = activeTab === rt.id;
                        return (
                            <button
                                key={rt.id}
                                onClick={() => { setActiveTab(rt.id); setFilterStatus('all'); }}
                                className={`relative text-start p-4 rounded-2xl border-2 transition-all overflow-hidden ${isActive ? 'border-transparent shadow-lg' : 'border-gray-200 dark:border-[#3a322c] hover:border-gray-300 dark:hover:border-[#4a4038]'}`}
                            >
                                {isActive && <div className={`absolute inset-0 bg-gradient-to-br ${rt.color} opacity-10`} />}
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className={`text-sm font-bold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{isAr ? rt.label_ar : rt.label_en}</h3>
                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-gray-800 dark:text-white' : 'bg-gray-200 dark:bg-[#3a322c] text-gray-500 dark:text-gray-400'}`}>{count}</span>
                                    </div>
                                    <p className={`text-[12px] leading-relaxed ${isActive ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>{isAr ? rt.desc_ar : rt.desc_en}</p>
                                    {isActive && <div className={`mt-3 h-0.5 w-8 rounded-full bg-gradient-to-r ${rt.color}`} />}
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <div className="flex gap-1">
                        {(statusFilter ? [{ key: 'all', label_ar: 'الكل', label_en: 'All' }] : [
                            { key: 'all', label_ar: 'الكل', label_en: 'All' },
                            { key: 'pending', label_ar: 'قيد الانتظار', label_en: 'Pending' },
                            { key: 'in_progress', label_ar: 'قيد التنفيذ', label_en: 'In Progress' },
                        ]).map(f => (
                            <button key={f.key} onClick={() => setFilterStatus(f.key)} className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${filterStatus === f.key ? 'bg-[#e8623a]/10 text-[#e8623a]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a231e]'}`}>
                                {isAr ? f.label_ar : f.label_en}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 text-[#e8623a] animate-spin" />
                </div>
            ) : filteredReviews.length === 0 ? (
                <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 p-12 text-center">
                    <ShieldCheck className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 dark:text-gray-500">{isAr ? 'لا توجد تحكيمات' : 'No reviews found'}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredReviews.map(review => {
                        const sc = statusConfig[review.status];
                        const type = REVIEW_TYPES.find(t => t.id === review.review_type) || REVIEW_TYPES[0];
                        return (
                            <div key={review.id} className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/50 p-5 hover:border-[#e8623a]/30 dark:hover:border-[#e8623a]/20 transition-all">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-[#2a231e] rounded-xl flex items-center justify-center flex-shrink-0">
                                            <FileText className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{isAr ? review.title_ar : (review.title_en || review.title_ar)}</h3>
                                            <div className="flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500">
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{review.date}</span>
                                                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" />{isAr ? type.label_ar : type.label_en}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 sm:flex-shrink-0">
                                        {review.score !== null && (
                                            <div className="text-center">
                                                <div className="text-lg font-black text-[#e8623a]">{review.score}%</div>
                                                <div className="text-[10px] text-gray-400">{isAr ? 'النتيجة' : 'Score'}</div>
                                            </div>
                                        )}
                                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${sc.cls}`}>{isAr ? sc.label_ar : sc.label_en}</span>
                                        <button onClick={() => openDetails(review.research_id)} className="p-2 rounded-xl text-gray-400 hover:text-[#e8623a] hover:bg-[#e8623a]/10 transition-all">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        {review.status === 'in_progress' && !statusFilter && (
                                            <button onClick={() => setExpandedId(expandedId === review.id ? null : review.id)} className="px-3 py-1.5 rounded-lg bg-[#e8623a]/10 text-[#e8623a] text-xs font-bold hover:bg-[#e8623a]/20 transition-colors">
                                                {isAr ? 'إنهاء' : 'Complete'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {expandedId === review.id && (
                                    <SubmitReviewForm review={review} isAr={isAr} reviewerId={entityId} onDone={handleReviewDone} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {detailsId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDetailsId(null)}>
                    <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-[#3a322c]/50">
                            <h3 className="font-bold text-gray-900 dark:text-white">{isAr ? 'تفاصيل البحث' : 'Research Details'}</h3>
                            <button onClick={() => setDetailsId(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-5">
                            {loadingDetails ? (
                                <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 text-[#e8623a] animate-spin" /></div>
                            ) : details && (
                                <div className="space-y-4 text-sm">
                                    <div><p className="text-xs text-gray-400 mb-1">{isAr ? 'العنوان' : 'Title'}</p><p className="font-semibold text-gray-900 dark:text-white">{isAr ? details.title_ar : (details.title_en || details.title_ar)}</p></div>
                                    <div><p className="text-xs text-gray-400 mb-1">{isAr ? 'الملخص' : 'Abstract'}</p><p className="text-gray-700 dark:text-gray-300 leading-relaxed">{details.abstract || '—'}</p></div>
                                    {details.keywords && <div><p className="text-xs text-gray-400 mb-1">{isAr ? 'الكلمات المفتاحية' : 'Keywords'}</p><p className="text-gray-700 dark:text-gray-300">{details.keywords}</p></div>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsPage;
