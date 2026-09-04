export const API_BASE_URL = 'http://localhost/ris-platform/api';
// export const API_BASE_URL = 'https://ris.sibaljo.com/api';

// ✅ جذر السيرفر (بدون /api) — يُستخدم لبناء روابط الملفات المرفوعة (uploads/...)
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

// ✅ يحوّل مساراً نسبياً راجعاً من الـ API (مثل "uploads/site_logo_x.png") إلى رابط كامل.
// - لو كان أصلاً رابطاً كاملاً (http/https) أو data URI، يُرجعه كما هو دون تعديل.
// - لو كان فارغاً/null، يُرجع '' حتى تتعامل معه الواجهة كصورة غير موجودة.
export const resolveUploadUrl = (path) => {
  if (!path) return '';
  if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:')) return path;
  return `${SERVER_BASE_URL}/${path.replace(/^\/+/, '')}`;
};