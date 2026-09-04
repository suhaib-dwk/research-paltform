import { useState, useEffect } from 'react';
import { Globe, Bell, Shield, Save, Check, Loader2 } from 'lucide-react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';

const SettingsPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

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

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[40vh]">
                <Loader2 className="w-6 h-6 text-[#e8623a] animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-3xl">
            <div className="mb-2">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isAr ? 'الإعدادات' : 'Settings'}</h1>
                <p className="text-sm text-gray-400 mt-1">{isAr ? 'إدارة تفضيلاتك وإعدادات الحساب' : 'Manage your preferences and account settings'}</p>
            </div>

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
    );
};

export default SettingsPage;
