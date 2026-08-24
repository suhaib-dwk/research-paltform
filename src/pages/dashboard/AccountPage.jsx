import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Mail, Phone, Camera, Save, Check, Loader2 } from 'lucide-react';
import { useSite } from '../../SiteContext';

const AccountPage = () => {
  const { t } = useTranslation();
  const { user } = useSite();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    full_name: user?.name || '',
    phone: user?.phone || '',
    personal_email: user?.email || '',
  });

  const handleChange = (name, value) => {
    setForm(p => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628]">{t('account.title')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('account.desc')}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-50">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-[#c8a44e]/10 text-[#c8a44e] flex items-center justify-center text-2xl font-black">
              {form.full_name?.charAt(0) || 'U'}
            </div>
            <button className="absolute -bottom-1 -end-1 w-7 h-7 bg-[#c8a44e] text-white rounded-lg flex items-center justify-center shadow-md hover:bg-[#a8872e] transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="font-bold text-[#0a1628]">{form.full_name || t('account.no_name')}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('account.role_' + (user?.role || 'default'))}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{t('account.full_name')}</label>
              <div className="relative">
                <User className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-gray-400" />
                <input type="text" value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)} className="w-full bg-[#f4f6fb] border border-gray-100 rounded-xl ps-11 pe-4 py-3 text-sm text-[#0a1628] outline-none focus:border-[#c8a44e] transition-colors" />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{t('account.phone')}</label>
              <div className="relative">
                <Phone className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-gray-400" />
                <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} dir="ltr" className="w-full bg-[#f4f6fb] border border-gray-100 rounded-xl ps-11 pe-4 py-3 text-sm text-[#0a1628] outline-none focus:border-[#c8a44e] transition-colors" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{t('account.email')}</label>
              <div className="relative">
                <Mail className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-gray-400" />
                <input type="email" value={form.personal_email} onChange={(e) => handleChange('personal_email', e.target.value)} dir="ltr" className="w-full bg-[#f4f6fb] border border-gray-100 rounded-xl ps-11 pe-4 py-3 text-sm text-[#0a1628] outline-none focus:border-[#c8a44e] transition-colors" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50">
            <button type="submit" disabled={loading} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-50 ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] hover:shadow-lg hover:shadow-[#c8a44e]/25'}`}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? t('settings.saved') : t('settings.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;