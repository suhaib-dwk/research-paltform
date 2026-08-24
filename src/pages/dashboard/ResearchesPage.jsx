import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Search, Plus, Eye, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const dummyResearches = [
  { id: 1, title_en: 'AI in Higher Education', title_ar: 'الذكاء الاصطناعي في التعليم العالي', status: 'published', date: '2025-01-10' },
  { id: 2, title_en: 'Water Resources Management', title_ar: 'إدارة الموارد المائية', status: 'under_review', date: '2025-01-05' },
  { id: 3, title_en: 'Renewable Energy Solutions', title_ar: 'حلول الطاقة المتجددة', status: 'draft', date: '2024-12-20' },
];

const statusColors = { published: 'bg-emerald-50 text-emerald-600', under_review: 'bg-[#c8a44e]/10 text-[#c8a44e]', draft: 'bg-gray-100 text-gray-500' };

const ResearchesPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = dummyResearches.filter(r => {
    const matchSearch = (isRTL ? r.title_ar : r.title_en).toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1628]">{t('researches.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('researches.desc')}</p>
        </div>
        <Link to="/dashboard/researches/new" className="flex items-center gap-2 bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all">
          <Plus className="w-4 h-4" /> {t('researches.add')}
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('researches.search')} className="w-full bg-[#f4f6fb] border border-gray-100 rounded-xl ps-10 pe-4 py-2.5 text-sm outline-none focus:border-[#c8a44e] transition-colors" />
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-[#f4f6fb] border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8a44e]">
            <option value="all">{t('researches.all_status')}</option>
            <option value="published">{t('researches.status_published')}</option>
            <option value="under_review">{t('researches.status_under_review')}</option>
            <option value="draft">{t('researches.status_draft')}</option>
          </select>
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">{t('employee.no_data')}</div>
          ) : filtered.map(r => (
            <div key={r.id} className="flex items-center gap-4 p-5 hover:bg-[#f4f6fb] transition-colors">
              <div className="w-11 h-11 rounded-xl bg-[#c8a44e]/10 text-[#c8a44e] flex items-center justify-center flex-shrink-0"><FileText className="w-5 h-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#0a1628] text-sm truncate">{isRTL ? r.title_ar : r.title_en}</p>
                <div className="flex items-center gap-1.5 mt-1"><Calendar className="w-3.5 h-3.5 text-gray-400" /><span className="text-xs text-gray-400">{r.date}</span></div>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0 ${statusColors[r.status]}`}>{t(`researches.status_${r.status}`)}</span>
              <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors flex-shrink-0"><Eye className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchesPage;