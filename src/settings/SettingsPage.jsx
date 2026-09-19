import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Globe,
    Bell,
    Shield,
    Save,
    Check,
    Loader2,
    Settings as SettingsIcon,
    Clock,
    CheckCircle,
    LogIn,
    FileText,
    UserPlus,
    ShieldCheck,
    MessageSquare,
    AlertCircle,
} from "lucide-react";
import { useSite } from "../SiteContext";
import { API_BASE_URL } from "../api";

// ✅ أيقونة/لون تُشتقان من event_type القادم من الخادم
const EVENT_STYLES = {
    login: {
        icon: LogIn,
        color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    },
    profile_update: {
        icon: FileText,
        color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    },
    avatar_update: {
        icon: FileText,
        color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    },
    research_submit: {
        icon: CheckCircle,
        color: "text-brand-orange bg-brand-orange/10 dark:text-brand-orange-light dark:bg-brand-orange/15",
    },
    review_submit: {
        icon: ShieldCheck,
        color: "text-violet-500 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400",
    },
    task_complete: {
        icon: CheckCircle,
        color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    },
    message_reply: {
        icon: MessageSquare,
        color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
    },
    settings_update: {
        icon: FileText,
        color: "text-gray-500 bg-gray-100 dark:bg-brand-dark-hover dark:text-gray-400",
    },
    account_approved: {
        icon: UserPlus,
        color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400",
    },
    account_rejected: {
        icon: UserPlus,
        color: "text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400",
    },
};
const DEFAULT_STYLE = {
    icon: UserPlus,
    color: "text-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400",
};

const SettingsPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === "ar";
    const entityId = user?.user_id ?? user?.id;

    const [searchParams] = useSearchParams();
    const initialTab =
        searchParams.get("tab") === "activity" ? "activity" : "settings";
    const [activeTab, setActiveTab] = useState(initialTab);

    // ===== تبويب الإعدادات =====
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    const [settings, setSettings] = useState({
        notifications_email: true,
        notifications_sms: false,
        two_factor_enabled: false,
        language: currentLang,
    });

    useEffect(() => {
        if (!entityId) return;
        setLoading(true);
        fetch(`${API_BASE_URL}/get_settings.php?user_id=${entityId}`)
            .then((r) => r.json())
            .then((r) => {
                if (r.status === "success")
                    setSettings((p) => ({ ...p, ...r.data }));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [entityId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("user_id", entityId || "");
            formData.append(
                "notifications_email",
                settings.notifications_email ? "true" : "false",
            );
            formData.append(
                "notifications_sms",
                settings.notifications_sms ? "true" : "false",
            );
            formData.append(
                "two_factor_enabled",
                settings.two_factor_enabled ? "true" : "false",
            );
            formData.append("language", settings.language);

            const res = await fetch(`${API_BASE_URL}/save_settings.php`, {
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            if (result.status === "success") {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (err) {
            console.error("Save settings error:", err);
        } finally {
            setSaving(false);
        }
    };

    // ===== تبويب سجل النشاط =====
    const [logs, setLogs] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);
    const [activityError, setActivityError] = useState(null);
    const [activityLoaded, setActivityLoaded] = useState(false);

    useEffect(() => {
        if (activeTab !== "activity" || activityLoaded || !entityId) return;
        setActivityLoading(true);
        setActivityError(null);
        fetch(`${API_BASE_URL}/get_activity.php?user_id=${entityId}`)
            .then((r) => r.json())
            .then((r) => {
                if (r.status === "success") setLogs(r.data);
                else
                    setActivityError(
                        r.message ||
                            (isAr
                                ? "فشل تحميل السجل"
                                : "Failed to load activity log"),
                    );
            })
            .catch(() =>
                setActivityError(
                    isAr
                        ? "تعذّر الاتصال بالخادم"
                        : "Failed to connect to server",
                ),
            )
            .finally(() => {
                setActivityLoading(false);
                setActivityLoaded(true);
            });
    }, [activeTab, activityLoaded, entityId, isAr]);

    const isRTL = isAr;

    // ✅ تحسين مكون التبديل ليكبر ويتناسب مع التصميم الجديد
    const Toggle = ({ checked, onChange }) => (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${checked ? "bg-brand-orange" : "bg-gray-200 dark:bg-brand-dark-border"}`}
        >
            <span
                className={`absolute top-1 ${checked ? (isRTL ? "start-1" : "end-1") : isRTL ? "end-1" : "start-1"} w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300`}
            />
        </button>
    );

    // ✅ تحسين مكون القسم ليكون أوسع وأجمل
    const Section = ({ icon: Icon, title, children }) => (
        <div className="bg-white dark:bg-brand-dark-card rounded-3xl border border-gray-100 dark:border-brand-dark-border shadow-xl shadow-gray-200/50 dark:shadow-none p-8 overflow-hidden">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-brand-dark-border/50">
                <div className="w-12 h-12 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shadow-sm">
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {title}
                </h3>
            </div>
            <div className="space-y-6">{children}</div>
        </div>
    );

    const TABS = [
        {
            key: "settings",
            icon: SettingsIcon,
            label_ar: "الإعدادات",
            label_en: "Settings",
        },
        {
            key: "activity",
            icon: Clock,
            label_ar: "سجل النشاط",
            label_en: "Activity Log",
        },
    ];

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                    {isAr ? "الإعدادات" : "Settings"}
                </h1>
                <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                    {isAr
                        ? "إدارة تفضيلاتك وإعدادات الحساب والخصوصية"
                        : "Manage your preferences, account settings, and privacy"}
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white dark:bg-brand-dark-card p-1.5 rounded-2xl border border-gray-200 dark:border-brand-dark-border/60 w-fit shadow-sm mb-8">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-base font-bold transition-all ${
                            activeTab === tab.key
                                ? "bg-brand-orange text-white shadow-md"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-brand-dark-hover"
                        }`}
                    >
                        <tab.icon className="w-5 h-5" />
                        {isAr ? tab.label_ar : tab.label_en}
                    </button>
                ))}
            </div>

            {/* Settings Tab Content */}
            {activeTab === "settings" &&
                (loading ? (
                    <div className="p-12 flex items-center justify-center min-h-[50vh]">
                        <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <Section
                            icon={Globe}
                            title={isAr ? "اللغة والمنطقة" : "Language & Region"}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                                        {isAr
                                            ? "لغة الواجهة"
                                            : "Interface Language"}
                                    </p>
                                    <p className="text-base text-gray-500 dark:text-gray-400">
                                        {isAr
                                            ? "اختر لغة عرض المنصة والنظام"
                                            : "Choose the platform display language"}
                                    </p>
                                </div>
                                <div className="relative">
                                    <select
                                        value={settings.language}
                                        onChange={(e) =>
                                            setSettings((p) => ({
                                                ...p,
                                                language: e.target.value,
                                            }))
                                        }
                                        className="bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-dark-border rounded-2xl px-6 py-3.5 text-base font-semibold text-gray-900 dark:text-white outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all appearance-none cursor-pointer min-w-[200px]"
                                    >
                                        <option value="ar">العربية</option>
                                        <option value="en">English</option>
                                    </select>
                                    {/* Custom arrow for select */}
                                    <div className="absolute inset-y-0 end-0 flex items-center px-4 pointer-events-none text-gray-500">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section
                            icon={Bell}
                            title={isAr ? "الإشعارات" : "Notifications"}
                        >
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                                            {isAr
                                                ? "إشعارات البريد الإلكتروني"
                                                : "Email Notifications"}
                                        </p>
                                        <p className="text-base text-gray-500 dark:text-gray-400">
                                            {isAr
                                                ? "استلام تنبيهات هامة عبر البريد"
                                                : "Receive important alerts via email"}
                                        </p>
                                    </div>
                                    <Toggle
                                        checked={settings.notifications_email}
                                        onChange={(v) =>
                                            setSettings((p) => ({
                                                ...p,
                                                notifications_email: v,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="pt-6 border-t border-gray-100 dark:border-brand-dark-border/50">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                                                {isAr
                                                    ? "إشعارات الرسائل النصية"
                                                    : "SMS Notifications"}
                                            </p>
                                            <p className="text-base text-gray-500 dark:text-gray-400">
                                                {isAr
                                                    ? "استلام تحديثات فورية عبر الهاتف"
                                                    : "Receive instant updates via phone"}
                                                </p>
                                        </div>
                                        <Toggle
                                            checked={settings.notifications_sms}
                                            onChange={(v) =>
                                                setSettings((p) => ({
                                                    ...p,
                                                    notifications_sms: v,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </Section>

                        <Section
                            icon={Shield}
                            title={isAr ? "الأمان" : "Security"}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                                        {isAr
                                            ? "المصادقة الثنائية (2FA)"
                                            : "Two-Factor Authentication"}
                                    </p>
                                    <p className="text-base text-gray-500 dark:text-gray-400">
                                        {isAr
                                            ? "طبقة أمان إضافية عند تسجيل الدخول"
                                            : "Extra security layer for logging in"}
                                    </p>
                                </div>
                                <Toggle
                                    checked={settings.two_factor_enabled}
                                    onChange={(v) =>
                                        setSettings((p) => ({
                                            ...p,
                                            two_factor_enabled: v,
                                        }))
                                    }
                                />
                            </div>
                        </Section>

                        <div className="pt-6 flex items-center justify-end">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className={`flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] ${
                                    saved
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                                        : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white shadow-xl shadow-gray-900/20 hover:shadow-brand-orange/40 hover:-translate-y-0.5"
                                }`}
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : saved ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                {saved
                                    ? isAr
                                        ? "تم الحفظ بنجاح"
                                        : "Changes Saved"
                                    : isAr
                                      ? "حفظ التغييرات"
                                      : "Save Changes"}
                            </button>
                        </div>
                    </div>
                ))}

            {/* Activity Log Tab Content */}
            {activeTab === "activity" && (
                <div>
                    {activityError && !activityLoading && (
                        <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 shadow-sm">
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                            <p className="text-base text-red-700 dark:text-red-300 font-medium">
                                {activityError}
                            </p>
                        </div>
                    )}

                    <div className="bg-white dark:bg-brand-dark-card rounded-3xl border border-gray-100 dark:border-brand-dark-border shadow-xl shadow-gray-200/50 dark:shadow-none p-8">
                        {activityLoading ? (
                            <div className="flex items-center justify-center py-24">
                                <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-600">
                                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-brand-dark-border/30 flex items-center justify-center mb-4">
                                    <Clock className="w-10 h-10 opacity-40" />
                                </div>
                                <p className="text-lg font-medium">
                                    {isAr
                                        ? "لا يوجد نشاط مسجل بعد"
                                        : "No activity recorded yet"}
                                </p>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Vertical Line */}
                                <div className="absolute start-6 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-brand-dark-border" />
                                <div className="space-y-8">
                                    {logs.map((log) => {
                                        const style =
                                            EVENT_STYLES[log.event_type] ||
                                            DEFAULT_STYLE;
                                        const Icon = style.icon;
                                        return (
                                            <div
                                                key={log.id}
                                                className="flex items-start gap-6 relative"
                                            >
                                                {/* Icon Container */}
                                                <div
                                                    className={`w-12 h-12 rounded-2xl ${style.color} flex items-center justify-center flex-shrink-0 z-10 shadow-sm ring-4 ring-white dark:ring-brand-dark-card`}
                                                >
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                
                                                {/* Content */}
                                                <div className="flex-1 pt-1.5">
                                                    <p className="font-semibold text-gray-900 dark:text-white text-base leading-relaxed">
                                                        {isAr
                                                            ? log.action_ar
                                                            : log.action_en}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                                            {log.time}
                                                        </p>
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
            )}
        </div>
    );
};

export default SettingsPage;