import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Globe, Bell, Shield, Save, Check, Loader2, Settings as SettingsIcon, Clock, CheckCircle, LogIn, FileText, UserPlus, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';

// ✅ أيقونة/لون تُشتقان من event_type القادم من الخادم (activity_log.event_type)
// — منقولة من ActivityPage.jsx السابقة (محذوفة الآن، مدمجة هنا كتبويب)
const EVENT_STYLES = {
    login: { icon: LogIn, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
    profile_update: { icon: FileText, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
    avatar_update: { icon: FileText, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
    research_submit: { icon: CheckCircle, color: 'text-[#e8623a] bg-[#e8623a]/10 dark:text-[#f0916d] dark:bg-[#e8623a]/15' },
    review_submit: { icon: ShieldCheck, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20 dark:text-violet-400' },
    task_complete: { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
    message_reply: { icon: MessageSquare, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' },
    settings_update: { icon: FileText, color: 'text-gray-500 bg-gray-100 dark:bg-[#2a231e] dark:text-gray-400' },
    account_approved: { icon: UserPlus, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' },
    account_rejected: { icon: UserPlus, color: 'text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400' },
};
const DEFAULT_STYLE = { icon: UserPlus, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400' };

const SettingsPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

    // ✅ التبويب يمكن تحديده عبر ?tab=activity بالرابط (يستخدمه رابط "عرض الكل"
    // بلوحة التحكم للانتقال مباشرة لتبويب سجل النشاط)، وإلا "الإعدادات" افتراضياً.
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') === 'activity' ? 'activity' : 'settings';
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
            .then(r => r.json())
            .then(r => { if (r.status === 'success') setSettings(p => ({ ...p, ...r.data })); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [entityId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('user_id', entityId || '');
            formData.append('notifications_email', settings.notifications_email ? 'true' : 'false');
            formData.append('notifications_sms', settings.notifications_sms ? 'true' : 'false');
            formData.append('two_factor_enabled', settings.two_factor_enabled ? 'true' : 'false');
            formData.append('language', settings.language);

            const res = await fetch(`${API_BASE_URL}/save_settings.php`, { method: 'POST', body: formData });
            const result = await res.json();
            if (result.status === 'success') {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (err) {
            console.error('Save settings error:', err);
        } finally {
            setSaving(false);
        }
    };

    // ===== تبويب سجل النشاط (منقول من ActivityPage.jsx) =====
    const [logs, setLogs] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);
    const [activityError, setActivityError] = useState(null);
    const [activityLoaded, setActivityLoaded] = useState(false); // نجلب عند أول فتح للتبويب فقط

    useEffect(() => {
        if (activeTab !== 'activity' || activityLoaded || !entityId) return;
        setActivityLoading(true);
        setActivityError(null);
        fetch(`${API_BASE_URL}/get_activity.php?user_id=${entityId}`)
            .then(r => r.json())
            .then(r => {
                if (r.status === 'success') setLogs(r.data);
                else setActivityError(r.message || (isAr ? 'فشل تحميل السجل' : 'Failed to load activity log'));
            })
            .catch(() => setActivityError(isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server'))
            .finally(() => { setActivityLoading(false); setActivityLoaded(true); });
    }, [activeTab, activityLoaded, entityId, isAr]);

    const isRTL = isAr;
    const Toggle = ({ checked, onChange }) => (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-[#e8623a]' : 'bg-gray-200 dark:bg-[#3a322c]'}`}
        >
            <span className={`absolute top-0.5 ${checked ? (isRTL ? 'start-0.5' : 'end-0.5') : (isRTL ? 'end-0.5' : 'start-0.5')} w-5 h-5 bg-white rounded-full shadow transition-all duration-300`} />
        </button>
    );

    const Section = ({ icon: Icon, title, children }) => (
        <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50 dark:border-[#3a322c]/50">
                <div className="w-10 h-10 rounded-xl bg-[#e8623a]/10 text-[#e8623a] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
            </div>
            {children}
        </div>
    );

    const TABS = [
        { key: 'settings', icon: SettingsIcon, label_ar: 'الإعدادات', label_en: 'Settings' },
        { key: 'activity', icon: Clock, label_ar: 'سجل النشاط', label_en: 'Activity Log' },
    ];

    return (
        <div className="p-6 space-y-6 max-w-3xl mx-auto">
            <div className="mb-2">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isAr ? 'الإعدادات' : 'Settings'}</h1>
                <p className="text-sm text-gray-400 mt-1">{isAr ? 'إدارة تفضيلاتك وإعدادات الحساب' : 'Manage your preferences and account settings'}</p>
            </div>

            {/* ---- التبويبات ---- */}
            <div className="flex gap-2 bg-white dark:bg-[#211c18] p-1.5 rounded-xl border border-gray-200 dark:border-[#3a322c]/60 w-fit shadow-sm">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                            activeTab === tab.key
                                ? 'bg-[#e8623a] text-white shadow'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a231e]'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {isAr ? tab.label_ar : tab.label_en}
                    </button>
                ))}
            </div>

            {/* ---- تبويب الإعدادات ---- */}
            {activeTab === 'settings' && (
                loading ? (
                    <div className="p-6 flex items-center justify-center min-h-[40vh]">
                        <Loader2 className="w-6 h-6 text-[#e8623a] animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-6">
                        <Section icon={Globe} title={isAr ? 'اللغة' : 'Language'}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{isAr ? 'لغة الواجهة' : 'Interface Language'}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{isAr ? 'اختر لغة عرض المنصة' : 'Choose the platform display language'}</p>
                                </div>
                                <select
                                    value={settings.language}
                                    onChange={(e) => setSettings(p => ({ ...p, language: e.target.value }))}
                                    className="bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-[#e8623a] transition-colors"
                                >
                                    <option value="ar">العربية</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </Section>

                        <Section icon={Bell} title={isAr ? 'الإشعارات' : 'Notifications'}>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{isAr ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{isAr ? 'استلام إشعارات عبر البريد' : 'Receive notifications via email'}</p>
                                    </div>
                                    <Toggle checked={settings.notifications_email} onChange={(v) => setSettings(p => ({ ...p, notifications_email: v }))} />
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-[#3a322c]/50">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{isAr ? 'إشعارات الرسائل النصية' : 'SMS Notifications'}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{isAr ? 'استلام إشعارات عبر الرسائل النصية' : 'Receive notifications via SMS'}</p>
                                    </div>
                                    <Toggle checked={settings.notifications_sms} onChange={(v) => setSettings(p => ({ ...p, notifications_sms: v }))} />
                                </div>
                            </div>
                        </Section>

                        <Section icon={Shield} title={isAr ? 'الأمان' : 'Security'}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{isAr ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{isAr ? 'حماية إضافية لحسابك' : 'Extra protection for your account'}</p>
                                </div>
                                <Toggle checked={settings.two_factor_enabled} onChange={(v) => setSettings(p => ({ ...p, two_factor_enabled: v }))} />
                            </div>
                        </Section>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-60 ${saved
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gradient-to-l from-[#e8623a] to-[#f0916d] text-white hover:shadow-lg hover:shadow-[#e8623a]/25'
                                }`}
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {saved ? (isAr ? 'تم الحفظ' : 'Saved') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
                        </button>
                    </div>
                )
            )}

            {/* ---- تبويب سجل النشاط ---- */}
            {activeTab === 'activity' && (
                <div>
                    {activityError && !activityLoading && (
                        <div className="flex items-center gap-2.5 p-4 mb-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{activityError}</p>
                        </div>
                    )}

                    <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 p-6">
                        {activityLoading ? (
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
                                                        <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                                        <p className="text-xs text-gray-400 dark:text-gray-500">{log.time}</p>
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
