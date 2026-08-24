import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, Users, BarChart3, BookOpen,
    TrendingUp, Clock, CheckCircle2, ArrowLeft,
    ArrowRight, MessageSquare, ClipboardList, Shield,
    Languages, AlertCircle, Loader2, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
    }),
};

// ✅ أيقونة الخدمة
const ServiceIcon = ({ service, className }) => {
    if (service === 'review') return <Shield className={className} />;
    if (service === 'translation') return <Languages className={className} />;
    return <FileText className={className} />;
};

// ✅ دالة الإحصائيات حسب الدور — تأخذ البيانات الحقيقية
const getStats = (role, lang, stats) => {
    const s = stats || {};

    if (role === 'employee') {
        return [
            {
                icon: ClipboardList,
                label: lang === 'ar' ? 'إجمالي الطلبات' : 'Total Requests',
                value: s.total_requests ?? 0,
                color: 'from-blue-500/20 to-blue-600/5',
                iconColor: 'text-blue-500 dark:text-blue-400',
                borderColor: 'border-blue-200 dark:border-blue-500/20',
                iconBg: 'bg-blue-100 dark:bg-blue-900/20',
            },
            {
                icon: CheckCircle2,
                label: lang === 'ar' ? 'مكتملة' : 'Completed',
                value: s.total_completed ?? 0,
                color: 'from-emerald-500/20 to-emerald-600/5',
                iconColor: 'text-emerald-500 dark:text-emerald-400',
                borderColor: 'border-emerald-200 dark:border-emerald-500/20',
                iconBg: 'bg-emerald-100 dark:bg-emerald-900/20',
            },
            {
                icon: Clock,
                label: lang === 'ar' ? 'قيد التنفيذ' : 'In Progress',
                value: s.total_in_progress ?? 0,
                color: 'from-amber-500/20 to-amber-600/5',
                iconColor: 'text-amber-500 dark:text-amber-400',
                borderColor: 'border-amber-200 dark:border-amber-500/20',
                iconBg: 'bg-amber-100 dark:bg-amber-900/20',
            },
            {
                icon: AlertCircle,
                label: lang === 'ar' ? 'تحتاج إجراء' : 'Needs Action',
                value: s.total_needs_action ?? 0,
                color: 'from-rose-500/20 to-rose-600/5',
                iconColor: 'text-rose-500 dark:text-rose-400',
                borderColor: 'border-rose-200 dark:border-rose-500/20',
                iconBg: 'bg-rose-100 dark:bg-rose-900/20',
            },
        ];
    }

    // باقي الأدوار (طالب، باحث...)
    return [
        {
            icon: Shield,
            label: lang === 'ar' ? 'طلبات التحكيم' : 'Review Requests',
            value: s.review_total ?? 0,
            color: 'from-[#c8a44e]/20 to-[#c8a44e]/5',
            iconColor: 'text-[#c8a44e] dark:text-[#d4b35a]',
            borderColor: 'border-[#c8a44e]/20 dark:border-[#c8a44e]/20',
            iconBg: 'bg-[#c8a44e]/10 dark:bg-[#c8a44e]/10',
        },
        {
            icon: Languages,
            label: lang === 'ar' ? 'طلبات الترجمة' : 'Translation Requests',
            value: s.translation_total ?? 0,
            color: 'from-blue-500/20 to-blue-600/5',
            iconColor: 'text-blue-500 dark:text-blue-400',
            borderColor: 'border-blue-200 dark:border-blue-500/20',
            iconBg: 'bg-blue-100 dark:bg-blue-900/20',
        },
        {
            icon: CheckCircle2,
            label: lang === 'ar' ? 'مكتملة' : 'Completed',
            value: s.total_completed ?? 0,
            color: 'from-emerald-500/20 to-emerald-600/5',
            iconColor: 'text-emerald-500 dark:text-emerald-400',
            borderColor: 'border-emerald-200 dark:border-emerald-500/20',
            iconBg: 'bg-emerald-100 dark:bg-emerald-900/20',
        },
        {
            icon: Clock,
            label: lang === 'ar' ? 'قيد التنفيذ' : 'In Progress',
            value: (s.total_in_progress ?? 0) + (s.total_pending ?? 0),
            color: 'from-amber-500/20 to-amber-600/5',
            iconColor: 'text-amber-500 dark:text-amber-400',
            borderColor: 'border-amber-200 dark:border-amber-500/20',
            iconBg: 'bg-amber-100 dark:bg-amber-900/20',
        },
    ];
};

// ✅ دالة الإجراءات السريعة حسب الدور
const getQuickActions = (role, lang) => {
    if (role === 'employee') {
        return [
            { icon: Shield, label: lang === 'ar' ? 'التحكيم' : 'Review', to: '../../dashboard/services/review', color: 'hover:border-[#c8a44e]/50 hover:bg-[#c8a44e]/5 dark:hover:border-[#c8a44e]/50 dark:hover:bg-[#c8a44e]/5' },
            { icon: Languages, label: lang === 'ar' ? 'الترجمة' : 'Translation', to: '../../dashboard/services/translation', color: 'hover:border-blue-500/50 hover:bg-blue-50 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/5' },
            { icon: FileText, label: lang === 'ar' ? 'سجل الطلبات' : 'Requests Log', to: '../../dashboard/dashboard/requests', color: 'hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/5' },
            { icon: BarChart3, label: lang === 'ar' ? 'التقارير' : 'Reports', to: '../../dashboard/dashboard/reports', color: 'hover:border-purple-500/50 hover:bg-purple-50 dark:hover:border-purple-500/50 dark:hover:bg-purple-500/5' },
        ];
    }

    return [
        { icon: Shield, label: lang === 'ar' ? 'طلب تحكيم' : 'Request Review', to: '../../dashboard/services/review', color: 'hover:border-[#c8a44e]/50 hover:bg-[#c8a44e]/5 dark:hover:border-[#c8a44e]/50 dark:hover:bg-[#c8a44e]/5' },
        { icon: Languages, label: lang === 'ar' ? 'طلب ترجمة' : 'Request Translation', to: '../../dashboard/services/translation', color: 'hover:border-blue-500/50 hover:bg-blue-50 dark:hover:border-blue-500/50 dark:hover:bg-blue-500/5' },
        { icon: BookOpen, label: lang === 'ar' ? 'سجل الطلبات' : 'Requests Log', to: '../../dashboard/dashboard/requests', color: 'hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/5' },
        { icon: TrendingUp, label: lang === 'ar' ? 'الإحصائيات' : 'Statistics', to: '../../dashboard/dashboard/stats', color: 'hover:border-purple-500/50 hover:bg-purple-50 dark:hover:border-purple-500/50 dark:hover:bg-purple-500/5' },
    ];
};

// ✅ هيكل Skeleton للتحميل
const StatSkeleton = () => (
    <div className="rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-[#1a2744]/50 dark:to-[#0d1a2e]/50 border border-gray-200 dark:border-[#1e3050]/30 p-4 lg:p-5 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-[#1e3050] mb-3" />
        <div className="w-16 h-8 rounded-lg bg-gray-200 dark:bg-[#1e3050] mb-1" />
        <div className="w-20 h-3 rounded bg-gray-200 dark:bg-[#1e3050]" />
    </div>
);

const ActivitySkeleton = () => (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#0d1a2e]/40 border border-gray-100 dark:border-[#1e3050]/20 animate-pulse">
        <div className="mt-1.5 w-2 h-2 rounded-full bg-gray-300 dark:bg-[#1e3050] flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="w-full h-3 rounded bg-gray-200 dark:bg-[#1e3050]" />
            <div className="w-24 h-2.5 rounded bg-gray-200 dark:bg-[#1e3050]" />
        </div>
        <div className="w-14 h-5 rounded-full bg-gray-200 dark:bg-[#1e3050] flex-shrink-0" />
    </div>
);

const DashboardHome = () => {
    const { user: userData, currentLang, isRTL } = useSite();
    const isAr = currentLang === 'ar';

    const Arrow = isRTL ? ArrowLeft : ArrowRight;
    const greeting = isAr ? 'مرحباً' : 'Welcome';
    const name = userData?.name?.split(' ')[0] || (isAr ? 'المستخدم' : 'User');

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ جلب البيانات
    const fetchDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('user_id', userData?.id || '');
            formData.append('lang', currentLang);

            const res = await fetch(`${API_BASE_URL}/get_dashboard.php`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            const result = await res.json();

            if (result.status === 'success') {
                setDashboardData(result.data);
            } else {
                setError(result.message || (isAr ? 'فشل تحميل البيانات' : 'Failed to load data'));
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError(isAr ? 'فشل الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userData?.id) fetchDashboard();
    }, [userData?.id]);

    const stats = getStats(userData?.role, currentLang, dashboardData?.stats);
    const quickActions = getQuickActions(userData?.role, currentLang);
    const activity = dashboardData?.activity || [];

    const typeStyles = {
        submit: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
        review: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
        accept: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    };
    const typeDots = { submit: 'bg-blue-500', review: 'bg-amber-500', accept: 'bg-emerald-500' };
    const typeLabels = {
        submit: isAr ? 'تقديم' : 'Submit',
        review: isAr ? 'مراجعة' : 'Review',
        accept: isAr ? 'مكتمل' : 'Done',
    };

    const serviceBadgeStyles = {
        review: 'bg-[#c8a44e]/10 text-[#c8a44e] dark:bg-[#c8a44e]/15',
        translation: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">

            {/* ─── الترحيب ─── */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="relative overflow-hidden rounded-2xl bg-white dark:bg-gradient-to-br dark:from-[#0f1d35] dark:to-[#0a1628] border border-gray-200 dark:border-[#1e3050]/50 p-6 lg:p-8 shadow-sm dark:shadow-none transition-colors duration-300">
                <div className="absolute top-0 start-0 w-64 h-64 bg-[#c8a44e]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 hidden dark:block" />
                <div className="absolute bottom-0 end-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 hidden dark:block" />

                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <p className="text-[#c8a44e] text-sm font-semibold mb-1">{greeting} 👋</p>
                        <h1 className="text-gray-900 dark:text-white text-2xl lg:text-3xl font-black mb-2 transition-colors duration-300">{name}</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-lg transition-colors duration-300">
                            {userData?.role === 'employee'
                                ? (isAr ? 'لوحة التحكم — تابع الطلبات، راجع الحالات، وأدِر عملك من مكان واحد.' : 'Control panel — track requests, review statuses, and manage your work from one place.')
                                : (isAr ? 'لوحة التحكم — تابع طلبات التحكيم والترجمة، راجع الحالات، وأدِر نشاطك من مكان واحد.' : 'Control panel — track review & translation requests, check statuses, and manage your activity from one place.')
                            }
                        </p>
                    </div>
                    <button
                        onClick={fetchDashboard}
                        disabled={loading}
                        className="p-2.5 rounded-xl border border-gray-200 dark:border-[#1e3050] bg-gray-50 dark:bg-[#0d1a2e] text-gray-400 hover:text-[#c8a44e] hover:border-[#c8a44e]/30 transition-all disabled:opacity-40"
                        title={isAr ? 'تحديث' : 'Refresh'}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </motion.div>

            {/* ─── خطأ ─── */}
            {error && !loading && (
                <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
                    className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30"
                >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium flex-1">{error}</p>
                    <button onClick={fetchDashboard} className="text-xs text-red-500 hover:text-red-600 font-semibold underline">{isAr ? 'إعادة المحاولة' : 'Retry'}</button>
                </motion.div>
            )}

            {/* ─── الإحصائيات ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
                    : stats.map((stat, i) => (
                        <motion.div key={stat.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible"
                            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.borderColor} p-4 lg:p-5 group hover:scale-[1.02] transition-all duration-200 shadow-sm dark:shadow-none`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center transition-colors duration-300`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor} transition-colors duration-300`} />
                                </div>
                            </div>
                            <p className="text-gray-900 dark:text-white text-2xl lg:text-3xl font-black mb-0.5 transition-colors duration-300">{stat.value}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium transition-colors duration-300">{stat.label}</p>
                        </motion.div>
                    ))
                }
            </div>

            {/* ─── إجراءات سريعة + النشاط الأخير ─── */}
            <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">

                {/* إجراءات سريعة */}
                <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2 bg-white dark:bg-[#0a1628]/60 border border-gray-200 dark:border-[#1e3050]/40 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors duration-300">
                    <h2 className="text-gray-900 dark:text-white text-sm font-bold mb-4 transition-colors duration-300">{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action) => (
                            <Link key={action.to} to={action.to}
                                className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border border-gray-200 dark:border-[#1e3050]/40 bg-gray-50 dark:bg-[#0d1a2e]/50 ${action.color} transition-all duration-200 group`}
                            >
                                <action.icon className="w-5 h-5 text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white transition-colors duration-200" />
                                <span className="text-xs text-gray-600 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white font-medium text-center transition-colors duration-200">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* النشاط الأخير */}
                <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-3 bg-white dark:bg-[#0a1628]/60 border border-gray-200 dark:border-[#1e3050]/40 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-gray-900 dark:text-white text-sm font-bold transition-colors duration-300">{isAr ? 'النشاط الأخير' : 'Recent Activity'}</h2>
                        {activity.length > 0 && (
                            <Link to="/dashboard/activity" className="text-[#c8a44e] text-xs font-medium hover:underline flex items-center gap-1">
                                {isAr ? 'عرض الكل' : 'View All'} <Arrow className="w-3 h-3" />
                            </Link>
                        )}
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => <ActivitySkeleton key={i} />)}
                        </div>
                    ) : activity.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-gray-600">
                            <Clock className="w-10 h-10 mb-3 opacity-40" />
                            <p className="text-sm font-medium">{isAr ? 'لا يوجد نشاط بعد' : 'No activity yet'}</p>
                            <p className="text-xs mt-1 opacity-70">{isAr ? 'ابدأ بطلب تحكيم أو ترجمة' : 'Start by requesting a review or translation'}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activity.map((item) => (
                                <div key={item.id}
                                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#0d1a2e]/40 border border-gray-100 dark:border-[#1e3050]/20 hover:border-gray-300 dark:hover:border-[#1e3050]/40 transition-colors duration-200"
                                >
                                    <div className="mt-1.5 flex-shrink-0">
                                        <span className={`block w-2 h-2 rounded-full ${typeDots[item.type] || 'bg-gray-400'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed transition-colors duration-300">
                                            {isAr ? item.text_ar : item.text_en}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                            <p className="text-gray-400 dark:text-gray-600 text-[10px] transition-colors duration-300">
                                                {isAr ? item.time_ago_ar : item.time_ago_en}
                                            </p>
                                            {/* شارة الخدمة */}
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${serviceBadgeStyles[item.service] || 'bg-gray-100 text-gray-500'}`}>
                                                {isAr ? item.service_ar : item.service_en}
                                            </span>
                                        </div>
                                    </div>
                                    {/* شارة الحالة */}
                                    <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors duration-300 ${typeStyles[item.type] || typeStyles.submit}`}>
                                        {typeLabels[item.type] || ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

            </div>
        </div>
    );
};

export default DashboardHome;