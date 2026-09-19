export const tableConfigs = {
  contact_messages: {
    title_ar: 'رسائل التواصل', title_en: 'Contact Messages',
    columns: [
      { key: 'name', label_ar: 'الاسم', label_en: 'Name', type: 'text' },
      { key: 'email', label_ar: 'البريد', label_en: 'Email', type: 'text' },
      { key: 'subject', label_ar: 'الموضوع', label_en: 'Subject', type: 'text' },
      { key: 'message', label_ar: 'الرسالة', label_en: 'Message', type: 'longtext' },
      { key: 'is_read', label_ar: 'مقروء', label_en: 'Read', type: 'boolean' },
      { key: 'created_at', label_ar: 'التاريخ', label_en: 'Date', type: 'text' }
    ],
    readOnly: false
  },
  faqs: {
    title_ar: 'الأسئلة الشائعة', title_en: 'FAQs',
    columns: [
      { key: 'question_ar', label_ar: 'السؤال (عربي)', label_en: 'Question (AR)', type: 'text' },
      { key: 'question_en', label_ar: 'السؤال (إنجليزي)', label_en: 'Question (EN)', type: 'text' },
      { key: 'answer_ar', label_ar: 'الجواب (عربي)', label_en: 'Answer (AR)', type: 'longtext' },
      { key: 'answer_en', label_ar: 'الجواب (إنجليزي)', label_en: 'Answer (EN)', type: 'longtext' },
      { key: 'is_active', label_ar: 'مفعل', label_en: 'Active', type: 'boolean' },
      { key: 'sort_order', label_ar: 'الترتيب', label_en: 'Order', type: 'text' }
    ],
    readOnly: false
  },
  home_slides: {
    title_ar: 'صور البانر', title_en: 'Hero Slides',
    columns: [
      { key: 'image_url', label_ar: 'الصورة', label_en: 'Image', type: 'image' },
      { key: 'is_active', label_ar: 'مفعل', label_en: 'Active', type: 'boolean' },
      { key: 'sort_order', label_ar: 'الترتيب', label_en: 'Order', type: 'text' },
      { key: 'created_at', label_ar: 'تاريخ الرفع', label_en: 'Created', type: 'text' }
    ],
    readOnly: false
  },
  news: {
    title_ar: 'إدارة الأخبار', title_en: 'News Management',
    columns: [
      { key: 'title_ar', label_ar: 'العنوان (عربي)', label_en: 'Title (AR)', type: 'text' },
      { key: 'title_en', label_ar: 'العنوان (إنجليزي)', label_en: 'Title (EN)', type: 'text' },
      { key: 'image_url', label_ar: 'الصورة', label_en: 'Image', type: 'image' },
      { key: 'category', label_ar: 'التصنيف', label_en: 'Category', type: 'text' },
      { key: 'slug', label_ar: 'الرابط', label_en: 'Slug', type: 'text' },
      { key: 'is_published', label_ar: 'منشور', label_en: 'Published', type: 'boolean' },
      { key: 'published_at', label_ar: 'تاريخ النشر', label_en: 'Published At', type: 'text' },
      { key: 'created_at', label_ar: 'تاريخ الإنشاء', label_en: 'Created', type: 'text' },
      { key: 'content_ar', label_ar: 'المحتوى (عربي)', label_en: 'Content (AR)', type: 'longtext', hidden: true },
      { key: 'content_en', label_ar: 'المحتوى (إنجليزي)', label_en: 'Content (EN)', type: 'longtext', hidden: true }
    ],
    readOnly: false
  },
  pages: {
    title_ar: 'محتوى الصفحات', title_en: 'Pages Content',
    columns: [
      { key: 'title_ar', label_ar: 'العنوان (عربي)', label_en: 'Title (AR)', type: 'text' },
      { key: 'title_en', label_ar: 'العنوان (إنجليزي)', label_en: 'Title (EN)', type: 'text' },
      { key: 'slug', label_ar: 'الرابط', label_en: 'Slug', type: 'text' },
      { key: 'icon_name', label_ar: 'الأيقونة', label_en: 'Icon', type: 'text' },
      { key: 'is_active', label_ar: 'مفعل', label_en: 'Active', type: 'boolean' },
      { key: 'show_in_nav', label_ar: 'في القائمة', label_en: 'In Nav', type: 'boolean' },
      { key: 'sort_order', label_ar: 'الترتيب', label_en: 'Order', type: 'text' },
      { key: 'content_ar', label_ar: 'المحتوى (عربي)', label_en: 'Content (AR)', type: 'longtext', hidden: true },
      { key: 'content_en', label_ar: 'المحتوى (إنجليزي)', label_en: 'Content (EN)', type: 'longtext', hidden: true }
    ],
    readOnly: false
  },
  platform_services: {
    title_ar: 'خدمات المنصة', title_en: 'Platform Services',
    columns: [
      { key: 'title_ar', label_ar: 'العنوان (عربي)', label_en: 'Title (AR)', type: 'text' },
      { key: 'title_en', label_ar: 'العنوان (إنجليزي)', label_en: 'Title (EN)', type: 'text' },
      { key: 'icon_name', label_ar: 'الأيقونة', label_en: 'Icon', type: 'text' },
      { key: 'slug', label_ar: 'الرابط', label_en: 'Slug', type: 'text' },
      { key: 'link', label_ar: 'الرابط الخارجي', label_en: 'External Link', type: 'text' },
      { key: 'is_active', label_ar: 'مفعل', label_en: 'Active', type: 'boolean' },
      { key: 'sort_order', label_ar: 'الترتيب', label_en: 'Order', type: 'text' },
      { key: 'desc_ar', label_ar: 'الوصف (عربي)', label_en: 'Desc (AR)', type: 'longtext', hidden: true },
      { key: 'desc_en', label_ar: 'الوصف (إنجليزي)', label_en: 'Desc (EN)', type: 'longtext', hidden: true },
      { key: 'details_ar', label_ar: 'التفاصيل (عربي)', label_en: 'Details (AR)', type: 'longtext', hidden: true },
      { key: 'details_en', label_ar: 'التفاصيل (إنجليزي)', label_en: 'Details (EN)', type: 'longtext', hidden: true }
    ],
    readOnly: false
  },
  site_info: {
    title_ar: 'معلومات الموقع', title_en: 'Site Info',
    columns: [
      { key: 'phone', label_ar: 'الهاتف', label_en: 'Phone', type: 'text' },
      { key: 'email', label_ar: 'البريد', label_en: 'Email', type: 'text' },
      { key: 'address_ar', label_ar: 'العنوان (عربي)', label_en: 'Address (AR)', type: 'text' },
      { key: 'address_en', label_ar: 'العنوان (إنجليزي)', label_en: 'Address (EN)', type: 'text' },
      { key: 'x_link', label_ar: 'رابط X', label_en: 'X Link', type: 'text' },
      { key: 'instagram_link', label_ar: 'رابط انستقرام', label_en: 'Instagram', type: 'text' },
      { key: 'linkedin_link', label_ar: 'رابط لينكدإن', label_en: 'LinkedIn', type: 'text' },
      { key: 'youtube_link', label_ar: 'رابط يوتيوب', label_en: 'Youtube', type: 'text' }
    ],
    // ✅ قابل للتعديل والإضافة والحذف من لوحة الأدمن (بطلب صريح)
    readOnly: false
  },
  site_settings: {
    title_ar: 'إعدادات الموقع', title_en: 'Site Settings',
    columns: [
     { key: 'id',           label_ar: 'الرقم',          label_en: 'ID' },
    { key: 'setting_key',  label_ar: 'مفتاح الإعداد',   label_en: 'Setting Key' },
    { key: 'setting_value',label_ar: 'قيمة الإعداد',    label_en: 'Setting Value', type: 'longtext' },
    { key: 'created_by',   label_ar: 'أُنشئ بواسطة',    label_en: 'Created By', noEdit: true },
    { key: 'created_at',   label_ar: 'تاريخ الإنشاء',   label_en: 'Created At', noEdit: true },
    { key: 'updated_at',   label_ar: 'تاريخ التحديث',   label_en: 'Updated At', noEdit: true },
    ],
    readOnly: true
  },
  users: {
    title_ar: 'إدارة المستخدمين', title_en: 'Users Management',
    columns: [
      { key: 'full_name_ar', label_ar: 'الاسم (عربي)', label_en: 'Name (AR)', type: 'text' },
      { key: 'full_name_en', label_ar: 'الاسم (إنجليزي)', label_en: 'Name (EN)', type: 'text' },
      { key: 'email', label_ar: 'البريد', label_en: 'Email', type: 'text' },
      { key: 'university_id', label_ar: 'الرقم الجامعي', label_en: 'University ID', type: 'text' },
      { key: 'role', label_ar: 'الدور', label_en: 'Role', type: 'text' },
      { key: 'academic_rank', label_ar: 'الرتبة الأكاديمية', label_en: 'Academic Rank', type: 'text' },
      { key: 'is_active', label_ar: 'مفعل', label_en: 'Active', type: 'boolean' },
      { key: 'created_at', label_ar: 'تاريخ التسجيل', label_en: 'Registered', type: 'text' },
      { key: 'password_hash', label_ar: 'كلمة المرور', label_en: 'Password Hash', type: 'text', hidden: true },
      { key: 'study_level', label_ar: 'المرحلة الدراسية', label_en: 'Study Level', type: 'text', hidden: true },
      { key: 'institution_id', label_ar: 'رقم المؤسسة', label_en: 'Institution ID', type: 'text', hidden: true },
      { key: 'staff_specific_role', label_ar: 'دور الموظف', label_en: 'Staff Role', type: 'text', hidden: true }
    ],
    readOnly: true // للقراءة فقط لحماية الحسابات حالياً
  }
};