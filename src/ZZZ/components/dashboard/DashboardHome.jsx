import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    FileText, BarChart3, BookOpen,
    TrendingUp, Clock, CheckCircle2, ArrowLeft,
    ArrowRight, MessageSquare, ClipboardList, Shield,
    Languages, AlertCircle, Loader2, RefreshCw, Eye, Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList,
    PieChart, Pie,
} from 'recharts';
import { useSite } from '../../../SiteContext';
import { API_BASE_URL } from '../../../api';
import { Card, CardHeader, KpiCard, StatusPill, PillButton, SelectPill } from './ui';

// ✅ استيراد لوحة التحكم الوطنية للوزارة
// تأكد من المسار الصحيح بناءً على مكان حفظ الملف السابق
import MinistryNationalDashboard from '../../pages/ministry/MinistryNationalDashboard';

// =========================================================
// الصفحة الرئيسية للداشبورد (كل الأدوار ما عدا الوزارة) — التصميم المرجعي
// الجديد: بطاقات مؤشرات بشرائح اتجاه، رسم أعمدة بخلفيات رمادية شبحية وعمود
// مميّز بشارة برتقالية، جدول النشاط الأخير بشارات حالة، ودونات توزيع الطلبات.
// منطق البيانات (get_dashboard.php + get_stats.php) كما هو دون تغيير.
// =========================================================

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
    const ar = lang === 'ar';

    if (role === 'employee') {
        return [
            { icon: ClipboardList, label: ar ? 'إجمالي الطلبات' : 'Total Requests', value: s.total_requests ?? 0, sub: ar ? 'طلب' : 'Requests', trendKey: 'requests' },
            { icon: CheckCircle2, label: ar ? 'مكتملة' : 'Completed', value: s.total_completed ?? 0, sub: ar ? 'طلب مكتمل' : 'Completed requests' },
            { icon: Clock, label: ar ? 'قيد التنفيذ' : 'In Progress', value: s.total_in_progress ?? 0, sub: ar ? 'طلب قيد التنفيذ' : 'Requests in progress' },
            { icon: AlertCircle, label: ar ? 'تحتاج إجراء' : 'Needs Action', value: s.total_needs_action ?? 0, sub: ar ? 'طلب بانتظارك' : 'Awaiting you' },
        ];
    }

    // باقي الأدوار (طالب، باحث...)
    return [
        { icon: Shield, label: ar ? 'طلبات التحكيم' : 'Review Requests', value: s.review_total ?? 0, sub: ar ? 'طلب تحكيم' : 'Review requests', trendKey: 'requests' },
        { icon: Languages, label: ar ? 'طلبات الترجمة' : 'Translation Requests', value: s.translation_total ?? 0, sub: ar ? 'طلب ترجمة' : 'Translation requests' },
        { icon: CheckCircle2, label: ar ? 'مكتملة' : 'Completed', value: s.total_completed ?? 0, sub: ar ? 'طلب مكتمل' : 'Completed requests' },
        { icon: Clock, label: ar ? 'قيد التنفيذ' : 'In Progress', value: (s.total_in_progress ?? 0) + (s.total_pending ?? 0), sub: ar ? 'قيد التنفيذ أو الانتظار' : 'In progress or pending' },
    ];
};

// ✅ دالة الإجراءات السريعة حسب الدور
const getQuickActions = (role, lang) => {
    const ar = lang === 'ar';
    if (role === 'employee') {
        return [
            { icon: Shield, label: ar ? 'التحكيم' : 'Review', to: '../../dashboard/services/review' },
            { icon: Languages, label: ar ? 'الترجمة' : 'Translation', to: '../../dashboard/services/translation' },
            { icon: FileText, label: ar ? 'سجل الطلبات' : 'Requests Log', to: '../../dashboard/dashboard/requests' },
            { icon: BarChart3, label: ar ? 'التقارير' : 'Reports', to: '../../dashboard/dashboard/reports' },
        ];
    }

    return [
        { icon: Shield, label: ar ? 'طلب تحكيم' : 'Request Review', to: '../../dashboard/services/review' },
        { icon: Languages, label: ar ? 'طلب ترجمة' : 'Request Translation', to: '../../dashboard/services/translation' },
        { icon: BookOpen, label: ar ? 'سجل الطلبات' : 'Requests Log', to: '../../dashboard/dashboard/requests' },
        { icon: MessageSquare, label: ar ? 'طلب استشارة' : 'Request Consultation', to: '../../dashboard/services/consultation' },
    ];
};

// ✅ بيانات رسم "النشاط الشهري" — تُبنى من dashboardData.monthly إن توفرت من الخادم،
// وإلا بيانات افتراضية معقولة (placeholder) بنفس اسم الأشهر المترجَم
const MONTH_KEYS_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const MONTH_KEYS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getMonthlyChartData = (monthly, isAr) => {
    if (Array.isArray(monthly) && monthly.length > 0) {
        return monthly.map((m, i) => ({
            month: isAr ? (m.label_ar || MONTH_KEYS_AR[i % 12]) : (m.label_en || MONTH_KEYS_EN[i % 12]),
            requests: m.total ?? m.requests ?? 0,
        }));
    }
    // Placeholder: لا توجد بيانات فعلية بعد من get_dashboard.php
    return MONTH_KEYS_EN.map((_, i) => ({
        month: isAr ? MONTH_KEYS_AR[i] : MONTH_KEYS_EN[i],
        requests: 0,
    }));
};

// ✅ نسبة التغيّر بين آخر شهرين له بيانات (لشريحة الاتجاه) — null إن تعذّر حسابها
const getTrend = (series) => {
    const vals = (series || []).map((d) => Number(d) || 0);
    const nonZero = vals.map((v, i) => [v, i]).filter(([v]) => v > 0);
    if (nonZero.length < 2) return null;
    const [last] = nonZero[nonZero.length - 1];
    const [prev] = nonZero[nonZero.length - 2];
    if (!prev) return null;
    return ((last - prev) / prev) * 100;
};

// ✅ شارة القيمة فوق العمود المميَّز (الأعلى) — نمط المرجع
const PeakLabel = ({ x, y, width, value, index, peakIndex }) => {
    if (index !== peakIndex || !value) return null;
    const cx = x + width / 2;
    return (
        <g>
            <rect x={cx - 18} y={y - 30} width={36} height={22} rx={6} fill="#FF8710" />
            <polygon points={`${cx - 5},${y - 8} ${cx + 5},${y - 8} ${cx},${y - 3}`} fill="#FF8710" />
            <text x={cx} y={y - 15} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={800}>{value}</text>
        </g>
    );
};

const PeakBarChart = ({ data, dataKey, xKey, name, isAr, height = 288 }) => {
    // ✅ ألوان الرسم من لوحة الهوية، متجاوبة مع الوضع الداكن (recharts لا يقبل Tailwind classes)
    const { theme } = useSite();
    const dark = theme === 'dark';
    const C = dark
        ? { ghost: '#2E2620', grid: '#3A2F27', bar: '#BCBCBC', tick: '#9ca3af', tipBorder: '#3A2F27' }
        : { ghost: '#F3F4F6', grid: '#E5E7EB', bar: '#241B14', tick: '#9ca3af', tipBorder: '#F3F4F6' };
    const values = data.map((d) => Number(d[dataKey]) || 0);
    const max = Math.max(0, ...values);
    const peakIndex = max > 0 ? values.indexOf(max) : -1;
    // ✅ الأعمدة "الشبحية" الرمادية خلف كل شهر (نمط المرجع): عمود مكدّس فوق
    // القيمة الفعلية يكمّلها إلى الحد الأعلى، فيظهر كل شهر كعمود فاتح كامل
    // الارتفاع والجزء الداكن منه هو القيمة الحقيقية — حتى الأشهر الصفرية.
    const capacity = max > 0 ? max : 1;
    const chartData = data.map((d, i) => ({ ...d, __rest: capacity - values[i] }));
    return (
        <div className="relative" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 36, right: 4, left: -18, bottom: 0 }} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="4 6" vertical={false} stroke={C.grid} />
                    <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: C.tick, fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: C.tick }} axisLine={false} tickLine={false} allowDecimals={false} domain={[0, capacity]} />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,135,16,0.06)' }}
                        contentStyle={{ borderRadius: 14, border: `1px solid ${C.tipBorder}`, fontSize: 12, boxShadow: '0 12px 30px -12px rgba(31,26,23,0.25)', background: dark ? '#241B14' : '#fff', color: dark ? '#fff' : '#241B14' }}
                        labelStyle={{ fontWeight: 700, marginBottom: 4 }}
                    />
                    {/* ⚠️ recharts لا يقبل Tailwind classes على fill — قيم CSS مباشرة (#FF8710 = brand.orange) */}
                    <Bar dataKey={dataKey} name={name} stackId="a" radius={[8, 8, 8, 8]} maxBarSize={44}>
                        {chartData.map((_, i) => (
                            <Cell key={i} fill={i === peakIndex ? '#FF8710' : C.bar} />
                        ))}
                        <LabelList dataKey={dataKey} content={(props) => <PeakLabel {...props} peakIndex={peakIndex} />} />
                    </Bar>
                    <Bar dataKey="__rest" stackId="a" fill={C.ghost} radius={[8, 8, 0, 0]} maxBarSize={44} isAnimationActive={false} tooltipType="none" legendType="none" />
                </BarChart>
            </ResponsiveContainer>
            {max === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-brand-dark-card/90 text-xs font-bold text-gray-400 shadow-sm">{isAr ? 'لا توجد بيانات بعد' : 'No data yet'}</span>
                </div>
            )}
        </div>
    );
};

// ✅ هيكل Skeleton للتحميل
const StatSkeleton = () => (
    <Card className="p-6 animate-pulse">
        <div className="flex items-center justify-between mb-4"><div className="w-24 h-4 rounded bg-gray-200 dark:bg-brand-dark-border" /><div className="w-12 h-5 rounded-full bg-gray-200 dark:bg-brand-dark-border" /></div>
        <div className="w-20 h-9 rounded-lg bg-gray-200 dark:bg-brand-dark-border mb-2" />
        <div className="w-16 h-3 rounded bg-gray-200 dark:bg-brand-dark-border" />
    </Card>
);

const ActivitySkeleton = () => (
    <div className="flex items-center gap-3 py-3 animate-pulse">
        <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-brand-dark-border flex-shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="w-full h-3 rounded bg-gray-200 dark:bg-brand-dark-border" />
            <div className="w-24 h-2.5 rounded bg-gray-200 dark:bg-brand-dark-border" />
        </div>
        <div className="w-16 h-6 rounded-md bg-gray-200 dark:bg-brand-dark-border flex-shrink-0" />
    </div>
);

// ✅ بطاقات "إحصائيات النشر" — منقولة من صفحة الإحصائيات المستقلة السابقة
// (StatsPage.jsx، محذوفة الآن) لتُعرض هنا ضمن لوحة التحكم مباشرة. تعتمد على
// get_stats.php (مقاييس نشر البحث: أبحاث/استشهادات/مشاهدات/تحميلات) — مختلف
// تماماً عن get_dashboard.php أعلاه (مقاييس طلبات الخدمات).
const PUBLISHING_CARD_DEFS = [
    { key: 'researches', icon: FileText },
    { key: 'citations', icon: TrendingUp },
    { key: 'views', icon: Eye },
    { key: 'downloads', icon: Download },
];
const PUBLISHING_CARD_LABELS = {
    researches: { ar: 'الأبحاث', en: 'Researches', sub_ar: 'بحث منشور', sub_en: 'Published researches' },
    citations: { ar: 'الاستشهادات', en: 'Citations', sub_ar: 'استشهاد', sub_en: 'Citations' },
    views: { ar: 'المشاهدات', en: 'Views', sub_ar: 'مشاهدة', sub_en: 'Views' },
    downloads: { ar: 'التحميلات', en: 'Downloads', sub_ar: 'تحميل', sub_en: 'Downloads' },
};

const DashboardHome = () => {
    const { user: userData, currentLang, isRTL, theme } = useSite();
    const isDark = theme === 'dark';
    const isAr = currentLang === 'ar';

    // ✅ التعديل: إذا كان المستخدم من الوزارة، اعرض لوحة التحكم الوطنية مباشرة
    // بدلاً من لوحة التحكم الشخصية.
    if (userData?.role === 'ministry') {
        return <MinistryNationalDashboard />;
    }

    // ... باقي الكود لبقية الأدوار ...
    const Arrow = isRTL ? ArrowLeft : ArrowRight;
    const greeting = isAr ? 'مرحباً' : 'Welcome';
    const name = userData?.name?.split(' ')[0] || (isAr ? 'المستخدم' : 'User');

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ⚠️ login.php يُرجع الحقل باسم user_id (وليس id)، ويُخزَّن كما هو في localStorage['user']
    const userId = userData?.user_id ?? userData?.id;

    // ✅ جلب البيانات
    const fetchDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('user_id', userId || '');
            formData.append('lang', currentLang);

            // ⚠️ لا نستخدم credentials: 'include' هنا — get_dashboard.php لا يعتمد
            // على كوكيز/session إطلاقاً (المصادقة عبر user_id بالـ FormData فقط)،
            // وإرسالها كان يجعل المتصفح يرفض استجابة السيرفر لأن رأس CORS المُعاد
            // هو 'Access-Control-Allow-Origin: *' — والمواصفة تمنع الجمع بين
            // النجمة العامة و credentials صراحةً.
            const res = await fetch(`${API_BASE_URL}/get_dashboard.php`, {
                method: 'POST',
                body: formData,
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
        if (userId) fetchDashboard();
    }, [userId]);

    // ✅ إحصائيات النشر (منقولة من StatsPage.jsx السابقة) — طلب منفصل ومستقل
    // عن fetchDashboard لأنه API مختلف تماماً (get_stats.php)
    const [publishingStats, setPublishingStats] = useState({ researches: 0, citations: 0, views: 0, downloads: 0, monthly: [] });
    const [publishingLoading, setPublishingLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        setPublishingLoading(true);
        fetch(`${API_BASE_URL}/get_stats.php?user_id=${userId}`)
            .then((r) => r.json())
            .then((r) => { if (r.status === 'success') setPublishingStats(r.data); })
            .catch(() => {})
            .finally(() => setPublishingLoading(false));
    }, [userId]);

    const stats = getStats(userData?.role, currentLang, dashboardData?.stats);
    const quickActions = getQuickActions(userData?.role, currentLang);
    const activity = dashboardData?.activity || [];
    const monthlyChartData = getMonthlyChartData(dashboardData?.monthly, isAr);
    const requestsTrend = useMemo(() => getTrend(monthlyChartData.map((d) => d.requests)), [monthlyChartData]);
    const researchTrend = useMemo(() => getTrend((publishingStats.monthly || []).map((d) => d.total)), [publishingStats.monthly]);

    // ✅ توزيع الطلبات (دونات) من الإحصائيات نفسها
    const s = dashboardData?.stats || {};
    const composition = [
        { key: 'completed', label: isAr ? 'مكتملة' : 'Completed', value: s.total_completed ?? 0, color: '#FF8710' },
        { key: 'in_progress', label: isAr ? 'قيد التنفيذ' : 'In progress', value: (s.total_in_progress ?? 0), color: isDark ? '#BCBCBC' : '#241B14' },
        { key: 'pending', label: isAr ? 'بانتظار الإجراء' : 'Pending', value: (s.total_pending ?? s.total_needs_action ?? 0), color: isDark ? '#3A2F27' : '#D1D5DB' },
    ];
    const compositionTotal = composition.reduce((a, c) => a + c.value, 0);

    const typeTone = { submit: 'blue', review: 'amber', accept: 'mint' };
    const typeLabels = {
        submit: isAr ? 'تقديم' : 'Submit',
        review: isAr ? 'مراجعة' : 'Review',
        accept: isAr ? 'مكتمل' : 'Done',
    };

    const yearLabel = new Date().getFullYear();

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* ─── العنوان ─── */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-brand-orange text-sm font-bold mb-1">{greeting} 👋</p>
                    <h1 className="text-gray-900 dark:text-white text-2xl lg:text-3xl font-black leading-tight">{name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 max-w-xl">
                        {userData?.role === 'employee'
                            ? (isAr ? 'تابع الطلبات، راجع الحالات، وأدِر عملك من مكان واحد.' : 'Track requests, review statuses, and manage your work from one place.')
                            : (isAr ? 'تابع طلبات التحكيم والترجمة، راجع الحالات، وأدِر نشاطك من مكان واحد.' : 'Track review & translation requests, check statuses, and manage your activity from one place.')
                        }
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <SelectPill label={String(yearLabel)} />
                    <button
                        onClick={fetchDashboard}
                        disabled={loading}
                        className="w-10 h-10 rounded-full bg-white dark:bg-brand-dark-card shadow-sm text-gray-500 hover:text-brand-orange transition-colors disabled:opacity-40 flex items-center justify-center"
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

            {/* ─── المؤشرات ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
                    : stats.map((stat, i) => (
                        <motion.div key={stat.label} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible" className="h-full">
                            <KpiCard
                                label={stat.label}
                                value={stat.value}
                                sub={stat.sub}
                                icon={stat.icon}
                                trend={stat.trendKey === 'requests' ? requestsTrend : null}
                            />
                        </motion.div>
                    ))
                }
            </div>

            {/* ─── رسم الطلبات الشهرية ─── */}
            <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible">
                <Card className="p-6 lg:p-7">
                    <CardHeader
                        title={isAr ? 'إحصائيات الطلبات' : 'Request Statistics'}
                        actions={
                            <>
                                <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300"><span className="w-3.5 h-3.5 rounded-sm bg-gray-100 dark:bg-brand-dark-border" />{isAr ? 'السعة' : 'Capacity'}</span>
                                <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300"><span className="w-3.5 h-3.5 rounded-sm bg-brand-ink dark:bg-brand-gray" />{isAr ? 'الطلبات' : 'Requests'}</span>
                                <span className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 dark:text-gray-300"><span className="w-3.5 h-3.5 rounded-sm bg-brand-orange" />{isAr ? 'الذروة' : 'Peak'}</span>
                                <SelectPill label={isAr ? 'هذا العام' : 'This year'} className="ms-2" />
                            </>
                        }
                    />
                    <PeakBarChart data={monthlyChartData} dataKey="requests" xKey="month" name={isAr ? 'الطلبات' : 'Requests'} isAr={isAr} />
                </Card>
            </motion.div>

            {/* ─── النشاط الأخير (جدول) + توزيع الطلبات (دونات) ─── */}
            <div className="grid lg:grid-cols-5 gap-4 lg:gap-6">
                <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-3">
                    <Card className="p-6 lg:p-7 h-full">
                        <CardHeader
                            title={isAr ? 'النشاط الأخير' : 'Recent Activity'}
                            actions={activity.length > 0 && (
                                <Link to="/dashboard/settings?tab=activity">
                                    <PillButton>{isAr ? 'عرض الكل' : 'View all'}</PillButton>
                                </Link>
                            )}
                        />
                        {loading ? (
                            <div className="divide-y divide-gray-100 dark:divide-brand-dark-border/50">
                                {Array.from({ length: 4 }).map((_, i) => <ActivitySkeleton key={i} />)}
                            </div>
                        ) : activity.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-600">
                                <Clock className="w-10 h-10 mb-3 opacity-40" />
                                <p className="text-sm font-medium">{isAr ? 'لا يوجد نشاط بعد' : 'No activity yet'}</p>
                                <p className="text-xs mt-1 opacity-70">{isAr ? 'ابدأ بطلب تحكيم أو ترجمة' : 'Start by requesting a review or translation'}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto -mx-2">
                                <table className="w-full min-w-[520px] text-start">
                                    <thead>
                                        <tr className="text-gray-400 dark:text-gray-500 text-xs font-semibold">
                                            <th className="text-start font-semibold px-2 pb-3">{isAr ? 'الحدث' : 'Event'}</th>
                                            <th className="text-start font-semibold px-2 pb-3">{isAr ? 'الخدمة' : 'Service'}</th>
                                            <th className="text-start font-semibold px-2 pb-3">{isAr ? 'الوقت' : 'Time'}</th>
                                            <th className="text-start font-semibold px-2 pb-3">{isAr ? 'الحالة' : 'Status'}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-brand-dark-border/50">
                                        {activity.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/80 dark:hover:bg-brand-dark-hover/40 transition-colors">
                                                <td className="px-2 py-3.5">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <span className="w-9 h-9 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center flex-shrink-0">
                                                            <ServiceIcon service={item.service} className="w-4 h-4" />
                                                        </span>
                                                        <span className="text-gray-800 dark:text-gray-200 text-sm font-bold leading-snug line-clamp-2">
                                                            {isAr ? item.text_ar : item.text_en}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-2 py-3.5 text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">{isAr ? item.service_ar : item.service_en}</td>
                                                <td className="px-2 py-3.5 text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{isAr ? item.time_ago_ar : item.time_ago_en}</td>
                                                <td className="px-2 py-3.5"><StatusPill tone={typeTone[item.type] || 'gray'}>{typeLabels[item.type] || ''}</StatusPill></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </Card>
                </motion.div>

                <motion.div custom={7} variants={fadeUp} initial="hidden" animate="visible" className="lg:col-span-2">
                    <Card className="p-6 lg:p-7 h-full flex flex-col">
                        <CardHeader title={isAr ? 'توزيع الطلبات' : 'Requests Composition'} />
                        <div className="relative flex-1 min-h-[220px]">
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={compositionTotal > 0 ? composition : [{ key: 'empty', value: 1, color: '#e5e7eb' }]}
                                        dataKey="value"
                                        innerRadius={64}
                                        outerRadius={92}
                                        paddingAngle={compositionTotal > 0 ? 3 : 0}
                                        cornerRadius={6}
                                        stroke="none"
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        {(compositionTotal > 0 ? composition : [{ key: 'empty', color: '#e5e7eb' }]).map((c) => (
                                            <Cell key={c.key} fill={c.color} />
                                        ))}
                                    </Pie>
                                    {compositionTotal > 0 && <Tooltip contentStyle={{ borderRadius: 14, border: `1px solid ${isDark ? '#3A2F27' : '#F3F4F6'}`, fontSize: 12, background: isDark ? '#241B14' : '#fff', color: isDark ? '#fff' : '#241B14' }} />}
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-gray-900 dark:text-white text-3xl font-black leading-none">{compositionTotal}</span>
                                <span className="text-gray-400 dark:text-gray-500 text-[11px] font-semibold mt-1">{isAr ? 'إجمالي الطلبات' : 'total requests'}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-col gap-2">
                            {composition.map((c) => {
                                const pct = compositionTotal > 0 ? Math.round((c.value / compositionTotal) * 100) : 0;
                                return (
                                    <div key={c.key} className="flex items-center gap-3 text-sm">
                                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: c.color }} />
                                        <span className="flex-1 text-gray-600 dark:text-gray-300 font-semibold">{c.label}</span>
                                        <span className="text-gray-900 dark:text-white font-black" dir="ltr">{pct}%</span>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* ─── إجراءات سريعة ─── */}
            <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible">
                <Card className="p-6 lg:p-7">
                    <CardHeader title={isAr ? 'إجراءات سريعة' : 'Quick Actions'} />
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {quickActions.map((action) => (
                            <Link key={action.to} to={action.to}
                                className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-brand-dark-hover/50 hover:bg-brand-orange/10 hover:text-brand-orange transition-colors group"
                            >
                                <span className="w-10 h-10 rounded-full bg-white dark:bg-brand-dark-card shadow-sm flex items-center justify-center text-gray-500 group-hover:text-brand-orange transition-colors flex-shrink-0">
                                    <action.icon className="w-[18px] h-[18px]" />
                                </span>
                                <span className="text-sm text-gray-700 dark:text-gray-200 group-hover:text-brand-orange font-bold transition-colors">{action.label}</span>
                                <Arrow className="w-4 h-4 ms-auto text-gray-300 group-hover:text-brand-orange transition-colors" />
                            </Link>
                        ))}
                    </div>
                </Card>
            </motion.div>

            {/* ─── إحصائيات النشر (منقولة من صفحة الإحصائيات المستقلة السابقة) ─── */}
            <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible" className="space-y-4 lg:space-y-5">
                <h2 className="text-gray-900 dark:text-white text-lg font-black">{isAr ? 'إحصائيات النشر' : 'Publishing Stats'}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
                    {publishingLoading
                        ? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
                        : PUBLISHING_CARD_DEFS.map((def) => (
                            <KpiCard
                                key={def.key}
                                icon={def.icon}
                                label={isAr ? PUBLISHING_CARD_LABELS[def.key].ar : PUBLISHING_CARD_LABELS[def.key].en}
                                value={publishingStats[def.key]}
                                sub={isAr ? PUBLISHING_CARD_LABELS[def.key].sub_ar : PUBLISHING_CARD_LABELS[def.key].sub_en}
                                trend={def.key === 'researches' ? researchTrend : null}
                            />
                        ))
                    }
                </div>

                <Card className="p-6 lg:p-7">
                    <CardHeader
                        title={isAr ? 'الأبحاث الشهرية' : 'Monthly Research Submissions'}
                        actions={<SelectPill label={isAr ? 'هذا العام' : 'This year'} />}
                    />
                    {publishingLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
                        </div>
                    ) : (
                        <PeakBarChart
                            data={(publishingStats.monthly || []).map((m) => ({ ...m, label: isAr ? m.label_ar : m.label_en }))}
                            dataKey="total"
                            xKey="label"
                            name={isAr ? 'الأبحاث' : 'Researches'}
                            isAr={isAr}
                        />
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default DashboardHome;
