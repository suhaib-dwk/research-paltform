import { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from './api';

export const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  // ✅ مقارنة بادئة اللغة لا تطابقًا حرفيًا — كاشف اللغة (LanguageDetector) قد
  // يُرجع كودًا كاملاً مثل "ar-IQ" بدل "ar" فقط، فتفشل المقارنة الصارمة القديمة.
  const isRTL = currentLang?.toLowerCase().startsWith('ar') ?? false;

  const [siteInfo, setSiteInfo] = useState({});
  const [navLinks, setNavLinks] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const [homeSlides, setHomeSlides] = useState([]);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  // ✅ حالة الوضع الداكن / الفاتح (تُقرأ من التخزين المحلي لمنع الومضة)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  // ✅ دالة تبديل الوضع
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    // إضافة/إزالة كلاس dark على عنصر html لتطبيق الألوان عبر Tailwind
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // ✅ تطبيق الوضع المحفوظ عند تحميل الموقع لأول مرة
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // ✅ حالة المستخدم (تُقرأ من التخزين المحلي فوراً لمنع الومضة)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  // ✅ دوال إدارة المستخدم
  const loginUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    window.dispatchEvent(new Event('authChange'));
  };

  const logoutUser = () => {
    // ✅ Stage A.5: تدمير الجلسة الحقيقية على الخادم أيضاً، وليس فقط مسح
    // التخزين المحلي — fire-and-forget: مسح localStorage لا يعتمد على نجاح
    // هذا الطلب حتى لا يتعطّل تسجيل الخروج من واجهة المستخدم عند أي عطل شبكة
    fetch(`${API_BASE_URL}/logout.php`, { method: 'POST', credentials: 'include' }).catch(() => {});
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
  };

  // ✅ التحقق من هوية المدير
  const isAdmin = user?.role === 'super_admin';

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const endpoints = [
          { key: 'settings', url: `${API_BASE_URL}/get_site_settings.php` },
          { key: 'info', url: `${API_BASE_URL}/get_site_info.php` },
          { key: 'nav', url: `${API_BASE_URL}/get_nav_links.php` },
          { key: 'slides', url: `${API_BASE_URL}/get_home_slides.php` },
        ];

        const responses = await Promise.all(
          endpoints.map(ep => fetch(ep.url).then(res => res.json()))
        );

        responses.forEach((result, index) => {
          const key = endpoints[index].key;
          if (result.status === 'success') {
            switch (key) {
              case 'info': setSiteInfo(result.data); break;
              case 'nav': setNavLinks(result.data); break;
              case 'settings': setSiteSettings(result.data); break;
              case 'slides': setHomeSlides(result.data); break;
            }
          }
        });
      } catch (error) {
        console.error('Error fetching site data:', error);
      } finally {
        setIsSettingsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // ✅ مراقبة تغييرات الجلسة في التبويبات الأخرى
  useEffect(() => {
    const syncAuth = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user') || 'null'));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', syncAuth);
    window.addEventListener('authChange', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('authChange', syncAuth);
    };
  }, []);

  return (
    <SiteContext.Provider value={{ 
      siteInfo, navLinks, siteSettings, setSiteSettings, 
      homeSlides, setHomeSlides, isSettingsLoading,
      // ✅ بيانات المستخدم والنظام
      user, loginUser, logoutUser, isAdmin,
      currentLang, isRTL,
      // ✅ إعدادات المظهر
      theme, toggleTheme
    }}>
      {children}
    </SiteContext.Provider>
  );
};

// ✅ هوك مخصص لسهولة الاستخدام في باقي المكونات
export const useSite = () => useContext(SiteContext);