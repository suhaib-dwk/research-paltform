import { useContext, useEffect } from 'react';
import { SiteContext } from '../../SiteContext';

const DynamicHead = () => {
  const { siteSettings } = useContext(SiteContext);

  useEffect(() => {
    if (!siteSettings) return;

    // 1. تحديث أيقونة التبويب (Favicon)
    if (siteSettings.site_favicon) {
      let link = document.querySelector("link[rel='icon']") || document.querySelector("link[rel='shortcut icon']");
      
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }

      // استخراج امتداد الملف لتحديد النوع الصحيح
      const ext = siteSettings.site_favicon.split('.').pop().toLowerCase();
      if (ext === 'png') link.type = 'image/png';
      else if (ext === 'svg') link.type = 'image/svg+xml';
      else link.type = 'image/x-icon'; // ico أو افتراضي

      // إضافة ?v= لكسر الكاش (Cache Busting) وإجبار المتصفح على تحميل الأيقونة الجديدة فوراً
      link.href = `${siteSettings.site_favicon}?v=${Date.now()}`;
    }

    // 2. تحديث عنوان الصفحة الافتراضي (اختياري)
    const lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
    const siteName = lang === 'ar' ? siteSettings.site_name_ar : siteSettings.site_name_en;
    
    if (siteName) {
      // لا نغير العنوان إذا كانت الصفحة الحالية لديها عنوان مخصص (مثل صفحة الخبر)
      const currentTitle = document.title;
      const isCustomPage = currentTitle.includes(' | ') || currentTitle.includes(' - ');
      
      if (!isCustomPage) {
        document.title = siteName;
      }
    }
  }, [siteSettings]);

  // هذا المكون لا يُرسم في الواجهة (Hidden Component)
  return null;
};

export default DynamicHead;