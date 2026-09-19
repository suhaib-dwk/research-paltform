import { useState, useRef } from 'react';
import { User, Mail, Phone, Camera, Save, Check, Loader2, XCircle } from 'lucide-react';
import { useSite } from '../SiteContext';
import { API_BASE_URL, resolveUploadUrl } from '../api';

const AccountPage = () => {
    const { user, currentLang, loginUser } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef(null);

    const [form, setForm] = useState({
        full_name: user?.name || '',
        phone: user?.phone || '',
        personal_email: user?.personal_email || user?.email || '',
    });
    const [avatarPath, setAvatarPath] = useState(user?.avatar_path || null);

    const handleChange = (name, value) => {
        setForm(p => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('user_id', entityId || '');
            formData.append('full_name', form.full_name);
            formData.append('phone', form.phone);
            formData.append('personal_email', form.personal_email);

            const res = await fetch(`${API_BASE_URL}/update_account.php`, { method: 'POST', body: formData });
            const result = await res.json();

            if (result.status === 'success') {
                loginUser({ ...user, ...result.data });
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            } else {
                setError(isAr ? 'فشل حفظ البيانات' : 'Failed to save data');
            }
        } catch (err) {
            console.error('Update account error:', err);
            setError(isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const ext = file.name.split('.').pop().toLowerCase();
        if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
            setError(isAr ? 'صيغة الصورة غير مقبولة. المسموح: JPG, PNG, WEBP' : 'Invalid image type. Allowed: JPG, PNG, WEBP');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError(isAr ? 'حجم الصورة يتجاوز 5 ميغابايت' : 'Image size exceeds 5MB');
            return;
        }

        setUploadingAvatar(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('user_id', entityId || '');
            formData.append('avatar', file);

            const res = await fetch(`${API_BASE_URL}/upload_avatar.php`, { method: 'POST', body: formData });
            const result = await res.json();

            if (result.status === 'success') {
                setAvatarPath(result.data.avatar_path);
                loginUser({ ...user, avatar_path: result.data.avatar_path });
            } else {
                setError(isAr ? 'فشل رفع الصورة' : 'Failed to upload image');
            }
        } catch (err) {
            console.error('Upload avatar error:', err);
            setError(isAr ? 'تعذّر رفع الصورة' : 'Failed to upload image');
        } finally {
            setUploadingAvatar(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-6xl mx-auto w-full">
            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                    {isAr ? 'الحساب' : 'Account'}
                </h1>
                <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                    {isAr ? 'إدارة بياناتك الشخصية وتفاصيل التواصل' : 'Manage your personal information and contact details'}
                </p>
            </div>

            {error && (
                <div className="flex items-start gap-3 p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <XCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-base text-red-700 dark:text-red-300 font-medium">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-brand-dark-card rounded-3xl border border-gray-100 dark:border-brand-dark-border shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
                
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-8 pb-8 border-b border-gray-100 dark:border-brand-dark-border bg-gray-50/50 dark:bg-brand-dark-card/50">
                    <div className="relative group">
                        {avatarPath ? (
                            <img src={resolveUploadUrl(avatarPath)} alt="" className="w-28 h-28 rounded-3xl object-cover shadow-lg ring-4 ring-white dark:ring-brand-dark-card transition-transform duration-300 group-hover:scale-[1.02]" />
                        ) : (
                            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-brand-orange to-brand-orange-dark text-white flex items-center justify-center text-4xl font-black shadow-lg ring-4 ring-white dark:ring-brand-dark-card">
                                {form.full_name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="absolute -bottom-2 -end-2 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 disabled:opacity-60 disabled:hover:scale-100"
                        >
                            {uploadingAvatar ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                        </button>
                        <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleAvatarChange} />
                    </div>
                    <div className="text-center sm:text-start">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{form.full_name || (isAr ? 'بدون اسم' : 'No name')}</p>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider">
                            {user?.role || 'User'}
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="p-8 space-y-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Full Name */}
                        <div className="space-y-2.5">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                {isAr ? 'الاسم الكامل' : 'Full Name'}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400 group-focus-within:text-brand-orange transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input 
                                    type="text" 
                                    value={form.full_name} 
                                    onChange={(e) => handleChange('full_name', e.target.value)} 
                                    className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-dark-border rounded-2xl ps-12 pe-5 py-4 text-base text-gray-900 dark:text-white outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all placeholder:text-gray-400" 
                                    placeholder={isAr ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2.5">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                {isAr ? 'رقم الهاتف' : 'Phone Number'}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400 group-focus-within:text-brand-orange transition-colors">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input 
                                    type="tel" 
                                    value={form.phone} 
                                    onChange={(e) => handleChange('phone', e.target.value)} 
                                    dir="ltr" 
                                    className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-dark-border rounded-2xl ps-12 pe-5 py-4 text-base text-gray-900 dark:text-white outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all placeholder:text-gray-400" 
                                    placeholder="+966 5X XXX XXXX"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="md:col-span-2 space-y-2.5">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                {isAr ? 'البريد الإلكتروني الشخصي' : 'Personal Email'}
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400 group-focus-within:text-brand-orange transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input 
                                    type="email" 
                                    value={form.personal_email} 
                                    onChange={(e) => handleChange('personal_email', e.target.value)} 
                                    dir="ltr" 
                                    className="w-full bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-dark-border rounded-2xl ps-12 pe-5 py-4 text-base text-gray-900 dark:text-white outline-none focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/10 transition-all placeholder:text-gray-400" 
                                    placeholder="example@domain.com"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 dark:border-brand-dark-border/50 flex items-center justify-end">
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className={`flex items-center gap-2.5 px-10 py-4 rounded-2xl font-bold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] ${
                                saved 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                                : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white shadow-xl shadow-gray-900/20 hover:shadow-brand-orange/40 hover:-translate-y-0.5'
                            }`}
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                            {saved ? (isAr ? 'تم الحفظ بنجاح' : 'Changes Saved') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountPage;