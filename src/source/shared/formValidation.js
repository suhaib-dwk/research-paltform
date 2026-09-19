// ✅ رسائل التحقق حسب اللغة
export const getValidationMessages = (lang) => ({
  name: {
    required: lang === 'ar' ? 'الاسم مطلوب' : 'Name is required',
    minLength: lang === 'ar' ? 'الاسم يجب أن يكون حرفين على الأقل' : 'Name must be at least 2 characters',
    maxLength: lang === 'ar' ? 'الاسم يجب ألا يتجاوز 50 حرفاً' : 'Name must not exceed 50 characters',
    invalidChars: lang === 'ar' ? 'الاسم يجب أن يحتوي على أحرف ومسافات فقط' : 'Name must contain only letters and spaces',
  },
  email: {
    required: lang === 'ar' ? 'البريد الإلكتروني مطلوب' : 'Email is required',
    invalid: lang === 'ar' ? 'صيغة البريد الإلكتروني غير صحيحة' : 'Invalid email format',
  },
  subject: {
    required: lang === 'ar' ? 'الموضوع مطلوب' : 'Subject is required',
    minLength: lang === 'ar' ? 'الموضوع يجب أن يكون 3 أحرف على الأقل' : 'Subject must be at least 3 characters',
    maxLength: lang === 'ar' ? 'الموضوع يجب ألا يتجاوز 100 حرف' : 'Subject must not exceed 100 characters',
  },
  message: {
    required: lang === 'ar' ? 'الرسالة مطلوبة' : 'Message is required',
    minLength: lang === 'ar' ? 'الرسالة يجب أن تكون 10 أحرف على الأقل' : 'Message must be at least 10 characters',
    maxLength: lang === 'ar' ? 'الرسالة يجب ألا تتجاوز 2000 حرف' : 'Message must not exceed 2000 characters',
  },
});

// ✅ دالة التحقق من صحة البريد الإلكتروني
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// ✅ دالة التحقق من صحة الاسم (أحرف ومسافات فقط، يدعم العربي والإنجليزي)
export const isValidName = (name) => {
  const nameRegex = /^[؀-ۿa-zA-Z\s]+$/;
  return nameRegex.test(name);
};

// ✅ دالة التحقق من حقل واحد ضمن نموذج التواصل (الاسم/البريد/الموضوع/الرسالة)
export const validateField = (name, value, messages) => {
  const msgs = messages[name];
  if (!msgs) return '';

  switch (name) {
    case 'name':
      if (!value.trim()) return msgs.required;
      if (value.trim().length < 2) return msgs.minLength;
      if (value.trim().length > 50) return msgs.maxLength;
      if (!isValidName(value.trim())) return msgs.invalidChars;
      return '';

    case 'email':
      if (!value.trim()) return msgs.required;
      if (!isValidEmail(value.trim())) return msgs.invalid;
      return '';

    case 'subject':
      if (!value.trim()) return msgs.required;
      if (value.trim().length < 3) return msgs.minLength;
      if (value.trim().length > 100) return msgs.maxLength;
      return '';

    case 'message':
      if (!value.trim()) return msgs.required;
      if (value.trim().length < 10) return msgs.minLength;
      if (value.trim().length > 2000) return msgs.maxLength;
      return '';

    default:
      return '';
  }
};
