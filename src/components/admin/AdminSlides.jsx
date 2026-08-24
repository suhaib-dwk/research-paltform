import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Upload, Trash2, Loader2, AlertCircle, X, TriangleAlert } from "lucide-react";
import { SiteContext } from "../../SiteContext";
import { API_BASE_URL } from "../../api";

const AdminSlides = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const { homeSlides, setHomeSlides } = useContext(SiteContext);
  const [slides, setSlides] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [actionError, setActionError] = useState(null);
  
  // ✅ حالات نافذة الحذف المخصصة
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, slide: null, isLoading: false });

  useEffect(() => { if (homeSlides) setSlides(homeSlides); }, [homeSlides]);

  const handleAdd = async (e) => {
    const file = e.target.files[0]; 
    if (!file) return;
    setIsUploading(true); 
    setActionError(null);
    try {
      const data = new FormData(); 
      data.append('action', 'add'); 
      data.append('image', file);
      
      const res = await fetch(`${API_BASE_URL}/manage_home_slides.php`, { method: 'POST', body: data });
      const text = await res.text();
      let result;
      try { result = JSON.parse(text); } 
      catch (err) { throw new Error(currentLang === 'ar' ? 'خطأ في استجابة السيرفر' : 'Invalid server response'); }

      if (result.status === 'success') {
        const newSlide = { id: Date.now(), image_url: result.image_url };
        setSlides(prev => [...prev, newSlide]);
        setHomeSlides(prev => [...prev, newSlide]);
      } else {
        setActionError(result.message || 'حدث خطأ');
      }
    } catch (err) {
      setActionError(err.message);
    } finally { 
      setIsUploading(false); 
      e.target.value = ''; 
    }
  };

  // ✅ فتح نافذة الحذف
  const openDeleteModal = (slide) => {
    setDeleteModal({ isOpen: true, slide: slide, isLoading: false });
  };

  // ✅ إغلاق نافذة الحذف
  const closeDeleteModal = () => {
    if (deleteModal.isLoading) return; // منع الإغلاق أثناء الحذف
    setDeleteModal({ isOpen: false, slide: null, isLoading: false });
  };

  // ✅ تنفيذ عملية الحذف
  const confirmDelete = async () => {
    if (!deleteModal.slide) return;
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    setActionError(null);

    try {
      const data = new FormData(); 
      data.append('action', 'delete'); 
      data.append('id', deleteModal.slide.id);
      
      const res = await fetch(`${API_BASE_URL}/manage_home_slides.php`, { method: 'POST', body: data });
      const text = await res.text();
      let result;
      try { result = JSON.parse(text); } 
      catch (err) { throw new Error(currentLang === 'ar' ? 'خطأ في استجابة السيرفر' : 'Invalid server response'); }

      if (result.status === 'success') {
        setSlides(prev => prev.filter(s => s.id !== deleteModal.slide.id));
        setHomeSlides(prev => prev.filter(s => s.id !== deleteModal.slide.id));
        closeDeleteModal(); // إغلاق النافذة عند النجاح
      } else {
        setDeleteModal(prev => ({ ...prev, isLoading: false }));
        setActionError(result.message || (currentLang === 'ar' ? 'فشل الحذف' : 'Delete failed'));
        closeDeleteModal();
      }
    } catch (err) {
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
      setActionError(err.message);
      closeDeleteModal();
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Image className="w-7 h-7 text-green-500" /> 
            {currentLang === 'ar' ? 'إدارة صور البانر' : 'Manage Hero Slides'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {currentLang === 'ar' ? 'هذه الصور تظهر متحركة في أعلى الصفحة الرئيسية' : 'These images appear as a slideshow on the homepage'}
          </p>
        </div>
        <label className="cursor-pointer bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 flex items-center gap-2 transition-colors relative shadow-sm">
          {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          {currentLang === 'ar' ? 'إضافة صورة جديدة' : 'Add New Slide'}
          <input type="file" accept="image/*" onChange={handleAdd} className="hidden" disabled={isUploading} />
        </label>
      </div>

      {actionError && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {actionError}
          <button onClick={() => setActionError(null)} className="ms-auto font-bold hover:text-red-800">✕</button>
        </div>
      )}

      {slides.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center text-gray-400">
          <Image className="w-20 h-20 mx-auto mb-4 opacity-30" />
          <p className="font-bold text-lg">{currentLang === 'ar' ? 'لا توجد صور بعد' : 'No slides yet'}</p>
          <p className="text-sm mt-1">{currentLang === 'ar' ? 'اضغط على زر "إضافة صورة جديدة" لبدء رفع الشرائح' : 'Click "Add New Slide" to start uploading'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide, index) => (
            <div key={slide.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden group relative">
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img src={slide.image_url} alt={`Slide ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex items-center justify-between border-t">
                <span className="text-sm font-bold text-gray-600">{currentLang === 'ar' ? 'شريحة رقم' : 'Slide'} {index + 1}</span>
                {/* ✅ زر الحذف الجديد يفتح النافذة */}
                <button 
                  onClick={() => openDeleteModal(slide)} 
                  className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  title={currentLang === 'ar' ? 'حذف الشريحة' : 'Delete Slide'}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅✅✅ تصميم نافذة تأكيد الحذف العصرية ✅✅✅ */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* خلفية معتمة */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDeleteModal}></div>
          
          {/* محتوى النافذة */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-[fadeInUp_0.3s_ease-out]">
            
            {/* معاينة الصورة المراد حذفها */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              <img 
                src={deleteModal.slide?.image_url} 
                alt="Preview" 
                className="w-full h-full object-cover opacity-80"
              />
              {/* تدرج أحمر خفيف للتحذير */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              {/* أيقونة التحذير */}
              <div className="absolute bottom-4 right-4 bg-red-500 text-white p-3 rounded-xl shadow-lg">
                <TriangleAlert className="w-6 h-6" />
              </div>
            </div>

            {/* نص التأكيد */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {currentLang === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?'}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {currentLang === 'ar' 
                  ? 'سيتم حذف هذه الصورة من شرائح البانر الرئيسي نهائياً. لا يمكن التراجع عن هذا الإجراء.'
                  : 'This image will be permanently removed from the hero slides. This action cannot be undone.'}
              </p>

              {/* أزرار التحكم */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleteModal.isLoading}
                  className="flex-1 px-4 py-3 text-sm font-bold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {currentLang === 'ar' ? 'إلغاء الأمر' : 'Cancel'}
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteModal.isLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                >
                  {deleteModal.isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                  {deleteModal.isLoading 
                    ? (currentLang === 'ar' ? 'جاري الحذف...' : 'Deleting...') 
                    : (currentLang === 'ar' ? 'نعم، احذف' : 'Yes, Delete')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* أنيميشن النافذة */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AdminSlides;