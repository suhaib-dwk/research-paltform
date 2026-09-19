import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Trash2, Edit3, Eye, X, Loader2, Search, ToggleLeft, ToggleRight, AlertCircle,
    Plus, Printer, FileDown, FileSpreadsheet, FileText, ChevronDown, Check, Pencil,
    ImageUp
} from 'lucide-react';
import { API_BASE_URL, resolveUploadUrl } from '../../api';

const AdminDataTable = ({ tableName, columns, readOnly = false }) => {
    const { i18n } = useTranslation();
    const isRTL = i18n.language?.toLowerCase().startsWith('ar') ?? false; // مقارنة بادئة اللغة (يدعم ar-IQ ونحوها)
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [fetchError, setFetchError] = useState(null);

    const [viewModal, setViewModal] = useState({ isOpen: false, data: null });
    const [editModal, setEditModal] = useState({ isOpen: false, data: null, values: {} });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, isLoading: false });

    const [addModal, setAddModal] = useState({ isOpen: false });
    const [addData, setAddData] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const printRef = useRef(null);

    // ✅ حالة رفع صورة مباشرة (بدل كتابة رابط يدويًا) — key هنا هو col.key الحقل
    // اسم الحقل الجاري رفع صورته حالياً حتى يقدر أكثر من حقل صورة بنفس المودال
    // يشتغلوا بدون تداخل، ونفس الحالة تُستخدم لمودالي الإضافة والتعديل معاً.
    const [uploadingField, setUploadingField] = useState(null);
    const [uploadError, setUploadError] = useState(null);

    const uploadImageFile = async (fieldKey, file, onSuccess) => {
        setUploadError(null);
        if (!file) return;
        setUploadingField(fieldKey);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`${API_BASE_URL}/upload_admin_image.php`, {
                method: 'POST', body: formData, credentials: 'include',
            });
            const result = await res.json();
            if (result.status === 'success') {
                onSuccess(result.data.image_url);
            } else {
                setUploadError(isRTL ? 'تعذّر رفع الصورة، حاول مجدداً' : 'Could not upload the image, try again');
            }
        } catch (err) {
            console.error('Image upload error:', err);
            setUploadError(isRTL ? 'تعذّر رفع الصورة، حاول مجدداً' : 'Could not upload the image, try again');
        } finally {
            setUploadingField(null);
        }
    };

    // ✅ حالة التعديل السريع داخل الخلية
    const [editingCell, setEditingCell] = useState({ rowId: null, colKey: null, value: '' });
    const [isSavingCell, setIsSavingCell] = useState(false);

    // ✅ حالة قائمة التصدير المنسدلة
    const [exportMenuOpen, setExportMenuOpen] = useState(false);
    const exportMenuRef = useRef(null);

    // ✅ إغلاق القائمة عند النقر خارجها
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
                setExportMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setFetchError(null);
        try {
            const res = await fetch(`${API_BASE_URL}/admin_crud.php?action=get&table=${tableName}`, { credentials: 'include' });
            const text = await res.text();
            let result;
            try { result = JSON.parse(text); }
            catch (err) { throw new Error(isRTL ? 'خطأ في صيغة البيانات من السيرفر' : 'Invalid server JSON response'); }

            if (result.status === 'success') setData(result.data || []);
            else throw new Error(result.message || (isRTL ? 'فشل جلب البيانات' : 'Failed to fetch data'));
        } catch (err) {
            console.error("Fetch Error:", err);
            setFetchError(err.message);
        } finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, [tableName]);

    const filteredData = data.filter(row => columns.some(col => String(row[col.key] || '').toLowerCase().includes(searchTerm.toLowerCase())));
    const getColLabel = (col) => isRTL ? col.label_ar : col.label_en;

    const openAddModal = () => {
        const initialData = {};
        columns.forEach(col => {
            if (col.key === 'id' || col.key === 'created_at' || col.key === 'updated_at' || col.hidden) return;
            if (col.type === 'boolean') initialData[col.key] = '1';
            else initialData[col.key] = '';
        });
        setAddData(initialData);
        setAddModal({ isOpen: true });
    };

    const handleAddChange = (key, value) => setAddData(prev => ({ ...prev, [key]: value }));

    const handleAddSubmit = async () => {
        setIsAdding(true);
        try {
            const formData = new FormData();
            formData.append('action', 'add');
            formData.append('table', tableName);
            Object.keys(addData).forEach(key => formData.append(key, addData[key]));

            const res = await fetch(`${API_BASE_URL}/admin_crud.php`, { method: 'POST', body: formData, credentials: 'include' });
            const result = await res.json();
            if (result.status === 'success') {
                setAddModal({ isOpen: false });
                fetchData();
            } else alert(result.message);
        } catch (err) { console.error(err); }
        finally { setIsAdding(false); }
    };

    // ✅ التحقق من إمكانية التعديل السريع للخلية
    const canInlineEdit = (col) => {
        return !readOnly &&
            col.key !== 'id' &&
            !col.hidden &&
            col.type !== 'boolean' &&
            col.type !== 'image' &&
            !col.noEdit &&
            col.key !== 'created_at' &&
            col.key !== 'updated_at';
    };

       // ✅ تعديل سريع - محمي
    const handleInlineSave = async (rowId, colKey) => {
        setIsSavingCell(true);
        try {
            const formData = new FormData();
            formData.append('action', 'update_field');
            formData.append('table', tableName);
            formData.append('id', rowId);
            formData.append('field', colKey);
            formData.append('value', editingCell.value);
            const res = await fetch(`${API_BASE_URL}/admin_crud.php`, { method: 'POST', body: formData, credentials: 'include' });
            const text = await res.text();
            let result;
            try { result = JSON.parse(text); }
            catch { throw new Error(isRTL ? 'استجابة غير صالحة من السيرفر' : 'Invalid server response'); }

            if (result.status === 'success') {
                setEditingCell({ rowId: null, colKey: null, value: '' });
                fetchData();
            } else {
                alert(result.message || (isRTL ? 'فشل الحفظ' : 'Save failed'));
            }
        } catch (err) {
            console.error("Inline Save Error:", err);
            alert(err.message);
        }
        setIsSavingCell(false);
    };

    const handleInlineCancel = () => {
        setEditingCell({ rowId: null, colKey: null, value: '' });
    };

    // ✅ Toggle - محمي
    const handleToggle = async (id, field, currentValue) => {
        const newValue = currentValue == 1 ? 0 : 1;
        try {
            const formData = new FormData();
            formData.append('action', 'update_field'); formData.append('table', tableName);
            formData.append('id', id); formData.append('field', field); formData.append('value', newValue);
            const res = await fetch(`${API_BASE_URL}/admin_crud.php`, { method: 'POST', body: formData, credentials: 'include' });
            const text = await res.text();
            let result;
            try { result = JSON.parse(text); }
            catch { throw new Error(isRTL ? 'استجابة غير صالحة' : 'Invalid server response'); }

            if (result.status === 'success') fetchData();
            else alert(result.message || '');
        } catch (err) { console.error(err); }
    };

    const openEditModal = (row) => {
        const values = {};
        columns.forEach(col => {
            if (col.key !== 'id' && !col.hidden && col.type !== 'boolean') {
                values[col.key] = row[col.key] || '';
            }
        });
        setEditModal({ isOpen: true, data: row, values });
    };

    // ✅ حفظ التعديل الكامل - محمي (هذا المكان المسبّب للخطأ)
    const handleSaveEdit = async () => {
        try {
            const formData = new FormData();
            formData.append('action', 'update_row');
            formData.append('table', tableName);
            formData.append('id', editModal.data.id);
            Object.keys(editModal.values).forEach(key => formData.append(key, editModal.values[key]));

            const res = await fetch(`${API_BASE_URL}/admin_crud.php`, { method: 'POST', body: formData, credentials: 'include' });
            const text = await res.text();
            let result;
            try { result = JSON.parse(text); }
            catch { throw new Error(isRTL ? 'استجابة غير صالحة من السيرفر' : 'Invalid server response'); }

            if (result.status === 'success') {
                setEditModal({ isOpen: false, data: null, values: {} });
                fetchData();
            } else {
                alert(result.message || (isRTL ? 'فشل حفظ التعديلات' : 'Failed to save changes'));
            }
        } catch (err) {
            console.error("Save Edit Error:", err);
            alert(err.message);
        }
    };

    // ✅ حذف - محمي
    const handleDelete = async () => {
        setDeleteModal(prev => ({ ...prev, isLoading: true }));
        try {
            const formData = new FormData();
            formData.append('action', 'delete'); formData.append('table', tableName); formData.append('id', deleteModal.id);
            const res = await fetch(`${API_BASE_URL}/admin_crud.php`, { method: 'POST', body: formData, credentials: 'include' });
            const text = await res.text();
            let result;
            try { result = JSON.parse(text); }
            catch { throw new Error(isRTL ? 'استجابة غير صالحة' : 'Invalid server response'); }

            if (result.status === 'success') {
                setDeleteModal({ isOpen: false, id: null, isLoading: false });
                fetchData();
            } else {
                alert(result.message || '');
                setDeleteModal(prev => ({ ...prev, isLoading: false }));
            }
        } catch (err) {
            console.error("Delete Error:", err);
            alert(err.message);
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    };

   

    // ✅ طباعة
    const handlePrint = () => {
        setExportMenuOpen(false);
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${isRTL ? 'طباعة' : 'Print'}</title>
                    <style>
                        @page { margin: 15mm; }
                        body { font-family: 'Tajawal', 'DM Sans', Arial, sans-serif; direction: ${isRTL ? 'rtl' : 'ltr'}; padding: 20px; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: ${isRTL ? 'right' : 'left'}; }
                        th { background-color: #f8fafc; font-weight: bold; }
                        img { max-width: 100px; height: 60px; object-fit: cover; border-radius: 8px; }
                        .bool-yes { color: green; font-weight: bold; }
                        .bool-no { color: red; }
                    </style>
                </head>
                <body>
                    <h2 style="text-align: center; margin-bottom: 5px;">${tableName}</h2>
                    <p style="text-align: center; color: #888; font-size: 12px; margin-bottom: 20px;">${isRTL ? 'تاريخ الطباعة' : 'Print Date'}: ${new Date().toLocaleString(isRTL ? 'ar-SA' : 'en-US')}</p>
                    ${printContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    // ✅ تصدير Word
    const handleExportWord = () => {
        setExportMenuOpen(false);
        const table = printRef.current.innerHTML;
        const preHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office:word" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40/strict"><head><meta charset="utf-8"><style>body{font-family:'Tajawal','DM Sans',Arial,sans-serif;direction:${isRTL ? 'rtl' : 'ltr'};padding:20px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:${isRTL ? 'right' : 'left'}}th{background:#f0f0f0;font-weight:bold}img{max-width:100px;height:60px;object-fit:cover}.bool-yes{color:green;font-weight:bold}.bool-no{color:red}</style><title>Export</title></head><body><h2 style="text-align:center;margin-bottom:20px">${tableName}</h2>${table}</body></html>`;
        const blob = new Blob(['\ufeff', preHtml], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${tableName}_${new Date().getTime()}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // ✅ تصدير Excel (CSV مشفر UTF-8)
    const handleExportExcel = () => {
        setExportMenuOpen(false);
        const headers = ['#', ...visibleCols.map(c => getColLabel(c))];
        const rows = filteredData.map(row => [
            row.id,
            ...visibleCols.map(c => {
                const val = row[c.key];
                if (c.type === 'boolean') return val == 1 ? (isRTL ? 'مفعل' : 'Active') : (isRTL ? 'غير مفعل' : 'Inactive');
                return val || '';
            })
        ]);

        let csvContent = '\uFEFF'; // BOM لضمان دعم العربية
        csvContent += headers.map(h => `"${h}"`).join(',') + '\n';
        rows.forEach(row => {
            csvContent += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${tableName}_${new Date().getTime()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // ✅ تصدير PDF (عبر نافذة الطباعة - حفظ كـ PDF)
    const handleExportPDF = () => {
        setExportMenuOpen(false);
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${tableName} - PDF</title>
                    <style>
                        @page { margin: 10mm; size: landscape; }
                        body { font-family: 'Tajawal', 'DM Sans', Arial, sans-serif; direction: ${isRTL ? 'rtl' : 'ltr'}; padding: 15px; font-size: 11px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        th, td { border: 1px solid #555; padding: 5px 8px; text-align: ${isRTL ? 'right' : 'left'}; }
                        th { background-color: #e2e8f0; font-weight: bold; font-size: 10px; }
                        img { max-width: 80px; height: 50px; object-fit: cover; }
                        .bool-yes { color: #16a34a; font-weight: bold; }
                        .bool-no { color: #dc2626; }
                    </style>
                </head>
                <body>
                    <h2 style="text-align: center; margin-bottom: 3px; font-size: 16px;">${tableName}</h2>
                    <p style="text-align: center; color: #888; font-size: 10px; margin-bottom: 10px;">${isRTL ? 'تاريخ التصدير' : 'Export Date'}: ${new Date().toLocaleString(isRTL ? 'ar-SA' : 'en-US')}</p>
                    ${printContent}
                </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

  

    const formatCellValue = (col, value) => {
        if (col.type === 'boolean') return value == 1
            ? `<span class="bool-yes">${isRTL ? 'مفعل' : 'Active'}</span>`
            : `<span class="bool-no">${isRTL ? 'غير مفعل' : 'Inactive'}</span>`;
        if (col.type === 'image' && value) return `<img src="${value}" alt="" style="max-width:100px; height:60px; object-fit:cover; border-radius:8px;" />`;
        return `<span style="white-space:pre-wrap;">${value || '-'}</span>`;
    };

    const visibleCols = columns.filter(c => !c.hidden);

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:max-w-md">
                    <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} w-5 h-5 text-gray-400`} />
                    <input type="text" placeholder={isRTL ? 'ابحث في الجدول...' : 'Search in table...'} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full border border-gray-200 dark:border-brand-dark-border rounded-xl ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 focus:ring-2 focus:ring-brand-orange outline-none bg-white dark:bg-brand-dark-card`}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {!readOnly && (
                        <button onClick={openAddModal} className="flex items-center justify-center gap-2 bg-brand-orange text-white px-5 py-3 rounded-xl font-bold hover:bg-brand-orange-dark transition-colors shadow-sm">
                            <Plus className="w-5 h-5" />
                            {isRTL ? 'إضافة جديد' : 'Add New'}
                        </button>
                    )}

                    {/* ✅ قائمة التصدير المنسدلة */}
                    <div className="relative" ref={exportMenuRef}>
                        <button
                            onClick={() => setExportMenuOpen(!exportMenuOpen)}
                            className="flex items-center justify-center gap-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-5 py-3 rounded-xl font-bold hover:bg-emerald-200 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-200 dark:border-emerald-800/30"
                        >
                            <FileDown className="w-5 h-5" />
                            <span className="hidden sm:inline">{isRTL ? 'تصدير' : 'Export'}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${exportMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {exportMenuOpen && (
                            <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-2 bg-white dark:bg-brand-dark-card rounded-xl shadow-2xl border border-gray-100 dark:border-brand-dark-border py-2 w-52 z-50 animate-in fade-in slide-in-from-top-2`}>
                                <button onClick={handlePrint} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-brand-dark-hover transition-colors">
                                    <Printer className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    {isRTL ? 'طباعة' : 'Print'}
                                </button>
                                <button onClick={handleExportWord} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-brand-orange/10 transition-colors">
                                    <FileText className="w-4 h-4 text-brand-orange" />
                                    {isRTL ? 'تصدير Word' : 'Export Word'}
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mr-auto">.doc</span>
                                </button>
                                <button onClick={handleExportExcel} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/15 transition-colors">
                                    <FileSpreadsheet className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                    {isRTL ? 'تصدير Excel' : 'Export Excel'}
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mr-auto">.csv</span>
                                </button>
                                <div className="border-t border-gray-100 dark:border-brand-dark-border my-1"></div>
                                <button onClick={handleExportPDF} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/15 transition-colors">
                                    <FileDown className="w-4 h-4 text-red-500 dark:text-red-400" />
                                    {isRTL ? 'تصدير PDF' : 'Export PDF'}
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mr-auto">.pdf</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {fetchError && (
                <div className="mb-6 p-5 bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-red-700 dark:text-red-400 mb-1">{isRTL ? 'خطأ في تحميل الجدول' : 'Failed to load table'}</h4>
                            <p className="text-sm text-red-600 dark:text-red-400 mb-3">{fetchError}</p>
                            <button onClick={fetchData} className="text-sm bg-red-100 dark:bg-red-900/25 text-red-700 dark:text-red-400 px-4 py-1.5 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 font-medium">
                                {isRTL ? 'إعادة المحاولة' : 'Retry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-brand-orange" /></div>
            ) : (
                <>
                    {/* جدول مخفي للتصدير */}
                    <div className="hidden overflow-hidden" id="exportable-table-area" ref={printRef}>
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-3 border-b border-gray-200 dark:border-brand-dark-border">#{isRTL ? 'رقم' : 'ID'}</th>
                                    {visibleCols.map(col => (<th key={col.key} className="px-4 py-3 border-b border-gray-200 dark:border-brand-dark-border">{getColLabel(col)}</th>))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(row => (
                                    <tr key={row.id}>
                                        <td className="px-4 py-3 border-b border-gray-100 dark:border-brand-dark-border">{row.id}</td>
                                        {visibleCols.map(col => (
                                            <td key={col.key} className="px-4 py-3 border-b border-gray-100 dark:border-brand-dark-border" dangerouslySetInnerHTML={{ __html: formatCellValue(col, row[col.key]) }} />
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ عرض الموبايل مع إضافة زر التعديل */}
                    <div className="lg:hidden space-y-4">
                        {filteredData.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">{isRTL ? 'لا توجد بيانات' : 'No data found'}</div>
                        ) : filteredData.map((row) => (
                            <div key={row.id} className="bg-white dark:bg-brand-dark-card p-4 rounded-xl border border-gray-200 dark:border-brand-dark-border/60 shadow-sm space-y-3">
                                {visibleCols.filter(c => c.key !== 'id').slice(0, 4).map(col => (
                                    <div key={col.key} className="flex justify-between items-start">
                                        <span className="text-xs font-bold text-gray-500">{getColLabel(col)}</span>
                                        <span className="text-sm text-gray-900 dark:text-white text-end max-w-[70%] truncate" dangerouslySetInnerHTML={{ __html: col.type === 'boolean' ? (row[col.key] == 1 ? '✅' : '❌') : (row[col.key] || '-') }} />
                                    </div>
                                ))}
                                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-brand-dark-border">
                                    <button onClick={() => setViewModal({ isOpen: true, data: row })} className="flex-1 flex items-center justify-center gap-1 text-xs py-2 bg-gray-100 dark:bg-brand-dark-hover rounded-lg hover:bg-gray-200">
                                        <Eye className="w-4 h-4" /> {isRTL ? 'عرض' : 'View'}
                                    </button>
                                    {!readOnly && (
                                        <>
                                            <button onClick={() => openEditModal(row)} className="flex-1 flex items-center justify-center gap-1 text-xs py-2 bg-amber-50 dark:bg-amber-900/15 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/25">
                                                <Edit3 className="w-4 h-4" /> {isRTL ? 'تعديل' : 'Edit'}
                                            </button>
                                            <button onClick={() => setDeleteModal({ isOpen: true, id: row.id, isLoading: false })} className="flex-1 flex items-center justify-center gap-1 text-xs py-2 bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/25">
                                                <Trash2 className="w-4 h-4" /> {isRTL ? 'حذف' : 'Delete'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ✅ جدول Desktop مع التعديل السريع */}
                    <div className="hidden lg:block bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-200 dark:border-brand-dark-border/60 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-brand-dark border-b border-gray-200 dark:border-brand-dark-border">
                                    <tr>
                                        <th className="px-6 py-4">#</th>
                                        {visibleCols.map(col => (<th key={col.key} className="px-6 py-4">{getColLabel(col)}</th>))}
                                        {!readOnly && <th className="px-6 py-4 text-end">{isRTL ? 'إجراءات' : 'Actions'}</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredData.length === 0 ? (
                                        <tr>
                                            <td colSpan={visibleCols.length + 2} className="text-center py-10 text-gray-400">
                                                {isRTL ? 'لا توجد بيانات' : 'No data found'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredData.map((row) => (
                                            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-brand-dark-hover transition-colors">
                                                <td className="px-6 py-4 font-medium text-gray-400">{row.id}</td>
                                                {visibleCols.map(col => (
                                                    <td key={col.key} className="px-6 py-4">
                                                        {/* ✅ وضع التعديل السريع */}
                                                        {editingCell.rowId === row.id && editingCell.colKey === col.key ? (
                                                            <div className="flex items-center gap-1.5">
                                                                {col.type === 'longtext' ? (
                                                                    <textarea
                                                                        autoFocus
                                                                        rows={3}
                                                                        value={editingCell.value}
                                                                        onChange={e => setEditingCell(prev => ({ ...prev, value: e.target.value }))}
                                                                        onKeyDown={e => {
                                                                            if (e.key === 'Enter' && e.ctrlKey) handleInlineSave(row.id, col.key);
                                                                            if (e.key === 'Escape') handleInlineCancel();
                                                                        }}
                                                                        className="w-full border-2 border-brand-orange rounded-lg p-2 text-sm focus:ring-2 focus:ring-brand-orange outline-none bg-orange-50 dark:bg-brand-orange/10 resize-none"
                                                                    />
                                                                ) : (
                                                                    <input
                                                                        autoFocus
                                                                        type="text"
                                                                        value={editingCell.value}
                                                                        onChange={e => setEditingCell(prev => ({ ...prev, value: e.target.value }))}
                                                                        onKeyDown={e => {
                                                                            if (e.key === 'Enter') handleInlineSave(row.id, col.key);
                                                                            if (e.key === 'Escape') handleInlineCancel();
                                                                        }}
                                                                        dir={col.key === 'email' || col.key === 'link' || col.key.includes('_en') || col.key.includes('_ar') ? 'ltr' : undefined}
                                                                        className="w-full border-2 border-brand-orange rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-brand-orange outline-none bg-orange-50 dark:bg-brand-orange/10"
                                                                    />
                                                                )}
                                                                <button onClick={() => handleInlineSave(row.id, col.key)} disabled={isSavingCell}
                                                                    className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/25 rounded-lg transition-colors flex-shrink-0" title={isRTL ? 'حفظ (Enter)' : 'Save (Enter)'}>
                                                                    {isSavingCell ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                                </button>
                                                                <button onClick={handleInlineCancel}
                                                                    className="p-1.5 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-brand-dark-hover rounded-lg transition-colors flex-shrink-0" title={isRTL ? 'إلغاء (Esc)' : 'Cancel (Esc)'}>
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ) : col.type === 'image' ? (
                                                            /* ✅ resolveUploadUrl ضرورية: المسار المخزَّن قد يكون نسبيًا (uploads/admin/...
                                                               من الرفع المباشر الجديد) وليس رابطًا كاملاً كما كان يُكتب يدويًا سابقًا. */
                                                            <img src={resolveUploadUrl(row[col.key])} className="w-16 h-10 object-cover rounded-lg bg-gray-50 dark:bg-brand-dark" alt="" />
                                                        ) : col.type === 'boolean' ? (
                                                            <button onClick={() => handleToggle(row.id, col.key, row[col.key])} title="Toggle">
                                                                {row[col.key] == 1
                                                                    ? <ToggleRight className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                                                                    : <ToggleLeft className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                                                }
                                                            </button>
                                                        ) : (
                                                            /* ✅ القيمة مع زر التعديل السريع عند التمرير */
                                                            <div className="flex items-center gap-2 group">
                                                                <span className="font-medium text-gray-900 dark:text-white whitespace-pre-wrap">{row[col.key] || '-'}</span>
                                                                {canInlineEdit(col) && (
                                                                    <button
                                                                        onClick={() => setEditingCell({ rowId: row.id, colKey: col.key, value: row[col.key] || '' })}
                                                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-brand-orange transition-all duration-150 flex-shrink-0"
                                                                        title={isRTL ? 'تعديل سريع' : 'Quick Edit'}
                                                                    >
                                                                        <Pencil className="w-3.5 h-3.5" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                ))}
                                                {!readOnly && (
                                                    <td className="px-6 py-4 text-end">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => setViewModal({ isOpen: true, data: row })} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:bg-brand-orange/10 hover:text-brand-orange rounded-lg"><Eye className="w-4 h-4" /></button>
                                                            <button onClick={() => openEditModal(row)} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-amber-50 dark:hover:bg-amber-900/15 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                                                            <button onClick={() => setDeleteModal({ isOpen: true, id: row.id, isLoading: false })} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* مودال العرض */}
            {viewModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setViewModal({ isOpen: false, data: null })}>
                    <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white dark:bg-brand-dark-card p-6 border-b flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{isRTL ? 'تفاصيل السجل' : 'Record Details'} (#{viewModal.data.id})</h3>
                            <button onClick={() => setViewModal({ isOpen: false, data: null })} className="p-2 hover:bg-gray-100 dark:hover:bg-brand-dark-hover rounded-lg"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            {columns.map(col => (
                                <div key={col.key} className="border-b border-gray-100 dark:border-brand-dark-border pb-4">
                                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1">{getColLabel(col)}</p>
                                    {col.type === 'image' ? (
                                        <img src={resolveUploadUrl(viewModal.data[col.key])} className="w-40 h-24 object-cover rounded-lg border" alt="" />
                                    ) : col.type === 'boolean' ? (
                                        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-brand-dark p-3 rounded-lg text-sm">{viewModal.data[col.key] == 1 ? (isRTL ? 'مفعل' : 'Active') : (isRTL ? 'غير مفعل' : 'Inactive')}</p>
                                    ) : (
                                        <p className="text-gray-900 dark:text-white whitespace-pre-wrap bg-gray-50 dark:bg-brand-dark p-3 rounded-lg text-sm">{viewModal.data[col.key] || '-'}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* مودال التعديل الكامل */}
            {editModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setEditModal({ isOpen: false, data: null, values: {} })}>
                    <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white dark:bg-brand-dark-card p-6 border-b flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {isRTL ? 'تعديل السجل' : 'Edit Record'} #{editModal.data.id}
                            </h3>
                            <button onClick={() => setEditModal({ isOpen: false, data: null, values: {} })} className="p-2 hover:bg-gray-100 dark:hover:bg-brand-dark-hover rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {uploadError && (
                                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400 text-sm font-bold px-4 py-3 rounded-xl">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {uploadError}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {columns.filter(c => c.key !== 'id' && !c.hidden && c.type !== 'boolean').map(col => (
                                    <div key={col.key} className={(col.type === 'longtext' || col.type === 'image') ? 'md:col-span-2' : ''}>
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 block">{getColLabel(col)}</label>
                                        {col.type === 'image' ? (
                                            <div>
                                                {editModal.values[col.key] && (
                                                    <img src={resolveUploadUrl(editModal.values[col.key])} alt="" className="w-32 h-20 object-cover rounded-lg border border-gray-200 dark:border-brand-dark-border mb-2" />
                                                )}
                                                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 cursor-pointer hover:border-brand-orange hover:bg-orange-50/50 dark:hover:bg-brand-orange/5 transition-colors text-sm font-bold text-gray-500 dark:text-gray-400">
                                                    {uploadingField === col.key ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <ImageUp className="w-4 h-4" />
                                                    )}
                                                    {uploadingField === col.key ? (isRTL ? 'جاري الرفع...' : 'Uploading...') : (isRTL ? 'رفع صورة جديدة' : 'Upload new image')}
                                                    <input
                                                        type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden"
                                                        disabled={uploadingField === col.key}
                                                        onChange={(e) => {
                                                            uploadImageFile(col.key, e.target.files?.[0], (url) =>
                                                                setEditModal((prev) => ({ ...prev, values: { ...prev.values, [col.key]: url } }))
                                                            );
                                                            e.target.value = '';
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        ) : col.type === 'longtext' ? (
                                            <textarea
                                                rows={6}
                                                value={editModal.values[col.key] || ''}
                                                onChange={e => setEditModal({ ...editModal, values: { ...editModal.values, [col.key]: e.target.value } })}
                                                className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl p-3 focus:ring-2 focus:ring-brand-orange outline-none resize-none"
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={editModal.values[col.key] || ''}
                                                onChange={e => setEditModal({ ...editModal, values: { ...editModal.values, [col.key]: e.target.value } })}
                                                dir={col.key === 'email' || col.key === 'link' || col.key.includes('_en') || col.key.includes('_ar') ? 'ltr' : undefined}
                                                className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 dark:border-brand-dark-border flex gap-3 justify-end">
                            <button onClick={() => setEditModal({ isOpen: false, data: null, values: {} })} className="px-6 py-2.5 bg-gray-100 dark:bg-brand-dark-hover rounded-xl text-sm font-bold hover:bg-gray-200">
                                {isRTL ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button onClick={handleSaveEdit} className="px-6 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-bold hover:bg-brand-orange-dark">
                                {isRTL ? 'حفظ التعديلات' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال الإضافة */}
            {addModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setAddModal({ isOpen: false })}>
                    <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white dark:bg-brand-dark-card p-6 border-b flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{isRTL ? 'إضافة سجل جديد' : 'Add New Record'}</h3>
                            <button onClick={() => setAddModal({ isOpen: false })} className="p-2 hover:bg-gray-100 dark:hover:bg-brand-dark-hover rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            {uploadError && (
                                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/15 text-red-600 dark:text-red-400 text-sm font-bold px-4 py-3 rounded-xl">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" /> {uploadError}
                                </div>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {columns.filter(c => c.key !== 'id' && !c.hidden).map(col => (
                                    <div key={col.key} className={(col.type === 'longtext' || col.type === 'image') ? 'md:col-span-2' : ''}>
                                        {col.type === 'boolean' ? (
                                            <label className="flex items-center gap-3 cursor-pointer select-none">
                                                <input type="checkbox" checked={addData[col.key] == 1}
                                                    onChange={(e) => handleAddChange(col.key, e.target.checked ? '1' : '0')}
                                                    className="w-5 h-5 rounded text-brand-orange focus:ring-brand-orange cursor-pointer" />
                                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{getColLabel(col)}</span>
                                            </label>
                                        ) : col.type === 'image' ? (
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 block">{getColLabel(col)}</label>
                                                {addData[col.key] && (
                                                    <img src={resolveUploadUrl(addData[col.key])} alt="" className="w-32 h-20 object-cover rounded-lg border border-gray-200 dark:border-brand-dark-border mb-2" />
                                                )}
                                                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 cursor-pointer hover:border-brand-orange hover:bg-orange-50/50 dark:hover:bg-brand-orange/5 transition-colors text-sm font-bold text-gray-500 dark:text-gray-400">
                                                    {uploadingField === col.key ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <ImageUp className="w-4 h-4" />
                                                    )}
                                                    {uploadingField === col.key ? (isRTL ? 'جاري الرفع...' : 'Uploading...') : (isRTL ? 'اختر صورة للرفع' : 'Choose image to upload')}
                                                    <input
                                                        type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden"
                                                        disabled={uploadingField === col.key}
                                                        onChange={(e) => {
                                                            uploadImageFile(col.key, e.target.files?.[0], (url) => handleAddChange(col.key, url));
                                                            e.target.value = '';
                                                        }}
                                                    />
                                                </label>
                                            </div>
                                        ) : col.type === 'longtext' ? (
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 block">{getColLabel(col)}</label>
                                                <textarea rows={5} value={addData[col.key] || ''} onChange={(e) => handleAddChange(col.key, e.target.value)}
                                                    placeholder={isRTL ? 'اكتب النص هنا...' : 'Type text here...'}
                                                    className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none resize-none" />
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 block">{getColLabel(col)}</label>
                                                <input type="text" value={addData[col.key] || ''} onChange={(e) => handleAddChange(col.key, e.target.value)}
                                                    placeholder={isRTL ? 'أدخل القيمة...' : 'Enter value...'}
                                                    dir={col.key === 'email' || col.key === 'link' || col.key.includes('_en') || col.key.includes('_ar') ? 'ltr' : undefined}
                                                    className="w-full border border-gray-200 dark:border-brand-dark-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-orange outline-none" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 dark:border-brand-dark-border flex gap-3 justify-end">
                            <button onClick={() => setAddModal({ isOpen: false })} className="px-6 py-2.5 bg-gray-100 dark:bg-brand-dark-hover rounded-xl text-sm font-bold hover:bg-gray-200">
                                {isRTL ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button onClick={handleAddSubmit} disabled={isAdding} className="px-6 py-2.5 bg-brand-orange text-white rounded-xl text-sm font-bold hover:bg-brand-orange-dark flex items-center gap-2 disabled:bg-brand-orange/50">
                                <Loader2 className={`w-5 h-5 animate-spin ${isAdding ? 'block' : 'hidden'}`} />
                                {isAdding ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ السجل' : 'Save Record')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* مودال الحذف */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !deleteModal.isLoading && setDeleteModal({ isOpen: false, id: null, isLoading: false })}>
                    <div className="bg-white dark:bg-brand-dark-card rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-500 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{isRTL ? 'تأكيد الحذف؟' : 'Confirm Delete?'}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{isRTL ? 'سيتم حذف هذا السجل نهائياً.' : 'This record will be permanently deleted.'}</p>
                        </div>
                        <div className="flex border-t border-gray-100 dark:border-brand-dark-border">
                            <button onClick={() => setDeleteModal({ isOpen: false, id: null, isLoading: false })} disabled={deleteModal.isLoading} className="flex-1 py-4 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-brand-dark-hover transition-colors">
                                {isRTL ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button onClick={handleDelete} disabled={deleteModal.isLoading} className="flex-1 py-4 text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:bg-red-400">
                                {deleteModal.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {isRTL ? 'حذف' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDataTable;