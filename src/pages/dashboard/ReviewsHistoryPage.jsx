import { useTranslation } from 'react-i18next';
import { History } from 'lucide-react';

const ReviewsHistoryPage = () => {
  const { t } = useTranslation();
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628]">{t('reviews_history.title')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('reviews_history.desc')}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <History className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-400 font-medium">{t('reviews_history.empty')}</p>
      </div>
    </div>
  );
};
export default ReviewsHistoryPage;