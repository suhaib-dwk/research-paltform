import { useState, useEffect } from 'react';
import { FileText, TrendingUp, Eye, Download, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';

const CARD_DEFS = [
    { key: 'researches', icon: FileText, color: 'from-[#e8623a] to-[#f0916d]' },
    { key: 'citations', icon: TrendingUp, color: 'from-emerald-500 to-emerald-400' },
    { key: 'views', icon: Eye, color: 'from-blue-500 to-blue-400' },
    { key: 'downloads', icon: Download, color: 'from-purple-500 to-purple-400' },
];

const CARD_LABELS = {
    researches: { ar: 'الأبحاث', en: 'Researches' },
    citations: { ar: 'الاستشهادات', en: 'Citations' },
    views: { ar: 'المشاهدات', en: 'Views' },
    downloads: { ar: 'التحميلات', en: 'Downloads' },
};

const StatsPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

    const [stats, setStats] = useState({ researches: 0, citations: 0, views: 0, downloads: 0, monthly: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!entityId) return;
        setLoading(true);
        fetch(`${API_BASE_URL}/get_stats.php?user_id=${entityId}`)
            .then(r => r.json())
            .then(r => { if (r.status === 'success') setStats(r.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [entityId]);

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isAr ? 'الإحصائيات' : 'Statistics'}</h1>
                <p className="text-sm text-gray-400 mt-1">{isAr ? 'إحصائيات أبحاثك ومنشوراتك' : 'Your research and publication stats'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {CARD_DEFS.map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.key} className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 p-6 hover:shadow-md transition-shadow">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-4 shadow-lg`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <p className="text-3xl font-black text-gray-900 dark:text-white">{loading ? '—' : stats[s.key]}</p>
                            <p className="text-sm text-gray-400 mt-1">{isAr ? CARD_LABELS[s.key].ar : CARD_LABELS[s.key].en}</p>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 p-6">
                <h2 className="text-gray-900 dark:text-white text-sm font-bold mb-4">{isAr ? 'الأبحاث الشهرية' : 'Monthly Research Submissions'}</h2>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-6 h-6 text-[#e8623a] animate-spin" />
                    </div>
                ) : (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-gray-100 dark:stroke-[#3a322c]/40" />
                                <XAxis dataKey={isAr ? 'label_ar' : 'label_en'} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(232, 98, 58, 0.06)' }}
                                    contentStyle={{ borderRadius: 12, border: '1px solid #f3f4f6', fontSize: 12 }}
                                    labelStyle={{ fontWeight: 700, marginBottom: 4 }}
                                />
                                <Bar dataKey="total" fill="#e8623a" radius={[6, 6, 0, 0]} maxBarSize={36} name={isAr ? 'الأبحاث' : 'Researches'} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsPage;
