import { useState, useEffect } from 'react';
import { Clock, CheckCircle, LogIn, FileText, UserPlus, ShieldCheck, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';

// ✅ أيقونة/لون تُشتقان من event_type القادم من الخادم (activity_log.event_type)
const EVENT_STYLES = {
    login: { icon: LogIn, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
    profile_update: { icon: FileText, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
    avatar_update: { icon: FileText, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
    research_submit: { icon: CheckCircle, color: 'text-[#e8623a] bg-[#e8623a]/10' },
    review_submit: { icon: ShieldCheck, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400' },
    task_complete: { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
    message_reply: { icon: MessageSquare, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
    settings_update: { icon: FileText, color: 'text-gray-500 bg-gray-100 dark:bg-[#2a231e] dark:text-gray-400' },
    account_approved: { icon: UserPlus, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
    account_rejected: { icon: UserPlus, color: 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400' },
};
const DEFAULT_STYLE = { icon: UserPlus, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400' };

const ActivityPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!entityId) return;
        setLoading(true);
        setError(null);
        fetch(`${API_BASE_URL}/get_activity.php?user_id=${entityId}`)
            .then(r => r.json())
            .then(r => {
                if (r.status === 'success') setLogs(r.data);
                else setError(r.message || (isAr ? 'فشل تحميل السجل' : 'Failed to load activity log'));
            })
            .catch(() => setError(isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server'))
            .finally(() => setLoading(false));
    }, [entityId]);

    return (
        <div className="p-6 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isAr ? 'سجل النشاط' : 'Activity Log'}</h1>
                <p className="text-sm text-gray-400 mt-1">{isAr ? 'آخر الأحداث والإجراءات على حسابك' : 'Recent actions on your account'}</p>
            </div>

            {error && !loading && (
                <div className="flex items-center gap-2.5 p-4 mb-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 text-[#e8623a] animate-spin" />
                    </div>
                ) : logs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600">
                        <Clock className="w-10 h-10 mb-3 opacity-40" />
                        <p className="text-sm font-medium">{isAr ? 'لا يوجد نشاط بعد' : 'No activity yet'}</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute start-5 top-0 bottom-0 w-px bg-gray-100 dark:bg-[#3a322c]" />
                        <div className="space-y-6">
                            {logs.map((log) => {
                                const style = EVENT_STYLES[log.event_type] || DEFAULT_STYLE;
                                const Icon = style.icon;
                                return (
                                    <div key={log.id} className="flex items-start gap-5 relative">
                                        <div className={`w-10 h-10 rounded-xl ${style.color} flex items-center justify-center flex-shrink-0 z-10`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 pb-6">
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{isAr ? log.action_ar : log.action_en}</p>
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                <p className="text-xs text-gray-400">{log.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityPage;
