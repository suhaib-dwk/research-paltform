import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, Image, Layout, LogOut, Save, Upload, Trash2, 
  Loader2, CheckCircle, AlertCircle, Menu, X, Globe
} from 'lucide-react';
import { SiteContext } from '../SiteContext';
import { API_BASE_URL, resolveUploadUrl } from '../api';

const AdminDashboard = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false; // مقارنة بادئة اللغة (يدعم ar-IQ ونحوها)
  const currentLang = i18n.language;
  const navigate = useNavigate();
  
  const { siteSettings, homeSlides, setSiteSettings, setHomeSlides } = useContext(SiteContext);
  
  const [activeTab, setActiveTab] = useState('general');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // حالات النموذج
  const [formData, setFormData] = useState({});
  const [previews, setPreviews] = useState({});
  const [slides, setSlides] = useState([]);
  
  // حالات الحفظ
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  const [isUploadingSlide, setIsUploadingSlide] = useState(false);

  useEffect(() => {
    if (siteSettings) setFormData(siteSettings);
    if (homeSlides) setSlides(homeSlides);
  }, [siteSettings, homeSlides]);

  const handleTextChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setSaveSuccess(null);
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [key]: file }));
      setPreviews(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
      setSaveSuccess(null);
    }
  };

  const handleSaveSettings = async () => {
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

      const res = await fetch(`${API_BASE_URL}/update_site_settings.php`, { method: 'POST', body: data });
      const result = await res.json();
      
      if (result.status === 'success') {
        setSaveSuccess('success');
        // تحديث السياق مباشرة بدون ريفريش
        const updatedSettings = { ...siteSettings };
        Object.keys(formData).forEach(key => {
          if (!(formData[key] instanceof File)) updatedSettings[key] = formData[key];
        });
        setSiteSettings(updatedSettings);
      } else {
        setSaveSuccess('error');
      }
    } catch (err) {
      setSaveSuccess('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSlide = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingSlide(true);
    try {
      const data = new FormData();
      data.append('action', 'add');
      data.append('image', file);

      const res = await fetch(`${API_BASE_URL}/manage_home_slides.php`, { method: 'POST', body: data });
      const result = await res.json();
      if (result.status === 'success') {
        setSlides(prev => [...prev, { id: Date.now(), image_url: result.image_url, is_active: 1 }]);
        setHomeSlides(prev => [...prev, { id: Date.now(), image_url: result.image_url, is_active: 1 }]);
      }
    } catch (err) { console.error(err); }
    finally { setIsUploadingSlide(false); e.target.value = ''; }
  };

  const handleDeleteSlide = async (id, imageUrl) => {
    if (!window.confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذه الصورة؟' : 'Are you sure you want to delete this slide?')) return;
    try {
      const data = new FormData();
      data.append('action', 'delete');
      data.append('id', id);
      await fetch(`${API_BASE_URL}/manage_home_slides.php`, { method: 'POST', body: data });
      setSlides(prev => prev.filter(s => s.id !== id));
      setHomeSlides(prev => prev.filter(s => s.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { id: 'general', label_ar: 'الإعدادات العامة', label_en: 'General Settings', icon: Settings },
    { id: 'hero', label_ar: 'نصوص البانر الرئيسي', label_en: 'Hero Texts', icon: Layout },
    { id: 'slides', label_ar: 'صور البانر', label_en: 'Hero Slides', icon: Image },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex flex-col lg:flex-row">
      
      {/* ✅ الشريط الجانبي للكمبيوتر */}
      <aside className="hidden lg:flex w-72 bg-[#0a1628] text-white flex-col flex-shrink-0">
        <div className="p-6 border-b border-[#1e3050]">
          <h1 className="text-xl font-bold flex items-center gap-2"><Settings className="w-6 h-6 text-[#c8a44e]" /> {currentLang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</h1>
          <p className="text-gray-500 text-xs mt-1">{currentLang === 'ar' ? 'إدارة إعدادات النظام' : 'System Settings Management'}</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] shadow-lg shadow-[#c8a44e]/20' : 'text-gray-400 hover:bg-[#1a2744] hover:text-gray-200'}`}>
              <item.icon className="w-5 h-5" /> {currentLang === 'ar' ? item.label_ar : item.label_en}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#1e3050]">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 transition-all">
            <LogOut className="w-5 h-5" /> {currentLang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </aside>

      {/* ✅ الهيدر والقائمة للهاتف */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-white shadow-sm border-b flex items-center justify-between px-4 py-3">
        <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 p-2 hover:bg-gray-100 rounded-lg"><Menu className="w-6 h-6" /></button>
        <h1 className="font-bold text-gray-800">{currentLang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</h1>
        <button onClick={handleLogout} className="text-red-500 p-2 hover:bg-red-50 rounded-lg"><LogOut className="w-5 h-5" /></button>
      </div>

      {/* قائمة الهاتف المنبثقة */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="bg-black/50 flex-1" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="w-72 bg-[#0a1628] text-white flex flex-col animate-[slideIn_0.3s_ease-out]">
            <div className="p-6 flex items-center justify-between border-b border-[#1e3050]">
              <h1 className="text-lg font-bold">القائمة</h1>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map(item => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628]' : 'text-gray-400 hover:bg-[#1a2744]'}`}>
                  <item.icon className="w-5 h-5" /> {currentLang === 'ar' ? item.label_ar : item.label_en}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* ✅ المحتوى الرئيسي */}
      <main className="flex-1 lg:p-10 p-6 pt-24 lg:pt-10 overflow-y-auto">
        
        {/* رسائل الحفظ */}
        {saveSuccess && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border ${saveSuccess === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            {saveSuccess === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {saveSuccess === 'success' ? (currentLang === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully') : (currentLang === 'ar' ? 'فشل الحفظ' : 'Failed to save')}
          </div>
        )}

        {/* --- تبويب الإعدادات العامة --- */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Settings className="w-7 h-7 text-[#c8a44e]" /> {currentLang === 'ar' ? 'الإعدادات العامة' : 'General Settings'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">اسم الموقع (عربي)</label>
                <input value={formData.site_name_ar || ''} onChange={e => handleTextChange('site_name_ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#c8a44e]/20 focus:border-[#c8a44e] outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">Site Name (English)</label>
                <input value={formData.site_name_en || ''} onChange={e => handleTextChange('site_name_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#c8a44e]/20 focus:border-[#c8a44e] outline-none transition-all" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">الاسم الفرعي (عربي)</label>
                <input value={formData.site_tagline_ar || ''} onChange={e => handleTextChange('site_tagline_ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#c8a44e]/20 focus:border-[#c8a44e] outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">Tagline (English)</label>
                <input value={formData.site_tagline_en || ''} onChange={e => handleTextChange('site_tagline_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#c8a44e]/20 focus:border-[#c8a44e] outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {/* رفع اللوجو */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-600">شعار الموقع (Logo)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#c8a44e] transition-colors relative">
                  <img src={previews.site_logo || resolveUploadUrl(formData.site_logo) || 'https://via.placeholder.com/150'} alt="Logo" className="w-24 h-24 object-contain mx-auto mb-3 rounded-lg bg-gray-50 p-2" />
                  <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'site_logo')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1"><Upload className="w-4 h-4" /> {currentLang === 'ar' ? 'اضغط لرفع صورة جديدة' : 'Click to upload'}</p>
                </div>
              </div>

              {/* رفع الفافيكون */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-600">أيقونة التبويب (Favicon)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-[#c8a44e] transition-colors relative">
                  <img src={previews.site_favicon || resolveUploadUrl(formData.site_favicon) || 'https://via.placeholder.com/50'} alt="Favicon" className="w-16 h-16 object-contain mx-auto mb-3 rounded-lg bg-gray-50 p-1" />
                  <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'site_favicon')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1"><Upload className="w-4 h-4" /> {currentLang === 'ar' ? 'اضغط لرفع أيقونة جديدة' : 'Click to upload'}</p>
                </div>
              </div>
            </div>

            <button onClick={handleSaveSettings} disabled={isSaving} className="mt-8 bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {currentLang === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
            </button>
          </div>
        )}

        {/* --- تبويب نصوص البانر --- */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 max-w-4xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2"><Layout className="w-7 h-7 text-[#c8a44e]" /> {currentLang === 'ar' ? 'نصوص البانر الرئيسي' : 'Hero Section Texts'}</h2>
            <p className="text-sm text-gray-500 -mt-4 mb-6">{currentLang === 'ar' ? 'هذه النصوص تظهر فوق صور البانر المتحركة' : 'These texts appear over the sliding banner images'}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">الشارة الصغيرة (عربي)</label>
                <input value={formData.hero_badge_ar || ''} onChange={e => handleTextChange('hero_badge_ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#c8a44e]/20 focus:border-[#c8a44e] outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600">Badge (English)</label>
                <input value={formData.hero_badge_en || ''} onChange={e => handleTextChange('hero_badge_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#c8a44e]/20 focus:border-[#c8a44e] outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">العنوان الرئيسي (عربي)</label>
              <input value={formData.hero_title_ar || ''} onChange={e => handleTextChange('hero_title_ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#c8a44e]/20 focus:border-[#c8a44e] outline-none transition-all text-lg font-bold" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">Main Title (English)</label>
              <input value={formData.hero_title_en || ''} onChange={e => handleTextChange('hero_title_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#c8a44e]/20 focus:border-[#c8a44e] outline-none transition-all text-lg font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">الوصف (عربي)</label>
              <textarea rows={4} value={formData.hero_desc_ar || ''} onChange={e => handleTextChange('hero_desc_ar', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#c8a44e]/20 focus:border-[#c8a44e] outline-none resize-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">Description (English)</label>
              <textarea rows={4} value={formData.hero_desc_en || ''} onChange={e => handleTextChange('hero_desc_en', e.target.value)} dir="ltr" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#c8a44e]/20 focus:border-[#c8a44e] outline-none resize-none transition-all" />
            </div>

            <button onClick={handleSaveSettings} disabled={isSaving} className="bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-2">
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {currentLang === 'ar' ? 'حفظ النصوص' : 'Save Texts'}
            </button>
          </div>
        )}

        {/* --- تبويب صور البانر --- */}
        {activeTab === 'slides' && (
          <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Image className="w-7 h-7 text-[#c8a44e]" /> {currentLang === 'ar' ? 'صور البانر' : 'Hero Slides'}</h2>
              <label className="cursor-pointer bg-gradient-to-l from-[#c8a44e] to-[#e6c96e] text-[#0a1628] px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all duration-300 flex items-center gap-2 relative">
                {isUploadingSlide ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                {currentLang === 'ar' ? 'إضافة صورة' : 'Add Slide'}
                <input type="file" accept="image/*" onChange={handleAddSlide} className="hidden" disabled={isUploadingSlide} />
              </label>
            </div>

            {slides.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center text-gray-400">
                <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-bold text-lg">{currentLang === 'ar' ? 'لا توجد صور حالياً' : 'No slides yet'}</p>
                <p className="text-sm mt-1">{currentLang === 'ar' ? 'اضغط على زر إضافة صورة لبدء رفع الشرائح' : 'Click Add Slide to start uploading'}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {slides.map((slide, index) => (
                  <div key={slide.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group relative">
                    <div className="aspect-video overflow-hidden">
                      <img src={slide.image_url} alt={`Slide ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-600">{currentLang === 'ar' ? 'شريحة' : 'Slide'} {index + 1}</span>
                      <button onClick={() => handleDeleteSlide(slide.id, slide.image_url)} className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Animation keyframes for mobile menu */}
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;