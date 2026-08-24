import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Search, Send, Paperclip, Inbox } from 'lucide-react';

const dummyMessages = [
  { id: 1, sender: 'admin', subject_en: 'Welcome to the platform', subject_ar: 'مرحباً بك في المنصة', date: '2025-01-15', read: false },
  { id: 2, sender: 'system', subject_en: 'Your account has been approved', subject_ar: 'تم اعتماد حسابك', date: '2025-01-14', read: true },
  { id: 3, sender: 'support', subject_en: 'New research grant available', subject_ar: 'منحة بحثية جديدة متاحة', date: '2025-01-10', read: true },
];

const MessagesPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const filtered = dummyMessages.filter(m =>
    (isRTL ? m.subject_ar : m.subject_en).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1628]">{t('messages.title')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('messages.desc')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        <div className="bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-50">
            <div className="relative">
              <Search className="absolute top-1/2 -translate-y-1/2 start-3 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('messages.search')} className="w-full bg-[#f4f6fb] border border-gray-100 rounded-xl ps-10 pe-4 py-2.5 text-sm outline-none focus:border-[#c8a44e] transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Inbox className="w-10 h-10 mb-3 opacity-40" />
                <p className="text-sm">{t('messages.empty')}</p>
              </div>
            ) : (
              filtered.map(msg => (
                <button key={msg.id} onClick={() => setSelectedId(msg.id)} className={`w-full text-start p-4 border-b border-gray-50 hover:bg-[#f4f6fb] transition-colors ${selectedId === msg.id ? 'bg-[#c8a44e]/5 border-s-4 border-s-[#c8a44e]' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-semibold ${msg.read ? 'text-gray-600' : 'text-[#0a1628]'}`}>{isRTL ? msg.subject_ar : msg.subject_en}</p>
                    {!msg.read && <span className="w-2.5 h-2.5 bg-[#c8a44e] rounded-full flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{msg.date}</p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 flex flex-col overflow-hidden">
          {selectedId ? (
            <>
              <div className="p-5 border-b border-gray-50">
                <h3 className="font-bold text-[#0a1628]">{isRTL ? dummyMessages.find(m => m.id === selectedId)?.subject_ar : dummyMessages.find(m => m.id === selectedId)?.subject_en}</h3>
                <p className="text-xs text-gray-400 mt-1">{dummyMessages.find(m => m.id === selectedId)?.date}</p>
              </div>
              <div className="flex-1 p-5 text-sm text-gray-600 leading-relaxed">{t('messages.content_placeholder')}</div>
              <div className="p-4 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <input type="text" placeholder={t('messages.reply_placeholder')} className="flex-1 bg-[#f4f6fb] border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#c8a44e] transition-colors" />
                  <button className="w-11 h-11 bg-[#f4f6fb] rounded-xl flex items-center justify-center text-gray-400 hover:text-[#c8a44e] transition-colors"><Paperclip className="w-5 h-5" /></button>
                  <button className="w-11 h-11 bg-gradient-to-br from-[#c8a44e] to-[#e6c96e] rounded-xl flex items-center justify-center text-[#0a1628] hover:shadow-lg hover:shadow-[#c8a44e]/25 transition-all"><Send className="w-5 h-5" /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
              <p className="font-medium">{t('messages.select')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;