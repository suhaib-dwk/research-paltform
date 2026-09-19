import {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Inbox,
  Loader2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Mail,
  MailOpen,
  X,
  Headset,
  Bell,
  CheckCheck,
} from "lucide-react";

import { useSite } from "../SiteContext";
import {
  API_BASE_URL,
  resolveUploadUrl,
} from "../api";

// =========================================================
// Sender Metadata
// =========================================================

const SENDER_META = {
  admin: {
    ar: "إدارة المنصة",
    en: "Platform admin",
    icon: Headset,
    cls: "bg-orange-600 text-white",
  },

  system: {
    ar: "النظام",
    en: "System",
    icon: Bell,
    cls: "bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900",
  },

  user: {
    ar: "أنت",
    en: "You",
    icon: null,
    cls: "bg-orange-600 text-white",
  },
};

const senderMeta = (type) =>
  SENDER_META[type] || SENDER_META.admin;

// =========================================================
// Format Time
// =========================================================

const formatTime = (iso, isAr) => {
  if (!iso) return "";

  const d = new Date(
    String(iso).replace(" ", "T")
  );

  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleTimeString(
    isAr ? "ar-EG" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

// =========================================================
// Format Day
// =========================================================

const formatDay = (iso, isAr) => {
  if (!iso) return "";

  const d = new Date(
    String(iso).replace(" ", "T")
  );

  if (Number.isNaN(d.getTime())) {
    return String(iso).slice(0, 10);
  }

  const today = new Date();

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const yesterday = new Date(today);

  yesterday.setDate(
    today.getDate() - 1
  );

  if (sameDay(d, today)) {
    return isAr ? "اليوم" : "Today";
  }

  if (sameDay(d, yesterday)) {
    return isAr ? "أمس" : "Yesterday";
  }

  return d.toLocaleDateString(
    isAr ? "ar-EG" : "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
};

// =========================================================
// Messages Page
// =========================================================

const MessagesPage = () => {
  const {
    user,
    currentLang,
    isRTL,
  } = useSite();

  const isAr = currentLang === "ar";

  const entityId =
    user?.user_id ?? user?.id;

  const BackIcon = isRTL
    ? ArrowRight
    : ArrowLeft;

  // =======================================================
  // State
  // =======================================================

  const [search, setSearch] = useState("");

  const [filter, setFilter] =
    useState("all");

  const [threads, setThreads] =
    useState([]);

  const [loadingThreads, setLoadingThreads] =
    useState(true);

  const [selectedId, setSelectedId] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [replyText, setReplyText] =
    useState("");

  const [attachment, setAttachment] =
    useState(null);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState(null);

  const fileInputRef =
    useRef(null);

  const endRef =
    useRef(null);

  // =======================================================
  // Fetch Threads
  // =======================================================

  const fetchThreads = () => {
    if (!entityId) {
      setLoadingThreads(false);
      return;
    }

    setLoadingThreads(true);

    fetch(
      `${API_BASE_URL}/get_message_threads.php?user_id=${entityId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        return response.json();
      })
      .then((result) => {
        if (result.status === "success") {
          setThreads(
            Array.isArray(result.data)
              ? result.data
              : []
          );
        }
      })
      .catch((err) => {
        console.error(
          "Fetch message threads error:",
          err
        );

        setThreads([]);
      })
      .finally(() => {
        setLoadingThreads(false);
      });
  };

  // =======================================================
  // Load Threads
  // =======================================================

  useEffect(() => {
    fetchThreads();
  }, [entityId]);

  // =======================================================
  // Scroll To Bottom
  // =======================================================

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // =======================================================
  // Unread Count
  // =======================================================

  const unreadCount = threads.filter(
    (thread) => !thread.read
  ).length;

  // =======================================================
  // Filtered Threads
  // =======================================================

  const filtered = useMemo(() => {
    const q = search
      .trim()
      .toLowerCase();

    return threads.filter((message) => {
      const subject =
        (
          isAr
            ? message.subject_ar
            : message.subject_en
        ) || "";

      const body =
        message.last_body || "";

      const matchesSearch =
        !q ||
        subject
          .toLowerCase()
          .includes(q) ||
        body
          .toLowerCase()
          .includes(q);

      const matchesFilter =
        filter === "all" ||
        !message.read;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    threads,
    search,
    filter,
    isAr,
  ]);

  // =======================================================
  // Selected Thread
  // =======================================================

  const selectedThread =
    threads.find(
      (thread) =>
        thread.id === selectedId
    );

  // =======================================================
  // Selected Sender Metadata
  // IMPORTANT:
  // تم إصلاح مشكلة JSX الموجودة في الكود الأصلي
  // =======================================================

  const selectedMeta = selectedThread
    ? senderMeta(selectedThread.sender)
    : null;

  const SelectedIcon =
    selectedMeta?.icon || Mail;

  // =======================================================
  // Select Thread
  // =======================================================

  const handleSelect = (threadId) => {
    setSelectedId(threadId);

    setLoadingMessages(true);

    setError(null);

    fetch(
      `${API_BASE_URL}/get_thread_messages.php?thread_id=${threadId}&user_id=${entityId}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        return response.json();
      })
      .then((result) => {
        if (result.status === "success") {
          setMessages(
            Array.isArray(result.data)
              ? result.data
              : []
          );

          // Optimistic read
          setThreads((previous) =>
            previous.map((thread) =>
              thread.id === threadId
                ? {
                    ...thread,
                    read: true,
                  }
                : thread
            )
          );
        } else {
          setError(
            isAr
              ? "تعذر تحميل الرسائل"
              : "Failed to load messages"
          );
        }
      })
      .catch((err) => {
        console.error(
          "Fetch thread messages error:",
          err
        );

        setError(
          isAr
            ? "تعذر الاتصال بالخادم"
            : "Failed to connect to server"
        );
      })
      .finally(() => {
        setLoadingMessages(false);
      });
  };

  // =======================================================
  // Send Message
  // =======================================================

  const handleSend = async () => {
    if (
      !replyText.trim() &&
      !attachment
    ) {
      return;
    }

    if (!selectedId) {
      return;
    }

    setSending(true);

    setError(null);

    try {
      const formData =
        new FormData();

      formData.append(
        "thread_id",
        String(selectedId)
      );

      formData.append(
        "user_id",
        String(entityId || "")
      );

      formData.append(
        "body",
        replyText.trim()
      );

      if (attachment) {
        formData.append(
          "attachment",
          attachment
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}/reply_message.php`,
          {
            method: "POST",
            body: formData,
          }
        );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const result =
        await response.json();

      if (result.status === "success") {
        setMessages((previous) => [
          ...previous,
          {
            ...result.data,
            sender_type: "user",
          },
        ]);

        setReplyText("");

        setAttachment(null);

        if (fileInputRef.current) {
          fileInputRef.current.value =
            "";
        }

        // تحديث وقت آخر رسالة في القائمة
        setThreads((previous) =>
          previous.map((thread) =>
            thread.id === selectedId
              ? {
                  ...thread,
                  last_body:
                    result.data?.body ||
                    replyText.trim(),
                  read: true,
                }
              : thread
          )
        );
      } else {
        setError(
          isAr
            ? "فشل إرسال الرسالة"
            : "Failed to send message"
        );
      }
    } catch (err) {
      console.error(
        "Reply message error:",
        err
      );

      setError(
        isAr
          ? "تعذّر الاتصال بالخادم"
          : "Failed to connect to server"
      );
    } finally {
      setSending(false);
    }
  };

  // =======================================================
  // Group Messages By Day
  // =======================================================

  const grouped = useMemo(() => {
    const output = [];

    let lastDay = null;

    messages.forEach((message) => {
      const day = formatDay(
        message.created_at,
        isAr
      );

      if (
        day &&
        day !== lastDay
      ) {
        output.push({
          type: "day",
          key: `day-${message.id}`,
          label: day,
        });

        lastDay = day;
      }

      output.push({
        type: "msg",
        key: message.id,
        m: message,
      });
    });

    return output;
  }, [messages, isAr]);

  // =======================================================
  // Main Pane Style
  // =======================================================

  const paneCls = `
    bg-white
    dark:bg-gray-800

    rounded-[20px]

    shadow-[0_12px_40px_-18px_rgba(31,26,23,0.22)]

    dark:shadow-none

    dark:border
    dark:border-gray-700/60

    flex
    flex-col

    overflow-hidden
  `;

  // =======================================================
  // Render
  // =======================================================

 
  return (
    <div className="w-full h-full min-h-0 flex flex-col overflow-hidden">
      <div
        className="
          flex-1
          min-h-0
          min-w-0

          grid
          grid-cols-1
          lg:grid-cols-[360px_minmax(0,1fr)]

          gap-4
          lg:gap-6

          overflow-hidden
        "
      >
        {/* ===================================================
            THREAD LIST
            =================================================== */}

        <div
          className={`
            ${paneCls}

            min-h-0
            min-w-0

            ${
              selectedId
                ? "hidden lg:flex"
                : "flex"
            }
          `}
        >
          {/* Header */}

          <div className="p-5 pb-3 flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-gray-900 dark:text-white text-xl font-black leading-tight">
                  {isAr ? "الرسائل" : "Messages"}
                </h1>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {isAr
                    ? "رسائلك وإشعاراتك"
                    : "Your messages and notifications"}
                </p>
              </div>

              {unreadCount > 0 && (
                <span
                  className="
                    min-w-[26px]
                    h-[26px]
                    px-2
                    rounded-full
                    bg-orange-600
                    text-white
                    text-xs
                    font-black
                    flex
                    items-center
                    justify-center
                  "
                >
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Search */}

            <div className="relative mb-3">
              <Search
                className="
                  absolute
                  top-1/2
                  -translate-y-1/2
                  start-3.5
                  w-4
                  h-4
                  text-gray-400
                  pointer-events-none
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder={
                  isAr
                    ? "بحث في الرسائل…"
                    : "Search messages…"
                }
                className="
                  w-full
                  h-11

                  bg-gray-100
                  dark:bg-gray-900

                  ps-10
                  pe-4

                  text-sm
                  outline-none

                  border
                  border-gray-200
                  dark:border-gray-700

                  focus:border-orange-500

                  focus:bg-white
                  dark:focus:bg-gray-800

                  transition-all

                  text-gray-900
                  dark:text-white

                  placeholder:text-gray-400

                  rounded-full
                "
              />
            </div>

            {/* Filters */}

            <div className="flex items-center gap-1.5">
              {[
                {
                  key: "all",
                  ar: "الكل",
                  en: "All",
                },
                {
                  key: "unread",
                  ar: "غير المقروءة",
                  en: "Unread",
                },
              ].map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() =>
                    setFilter(f.key)
                  }
                  className={`
                    px-3.5
                    py-1.5
                    rounded-full
                    text-xs
                    font-bold
                    transition-all

                    ${
                      filter === f.key
                        ? "bg-orange-600 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400"
                    }
                  `}
                >
                  {isAr ? f.ar : f.en}

                  {f.key === "unread" &&
                    unreadCount > 0 && (
                      <span className="ms-1.5 opacity-70">
                        ({unreadCount})
                      </span>
                    )}
                </button>
              ))}
            </div>
          </div>

          {/* Thread List */}

          <div
            className="
              flex-1
              min-h-0

              overflow-y-auto
              overflow-x-hidden

              border-t
              border-gray-200
              dark:border-gray-700/60
            "
          >
            {loadingThreads ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 text-orange-600 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-center

                  h-full
                  py-16

                  text-center
                  px-6
                "
              >
                <span
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-orange-50
                    dark:bg-orange-500/10
                    text-orange-500
                    flex
                    items-center
                    justify-center
                    mb-3
                  "
                >
                  <Inbox className="w-6 h-6" />
                </span>

                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  {filter === "unread"
                    ? isAr
                      ? "لا رسائل غير مقروءة"
                      : "No unread messages"
                    : isAr
                      ? "لا توجد رسائل"
                      : "No messages"}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {isAr
                    ? "ستظهر هنا رسائل إدارة المنصة وإشعارات طلباتك."
                    : "Messages from the platform team and request notifications will appear here."}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-gray-700/40">
                {filtered.map((msg) => {
                  const meta = senderMeta(msg.sender);
                  const Icon = meta.icon || Mail;
                  const active = selectedId === msg.id;

                  const subject =
                    isAr
                      ? msg.subject_ar
                      : msg.subject_en;

                  return (
                    <li key={msg.id}>
                      <button
                        type="button"
                        onClick={() =>
                          handleSelect(msg.id)
                        }
                        className={`
                          relative
                          w-full
                          text-start

                          px-5
                          py-3.5

                          flex
                          items-start
                          gap-3

                          transition-all

                          ${
                            active
                              ? "bg-orange-50 dark:bg-orange-500/10"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          }
                        `}
                      >
                        {active && (
                          <span
                            className="
                              absolute
                              inset-y-0
                              start-0
                              w-1
                              bg-orange-600
                            "
                          />
                        )}

                        <span
                          className={`
                            w-10
                            h-10
                            rounded-full

                            flex
                            items-center
                            justify-center

                            flex-shrink-0

                            ${meta.cls}
                          `}
                        >
                          <Icon className="w-4 h-4" />
                        </span>

                        <span className="flex-1 min-w-0">
                          <span className="flex items-center justify-between gap-2">
                            <span
                              className={`
                                text-sm
                                truncate

                                ${
                                  msg.read
                                    ? "font-semibold text-gray-700 dark:text-gray-300"
                                    : "font-black text-gray-900 dark:text-white"
                                }
                              `}
                            >
                              {subject}
                            </span>

                            <span
                              className="
                                text-[11px]
                                text-gray-400
                                flex-shrink-0
                              "
                              dir="ltr"
                            >
                              {msg.date}
                            </span>
                          </span>

                          <span className="flex items-center justify-between gap-2 mt-0.5">
                            <span
                              className={`
                                text-xs
                                truncate

                                ${
                                  msg.read
                                    ? "text-gray-400 dark:text-gray-500"
                                    : "text-gray-600 dark:text-gray-300 font-medium"
                                }
                              `}
                            >
                              {msg.last_body ||
                                (isAr
                                  ? meta.ar
                                  : meta.en)}
                            </span>

                            {!msg.read && (
                              <span
                                className="
                                  w-2.5
                                  h-2.5
                                  bg-orange-600
                                  rounded-full
                                  flex-shrink-0
                                "
                              />
                            )}
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

        {/* ===================================================
            CHAT PANEL
            =================================================== */}

        <div
          className={`
            ${paneCls}

            min-h-0
            min-w-0

            ${
              selectedId
                ? "flex"
                : "hidden lg:flex"
            }
          `}
        >
          {selectedThread ? (
            <>
              {/* CHAT HEADER */}

              <div
                className="
                  flex
                  items-center
                  gap-3

                  px-5
                  py-4

                  flex-shrink-0

                  border-b
                  border-gray-200
                  dark:border-gray-700/60
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setSelectedId(null)
                  }
                  className="
                    lg:hidden

                    w-9
                    h-9

                    rounded-full

                    hover:bg-orange-50
                    dark:hover:bg-orange-500/10

                    flex
                    items-center
                    justify-center

                    text-gray-600
                    dark:text-gray-300

                    hover:text-orange-600
                  "
                  aria-label="back"
                >
                  <BackIcon className="w-4 h-4" />
                </button>

                <span
                  className={`
                    w-10
                    h-10

                    rounded-full

                    flex
                    items-center
                    justify-center

                    flex-shrink-0

                    ${selectedMeta?.cls}
                  `}
                >
                  <SelectedIcon className="w-4 h-4" />
                </span>

                <div className="flex-1 min-w-0">
                  <h2
                    className="
                      text-gray-900
                      dark:text-white

                      text-[15px]
                      font-black
                      truncate
                    "
                  >
                    {isAr
                      ? selectedThread.subject_ar
                      : selectedThread.subject_en}
                  </h2>

                  <p
                    className="
                      text-[11px]
                      text-gray-400
                      dark:text-gray-500

                      flex
                      items-center
                      gap-2
                    "
                  >
                    <span>
                      {isAr
                        ? selectedMeta.ar
                        : selectedMeta.en}
                    </span>

                    <span>·</span>

                    <span dir="ltr">
                      {selectedThread.date}
                    </span>
                  </p>
                </div>

                <span
                  className="
                    hidden
                    sm:inline-flex

                    items-center
                    gap-1.5

                    px-3
                    py-1.5

                    rounded-full

                    bg-emerald-50
                    dark:bg-emerald-500/15

                    text-emerald-700
                    dark:text-emerald-400

                    text-[11px]
                    font-bold
                  "
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  {isAr ? "مقروءة" : "Read"}
                </span>
              </div>

              {/* MESSAGES */}

              <div
                className="
                  flex-1
                  min-h-0

                  overflow-y-auto
                  overflow-x-hidden

                  px-5
                  py-5

                  bg-gray-100/70
                  dark:bg-gray-900/50
                "
              >
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 text-orange-600 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center

                      h-full
                      text-gray-400
                    "
                  >
                    <MailOpen className="w-10 h-10 mb-3 opacity-40" />

                    <p className="text-sm">
                      {isAr
                        ? "لا توجد رسائل في هذه المحادثة"
                        : "No messages in this conversation"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {grouped.map((item) => {
                      if (item.type === "day") {
                        return (
                          <div
                            key={item.key}
                            className="flex items-center gap-3 py-2"
                          >
                            <span className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />

                            <span
                              className="
                                text-[11px]
                                font-bold

                                text-gray-500
                                dark:text-gray-400

                                bg-white
                                dark:bg-gray-800

                                px-3
                                py-1

                                rounded-full
                                shadow-sm
                              "
                            >
                              {item.label}
                            </span>

                            <span className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                          </div>
                        );
                      }

                      const m = item.m;
                      const mine =
                        m.sender_type === "user";

                      const meta =
                        senderMeta(
                          m.sender_type
                        );

                      const Icon =
                        meta.icon || Mail;

                      return (
                        <div
                          key={item.key}
                          className={`
                            flex
                            items-end
                            gap-2.5

                            ${
                              mine
                                ? "justify-end"
                                : "justify-start"
                            }
                          `}
                        >
                          {!mine && (
                            <span
                              className={`
                                w-8
                                h-8
                                rounded-full

                                flex
                                items-center
                                justify-center

                                flex-shrink-0

                                ${meta.cls}
                              `}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </span>
                          )}

                          <div
                            className={`
                              max-w-[78%]

                              flex
                              flex-col

                              ${
                                mine
                                  ? "items-end"
                                  : "items-start"
                              }
                            `}
                          >
                            <div
                              className={`
                                px-4
                                py-2.5

                                text-sm
                                leading-relaxed

                                whitespace-pre-wrap

                                ${
                                  mine
                                    ? "bg-orange-600 text-white rounded-3xl rounded-ee-md"
                                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-3xl rounded-es-md shadow-sm"
                                }
                              `}
                            >
                              <p>{m.body}</p>

                              {m.attachment_path && (
                                <a
                                  href={resolveUploadUrl(
                                    m.attachment_path
                                  )}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`
                                    inline-flex
                                    items-center
                                    gap-1.5

                                    mt-2
                                    px-2.5
                                    py-1.5

                                    rounded-xl

                                    text-xs
                                    font-semibold

                                    ${
                                      mine
                                        ? "bg-white/15 text-white hover:bg-white/25"
                                        : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200"
                                    }

                                    transition-colors
                                  `}
                                >
                                  <Paperclip className="w-3 h-3" />

                                  {m.attachment_name ||
                                    (isAr
                                      ? "مرفق"
                                      : "Attachment")}
                                </a>
                              )}
                            </div>

                            <span
                              className="
                                text-[10px]
                                text-gray-400
                                mt-1
                                px-1
                              "
                              dir="ltr"
                            >
                              {formatTime(
                                m.created_at,
                                isAr
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    <div ref={endRef} />
                  </div>
                )}
              </div>

              {/* REPLY AREA */}

              <div
                className="
                  p-4
                  flex-shrink-0

                  border-t
                  border-gray-200
                  dark:border-gray-700/60
                "
              >
                {error && (
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      mb-2

                      text-xs
                      text-red-500
                    "
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    {error}
                  </div>
                )}

                {attachment && (
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2

                      mb-2

                      px-3
                      py-1.5

                      rounded-full

                      bg-orange-50
                      dark:bg-orange-500/10

                      text-xs

                      text-gray-600
                      dark:text-gray-300

                      font-semibold
                    "
                  >
                    <Paperclip className="w-3.5 h-3.5 text-orange-600" />

                    {attachment.name}

                    <button
                      type="button"
                      onClick={() => {
                        setAttachment(null);

                        if (
                          fileInputRef.current
                        ) {
                          fileInputRef.current.value =
                            "";
                        }
                      }}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div
                  className="
                    flex
                    items-end
                    gap-2

                    rounded-3xl

                    bg-gray-100
                    dark:bg-gray-900

                    p-1.5
                    ps-2

                    border
                    border-gray-200
                    dark:border-gray-700

                    focus-within:ring-2
                    focus-within:ring-orange-500/30

                    focus-within:border-orange-500

                    transition-all
                  "
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) =>
                      setAttachment(
                        e.target.files?.[0] || null
                      )
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="
                      w-10
                      h-10
                      rounded-full

                      flex
                      items-center
                      justify-center

                      text-gray-400

                      hover:text-orange-600

                      hover:bg-white
                      dark:hover:bg-gray-800

                      transition-colors

                      flex-shrink-0
                    "
                    aria-label={
                      isAr
                        ? "إرفاق ملف"
                        : "Attach file"
                    }
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <textarea
                    value={replyText}
                    onChange={(e) =>
                      setReplyText(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey
                      ) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    rows={1}
                    placeholder={
                      isAr
                        ? "اكتب ردك… (Enter للإرسال)"
                        : "Type your reply… (Enter to send)"
                    }
                    className="
                      flex-1
                      bg-transparent

                      px-2
                      py-2.5

                      text-sm

                      outline-none

                      text-gray-900
                      dark:text-white

                      placeholder:text-gray-400

                      resize-none
                      max-h-32
                    "
                  />

                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={
                      sending ||
                      (!replyText.trim() &&
                        !attachment)
                    }
                    className="
                      w-10
                      h-10
                      rounded-full

                      bg-orange-600
                      text-white

                      flex
                      items-center
                      justify-center

                      hover:bg-orange-700

                      disabled:bg-gray-300
                      dark:disabled:bg-gray-700

                      disabled:text-gray-400

                      transition-colors

                      flex-shrink-0
                    "
                    aria-label={
                      isAr
                        ? "إرسال"
                        : "Send"
                    }
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send
                        className={`
                          w-4 h-4

                          ${
                            isRTL
                              ? "-scale-x-100"
                              : ""
                          }
                        `}
                      />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div
              className="
                flex-1
                min-h-0

                flex
                flex-col

                items-center
                justify-center

                text-center

                px-6
                py-16
              "
            >
              <span
                className="
                  w-20
                  h-20

                  rounded-3xl

                  bg-orange-50
                  dark:bg-orange-500/10

                  text-orange-600
                  dark:text-orange-400

                  flex
                  items-center
                  justify-center

                  mb-5
                "
              >
                <MessageSquare className="w-9 h-9" />
              </span>

              <h2
                className="
                  text-gray-900
                  dark:text-white

                  text-lg
                  font-black

                  mb-1.5
                "
              >
                {isAr
                  ? "اختر محادثة لعرضها"
                  : "Select a conversation"}
              </h2>

              <p
                className="
                  text-sm

                  text-gray-500
                  dark:text-gray-400

                  max-w-sm
                "
              >
                {isAr
                  ? "كل الرسائل بينك وبين إدارة المنصة وإشعارات طلباتك تظهر هنا في مكان واحد."
                  : "All messages between you and the platform team, plus request notifications, live here in one place."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
