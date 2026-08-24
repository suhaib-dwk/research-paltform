import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Moon, Sun, Globe, Bell, Shield, Save, Check } from 'lucide-react';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    notifications_email: true,
    notifications_sms: false,
    two_factor: false,
    language: i18n.language,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-[#c8a44e]' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 ${checked ? (isRTL ? 'start-0.5' : 'end-0.5') : (isRTL ? 'end-0.5' : 'start-0.5')} w-5 h-5 bg-white rounded-full shadow transition-all duration-300`} />
    </button>
  );

  const Section = ({ icon: Icon, title, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
        <div className="w-10 h-10 rounded-xl bg-[#c8a44e]/10 text-[#c8a44e] flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-[#0a1628]">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="mb-2">
        <h1 className="text-2xl font-black text-[#0a1628]">{t('settings.title')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('settings.desc')}</p>
      </div>

      <Section icon={Globe} title={t('settings.language_title')}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#0a1628] text-sm">{t('settings.interface_lang')}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('settings.interface_lang_desc')}</p>
          </div>
          <select
            value={settings.language}
            onChange={(e) => {
              setSettings(p => ({ ...p, language: e.target.value }));
              i18n.changeLanguage(e.target.value);
            }}
            className="bg-[#f4f6fb] border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0a1628] outline-none focus:border-[#c8a44e] transition-colors"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </div>
      </Section>

      <Section icon={Bell} title={t('settings.notif_title')}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#0a1628] text-sm">{t('settings.email_notif')}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t('settings.email_notif_desc')}</p>
            </div>
            <Toggle checked={settings.notifications_email} onChange={(v) => setSettings(p => ({ ...p, notifications_email: v }))} />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div>
              <p className="font-semibold text-[#0a1628] text-sm">{t('settings.sms_notif')}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t('settings.sms_notif_desc')}</p>
            </div>
            <Toggle checked={settings.notifications_sms} onChange={(v) => setSettings(p => ({ ...p, notifications_sms: v }))} />
          </div>
        </div>
      </Section>

      <Section icon={Shield} title={t('settings.security_title')}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#0a1628] text-sm">{t('settings.two_factor')}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('settings.two_factor_desc')}</p>
          </div>
          <Toggle checked={settings.two_factor} onChange={(v) => setSettings(p => ({ ...p, two_factor: v }))} />
        </div>
      </Section>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${saved
            ? 'bg-emerald-500 text-white'
            : 'bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] hover:shadow-lg hover:shadow-[#c8a44e]/25'
          }`}
      >
        {saved ? <><Check className="w-4 h-4" /> {t('settings.saved')}</> : <><Save className="w-4 h-4" /> {t('settings.save')}</>}
      </button>
    </div>
  );
};

export default SettingsPage;