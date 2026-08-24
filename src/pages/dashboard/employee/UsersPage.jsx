import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Search, Eye, Ban, CheckCircle, UserCheck, UserX } from 'lucide-react';

const dummyUsers = [
  { id: 1, name_en: 'Ahmed Ali', name_ar: 'أحمد علي', email: 'ahmed@uni.edu', role: 'faculty', status: 'active' },
  { id: 2, name_en: 'Sara Hassan', name_ar: 'سارة حسن', email: 'sara@uni.edu', role: 'grad', status: 'pending' },
  { id: 3, name_en: 'Mohammed Omar', name_ar: 'محمد عمر', email: 'mohammed@uni.edu', role: 'researcher', status: 'active' },
  { id: 4, name_en: 'Fatima Khalid', name_ar: 'فاطمة خالد', email: 'fatima@uni.edu', role: 'undergrad', status: 'rejected' },
];

const roleColors = {
  faculty: 'bg-purple-50 text-purple-600', grad: 'bg-blue-50 text-blue-600',
  researcher: 'bg-[#c8a44e]/10 text-[#c8a44e]', undergrad: 'bg-emerald-50 text-emerald-600', reviewer: 'bg-orange-50 text-orange-600',
};
const statusIcons = {
  active: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  pending: <UserCheck className="w-4 h-4 text-[#c8a44e]" />,
  rejected: <UserX className="w-4 h-4 text-red-400" />,
};

const UsersPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filtered = dummyUsers.filter(u => {
    const matchSearch = (isRTL ? u.name_ar : u.name_en).toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628]">{t('employee.users.title')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('employee.users.desc')}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('employee.users.search_placeholder')} className="w-full bg-[#f4f6fb] border border-gray-100 rounded-xl ps-10 pe-4 py-2.5 text-sm outline-none focus:border-[#c8a44e] transition-colors" />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="bg-[#f4f6fb] border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#c8a44e]">
            <option value="all">{t('employee.users.all_roles')}</option>
            <option value="faculty">{t('roles.faculty')}</option>
            <option value="grad">{t('roles.grad')}</option>
            <option value="researcher">{t('roles.researcher')}</option>
            <option value="undergrad">{t('roles.undergrad')}</option>
            <option value="reviewer">{t('roles.reviewer')}</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{t('employee.users.name')}</th>
                <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{t('employee.users.email')}</th>
                <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{t('employee.users.role')}</th>
                <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{t('employee.users.status')}</th>
                <th className="text-start text-xs font-bold text-gray-400 uppercase tracking-wider px-5 py-3">{t('employee.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">{t('employee.no_data')}</td></tr>
              ) : filtered.map(user => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-[#f4f6fb] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#0a1628]/10 text-[#0a1628] flex items-center justify-center text-xs font-bold">{(isRTL ? user.name_ar : user.name_en).charAt(0)}</div>
                      <span className="text-sm font-semibold text-[#0a1628]">{isRTL ? user.name_ar : user.name_en}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500" dir="ltr">{user.email}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-bold px-3 py-1 rounded-full ${roleColors[user.role] || 'bg-gray-100 text-gray-500'}`}>{t(`roles.${user.role}`)}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">{statusIcons[user.status]}<span className="text-xs font-medium text-gray-500">{t(`employee.users.status_${user.status}`)}</span></div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"><Eye className="w-4 h-4" /></button>
                      {user.status === 'pending' && (
                        <>
                          <button className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition-colors"><CheckCircle className="w-4 h-4" /></button>
                          <button className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"><Ban className="w-4 h-4" /></button>
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
    </div>
  );
};

export default UsersPage;