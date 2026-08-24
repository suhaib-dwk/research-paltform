import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const dummyTasks = [
  { id: 1, title_en: 'Complete your profile', title_ar: 'أكمل ملفك الشخصي', status: 'pending', due: '2025-02-01' },
  { id: 2, title_en: 'Submit annual report', title_ar: 'قدم التقرير السنوي', status: 'in_progress', due: '2025-03-15' },
  { id: 3, title_en: 'Review research paper', title_ar: 'راجع ورقة بحثية', status: 'completed', due: '2025-01-10' },
];

const statusStyle = {
  pending: { bg: 'bg-orange-50', text: 'text-orange-600', icon: Clock },
  in_progress: { bg: 'bg-[#c8a44e]/10', text: 'text-[#c8a44e]', icon: AlertCircle },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-500', icon: CheckCircle },
};

const TasksPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628]">{t('tasks.title')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('tasks.desc')}</p>
      </div>
      <div className="space-y-4">
        {dummyTasks.map(task => {
          const style = statusStyle[task.status];
          const Icon = style.icon;
          return (
            <div key={task.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`w-11 h-11 rounded-xl ${style.bg} ${style.text} flex items-center justify-center flex-shrink-0`}><Icon className="w-5 h-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#0a1628] text-sm truncate">{isRTL ? task.title_ar : task.title_en}</p>
                <p className="text-xs text-gray-400 mt-1">{t('tasks.due')}: {task.due}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${style.bg} ${style.text} flex-shrink-0`}>{t(`tasks.status_${task.status}`)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksPage;