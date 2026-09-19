import { useState, useEffect } from 'react';
import { FileText, Search, Plus, Eye, Calendar, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../../../SiteContext';
import { API_BASE_URL, resolveUploadUrl } from '../../../api';

const statusColors = {
    published: 'bg-emerald-50 dark:bg-emerald-900/15 text-emerald-600 dark:text-emerald-400',
    under_review: 'bg-brand-orange/10 text-brand-orange',
    draft: 'bg-gray-100 dark:bg-brand-dark-hover text-gray-500 dark:text-gray-400',
    rejected: 'bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400',
};

const statusLabel = (status, isAr) => ({
    published: isAr ? 'منشور' : 'Published',
    under_review: isAr ? 'قيد المراجعة' : 'Under Review',
    draft: isAr ? 'مسودة' : 'Draft',
    rejected: isAr ? 'مرفوض' : 'Rejected',
}[status] || status);

const ResearchesPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [researches, setResearches] = useState([]);
    const [loading, setLoading] = useState(true);

    const [detailsId, setDetailsId] = useState(null);
    const [details, setDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    useEffect(() => {
        if (!entityId) return;
        setLoading(true);
        fetch(`${API_BASE_URL}/get_researches.php?user_id=${entityId}`)
            .then(r => r.json())
            .then(r => { if (r.status === 'success') setResearches(r.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [entityId]);

    const filtered = researches.filter(r => {
        const title = isAr ? r.title_ar : (r.title_en || r.title_ar);
        const matchSearch = title.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || r.status === filter;
        return matchSearch && matchFilter;
    });

    const openDetails = (id) => {
        setDetailsId(id);
        setLoadingDetails(true);
        fetch(`${API_BASE_URL}/get_research_details.php?research_id=${id}&user_id=${entityId}`)
            .then(r => r.json())
            .then(r => { if (r.status === 'success') setDetails(r.data); })
            .catch(() => {})
            .finally(() => setLoadingDetails(false));
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isAr ? 'الأبحاث' : 'Researches'}</h1>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{isAr ? 'إدارة أبحاثك ومنشوراتك' : 'Manage your research and publications'}</p>
                </div>
                <Link to="/dashboard/researches/new" className="flex items-center gap-2 bg-gradient-to-l from-brand-orange to-brand-orange-light text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-brand-orange/25 transition-all">
                    <Plus className="w-4 h-4" /> {isAr ? 'بحث جديد' : 'New Research'}
                </Link>
            </div>

            <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-100 dark:border-brand-dark-border/50 overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-brand-dark-border/50 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={isAr ? 'بحث في الأبحاث...' : 'Search researches...'} className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-100 dark:border-brand-dark-border rounded-xl ps-10 pe-4 py-2.5 text-sm outline-none focus:border-brand-orange transition-colors text-gray-900 dark:text-white" />
                    </div>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-gray-50 dark:bg-brand-dark border border-gray-100 dark:border-brand-dark-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-orange text-gray-900 dark:text-white">
                        <option value="all">{isAr ? 'جميع الحالات' : 'All Status'}</option>
                        <option value="published">{isAr ? 'منشور' : 'Published'}</option>
                        <option value="under_review">{isAr ? 'قيد المراجعة' : 'Under Review'}</option>
                        <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
                    </select>
                </div>
                <div className="divide-y divide-gray-50 dark:divide-brand-dark-border/30">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12 text-gray-400 text-sm">{isAr ? 'لا توجد بيانات' : 'No data available'}</div>
                    ) : filtered.map(r => (
                        <div key={r.id} className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-brand-dark/40 transition-colors">
                            <div className="w-11 h-11 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5" /></div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{isAr ? r.title_ar : (r.title_en || r.title_ar)}</p>
                                <div className="flex items-center gap-1.5 mt-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /><span className="text-xs text-gray-400">{r.date}</span></div>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${statusColors[r.status]}`}>{statusLabel(r.status, isAr)}</span>
                            <button onClick={() => openDetails(r.id)} className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-brand-orange/10 text-brand-orange flex items-center justify-center hover:bg-orange-100 dark:hover:bg-brand-orange/20 transition-colors flex-shrink-0"><Eye className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            </div>

            {detailsId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDetailsId(null)}>
                    <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-100 dark:border-brand-dark-border/50 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-brand-dark-border/50">
                            <h3 className="font-bold text-gray-900 dark:text-white">{isAr ? 'تفاصيل البحث' : 'Research Details'}</h3>
                            <button onClick={() => setDetailsId(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-5">
                            {loadingDetails ? (
                                <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 text-brand-orange animate-spin" /></div>
                            ) : details && (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">{isAr ? 'العنوان' : 'Title'}</p>
                                        <p className="font-semibold text-gray-900 dark:text-white">{isAr ? details.title_ar : (details.title_en || details.title_ar)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">{isAr ? 'الملخص' : 'Abstract'}</p>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{details.abstract || '—'}</p>
                                    </div>
                                    {details.keywords && (
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">{isAr ? 'الكلمات المفتاحية' : 'Keywords'}</p>
                                            <p className="text-gray-700 dark:text-gray-300">{details.keywords}</p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusColors[details.status]}`}>{statusLabel(details.status, isAr)}</span>
                                        <span className="text-xs text-gray-400">{details.date}</span>
                                    </div>
                                    {details.file_path && (
                                        <a href={resolveUploadUrl(details.file_path)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-brand-orange hover:underline">
                                            <FileText className="w-4 h-4" />{details.file_name || (isAr ? 'تحميل الملف' : 'Download file')}
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResearchesPage;
