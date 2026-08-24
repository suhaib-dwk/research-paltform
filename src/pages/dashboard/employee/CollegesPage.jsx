import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Search, Plus, Edit3, Trash2, Eye, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../../api';

const CollegesPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/get_dropdowns.php?type=colleges`)
      .then(r => r.json())
      .then(r => { if (r.status === 'success') setData(r.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(c => (isRTL ? c.name_ar : c.name_en)?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1628]">{t('employee.colleges.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('employee.colleges.desc')}</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all">
          <Plus className="w-4 h-4" /> {t('employee.add_btn')}
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <div className="relative max-w-sm">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('employee.search')} className="w-full bg-[#f4f6fb] border border-gray-100 rounded-xl ps-10 pe-4 py-2.5 text-sm outline-none focus:border-[#c8a44e] transition-colors" />
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-[#c8a44e]" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">#</th>
                  <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{t('employee.name')}</th>
                  <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{t('employee.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-12 text-gray-400 text-sm">{t('employee.no_data')}</td></tr>
                ) : filtered.map((item, i) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-[#f4f6fb] transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-400">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                        <span className="text-sm font-semibold text-[#0a1628]">{isRTL ? item.name_ar : item.name_en}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"><Eye className="w-4 h-4" /></button>
                        <button className="w-8 h-8 rounded-lg bg-[#c8a44e]/10 text-[#c8a44e] flex items-center justify-center hover:bg-[#c8a44e]/20 transition-colors"><Edit3 className="w-4 h-4" /></button>
                        <button className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

export default CollegesPage;