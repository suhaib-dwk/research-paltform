import { useState, useEffect } from 'react';
import { Search, Eye, Ban, CheckCircle, UserCheck, UserX, Loader2, X } from 'lucide-react';
import { useSite } from '../../../SiteContext';
import { API_BASE_URL } from '../../../api';

const roleColors = {
    faculty: 'bg-purple-50 dark:bg-purple-900/15 text-purple-600 dark:text-purple-400',
    grad: 'bg-blue-50 dark:bg-blue-900/15 text-blue-600 dark:text-blue-400',
    researcher: 'bg-[#e8623a]/10 text-[#e8623a]',
    undergrad: 'bg-emerald-50 dark:bg-emerald-900/15 text-emerald-600 dark:text-emerald-400',
    reviewer: 'bg-orange-50 dark:bg-orange-900/15 text-orange-600 dark:text-orange-400',
    university: 'bg-indigo-50 dark:bg-indigo-900/15 text-indigo-600 dark:text-indigo-400',
    college: 'bg-teal-50 dark:bg-teal-900/15 text-teal-600 dark:text-teal-400',
    research_center: 'bg-cyan-50 dark:bg-cyan-900/15 text-cyan-600 dark:text-cyan-400',
    ministry: 'bg-rose-50 dark:bg-rose-900/15 text-rose-600 dark:text-rose-400',
    employee: 'bg-gray-100 dark:bg-[#2a231e] text-gray-500 dark:text-gray-400',
    service_provider: 'bg-amber-50 dark:bg-amber-900/15 text-amber-600 dark:text-amber-400',
};
const statusIcons = {
    active: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    pending: <UserCheck className="w-4 h-4 text-[#e8623a]" />,
    rejected: <UserX className="w-4 h-4 text-red-400" />,
};
const statusLabel = (status, isAr) => ({
    active: isAr ? 'مفعّل' : 'Active',
    pending: isAr ? 'قيد المراجعة' : 'Pending',
    rejected: isAr ? 'مرفوض' : 'Rejected',
}[status] || status);
const roleLabel = (role, isAr) => ({
    faculty: isAr ? 'هيئة تدريس' : 'Faculty', grad: isAr ? 'دراسات عليا' : 'Graduate',
    researcher: isAr ? 'باحث' : 'Researcher', undergrad: isAr ? 'بكالوريوس' : 'Undergraduate',
    reviewer: isAr ? 'محكم' : 'Reviewer', university: isAr ? 'جامعة' : 'University',
    college: isAr ? 'كلية' : 'College', research_center: isAr ? 'مركز بحثي' : 'Research Center',
    ministry: isAr ? 'وزارة' : 'Ministry', employee: isAr ? 'موظف' : 'Employee',
    service_provider: isAr ? 'مقدّم خدمة' : 'Service Provider',
}[role] || role);

const UsersPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actingId, setActingId] = useState(null);
    const [detailsId, setDetailsId] = useState(null);
    const [details, setDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const fetchUsers = () => {
        if (!entityId) return;
        setLoading(true);
        fetch(`${API_BASE_URL}/get_all_users.php?requester_id=${entityId}`)
            .then(r => r.json())
            .then(r => { if (r.status === 'success') setUsers(r.data); })
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(fetchUsers, [entityId]);

    const filtered = users.filter(u => {
        const name = isAr ? u.name_ar : u.name_en;
        const matchSearch = name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = filterRole === 'all' || u.role === filterRole;
        return matchSearch && matchRole;
    });

    const openDetails = (targetId) => {
        setDetailsId(targetId);
        setLoadingDetails(true);
        fetch(`${API_BASE_URL}/get_user_details.php?requester_id=${entityId}&target_user_id=${targetId}`)
            .then(r => r.json())
            .then(r => { if (r.status === 'success') setDetails(r.data); })
            .catch(() => {})
            .finally(() => setLoadingDetails(false));
    };

    const handleStatusChange = async (targetId, newStatus) => {
        setActingId(targetId);
        try {
            const formData = new FormData();
            formData.append('requester_id', entityId || '');
            formData.append('target_user_id', targetId);
            formData.append('new_status', newStatus);
            const res = await fetch(`${API_BASE_URL}/update_user_status.php`, { method: 'POST', body: formData });
            const result = await res.json();
            if (result.status === 'success') {
                setUsers(prev => prev.map(u => u.id === targetId ? { ...u, status: newStatus } : u));
            }
        } catch (err) {
            console.error('Update user status error:', err);
        } finally {
            setActingId(null);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isAr ? 'المستخدمون' : 'Users'}</h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{isAr ? 'إدارة حسابات المستخدمين والموافقة عليها' : 'Manage and approve user accounts'}</p>
            </div>
            <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-[#3a322c]/50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={isAr ? 'بحث بالاسم أو البريد...' : 'Search by name or email...'} className="w-full bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl ps-10 pe-4 py-2.5 text-sm outline-none focus:border-[#e8623a] transition-colors text-gray-900 dark:text-white" />
                    </div>
                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#e8623a] text-gray-900 dark:text-white">
                        <option value="all">{isAr ? 'جميع الأدوار' : 'All Roles'}</option>
                        {['faculty', 'grad', 'researcher', 'undergrad', 'reviewer', 'university', 'college', 'research_center', 'ministry', 'service_provider'].map(r => (
                            <option key={r} value={r}>{roleLabel(r, isAr)}</option>
                        ))}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-50 dark:border-[#3a322c]/50">
                                <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{isAr ? 'الاسم' : 'Name'}</th>
                                <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                                <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{isAr ? 'الدور' : 'Role'}</th>
                                <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{isAr ? 'الحالة' : 'Status'}</th>
                                <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{isAr ? 'الإجراءات' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-16"><Loader2 className="w-6 h-6 text-[#e8623a] animate-spin mx-auto" /></td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">{isAr ? 'لا توجد بيانات' : 'No data available'}</td></tr>
                            ) : filtered.map(u => (
                                <tr key={u.id} className="border-b border-gray-50 dark:border-[#3a322c]/30 hover:bg-[#f4f6fb] dark:hover:bg-[#1a1613]/40 transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gray-900/10 dark:bg-white/10 text-gray-900 dark:text-white flex items-center justify-center text-xs font-bold">{(isAr ? u.name_ar : u.name_en).charAt(0)}</div>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{isAr ? u.name_ar : u.name_en}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400" dir="ltr">{u.email}</td>
                                    <td className="px-5 py-3.5"><span className={`text-xs font-bold px-3 py-1 rounded-full ${roleColors[u.role] || 'bg-gray-100 dark:bg-[#2a231e] text-gray-500 dark:text-gray-400'}`}>{roleLabel(u.role, isAr)}</span></td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1.5">{statusIcons[u.status]}<span className="text-xs font-medium text-gray-500 dark:text-gray-400">{statusLabel(u.status, isAr)}</span></div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => openDetails(u.id)} className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-[#e8623a]/10 text-[#e8623a] flex items-center justify-center hover:bg-orange-100 dark:hover:bg-[#e8623a]/20 transition-colors"><Eye className="w-4 h-4" /></button>
                                            {u.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(u.id, 'active')}
                                                        disabled={actingId === u.id}
                                                        className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors disabled:opacity-50"
                                                    >
                                                        {actingId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(u.id, 'rejected')}
                                                        disabled={actingId === u.id}
                                                        className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {detailsId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setDetailsId(null)}>
                    <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 max-w-md w-full" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-[#3a322c]/50">
                            <h3 className="font-bold text-gray-900 dark:text-white">{isAr ? 'تفاصيل المستخدم' : 'User Details'}</h3>
                            <button onClick={() => setDetailsId(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-5">
                            {loadingDetails ? (
                                <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 text-[#e8623a] animate-spin" /></div>
                            ) : details && (
                                <div className="space-y-3 text-sm">
                                    <div><p className="text-xs text-gray-400 mb-1">{isAr ? 'الاسم' : 'Name'}</p><p className="font-semibold text-gray-900 dark:text-white">{details.name || '—'}</p></div>
                                    <div><p className="text-xs text-gray-400 mb-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</p><p className="text-gray-700 dark:text-gray-300" dir="ltr">{details.email}</p></div>
                                    {details.phone && <div><p className="text-xs text-gray-400 mb-1">{isAr ? 'الهاتف' : 'Phone'}</p><p className="text-gray-700 dark:text-gray-300" dir="ltr">{details.phone}</p></div>}
                                    <div><p className="text-xs text-gray-400 mb-1">{isAr ? 'الدور' : 'Role'}</p><span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${roleColors[details.role]}`}>{roleLabel(details.role, isAr)}</span></div>
                                    <div><p className="text-xs text-gray-400 mb-1">{isAr ? 'تاريخ التسجيل' : 'Registered'}</p><p className="text-gray-700 dark:text-gray-300">{details.created_at}</p></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
