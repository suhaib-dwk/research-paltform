import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Save, Loader2, Check } from 'lucide-react';

const NewResearchPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ title: '', abstract: '', keywords: '', field: '', file: null });

  const handleChange = (name, value) => setForm(p => ({ ...p, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628]">{t('new_research.title')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('new_research.desc')}</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{t('new_research.title_field')}</label>
          <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full bg-[#f4f6fb] border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8a44e] transition-colors" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{t('new_research.abstract')}</label>
          <textarea rows={5} value={form.abstract} onChange={(e) => handleChange('abstract', e.target.value)} className="w-full bg-[#f4f6fb] border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8a44e] transition-colors resize-none" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{t('new_research.keywords')}</label>
            <input type="text" value={form.keywords} onChange={(e) => handleChange('keywords', e.target.value)} placeholder={t('new_research.keywords_placeholder')} className="w-full bg-[#f4f6fb] border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8a44e] transition-colors" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{t('new_research.field')}</label>
            <select value={form.field} onChange={(e) => handleChange('field', e.target.value)} className="w-full bg-[#f4f6fb] border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8a44e]">
              <option value="">{t('form.select')}</option>
              <option value="cs">Computer Science</option>
              <option value="eng">Engineering</option>
              <option value="med">Medicine</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{t('new_research.file')}</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#c8a44e] transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">{t('new_research.file_desc')}</p>
          </div>
        </div>
        <div className="pt-4 border-t border-gray-50">
          <button type="submit" disabled={loading} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-50 ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] hover:shadow-lg hover:shadow-[#c8a44e]/25'}`}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? t('settings.saved') : t('new_research.submit')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewResearchPage;