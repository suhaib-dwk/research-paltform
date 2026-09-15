import { useState, useEffect, useRef, useMemo } from 'react';
import { MessageSquare, Search, Send, Paperclip, Inbox, Loader2, XCircle, ArrowLeft, ArrowRight, Mail, MailOpen, X, Headset, Bell, CheckCheck } from 'lucide-react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL, resolveUploadUrl } from '../../api';

// =========================================================
// الرسائل — صندوق وارد بأسلوب الأنظمة العالمية (Gmail / Intercom):
//   • قائمة محادثات: بحث، فلتر (الكل / غير المقروءة)، صف لكل محادثة فيه
//     صورة رمزية للمرسل، الموضوع، معاينة آخر رسالة، التاريخ، ونقطة غير مقروء.
//   • لوحة المحادثة: رأس بالمرسل والموضوع، رسائل بفواصل تاريخ وطوابع وقت،
//     الوارد جهة البداية بصورة رمزية والصادر برتقالي جهة النهاية، مرفقات
//     كشرائح، ومؤلِّف أسفل اللوحة (مرفق + نص + إرسال).
//   • على الموبايل تُعرض القائمة أو المحادثة (مع زر رجوع) لا الاثنتان.
// منطق الـ API (get_message_threads / get_thread_messages / reply_message) كما هو.
// =========================================================

const SENDER_META = {
  admin: { ar: 'إدارة المنصة', en: 'Platform admin', icon: Headset, cls: 'bg-brand-orange text-white' },
  system: { ar: 'النظام', en: 'System', icon: Bell, cls: 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' },
  user: { ar: 'أنت', en: 'You', icon: null, cls: 'bg-brand-orange text-white' },
};
const senderMeta = (type) => SENDER_META[type] || SENDER_META.admin;

const formatTime = (iso, isAr) => {
  if (!iso) return '';
  const d = new Date(String(iso).replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
};
const formatDay = (iso, isAr) => {
  if (!iso) return '';
  const d = new Date(String(iso).replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  const today = new Date();
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  if (sameDay(d, today)) return isAr ? 'اليوم' : 'Today';
  if (sameDay(d, yesterday)) return isAr ? 'أمس' : 'Yesterday';
  return d.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

const MessagesPage = () => {
    const { user, currentLang, isRTL } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;
    const BackIcon = isRTL ? ArrowRight : ArrowLeft;

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all | unread
    const [threads, setThreads] = useState([]);
    const [loadingThreads, setLoadingThreads] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const [replyText, setReplyText] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const endRef = useRef(null);

    const fetchThreads = () => {
        if (!entityId) return;
        setLoadingThreads(true);
        fetch(`${API_BASE_URL}/get_message_threads.php?user_id=${entityId}`)
            .then(r => r.json())
            .then(r => { if (r.status === 'success') setThreads(r.data); })
            .catch(() => {})
            .finally(() => setLoadingThreads(false));
    };

    useEffect(fetchThreads, [entityId]);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const unreadCount = threads.filter(t => !t.read).length;

    const filtered = useMemo(() => threads.filter(m => {
        const subject = (isAr ? m.subject_ar : m.subject_en) || '';
        const matches = subject.toLowerCase().includes(search.toLowerCase()) || (m.last_body || '').toLowerCase().includes(search.toLowerCase());
        return matches && (filter === 'all' || !m.read);
    }), [threads, search, filter, isAr]);

    const selectedThread = threads.find(m => m.id === selectedId);

    const handleSelect = (threadId) => {
        setSelectedId(threadId);
        setLoadingMessages(true);
        setError(null);
        fetch(`${API_BASE_URL}/get_thread_messages.php?thread_id=${threadId}&user_id=${entityId}`)
            .then(r => r.json())
            .then(r => {
                if (r.status === 'success') {
                    setMessages(r.data);
                    // ✅ تحديث تفاؤلي فوري لعلامة القراءة بالقائمة دون إعادة جلب كامل
                    setThreads(prev => prev.map(t => t.id === threadId ? { ...t, read: true } : t));
                }
            })
            .catch(() => {})
            .finally(() => setLoadingMessages(false));
    };

    const handleSend = async () => {
        if (!replyText.trim() && !attachment) return;
        setSending(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('thread_id', selectedId);
            formData.append('user_id', entityId || '');
            formData.append('body', replyText.trim());
            if (attachment) formData.append('attachment', attachment);

            const res = await fetch(`${API_BASE_URL}/reply_message.php`, { method: 'POST', body: formData });
            const result = await res.json();

            if (result.status === 'success') {
                setMessages(prev => [...prev, { ...result.data, sender_type: 'user' }]);
                setReplyText('');
                setAttachment(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
            } else {
                setError(isAr ? 'فشل إرسال الرسالة' : 'Failed to send message');
            }
        } catch (err) {
            console.error('Reply message error:', err);
            setError(isAr ? 'تعذّر الاتصال بالخادم' : 'Failed to connect to server');
        } finally {
            setSending(false);
        }
    };

    // ✅ تجميع الرسائل بفواصل تاريخ
    const grouped = useMemo(() => {
        const out = [];
        let lastDay = null;
        messages.forEach((m) => {
            const day = formatDay(m.created_at, isAr);
            if (day && day !== lastDay) { out.push({ type: 'day', key: `day-${m.id}`, label: day }); lastDay = day; }
            out.push({ type: 'msg', key: m.id, m });
        });
        return out;
    }, [messages, isAr]);

    const paneCls = 'bg-white dark:bg-brand-dark-card rounded-[20px] shadow-[0_12px_40px_-18px_rgba(31,26,23,0.22)] dark:shadow-none dark:border dark:border-brand-dark-border/60 flex flex-col overflow-hidden';

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-5rem-2rem)] sm:h-[calc(100vh-5rem-3rem)] lg:h-[calc(100vh-5rem-4rem)] flex flex-col">
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-4 lg:gap-6">

                {/* ─── قائمة المحادثات ─── */}
                <div className={`${paneCls} ${selectedId ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-5 pb-3">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-gray-900 dark:text-white text-xl font-black leading-tight">{isAr ? 'الرسائل' : 'Messages'}</h1>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{isAr ? 'رسائلك وإشعاراتك' : 'Your messages and notifications'}</p>
                            </div>
                            {unreadCount > 0 && (
                                <span className="min-w-[26px] h-[26px] px-2 rounded-full bg-brand-orange text-white text-xs font-black flex items-center justify-center">{unreadCount}</span>
                            )}
                        </div>
                        <div className="relative mb-3">
                            <Search className="absolute top-1/2 -translate-y-1/2 start-3.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={isAr ? 'بحث في الرسائل…' : 'Search messages…'}
                                className="w-full h-11 bg-gray-50 dark:bg-brand-dark rounded-full ps-10 pe-4 text-sm outline-none border border-transparent focus:border-brand-orange/40 focus:bg-white dark:focus:bg-brand-dark-hover transition-colors text-gray-900 dark:text-white placeholder:text-gray-400"
                            />
                        </div>
                        <div className="flex items-center gap-1.5">
                            {[{ key: 'all', ar: 'الكل', en: 'All' }, { key: 'unread', ar: 'غير المقروءة', en: 'Unread' }].map((f) => (
                                <button
                                    key={f.key}
                                    type="button"
                                    onClick={() => setFilter(f.key)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === f.key ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-brand-dark-hover text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brand-dark-border'}`}
                                >
                                    {isAr ? f.ar : f.en}
                                    {f.key === 'unread' && unreadCount > 0 && <span className="ms-1.5 opacity-70">({unreadCount})</span>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto border-t border-gray-100 dark:border-brand-dark-border/50">
                        {loadingThreads ? (
                            <div className="flex items-center justify-center h-full py-16">
                                <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-center px-6">
                                <span className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-brand-dark-hover text-gray-400 flex items-center justify-center mb-3"><Inbox className="w-6 h-6" /></span>
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{filter === 'unread' ? (isAr ? 'لا رسائل غير مقروءة' : 'No unread messages') : (isAr ? 'لا توجد رسائل' : 'No messages')}</p>
                                <p className="text-xs text-gray-400 mt-1">{isAr ? 'ستظهر هنا رسائل إدارة المنصة وإشعارات طلباتك.' : 'Messages from the platform team and request notifications will appear here.'}</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-50 dark:divide-brand-dark-border/40">
                                {filtered.map((msg) => {
                                    const meta = senderMeta(msg.sender);
                                    const Icon = meta.icon || Mail;
                                    const active = selectedId === msg.id;
                                    const subject = isAr ? msg.subject_ar : msg.subject_en;
                                    return (
                                        <li key={msg.id}>
                                            <button
                                                type="button"
                                                onClick={() => handleSelect(msg.id)}
                                                className={`relative w-full text-start px-5 py-3.5 flex items-start gap-3 transition-colors ${active ? 'bg-brand-orange/[0.07]' : 'hover:bg-gray-50 dark:hover:bg-brand-dark-hover/50'}`}
                                            >
                                                {active && <span className="absolute inset-y-0 start-0 w-1 bg-brand-orange" />}
                                                <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${meta.cls}`}>
                                                    <Icon className="w-4 h-4" />
                                                </span>
                                                <span className="flex-1 min-w-0">
                                                    <span className="flex items-center justify-between gap-2">
                                                        <span className={`text-sm truncate ${msg.read ? 'font-semibold text-gray-700 dark:text-gray-300' : 'font-black text-gray-900 dark:text-white'}`}>{subject}</span>
                                                        <span className="text-[11px] text-gray-400 flex-shrink-0" dir="ltr">{msg.date}</span>
                                                    </span>
                                                    <span className="flex items-center justify-between gap-2 mt-0.5">
                                                        <span className={`text-xs truncate ${msg.read ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300 font-medium'}`}>{msg.last_body || (isAr ? meta.ar : meta.en)}</span>
                                                        {!msg.read && <span className="w-2.5 h-2.5 bg-brand-orange rounded-full flex-shrink-0" />}
                                                    </span>
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>

                {/* ─── لوحة المحادثة ─── */}
                <div className={`${paneCls} ${selectedId ? 'flex' : 'hidden lg:flex'}`}>
                    {selectedThread ? (
                        <>
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-brand-dark-border/50">
                                <button type="button" onClick={() => setSelectedId(null)} className="lg:hidden w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-brand-dark-hover flex items-center justify-center text-gray-600 dark:text-gray-300" aria-label="back">
                                    <BackIcon className="w-4 h-4" />
                                </button>
                                {(() => { const meta = senderMeta(selectedThread.sender); const Icon = meta.icon || Mail; return (
                                    <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${meta.cls}`}><Icon className="w-4 h-4" /></span>
                                ); })()}
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-gray-900 dark:text-white text-[15px] font-black truncate">{isAr ? selectedThread.subject_ar : selectedThread.subject_en}</h2>
                                    <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-2">
                                        <span>{isAr ? senderMeta(selectedThread.sender).ar : senderMeta(selectedThread.sender).en}</span>
                                        <span>·</span>
                                        <span dir="ltr">{selectedThread.date}</span>
                                    </p>
                                </div>
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
                                    <CheckCheck className="w-3.5 h-3.5" />{isAr ? 'مقروءة' : 'Read'}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto px-5 py-5 bg-gray-50/60 dark:bg-brand-dark/40">
                                {loadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <MailOpen className="w-10 h-10 mb-3 opacity-40" />
                                        <p className="text-sm">{isAr ? 'لا توجد رسائل في هذه المحادثة' : 'No messages in this conversation'}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {grouped.map((item) => {
                                            if (item.type === 'day') {
                                                return (
                                                    <div key={item.key} className="flex items-center gap-3 py-2">
                                                        <span className="flex-1 h-px bg-gray-200 dark:bg-brand-dark-border" />
                                                        <span className="text-[11px] font-bold text-gray-400 bg-white dark:bg-brand-dark-card px-3 py-1 rounded-full shadow-sm">{item.label}</span>
                                                        <span className="flex-1 h-px bg-gray-200 dark:bg-brand-dark-border" />
                                                    </div>
                                                );
                                            }
                                            const m = item.m;
                                            const mine = m.sender_type === 'user';
                                            const meta = senderMeta(m.sender_type);
                                            const Icon = meta.icon || Mail;
                                            return (
                                                <div key={item.key} className={`flex items-end gap-2.5 ${mine ? 'justify-end' : 'justify-start'}`}>
                                                    {!mine && (
                                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${meta.cls}`}><Icon className="w-3.5 h-3.5" /></span>
                                                    )}
                                                    <div className={`max-w-[78%] flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                                                        <div className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                                                            mine
                                                                ? 'bg-brand-orange text-white rounded-3xl rounded-ee-md'
                                                                : 'bg-white dark:bg-brand-dark-hover text-gray-800 dark:text-gray-200 rounded-3xl rounded-es-md shadow-sm'
                                                        }`}>
                                                            <p>{m.body}</p>
                                                            {m.attachment_path && (
                                                                <a
                                                                    href={resolveUploadUrl(m.attachment_path)}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold ${mine ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-gray-100 dark:bg-brand-dark-border text-gray-700 dark:text-gray-200 hover:bg-gray-200'} transition-colors`}
                                                                >
                                                                    <Paperclip className="w-3 h-3" />{m.attachment_name || (isAr ? 'مرفق' : 'Attachment')}
                                                                </a>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 mt-1 px-1" dir="ltr">{formatTime(m.created_at, isAr)}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={endRef} />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-gray-100 dark:border-brand-dark-border/50">
                                {error && (
                                    <div className="flex items-center gap-2 mb-2 text-xs text-red-500">
                                        <XCircle className="w-3.5 h-3.5" />{error}
                                    </div>
                                )}
                                {attachment && (
                                    <div className="inline-flex items-center gap-2 mb-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-brand-dark-hover text-xs text-gray-600 dark:text-gray-300 font-semibold">
                                        <Paperclip className="w-3.5 h-3.5" />{attachment.name}
                                        <button type="button" onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-gray-400 hover:text-red-500" aria-label="remove"><X className="w-3.5 h-3.5" /></button>
                                    </div>
                                )}
                                <div className="flex items-end gap-2 rounded-3xl bg-gray-50 dark:bg-brand-dark p-1.5 ps-2 focus-within:ring-2 focus-within:ring-brand-orange/30 transition-shadow">
                                    <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                                    <button type="button" onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-brand-orange hover:bg-white dark:hover:bg-brand-dark-hover transition-colors flex-shrink-0" aria-label={isAr ? 'إرفاق ملف' : 'Attach file'}>
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                        rows={1}
                                        placeholder={isAr ? 'اكتب ردك… (Enter للإرسال)' : 'Type your reply… (Enter to send)'}
                                        className="flex-1 bg-transparent px-2 py-2.5 text-sm outline-none text-gray-900 dark:text-white placeholder:text-gray-400 resize-none max-h-32"
                                    />
                                    <button type="button" onClick={handleSend} disabled={sending || (!replyText.trim() && !attachment)} className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-brand-orange-dark disabled:bg-gray-200 dark:disabled:bg-brand-dark-border disabled:text-gray-400 transition-colors flex-shrink-0" aria-label={isAr ? 'إرسال' : 'Send'}>
                                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className={`w-4 h-4 ${isRTL ? '-scale-x-100' : ''}`} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
                            <span className="w-20 h-20 rounded-3xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-5">
                                <MessageSquare className="w-9 h-9" />
                            </span>
                            <h2 className="text-gray-900 dark:text-white text-lg font-black mb-1.5">{isAr ? 'اختر محادثة لعرضها' : 'Select a conversation'}</h2>
                            <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm">{isAr ? 'كل الرسائل بينك وبين إدارة المنصة وإشعارات طلباتك تظهر هنا في مكان واحد.' : 'All messages between you and the platform team, plus request notifications, live here in one place.'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
