import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Search, Send, Paperclip, Inbox, Loader2, XCircle } from 'lucide-react';
import { useSite } from '../../SiteContext';
import { API_BASE_URL, resolveUploadUrl } from '../../api';

const MessagesPage = () => {
    const { user, currentLang } = useSite();
    const isAr = currentLang === 'ar';
    const entityId = user?.user_id ?? user?.id;

    const [search, setSearch] = useState('');
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

    const filtered = threads.filter(m =>
        (isAr ? m.subject_ar : m.subject_en).toLowerCase().includes(search.toLowerCase())
    );
    const selectedThread = threads.find(m => m.id === selectedId);

    const handleSelect = (threadId) => {
        setSelectedId(threadId);
        setLoadingMessages(true);
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

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{isAr ? 'الرسائل' : 'Messages'}</h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{isAr ? 'رسائلك وإشعاراتك' : 'Your messages and notifications'}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
                <div className="bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-50 dark:border-[#3a322c]/50">
                        <div className="relative">
                            <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={isAr ? 'بحث في الرسائل...' : 'Search messages...'} className="w-full bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl ps-10 pe-4 py-2.5 text-sm outline-none focus:border-brand-orange transition-colors text-gray-900 dark:text-white" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loadingThreads ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <Inbox className="w-10 h-10 mb-3 opacity-40" />
                                <p className="text-sm">{isAr ? 'لا توجد رسائل' : 'No messages'}</p>
                            </div>
                        ) : (
                            filtered.map(msg => (
                                <button key={msg.id} onClick={() => handleSelect(msg.id)} className={`w-full text-start p-4 border-b border-gray-50 dark:border-[#3a322c]/30 hover:bg-[#f4f6fb] dark:hover:bg-[#1a1613]/60 transition-colors ${selectedId === msg.id ? 'bg-brand-orange/5 border-s-4 border-s-brand-orange' : ''}`}>
                                    <div className="flex items-start justify-between gap-2">
                                        <p className={`text-sm font-semibold ${msg.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{isAr ? msg.subject_ar : msg.subject_en}</p>
                                        {!msg.read && <span className="w-2.5 h-2.5 bg-brand-orange rounded-full flex-shrink-0 mt-1.5" />}
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{msg.date}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white dark:bg-[#211c18] rounded-2xl border border-gray-100 dark:border-[#3a322c]/50 flex flex-col overflow-hidden">
                    {selectedThread ? (
                        <>
                            <div className="p-5 border-b border-gray-50 dark:border-[#3a322c]/50">
                                <h3 className="font-bold text-gray-900 dark:text-white">{isAr ? selectedThread.subject_ar : selectedThread.subject_en}</h3>
                                <p className="text-xs text-gray-400 mt-1">{selectedThread.date}</p>
                            </div>
                            <div className="flex-1 p-5 overflow-y-auto space-y-3">
                                {loadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="w-6 h-6 text-brand-orange animate-spin" />
                                    </div>
                                ) : (
                                    messages.map(m => (
                                        <div key={m.id} className={`flex ${m.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                                m.sender_type === 'user'
                                                    ? 'bg-brand-orange text-white rounded-tl-sm'
                                                    : 'bg-gray-100 dark:bg-[#2a231e] text-gray-700 dark:text-gray-300 rounded-tr-sm'
                                            }`}>
                                                <p>{m.body}</p>
                                                {m.attachment_path && (
                                                    <a href={resolveUploadUrl(m.attachment_path)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 mt-2 text-xs underline opacity-90">
                                                        <Paperclip className="w-3 h-3" />{m.attachment_name}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-50 dark:border-[#3a322c]/50">
                                {error && (
                                    <div className="flex items-center gap-2 mb-2 text-xs text-red-500">
                                        <XCircle className="w-3.5 h-3.5" />{error}
                                    </div>
                                )}
                                {attachment && (
                                    <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                                        <Paperclip className="w-3.5 h-3.5" />{attachment.name}
                                        <button onClick={() => { setAttachment(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="text-red-500 hover:underline">{isAr ? 'إزالة' : 'Remove'}</button>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                                        placeholder={isAr ? 'اكتب ردك...' : 'Type your reply...'}
                                        className="flex-1 bg-[#f4f6fb] dark:bg-[#1a1613] border border-gray-100 dark:border-[#3a322c] rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-orange transition-colors text-gray-900 dark:text-white"
                                    />
                                    <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                                    <button onClick={() => fileInputRef.current?.click()} className="w-11 h-11 bg-[#f4f6fb] dark:bg-[#1a1613] rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-orange transition-colors flex-shrink-0">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <button onClick={handleSend} disabled={sending} className="w-11 h-11 bg-gradient-to-br from-brand-orange to-[#f0916d] rounded-xl flex items-center justify-center text-white hover:shadow-lg hover:shadow-brand-orange/25 transition-all disabled:opacity-60 flex-shrink-0">
                                        {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                            <p className="font-medium">{isAr ? 'اختر رسالة لعرضها' : 'Select a message to view'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
