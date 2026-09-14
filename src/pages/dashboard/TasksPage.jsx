import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Loader2, Check } from 'lucide-react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';

const statusStyle = {
    pending: { bg: 'bg-orange-50 dark:bg-orange-900/15', text: 'text-orange-600 dark:text-orange-400', icon: Clock },
    in_progress: { bg: 'bg-[#e8623a]/10', text: 'text-[#e8623a]', icon: AlertCircle },
    completed: { bg: 'bg-emerald-50 dark:bg-emerald-900/15', text: 'text-emerald-500 dark:text-emerald-400', icon: CheckCircle },
};

const statusLabel = (status, isAr) => ({
    pending: isAr ? 'قيد الانتظار' : 'Pending',
    in_progress: isAr ? 'قيد التنفيذ' : 'In Progress',
    completed: isAr ? 'مكتمل' : 'Completed',
}[status] || status);

const TasksPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [completingId, setCompletingId] = useState(null);

    const fetchTasks = () => {
        if (!entityId) return;
        setLoading(true);
        fetch(`${API_BASE_URL}/get_tasks.php?user_id=${entityId}`)
            .then(r => r.json())
            .then(r => { if (r.status === 'success') setTasks(r.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(fetchTasks, [entityId]);

    const handleComplete = async (taskId) => {
        setCompletingId(taskId);
        try {
            const formData = new FormData();
            formData.append('task_id', taskId);
            formData.append('user_id', entityId || '');
            formData.append('status', 'completed');
            const res = await fetch(`${API_BASE_URL}/update_task_status.php`, { method: 'POST', body: formData });
            const result = await res.json();
            if (result.status === 'success') {
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed' } : t));
            }
        } catch (err) {
            console.error('Complete task error:', err);
        } finally {
            setCompletingId(null);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isAr ? 'المهام' : 'Tasks'}</h1>
                <p className="text-sm text-gray-400 mt-1">{isAr ? 'المهام والمطلوبات الموكلة إليك' : 'Tasks assigned to you'}</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 text-[#e8623a] animate-spin" />
                </div>
            ) : tasks.length === 0 ? (
                <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 p-12 text-center">
                    <CheckCircle className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium text-sm">{isAr ? 'لا توجد مهام حالياً' : 'No tasks yet'}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map(task => {
                        const style = statusStyle[task.status] || statusStyle.pending;
                        const Icon = style.icon;
                        return (
                            <div key={task.id} className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                                <div className={`w-11 h-11 rounded-xl ${style.bg} ${style.text} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{isAr ? task.title_ar : task.title_en}</p>
                                    {task.due && <p className="text-xs text-gray-400 mt-1">{isAr ? 'الموعد النهائي' : 'Due'}: {task.due}</p>}
                                </div>
                                {task.status !== 'completed' && (
                                    <button
                                        onClick={() => handleComplete(task.id)}
                                        disabled={completingId === task.id}
                                        className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors disabled:opacity-50"
                                        title={isAr ? 'تعليم كمكتمل' : 'Mark as complete'}
                                    >
                                        {completingId === task.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    </button>
                                )}
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${style.bg} ${style.text} flex-shrink-0`}>{statusLabel(task.status, isAr)}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TasksPage;
