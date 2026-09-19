import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Save, Upload, Loader2, CheckCircle, AlertCircle, Sparkles, Eye, EyeOff, KeyRound } from 'lucide-react';
import { SiteContext } from '../../../SiteContext';
import { resolveUploadUrl } from '../../../api';
import { API_BASE_URL } from '../../../api';

// ===== مزوّدو الذكاء الاصطناعي المدعومون (يُعرَضان دائمًا حتى قبل أي بذر بقاعدة البيانات) =====
const AI_PROVIDER_DEFS = [
  { key: 'openrouter', label: 'OpenRouter', defaultModel: 'openai/gpt-4o-mini', modelHint: 'مثال: openai/gpt-4o-mini، anthropic/claude-3.5-sonnet', keyHint: 'sk-or-v1-...' },
  { key: 'openai', label: 'OpenAI', defaultModel: 'gpt-4o-mini', modelHint: 'مثال: gpt-4o-mini، gpt-4o', keyHint: 'sk-...' },
];

const AdminSettings = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const { siteSettings, setSiteSettings, user } = useContext(SiteContext);
  const userId = user?.user_id ?? user?.id;

  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({});
  const [previews, setPreviews] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  // ===== حالة تبويب الذكاء الاصطناعي =====
  const [aiProviders, setAiProviders] = useState({}); // { openrouter: {...}, openai: {...} }
  const [aiLoading, setAiLoading] = useState(true);
  const [aiSavingKey, setAiSavingKey] = useState(null); // provider_key الجاري حفظه حاليًا
  const [aiSaveResult, setAiSaveResult] = useState({}); // { [provider_key]: 'success' | 'error' }
  const [aiKeyInputs, setAiKeyInputs] = useState({}); // مفاتيح API الجديدة المكتوبة بالفورم (لا تُملأ من الخادم أبدًا)
  const [aiKeyVisible, setAiKeyVisible] = useState({});

  useEffect(() => { if (siteSettings) setFormData(siteSettings); }, [siteSettings]);

  // ===== تحميل حالة مزوّدي الذكاء الاصطناعي عند فتح التبويب =====
  useEffect(() => {
    if (activeTab !== 'ai' || !userId) return;
    setAiLoading(true);
    fetch(`${API_BASE_URL}/get_ai_provider_settings.php?user_id=${userId}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.status === 'success') {
          const map = {};
          AI_PROVIDER_DEFS.forEach((def) => {
            const row = (result.data || []).find((p) => p.provider_key === def.key);
            map[def.key] = row || { provider_key: def.key, is_enabled: false, has_key: false, api_key_last4: null, model: def.defaultModel };
          });
          setAiProviders(map);
        }
      })
      .catch(() => {})
      .finally(() => setAiLoading(false));
  }, [activeTab, userId]);

  const handleAiToggle = (providerKey) => {
    setAiProviders((prev) => ({ ...prev, [providerKey]: { ...prev[providerKey], is_enabled: !prev[providerKey]?.is_enabled } }));
  };

  const handleAiModelChange = (providerKey, value) => {
    setAiProviders((prev) => ({ ...prev, [providerKey]: { ...prev[providerKey], model: value } }));
  };

  const handleAiKeyInputChange = (providerKey, value) => {
    setAiKeyInputs((prev) => ({ ...prev, [providerKey]: value }));
  };

  const handleSaveAiProvider = async (providerKey) => {
    if (!userId) return;
    setAiSavingKey(providerKey);
    setAiSaveResult((prev) => ({ ...prev, [providerKey]: null }));
    try {
      const provider = aiProviders[providerKey] || {};
      const payload = {
        user_id: userId,
        provider_key: providerKey,
        is_enabled: !!provider.is_enabled,
        model: provider.model || AI_PROVIDER_DEFS.find((d) => d.key === providerKey)?.defaultModel,
      };
      const newKey = (aiKeyInputs[providerKey] || '').trim();
      if (newKey) payload.api_key = newKey;

      const res = await fetch(`${API_BASE_URL}/save_ai_provider_settings.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.status === 'success') {
        setAiSaveResult((prev) => ({ ...prev, [providerKey]: 'success' }));
        setAiKeyInputs((prev) => ({ ...prev, [providerKey]: '' })); // مسح حقل الإدخال بعد الحفظ لعدم إبقاء المفتاح ظاهرًا
        // إعادة تحميل الحالة (has_key/last4) دون كشف المفتاح نفسه
        const refreshed = await fetch(`${API_BASE_URL}/get_ai_provider_settings.php?user_id=${userId}`).then((r) => r.json());
        if (refreshed.status === 'success') {
          const row = (refreshed.data || []).find((p) => p.provider_key === providerKey);
          if (row) setAiProviders((prev) => ({ ...prev, [providerKey]: row }));
        }
      } else {
        setAiSaveResult((prev) => ({ ...prev, [providerKey]: 'error' }));
      }
    } catch {
      setAiSaveResult((prev) => ({ ...prev, [providerKey]: 'error' }));
    } finally {
      setAiSavingKey(null);
      setTimeout(() => setAiSaveResult((prev) => ({ ...prev, [providerKey]: null })), 3000);
    }
  };

  const handleTextChange = (key, value) => { setFormData(prev => ({ ...prev, [key]: value })); setSaveSuccess(null); };
  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) { setFormData(prev => ({ ...prev, [key]: file })); setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) })); setSaveSuccess(null); }
  };

    const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] instanceof File) {
          data.append(key, formData[key]);
        } else if (typeof formData[key] === 'string') {
          data.append(key, formData[key]);
        }
      });

      const res = await fetch(`${API_BASE_URL}/update_site_settings.php`, {
        method: 'POST',
        body: data
      });

      const text = await res.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        throw new Error(currentLang === 'ar' ? 'استجابة غير صالحة من السيرفر' : 'Invalid server response');
      }

      if (result.status === 'success') {
        setSaveSuccess('success');
        
        // 1. تحديث السياق العام للموقع
        const updatedContext = { ...siteSettings };
        
        // 2. ✅ تحديث الفورم المحلي لاستبدال كائن الملف بالرابط الحقيقي
        const updatedFormData = { ...formData };

        Object.keys(formData).forEach(k => {
          if (formData[k] instanceof File) {
            // إذا كان السيرفر رد بالرابط الجديد، نستبدل كائن الملف بهذا الرابط
            if (result.files && result.files[k]) {
              updatedContext[k] = result.files[k];
              updatedFormData[k] = result.files[k]; // ← هذا يمنع اختفاء الصورة!
            }
          } else if (typeof formData[k] === 'string') {
            updatedContext[k] = formData[k];
          }
        });

        setSiteSettings(updatedContext);
        setFormData(updatedFormData); // ✅ تحديث الحالة المحلية بالرابط النهائي
        setPreviews({}); // الآن يمكن مسح المعاينة بأمان
      } else {
        throw new Error(result.message || (currentLang === 'ar' ? 'فشل الحفظ' : 'Save failed'));
      }
    } catch (err) {
      console.error('Save Error:', err);
      setSaveSuccess(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {saveSuccess && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${saveSuccess === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30' : 'bg-red-50 dark:bg-red-900/15 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30'}`}>
          {saveSuccess === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {saveSuccess === 'success' ? 'تم الحفظ بنجاح' : 'فشل الحفظ'}
        </div>
      )}

      {/* التبويبات الداخلية */}
      <div className="flex gap-2 mb-8 bg-white dark:bg-brand-dark-card p-1.5 rounded-xl border border-gray-200 dark:border-brand-dark-border/60 w-fit shadow-sm">
        {[
          { id: 'general', ar: 'عام', en: 'General' },
          { id: 'hero', ar: 'البانر', en: 'Hero' },
          { id: 'ai', ar: 'الذكاء الاصطناعي', en: 'AI' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-brand-orange text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-brand-dark-hover'}`}>
            {currentLang === 'ar' ? tab.ar : tab.en}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-gray-200 dark:border-brand-dark-border/60 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2"><Settings className="w-6 h-6 text-brand-orange" /> الإعدادات العامة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600 dark:text-gray-400">اسم الموقع (عربي)</label><input value={formData.site_name_ar || ''} onChange={e => handleTextChange('site_name_ar', e.target.value)} className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600 dark:text-gray-400">Site Name (English)</label><input value={formData.site_name_en || ''} onChange={e => handleTextChange('site_name_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600 dark:text-gray-400">الاسم الفرعي (عربي)</label><input value={formData.site_tagline_ar || ''} onChange={e => handleTextChange('site_tagline_ar', e.target.value)} className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600 dark:text-gray-400">Tagline (English)</label><input value={formData.site_tagline_en || ''} onChange={e => handleTextChange('site_tagline_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {['site_logo', 'site_favicon'].map(key => (
              <div key={key} className="space-y-3">
                <label className="text-sm font-bold text-gray-600 dark:text-gray-400">{key === 'site_logo' ? 'شعار الموقع (Logo)' : 'أيقونة التبويب (Favicon)'}</label>
                <div className="border-2 border-dashed border-gray-200 dark:border-brand-dark-border rounded-xl p-4 text-center hover:border-brand-orange transition-colors relative">
                  <img src={previews[key] || resolveUploadUrl(formData[key]) || 'https://via.placeholder.com/100'} alt="" className={`${key === 'site_logo' ? 'w-24 h-24' : 'w-16 h-16'} object-contain mx-auto mb-3 rounded-lg bg-gray-50 dark:bg-brand-dark p-1`} />
                  <input type="file" accept="image/*" onChange={e => handleFileChange(e, key)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1"><Upload className="w-4 h-4" /> اضغط للرفع</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSave} disabled={isSaving} className="mt-8 bg-brand-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-orange-dark flex items-center gap-2 transition-colors disabled:bg-brand-orange/50">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} حفظ الإعدادات
          </button>
        </div>
      )}

      {activeTab === 'hero' && (
        <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-gray-200 dark:border-brand-dark-border/60 p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">نصوص البانر الرئيسي</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 -mt-4 mb-6">هذه النصوص تظهر فوق صور البانر المتحركة في الصفحة الرئيسية</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600 dark:text-gray-400">الشارة الصغيرة (عربي)</label><input value={formData.hero_badge_ar || ''} onChange={e => handleTextChange('hero_badge_ar', e.target.value)} className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600 dark:text-gray-400">Badge (English)</label><input value={formData.hero_badge_en || ''} onChange={e => handleTextChange('hero_badge_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none" /></div>
          </div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-600 dark:text-gray-400">العنوان الرئيسي (عربي)</label><input value={formData.hero_title_ar || ''} onChange={e => handleTextChange('hero_title_ar', e.target.value)} className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none text-lg font-bold" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-600 dark:text-gray-400">Main Title (English)</label><input value={formData.hero_title_en || ''} onChange={e => handleTextChange('hero_title_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none text-lg font-bold" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-600 dark:text-gray-400">الوصف (عربي)</label><textarea rows={4} value={formData.hero_desc_ar || ''} onChange={e => handleTextChange('hero_desc_ar', e.target.value)} className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none resize-none" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-600 dark:text-gray-400">Description (English)</label><textarea rows={4} value={formData.hero_desc_en || ''} onChange={e => handleTextChange('hero_desc_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none resize-none" /></div>
          <button onClick={handleSave} disabled={isSaving} className="bg-brand-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-orange-dark flex items-center gap-2 transition-colors disabled:bg-brand-orange/50">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} حفظ النصوص
          </button>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="bg-orange-50 dark:bg-brand-orange/10 border border-orange-200 dark:border-brand-orange/20 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-brand-orange mt-0.5 flex-shrink-0" />
            <p className="text-sm text-orange-700 dark:text-brand-orange-light">
              {currentLang === 'ar'
                ? 'فعّل مزوّد ذكاء اصطناعي واحد على الأقل وأدخل مفتاح API خاصته لتفعيل ميزات الذكاء الاصطناعي بالمنصة (مثل تقييم جاهزية الجامعة). المفاتيح تُخزَّن مشفّرة ولا تُعرض مجددًا بعد الحفظ.'
                : 'Enable at least one AI provider and enter its API key to activate AI features on the platform (such as university readiness assessment). Keys are stored encrypted and never shown again after saving.'}
            </p>
          </div>

          {aiLoading ? (
            <div className="flex items-center justify-center p-12"><Loader2 className="w-6 h-6 text-brand-orange animate-spin" /></div>
          ) : (
            AI_PROVIDER_DEFS.map((def) => {
              const provider = aiProviders[def.key] || {};
              const result = aiSaveResult[def.key];
              const isKeyVisible = !!aiKeyVisible[def.key];
              return (
                <div key={def.key} className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-gray-200 dark:border-brand-dark-border/60 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <KeyRound className="w-5 h-5 text-brand-orange" /> {def.label}
                    </h2>
                    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        {provider.is_enabled ? (currentLang === 'ar' ? 'مفعّل' : 'Enabled') : (currentLang === 'ar' ? 'معطّل' : 'Disabled')}
                      </span>
                      <span
                        onClick={() => handleAiToggle(def.key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${provider.is_enabled ? 'bg-brand-orange' : 'bg-gray-300 dark:bg-brand-dark-border'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${provider.is_enabled ? (currentLang === 'ar' ? '-translate-x-6' : 'translate-x-6') : (currentLang === 'ar' ? '-translate-x-1' : 'translate-x-1')}`} />
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-600 dark:text-gray-400">
                        {currentLang === 'ar' ? 'مفتاح API' : 'API Key'}
                        {provider.has_key && (
                          <span className="ms-2 text-xs font-normal text-gray-400 dark:text-gray-500">
                            {currentLang === 'ar' ? `(محفوظ حاليًا، ينتهي بـ ${provider.api_key_last4})` : `(currently saved, ends with ${provider.api_key_last4})`}
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type={isKeyVisible ? 'text' : 'password'}
                          dir="ltr"
                          value={aiKeyInputs[def.key] || ''}
                          onChange={(e) => handleAiKeyInputChange(def.key, e.target.value)}
                          placeholder={provider.has_key ? (currentLang === 'ar' ? 'اتركه فارغًا للإبقاء على المفتاح الحالي' : 'Leave empty to keep current key') : def.keyHint}
                          className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 pe-11 focus:ring-2 focus:ring-brand-orange outline-none font-mono text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setAiKeyVisible((prev) => ({ ...prev, [def.key]: !prev[def.key] }))}
                          className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-gray-600 dark:text-gray-400">{currentLang === 'ar' ? 'الموديل' : 'Model'}</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={provider.model ?? def.defaultModel}
                        onChange={(e) => handleAiModelChange(def.key, e.target.value)}
                        placeholder={def.defaultModel}
                        className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none font-mono text-sm"
                      />
                      <p className="text-xs text-gray-400 dark:text-gray-500">{def.modelHint}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={() => handleSaveAiProvider(def.key)}
                      disabled={aiSavingKey === def.key}
                      className="bg-brand-orange text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-orange-dark flex items-center gap-2 transition-colors disabled:bg-brand-orange/50"
                    >
                      {aiSavingKey === def.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {currentLang === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                    {result === 'success' && (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400"><CheckCircle className="w-4 h-4" /> {currentLang === 'ar' ? 'تم الحفظ' : 'Saved'}</span>
                    )}
                    {result === 'error' && (
                      <span className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400"><AlertCircle className="w-4 h-4" /> {currentLang === 'ar' ? 'فشل الحفظ' : 'Save failed'}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
export default AdminSettings;