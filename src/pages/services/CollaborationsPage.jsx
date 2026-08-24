import { useTranslation } from 'react-i18next';
import { Handshake, Plus } from 'lucide-react';

const CollabsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1628]">{t('collabs.title')}</h1>
          <p className="text-sm text-gray-400 mt-1">{t('collabs.desc')}</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all">
          <Plus className="w-4 h-4" /> {t('collabs.request')}
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <Handshake className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-400 font-medium">{t('collabs.empty')}</p>
      </div>
    </div>
  );
};
export default CollabsPage;