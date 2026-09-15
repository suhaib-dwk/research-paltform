import { useState, useRef } from 'react';
import { User, Mail, Phone, Camera, Save, Check, Loader2, XCircle } from 'lucide-react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL, resolveUploadUrl } from '../../api';

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
                // ✅ دمج صريح مع بيانات المستخدم الحالية (loginUser لا يدمج تلقائياً)
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
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isAr ? 'الحساب' : 'Account'}</h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{isAr ? 'إدارة بياناتك الشخصية' : 'Manage your personal information'}</p>
            </div>

            {error && (
                <div className="flex items-start gap-2.5 p-3.5 mb-5 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 p-6">
                <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-50 dark:border-[#3a322c]/50">
                    <div className="relative">
                        {avatarPath ? (
                            <img src={resolveUploadUrl(avatarPath)} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center text-2xl font-black">
                                {form.full_name?.charAt(0) || 'U'}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="absolute -bottom-1 -end-1 w-7 h-7 bg-brand-orange text-white rounded-lg flex items-center justify-center shadow-md hover:bg-[#d4502a] transition-colors disabled:opacity-60"
                        >
                            {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                        </button>
                        <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleAvatarChange} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{form.full_name || (isAr ? 'بدون اسم' : 'No name')}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{user?.role}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">{isAr ? 'الاسم الكامل' : 'Full Name'}</label>
                            <div className="relative">
                                <User className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-gray-400" />
                                <input type="text" value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)} className="w-full bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl ps-11 pe-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-brand-orange transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">{isAr ? 'الهاتف' : 'Phone'}</label>
                            <div className="relative">
                                <Phone className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-gray-400" />
                                <input type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} dir="ltr" className="w-full bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl ps-11 pe-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-brand-orange transition-colors" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">{isAr ? 'البريد الإلكتروني الشخصي' : 'Personal Email'}</label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 -translate-y-1/2 start-4 w-4 h-4 text-gray-400" />
                                <input type="email" value={form.personal_email} onChange={(e) => handleChange('personal_email', e.target.value)} dir="ltr" className="w-full bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl ps-11 pe-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:border-brand-orange transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 dark:border-[#3a322c]/50">
                        <button type="submit" disabled={loading} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-50 ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-l from-brand-orange to-[#f0916d] text-white hover:shadow-lg hover:shadow-brand-orange/25'}`}>
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                            {saved ? (isAr ? 'تم الحفظ' : 'Saved') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountPage;
