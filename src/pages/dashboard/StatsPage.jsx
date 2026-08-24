import { useTranslation } from 'react-i18next';
import { FileText, TrendingUp, Eye, Download } from 'lucide-react';

const statsCards = [
  { key: 'researches', icon: FileText, color: 'from-[#c8a44e] to-[#e6c96e]' },
  { key: 'citations', icon: TrendingUp, color: 'from-emerald-500 to-emerald-400' },
  { key: 'views', icon: Eye, color: 'from-blue-500 to-blue-400' },
  { key: 'downloads', icon: Download, color: 'from-purple-500 to-purple-400' },
];

const StatsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628]">{t('stats.title')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('stats.desc')}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.key} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center mb-4 shadow-lg`}><Icon className="w-6 h-6" /></div>
              <p className="text-3xl font-black text-[#0a1628]">0</p>
              <p className="text-sm text-gray-400 mt-1">{t(`stats.${s.key}`)}</p>
            </div>
          );
        })}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <TrendingUp className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-400 font-medium">{t('stats.chart_placeholder')}</p>
      </div>
    </div>
  );
};
export default StatsPage;