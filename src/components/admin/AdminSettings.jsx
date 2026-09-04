import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Save, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { SiteContext } from '../../SiteContext';
import { resolveUploadUrl } from '../../api';
import { API_BASE_URL } from '../../api';

const AdminSettings = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const { siteSettings, setSiteSettings } = useContext(SiteContext);
  
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({});
  const [previews, setPreviews] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);

  useEffect(() => { if (siteSettings) setFormData(siteSettings); }, [siteSettings]);

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
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${saveSuccess === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {saveSuccess === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {saveSuccess === 'success' ? 'تم الحفظ بنجاح' : 'فشل الحفظ'}
        </div>
      )}

      {/* التبويبات الداخلية */}
      <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-xl border w-fit shadow-sm">
        {[
          { id: 'general', ar: 'عام', en: 'General' },
          { id: 'hero', ar: 'البانر', en: 'Hero' }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
            {currentLang === 'ar' ? tab.ar : tab.en}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Settings className="w-6 h-6 text-blue-500" /> الإعدادات العامة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600">اسم الموقع (عربي)</label><input value={formData.site_name_ar || ''} onChange={e => handleTextChange('site_name_ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600">Site Name (English)</label><input value={formData.site_name_en || ''} onChange={e => handleTextChange('site_name_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600">الاسم الفرعي (عربي)</label><input value={formData.site_tagline_ar || ''} onChange={e => handleTextChange('site_tagline_ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600">Tagline (English)</label><input value={formData.site_tagline_en || ''} onChange={e => handleTextChange('site_tagline_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {['site_logo', 'site_favicon'].map(key => (
              <div key={key} className="space-y-3">
                <label className="text-sm font-bold text-gray-600">{key === 'site_logo' ? 'شعار الموقع (Logo)' : 'أيقونة التبويب (Favicon)'}</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-blue-400 transition-colors relative">
                  <img src={previews[key] || resolveUploadUrl(formData[key]) || 'https://via.placeholder.com/100'} alt="" className={`${key === 'site_logo' ? 'w-24 h-24' : 'w-16 h-16'} object-contain mx-auto mb-3 rounded-lg bg-gray-50 p-1`} />
                  <input type="file" accept="image/*" onChange={e => handleFileChange(e, key)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1"><Upload className="w-4 h-4" /> اضغط للرفع</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleSave} disabled={isSaving} className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:bg-blue-400">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} حفظ الإعدادات
          </button>
        </div>
      )}

      {activeTab === 'hero' && (
        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">نصوص البانر الرئيسي</h2>
          <p className="text-sm text-gray-500 -mt-4 mb-6">هذه النصوص تظهر فوق صور البانر المتحركة في الصفحة الرئيسية</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600">الشارة الصغيرة (عربي)</label><input value={formData.hero_badge_ar || ''} onChange={e => handleTextChange('hero_badge_ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div className="space-y-2"><label className="text-sm font-bold text-gray-600">Badge (English)</label><input value={formData.hero_badge_en || ''} onChange={e => handleTextChange('hero_badge_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          </div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-600">العنوان الرئيسي (عربي)</label><input value={formData.hero_title_ar || ''} onChange={e => handleTextChange('hero_title_ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-600">Main Title (English)</label><input value={formData.hero_title_en || ''} onChange={e => handleTextChange('hero_title_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none text-lg font-bold" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-600">الوصف (عربي)</label><textarea rows={4} value={formData.hero_desc_ar || ''} onChange={e => handleTextChange('hero_desc_ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-600">Description (English)</label><textarea rows={4} value={formData.hero_desc_en || ''} onChange={e => handleTextChange('hero_desc_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none" /></div>
          <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:bg-blue-400">
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} حفظ النصوص
          </button>
        </div>
      )}
    </div>
  );
};
export default AdminSettings;