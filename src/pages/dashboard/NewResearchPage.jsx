import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Save, Loader2, Check, FileText, XCircle } from 'lucide-react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL } from '../../api';

const getSubmitError = (serverMsg, isAr) => {
    if (!serverMsg) return isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred';
    const map = {
        'title_required': { ar: 'عنوان البحث مطلوب', en: 'Title is required' },
        'abstract_required': { ar: 'الملخص مطلوب', en: 'Abstract is required' },
        'invalid_field': { ar: 'المجال العلمي غير صحيح', en: 'Invalid scientific field' },
        'file_required': { ar: 'يرجى رفع ملف البحث', en: 'Please upload research file' },
        'invalid_file_type': { ar: 'صيغة الملف غير مقبولة. المسموح: PDF, DOC, DOCX', en: 'Invalid file type. Allowed: PDF, DOC, DOCX' },
        'file_size_exceeded': { ar: 'حجم الملف يتجاوز 20 ميغابايت', en: 'File size exceeds 20MB' },
        'file_empty': { ar: 'الملف فارغ', en: 'File is empty' },
        'database_insert_failed': { ar: 'فشل حفظ البحث', en: 'Failed to save research' },
    };
    const lower = serverMsg.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    for (const [key, trans] of Object.entries(map)) {
        if (lower.includes(key)) return isAr ? trans.ar : trans.en;
    }
    return serverMsg;
};

const formatFileSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

const NewResearchPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ title: '', abstract: '', keywords: '', field: '' });
    const [file, setFile] = useState(null);

    const handleChange = (name, value) => setForm(p => ({ ...p, [name]: value }));

    const handleFileChange = (e) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        const ext = selected.name.split('.').pop().toLowerCase();
        if (!['pdf', 'doc', 'docx'].includes(ext)) {
            setError(isAr ? 'صيغة الملف غير مقبولة. المسموح: PDF, DOC, DOCX' : 'Invalid file type. Allowed: PDF, DOC, DOCX');
            return;
        }
        if (selected.size > 20 * 1024 * 1024) {
            setError(isAr ? 'حجم الملف يتجاوز 20 ميغابايت' : 'File size exceeds 20MB');
            return;
        }
        setFile(selected);
        setError(null);
    };

    const isFormValid = form.title.trim() && form.abstract.trim() && form.field && file;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('user_id', entityId || '');
            formData.append('title', form.title.trim());
            formData.append('abstract', form.abstract.trim());
            formData.append('keywords', form.keywords.trim());
            formData.append('field', form.field);
            formData.append('file', file);

            const res = await fetch(`${API_BASE_URL}/submit_research.php`, { method: 'POST', body: formData });
            const result = await res.json();

            if (result.status === 'success') {
                setSaved(true);
                setTimeout(() => navigate('/dashboard/researches'), 1200);
            } else {
                setError(getSubmitError(result.message, isAr));
            }
        } catch (err) {
            console.error('Submit research error:', err);
            setError(isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isAr ? 'إضافة بحث جديد' : 'Add New Research'}</h1>
                <p className="text-sm text-gray-400 mt-1">{isAr ? 'املأ بيانات البحث وارفع الملف' : 'Fill in the research details and upload file'}</p>
            </div>

            {error && (
                <div className="flex items-start gap-2.5 p-3.5 mb-5 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 p-6 space-y-5">
                <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">{isAr ? 'عنوان البحث' : 'Research Title'}</label>
                    <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e8623a] transition-colors text-gray-900 dark:text-white" />
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">{isAr ? 'الملخص' : 'Abstract'}</label>
                    <textarea rows={5} value={form.abstract} onChange={(e) => handleChange('abstract', e.target.value)} className="w-full bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e8623a] transition-colors resize-none text-gray-900 dark:text-white" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">{isAr ? 'الكلمات المفتاحية' : 'Keywords'}</label>
                        <input type="text" value={form.keywords} onChange={(e) => handleChange('keywords', e.target.value)} placeholder={isAr ? 'كلمة 1, كلمة 2, كلمة 3' : 'keyword 1, keyword 2, keyword 3'} className="w-full bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e8623a] transition-colors text-gray-900 dark:text-white" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">{isAr ? 'المجال العلمي' : 'Scientific Field'}</label>
                        <select value={form.field} onChange={(e) => handleChange('field', e.target.value)} className="w-full bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e8623a] text-gray-900 dark:text-white">
                            <option value="">{isAr ? 'اختر...' : 'Select...'}</option>
                            <option value="cs">Computer Science</option>
                            <option value="eng">Engineering</option>
                            <option value="med">Medicine</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                        {isAr ? 'ملف البحث' : 'Research File'} <span className="text-rose-500">*</span>
                    </label>
                    <label className={`flex flex-col items-center justify-center h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                        file ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-gray-200 dark:border-[#3a322c] hover:border-[#e8623a]'
                    }`}>
                        <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                        {file ? (
                            <div className="text-center">
                                <FileText className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 max-w-[240px] truncate">{file.name}</p>
                                <p className="text-[11px] text-emerald-500/70 mt-0.5">{formatFileSize(file.size)}</p>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">{isAr ? 'اسحب الملف هنا أو اضغط للاختيار (PDF, DOCX - حد أقصى 20MB)' : 'Drag file here or click to select (PDF, DOCX - Max 20MB)'}</p>
                            </>
                        )}
                    </label>
                </div>
                <div className="pt-4 border-t border-gray-50 dark:border-[#3a322c]/50">
                    <button type="submit" disabled={loading || !isFormValid} className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-50 ${saved ? 'bg-emerald-500 text-white' : 'bg-gradient-to-l from-[#e8623a] to-[#f0916d] text-white hover:shadow-lg hover:shadow-[#e8623a]/25'}`}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saved ? (isAr ? 'تم الإرسال' : 'Submitted') : (isAr ? 'إرسال البحث' : 'Submit Research')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewResearchPage;
