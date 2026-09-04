import { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SiteContext } from '../../SiteContext';
import { resolveUploadUrl } from '../../api';

const DynamicHead = () => {
  const { siteSettings } = useContext(SiteContext);
  const { i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    if (!siteSettings || Object.keys(siteSettings).length === 0) return;

    // ✅ تحديث الفافيكون ديناميكياً
    if (siteSettings.site_favicon) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      // تحديد النوع بناءً على الامتداد
      const faviconUrl = resolveUploadUrl(siteSettings.site_favicon);
      if (faviconUrl.endsWith('.svg')) {
        link.type = 'image/svg+xml';
      } else if (faviconUrl.endsWith('.png')) {
        link.type = 'image/png';
      } else {
        link.type = 'image/x-icon';
      }
      link.href = faviconUrl;
    }

    // ✅ تحديث عنوان الصفحة ديناميكياً حسب اللغة
    const name = siteSettings[`site_name_${lang}`] || 'Research Platform';
    const tagline = siteSettings[`site_tagline_${lang}`] || '';
    document.title = tagline ? `${name} | ${tagline}` : name;
  }, [siteSettings, lang]);

  return null;
};

export default DynamicHead;