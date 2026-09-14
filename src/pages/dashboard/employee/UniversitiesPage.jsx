import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Search, Plus, Edit3, Trash2, Eye, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../../api';

const UniversitiesPage = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false; // مقارنة بادئة اللغة (يدعم ar-IQ ونحوها)
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE_URL}/get_dropdowns.php?type=universities`)
            .then(r => r.json())
            .then(r => { if (r.status === 'success') setData(r.data || []); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = data.filter(u => (isRTL ? u.name_ar : u.name_en)?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <Building2 className="w-6 h-6 text-[#e8623a]" />
                        {t('employee.universities.title')}
                    </h1>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t('employee.universities.desc')}</p>
                </div>
                <button className="flex items-center gap-2 bg-gradient-to-l from-[#e8623a] to-[#f0916d] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#e8623a]/25 transition-all">
                    <Plus className="w-4 h-4" /> {t('employee.add_btn')}
                </button>
            </div>
            <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-200 dark:border-[#3a322c]/60 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-[#3a322c]">
                    <div className="relative max-w-sm">
                        <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('employee.search')} className="w-full bg-gray-50 dark:bg-[#1a1613] border border-gray-200 dark:border-[#3a322c]/60 rounded-xl ps-10 pe-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:border-[#e8623a] transition-colors" />
                    </div>
                </div>
                {loading ? (
                    <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#e8623a]" /></div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-[#3a322c]">
                                    <th className="text-start text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">#</th>
                                    <th className="text-start text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">{t('employee.name')}</th>
                                    <th className="text-start text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-5 py-3">{t('employee.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={3} className="text-center py-12 text-gray-400 dark:text-gray-500 text-sm">{t('employee.no_data')}</td></tr>
                                ) : filtered.map((item, i) => (
                                    <tr key={item.id} className="border-b border-gray-100 dark:border-[#3a322c] hover:bg-gray-50 dark:hover:bg-[#2a231e] transition-colors">
                                        <td className="px-5 py-3.5 text-sm text-gray-400 dark:text-gray-500">{i + 1}</td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-[#e8623a]/10 text-[#e8623a] flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">{isRTL ? item.name_ar : item.name_en}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <button className="w-8 h-8 rounded-lg bg-[#e8623a]/10 text-[#e8623a] flex items-center justify-center hover:bg-[#e8623a]/20 transition-colors"><Eye className="w-4 h-4" /></button>
                                                <button className="w-8 h-8 rounded-lg bg-[#e8623a]/10 text-[#e8623a] flex items-center justify-center hover:bg-[#e8623a]/20 transition-colors"><Edit3 className="w-4 h-4" /></button>
                                                <button className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UniversitiesPage;