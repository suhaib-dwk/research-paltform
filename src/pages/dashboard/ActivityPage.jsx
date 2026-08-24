import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, LogIn, FileText, UserPlus } from 'lucide-react';

const dummyLogs = [
  { id: 1, action_en: 'Logged in', action_ar: 'تسجيل دخول', time: '2025-01-15 09:30', icon: LogIn, color: 'text-blue-500 bg-blue-50' },
  { id: 2, action_en: 'Profile updated', action_ar: 'تحديث الملف الشخصي', time: '2025-01-14 14:20', icon: FileText, color: 'text-emerald-500 bg-emerald-50' },
  { id: 3, action_en: 'Research submitted', action_ar: 'تقديم بحث', time: '2025-01-13 11:00', icon: CheckCircle, color: 'text-[#c8a44e] bg-[#c8a44e]/10' },
  { id: 4, action_en: 'Account created', action_ar: 'إنشاء حساب', time: '2025-01-10 08:00', icon: UserPlus, color: 'text-purple-500 bg-purple-50' },
];

const ActivityPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628]">{t('activity.title')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('activity.desc')}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="relative">
          <div className="absolute start-5 top-0 bottom-0 w-px bg-gray-100" />
          <div className="space-y-6">
            {dummyLogs.map((log) => {
              const Icon = log.icon;
              return (
                <div key={log.id} className="flex items-start gap-5 relative">
                  <div className={`w-10 h-10 rounded-xl ${log.color} flex items-center justify-center flex-shrink-0 z-10`}><Icon className="w-5 h-5" /></div>
                  <div className="flex-1 pb-6">
                    <p className="font-semibold text-[#0a1628] text-sm">{isRTL ? log.action_ar : log.action_en}</p>
                    <div className="flex items-center gap-1.5 mt-1"><Clock className="w-3.5 h-3.5 text-gray-400" /><p className="text-xs text-gray-400">{log.time}</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;