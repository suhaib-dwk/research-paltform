import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Handshake, Plus, Loader2, X, Check, ArrowUpRight, ArrowDownLeft,
  Clock, CheckCircle2, XCircle, Search,
} from 'lucide-react';
import { useSite } from '../../../SiteContext';
import { API_BASE_URL } from '../../../api';

const roleLabel = (role, isAr) => ({
  researcher: isAr ? 'باحث' : 'Researcher',
  faculty: isAr ? 'هيئة تدريسية' : 'Faculty',
  university: isAr ? 'جامعة' : 'University',
  research_center: isAr ? 'مركز بحثي' : 'Research Center',
}[role] || role);

const statusStyle = {
  pending: { bg: 'bg-orange-50 dark:bg-orange-900/15', text: 'text-orange-600 dark:text-orange-400', icon: Clock },
  accepted: { bg: 'bg-emerald-50 dark:bg-emerald-900/15', text: 'text-emerald-500 dark:text-emerald-400', icon: CheckCircle2 },
  rejected: { bg: 'bg-red-50 dark:bg-red-900/15', text: 'text-red-500 dark:text-red-400', icon: XCircle },
};

const statusLabel = (status, isAr) => ({
  pending: isAr ? 'قيد الانتظار' : 'Pending',
  accepted: isAr ? 'مقبول' : 'Accepted',
  rejected: isAr ? 'مرفوض' : 'Rejected',
}[status] || status);

const CollaborationsPage = () => {
  const { user, currentLang } = useSite();
  const isAr = currentLang === 'ar';
  const userId = user?.user_id ?? user?.id;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCollaborations = () => {
    if (!userId) return;
    setLoading(true);
    fetch(`${API_BASE_URL}/get_collaborations.php?user_id=${userId}`)
      .then((r) => r.json())
      .then((r) => { if (r.status === 'success') setItems(r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(fetchCollaborations, [userId]);

  const openModal = () => {
    setShowModal(true);
    setFormError('');
    setSelectedPartner(null);
    setSubject('');
    setMessage('');
    setSearch('');
    if (partners.length === 0 && userId) {
      setPartnersLoading(true);
      fetch(`${API_BASE_URL}/get_collaboration_partners.php?exclude_user_id=${userId}`)
        .then((r) => r.json())
        .then((r) => { if (r.status === 'success') setPartners(r.data); })
        .catch(() => {})
        .finally(() => setPartnersLoading(false));
    }
  };

  const filteredPartners = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return partners;
    return partners.filter((p) => p.name.toLowerCase().includes(q));
  }, [partners, search]);

  const handleSubmit = async () => {
    setFormError('');
    if (!selectedPartner) {
      setFormError(isAr ? 'اختر الجهة التي تريد التعاون معها' : 'Choose who to collaborate with');
      return;
    }
    if (!subject.trim()) {
      setFormError(isAr ? 'اكتب موضوع التعاون' : 'Write a collaboration subject');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('requester_id', userId);
      formData.append('recipient_id', selectedPartner.user_id);
      formData.append('subject', subject.trim());
      formData.append('message', message.trim());
      const res = await fetch(`${API_BASE_URL}/create_collaboration_request.php`, { method: 'POST', body: formData });
      const result = await res.json();
      if (result.status === 'success') {
        setShowModal(false);
        fetchCollaborations();
      } else {
        setFormError(isAr ? 'تعذر إرسال الطلب، حاول مجدداً' : 'Could not send the request, try again');
      }
    } catch {
      setFormError(isAr ? 'تعذر إرسال الطلب، حاول مجدداً' : 'Could not send the request, try again');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespond = async (collabId, status) => {
    setRespondingId(collabId);
    try {
      const formData = new FormData();
      formData.append('collaboration_id', collabId);
      formData.append('user_id', userId);
      formData.append('status', status);
      const res = await fetch(`${API_BASE_URL}/update_collaboration_status.php`, { method: 'POST', body: formData });
      const result = await res.json();
      if (result.status === 'success') {
        setItems((prev) => prev.map((it) => (it.id === collabId ? { ...it, status } : it)));
      }
    } catch {
      // تجاهل بصمت — الحالة تبقى كما هي والمستخدم يقدر يعيد المحاولة
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isAr ? 'التعاونات' : 'Collaborations'}</h1>
          <p className="text-sm text-gray-400 mt-1">{isAr ? 'طلبات التعاون البحثي' : 'Research collaboration requests'}</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center gap-2 bg-gradient-to-l from-brand-orange to-brand-orange-light text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-brand-orange/25 transition-all"
        >
          <Plus className="w-4 h-4" /> {isAr ? 'طلب تعاون' : 'Request Collaboration'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-100 dark:border-brand-dark-border/50 p-12 text-center">
          <Handshake className="w-12 h-12 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-medium text-sm">{isAr ? 'لا توجد تعاونات حالياً' : 'No collaborations yet'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const style = statusStyle[item.status] || statusStyle.pending;
            const StatusIcon = style.icon;
            const DirectionIcon = item.is_outgoing ? ArrowUpRight : ArrowDownLeft;
            return (
              <div key={item.id} className="bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-100 dark:border-brand-dark-border/50 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-xl ${style.bg} ${style.text} flex items-center justify-center flex-shrink-0`}>
                    <DirectionIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.subject}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.is_outgoing
                        ? (isAr ? 'إلى: ' : 'To: ')
                        : (isAr ? 'من: ' : 'From: ')}
                      <span className="font-medium text-gray-600 dark:text-gray-300">{item.other_party.name}</span>
                      {' · '}{roleLabel(item.other_party.role, isAr)}
                    </p>
                    {item.message && (
                      <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.message}</p>
                    )}
                  </div>
                  <span className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full ${style.bg} ${style.text} flex items-center gap-1.5`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusLabel(item.status, isAr)}
                  </span>
                </div>

                {/* أزرار القبول/الرفض تظهر فقط للمستلم على طلب لا يزال قيد الانتظار */}
                {!item.is_outgoing && item.status === 'pending' && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-brand-dark-border/50">
                    <button
                      onClick={() => handleRespond(item.id, 'accepted')}
                      disabled={respondingId === item.id}
                      className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-lg font-bold text-xs hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors disabled:opacity-50"
                    >
                      {respondingId === item.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      {isAr ? 'قبول' : 'Accept'}
                    </button>
                    <button
                      onClick={() => handleRespond(item.id, 'rejected')}
                      disabled={respondingId === item.id}
                      className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/15 text-red-500 dark:text-red-400 px-4 py-2 rounded-lg font-bold text-xs hover:bg-red-100 dark:hover:bg-red-900/25 transition-colors disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      {isAr ? 'رفض' : 'Reject'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* نافذة إنشاء طلب تعاون جديد */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-brand-dark-card rounded-2xl border border-gray-100 dark:border-brand-dark-border/60 shadow-xl max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-brand-dark-border/50 flex-shrink-0">
                <h2 className="font-black text-gray-900 dark:text-white">{isAr ? 'طلب تعاون جديد' : 'New Collaboration Request'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-brand-dark-hover rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
                    {isAr ? 'الجهة المطلوب التعاون معها' : 'Collaborate with'}
                  </label>
                  {selectedPartner ? (
                    <div className="flex items-center justify-between bg-brand-orange/10 border border-brand-orange/30 rounded-xl px-4 py-2.5">
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedPartner.name}</p>
                        <p className="text-xs text-gray-400">{roleLabel(selectedPartner.role, isAr)}</p>
                      </div>
                      <button onClick={() => setSelectedPartner(null)} className="text-xs font-bold text-brand-orange hover:underline">
                        {isAr ? 'تغيير' : 'Change'}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-2">
                        <Search className="w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2 start-3" />
                        <input
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder={isAr ? 'ابحث بالاسم...' : 'Search by name...'}
                          className="w-full ps-9 pe-3 py-2.5 text-sm bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-dark-border rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                        />
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1 rounded-xl">
                        {partnersLoading ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-5 h-5 text-brand-orange animate-spin" />
                          </div>
                        ) : filteredPartners.length === 0 ? (
                          <p className="text-xs text-gray-400 text-center py-6">{isAr ? 'لا توجد نتائج' : 'No results'}</p>
                        ) : (
                          filteredPartners.map((p) => (
                            <button
                              key={p.user_id}
                              onClick={() => setSelectedPartner(p)}
                              className="w-full flex items-center justify-between text-start px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-brand-dark-hover transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{p.name}</span>
                              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-brand-dark-hover px-2 py-1 rounded-full">{roleLabel(p.role, isAr)}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">{isAr ? 'موضوع التعاون' : 'Subject'}</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={isAr ? 'مثال: تعاون بحثي حول الذكاء الاصطناعي' : 'e.g. AI research collaboration'}
                    maxLength={300}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-dark-border rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">{isAr ? 'رسالة (اختياري)' : 'Message (optional)'}</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    maxLength={2000}
                    placeholder={isAr ? 'اشرح باختصار ما تريد التعاون فيه...' : 'Briefly describe what you want to collaborate on...'}
                    className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-brand-dark border border-gray-200 dark:border-brand-dark-border rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/40 resize-none"
                  />
                </div>

                {formError && <p className="text-xs font-medium text-red-500">{formError}</p>}
              </div>

              <div className="p-5 border-t border-gray-100 dark:border-brand-dark-border/50 flex-shrink-0">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-brand-orange to-brand-orange-light text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-brand-orange/25 transition-all disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {isAr ? 'إرسال الطلب' : 'Send Request'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollaborationsPage;
