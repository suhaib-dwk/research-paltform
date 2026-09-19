import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Menu,
  ChevronDown,
  Search,
  User,
  LogOut,
  Languages,
  Sun,
  Moon,
  Settings,
  LayoutDashboard,
  ListChecks,
  MessageSquare,
  HelpCircle,
  BookOpen,
  FileText,
  ShieldCheck,
  Building2,
  Users,
} from "lucide-react";
import { useSite } from "../SiteContext";

// =========================================================
// Dashboard Header
// Gray / Orange Design
// =========================================================

const QUICK_PAGES = [
  {
    to: "/academic",
    icon: LayoutDashboard,
    ar: "لوحة التحكم",
    en: "Dashboard",
  },
  {
    to: "/academic/tasks",
    icon: ListChecks,
    ar: "المهام",
    en: "Tasks",
  },
  {
    to: "/academic/services",
    icon: BookOpen,
    ar: "الخدمات",
    en: "Services",
  },
  {
    to: "/academic/researches",
    icon: FileText,
    ar: "الأبحاث",
    en: "Researches",
  },
  {
    to: "/academic/reviews",
    icon: ShieldCheck,
    ar: "التحكيم",
    en: "Reviews",
  },
  {
    to: "/academic/collaborations",
    icon: Users,
    ar: "التعاون البحثي",
    en: "Collaborations",
  },
  {
    to: "/academic/university-profile",
    icon: Building2,
    ar: "ملف الجامعة",
    en: "University profile",
  },
  {
    to: "/academic/messages",
    icon: MessageSquare,
    ar: "الرسائل",
    en: "Messages",
  },
  {
    to: "/academic/account",
    icon: User,
    ar: "الحساب",
    en: "Account",
  },
  {
    to: "/academic/settings",
    icon: Settings,
    ar: "الإعدادات",
    en: "Settings",
  },
  {
    to: "/academic/help",
    icon: HelpCircle,
    ar: "المساعدة",
    en: "Help",
  },
];

const DashboardHeader = ({ onMenuToggle, onLogout }) => {
  const { t, i18n } = useTranslation();

  const {
    user: userData,
    currentLang,
    isRTL,
    theme,
    toggleTheme,
  } = useSite();

  const navigate = useNavigate();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const firstItemRef = useRef(null);

  const isAr = currentLang === "ar";

  // =========================================================
  // Close menus
  // =========================================================

  useEffect(() => {
    if (!showUserMenu && !searchOpen) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowUserMenu(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setSearchOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowUserMenu(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    const timer = setTimeout(() => {
      if (showUserMenu) {
        firstItemRef.current?.focus();
      }
    }, 60);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );

      clearTimeout(timer);
    };
  }, [showUserMenu, searchOpen]);

  // =========================================================
  // User information
  // =========================================================

  const userInitial =
    userData?.name?.charAt(0)?.toUpperCase() || "U";

  const roleName = isAr
    ? userData?.role_name_ar ||
      t(`account.role_${userData?.role || "default"}`)
    : userData?.role_name_en ||
      t(`account.role_${userData?.role || "default"}`);

  // =========================================================
  // Language
  // =========================================================

  const handleToggleLang = () => {
    const newLang = currentLang === "ar" ? "en" : "ar";

    i18n.changeLanguage(newLang);

    document.documentElement.dir =
      newLang === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = newLang;

    document.documentElement.style.fontFamily =
      newLang === "ar"
        ? "var(--font-ar)"
        : "var(--font-en)";
  };

  // =========================================================
  // Quick Search
  // =========================================================

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return [];

    return QUICK_PAGES.filter(
      (p) =>
        p.ar.includes(q) ||
        p.en.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const goTo = (to) => {
    setQuery("");
    setSearchOpen(false);
    navigate(to);
  };

  // =========================================================
  // Render
  // =========================================================

  return (
    <header
      className="
        sticky top-0 z-30
        h-20
        bg-gray-200 dark:bg-gray-900
        border-b border-gray-300 dark:border-gray-800
        backdrop-blur-xl
        flex items-center justify-between
        gap-4
        px-4 lg:px-8
        transition-all duration-300
        shadow-sm
      "
    >
      {/* =====================================================
          LEFT SIDE
          ===================================================== */}

      <div className="flex items-center gap-3 flex-1 min-w-0">

        {/* Mobile Menu */}
        <button
          onClick={onMenuToggle}
          aria-label={t("admin_menu.sidebar")}
          className="
            lg:hidden
            text-gray-600 dark:text-gray-400
            hover:text-orange-600 dark:hover:text-orange-400
            p-2.5
            hover:bg-orange-50 dark:hover:bg-gray-800
            rounded-xl
            transition-all duration-200
          "
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* =================================================
            QUICK SEARCH
            ================================================= */}

        <div
          className="relative flex-1 max-w-md"
          ref={searchRef}
        >
          <Search
            className="
              absolute
              top-1/2
              -translate-y-1/2
              start-4
              w-5 h-5
              text-gray-400
              pointer-events-none
            "
          />

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                results[0]
              ) {
                goTo(results[0].to);
              }
            }}
            placeholder={
              isAr ? "بحث…" : "Search…"
            }
            aria-label={
              isAr ? "بحث سريع" : "Quick search"
            }
            className="
              w-full
              h-11
              ps-12 pe-4
              rounded-full

              bg-white
              dark:bg-gray-800

              border border-gray-300
              dark:border-gray-700

              focus:border-orange-500
              focus:ring-2
              focus:ring-orange-500/10

              dark:focus:border-orange-500

              text-sm
              text-gray-800
              dark:text-gray-100

              placeholder:text-gray-400
              dark:placeholder:text-gray-500

              outline-none

              shadow-sm
              focus:shadow-md

              transition-all duration-200
            "
          />

          {/* =================================================
              SEARCH RESULTS
              ================================================= */}

          <AnimatePresence>
            {searchOpen && results.length > 0 && (
              <motion.ul
                initial={{
                  opacity: 0,
                  y: -6,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -6,
                }}
                transition={{
                  duration: 0.15,
                }}
                className="
                  absolute
                  top-full
                  mt-2
                  inset-x-0

                  bg-white
                  dark:bg-gray-800

                  border
                  border-gray-200
                  dark:border-gray-700

                  rounded-2xl

                  shadow-xl
                  shadow-gray-300/40
                  dark:shadow-black/40

                  overflow-hidden
                  z-50
                "
              >
                {results.map((r) => (
                  <li key={r.to}>
                    <button
                      type="button"
                      onClick={() => goTo(r.to)}
                      className="
                        w-full
                        flex items-center gap-3

                        px-4 py-3

                        text-sm
                        text-gray-700
                        dark:text-gray-200

                        hover:bg-orange-50
                        dark:hover:bg-orange-500/10

                        hover:text-orange-600
                        dark:hover:text-orange-400

                        transition-colors

                        text-start
                      "
                    >
                      <r.icon
                        className="
                          w-4 h-4
                          text-gray-400
                          group-hover:text-orange-500
                        "
                      />

                      {isAr ? r.ar : r.en}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE
          ===================================================== */}

      <div
        className="
          flex items-center
          gap-1 sm:gap-2
          flex-shrink-0
        "
      >

        {/* =================================================
            LANGUAGE
            ================================================= */}

        <button
          onClick={handleToggleLang}
          className="
            flex items-center gap-1.5

            p-2.5

            text-gray-600
            dark:text-gray-400

            hover:text-orange-600
            dark:hover:text-orange-400

            hover:bg-orange-50
            dark:hover:bg-orange-500/10

            rounded-full

            transition-all duration-200
          "
          aria-label="Toggle Language"
        >
          <Languages className="w-5 h-5" />

          <span
            className="
              hidden sm:inline
              text-[10px]
              font-black
              tracking-wide
            "
          >
            {isAr ? "EN" : "عربي"}
          </span>
        </button>

        {/* =================================================
            THEME
            ================================================= */}

        <button
          onClick={() => toggleTheme?.()}
          className="
            p-2.5

            text-gray-600
            dark:text-gray-400

            hover:text-orange-600
            dark:hover:text-orange-400

            hover:bg-orange-50
            dark:hover:bg-orange-500/10

            rounded-full

            transition-all duration-200
          "
          aria-label="Toggle Theme"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        {/* =================================================
            NOTIFICATIONS
            ================================================= */}

        <Link
          to="/academic/messages"
          aria-label={t("admin_menu.messages")}
          className="
            relative

            w-11 h-11

            rounded-full

            bg-white
            dark:bg-gray-800

            border
            border-gray-300
            dark:border-gray-700

            flex items-center justify-center

            text-gray-600
            dark:text-gray-300

            hover:text-orange-600
            dark:hover:text-orange-400

            hover:bg-orange-50
            dark:hover:bg-orange-500/10

            transition-all duration-200

            shadow-sm
          "
        >
          <Bell className="w-5 h-5" />

          <span
            className="
              absolute
              top-2.5
              end-2.5

              w-2 h-2

              bg-orange-600

              rounded-full

              ring-2
              ring-white
              dark:ring-gray-900
            "
          />
        </Link>

        {/* =================================================
            USER MENU
            ================================================= */}

        <div
          className="relative"
          ref={menuRef}
        >
          <button
            onClick={() =>
              setShowUserMenu((prev) => !prev)
            }
            aria-expanded={showUserMenu}
            aria-haspopup="true"
            className={`
              flex items-center gap-2.5

              p-1.5 pe-2.5

              rounded-2xl

              transition-all duration-200

              ${
                showUserMenu
                  ? "bg-orange-50 dark:bg-orange-500/10"
                  : "hover:bg-orange-50 dark:hover:bg-gray-800"
              }
            `}
          >
            {/* User Avatar */}
            <span
              className="
                w-9 h-9

                bg-gradient-to-br
                from-orange-400
                to-orange-600

                text-white

                rounded-full

                flex items-center
                justify-center

                text-sm
                font-black

                shadow-md
                shadow-orange-500/20
              "
            >
              {userInitial}
            </span>

            {/* User Info */}
            <span
              className="
                hidden sm:block
                text-start
              "
            >
              <span
                className="
                  block

                  text-gray-900
                  dark:text-white

                  text-xs
                  font-bold
                  leading-tight

                  max-w-[140px]
                  truncate
                "
              >
                {userData?.name || "User"}
              </span>

              <span
                className="
                  flex items-center
                  gap-1.5
                  mt-0.5
                "
              >
                <span
                  className="
                    inline-block
                    w-1.5 h-1.5

                    rounded-full

                    bg-orange-500
                  "
                />

                <span
                  className="
                    text-[10px]

                    text-orange-600
                    dark:text-orange-400

                    font-semibold
                    leading-tight
                  "
                >
                  {roleName}
                </span>
              </span>
            </span>

            <ChevronDown
              className={`
                w-4 h-4

                text-gray-500
                dark:text-gray-500

                hidden sm:block

                transition-transform
                duration-200

                ${
                  showUserMenu
                    ? "rotate-180 text-orange-500"
                    : ""
                }
              `}
            />
          </button>

          {/* =================================================
              USER DROPDOWN
              ================================================= */}

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                role="menu"
                initial={{
                  opacity: 0,
                  y: -8,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.95,
                }}
                transition={{
                  duration: 0.15,
                }}
                className={`
                  absolute
                  top-full

                  ${
                    isRTL
                      ? "left-0"
                      : "right-0"
                  }

                  mt-2.5

                  w-72

                  bg-white
                  dark:bg-gray-800

                  border
                  border-gray-200
                  dark:border-gray-700

                  rounded-2xl

                  shadow-xl
                  shadow-gray-300/40
                  dark:shadow-black/50

                  overflow-hidden
                  z-50

                  transition-colors duration-300
                `}
              >

                {/* =================================================
                    USER PROFILE HEADER
                    ================================================= */}

                <div
                  className="
                    p-4

                    border-b
                    border-gray-200
                    dark:border-gray-700

                    bg-gray-50
                    dark:bg-gray-800
                  "
                >
                  <div className="flex items-center gap-3">

                    <div
                      className="
                        w-11 h-11

                        bg-gradient-to-br
                        from-orange-400
                        to-orange-600

                        text-white

                        rounded-full

                        flex items-center
                        justify-center

                        text-base
                        font-black

                        shadow-md
                        shadow-orange-500/20
                      "
                    >
                      {userInitial}
                    </div>

                    <div
                      className="
                        flex-1
                        min-w-0
                      "
                    >
                      <p
                        className="
                          text-gray-900
                          dark:text-white

                          text-sm
                          font-bold

                          truncate
                        "
                      >
                        {userData?.name || "User"}
                      </p>

                      <p
                        className="
                          text-orange-600
                          dark:text-orange-400

                          text-[11px]
                          font-semibold

                          truncate
                        "
                      >
                        {roleName}
                      </p>

                      <p
                        className="
                          text-gray-500
                          dark:text-gray-400

                          text-xs

                          truncate
                        "
                        dir="ltr"
                      >
                        {userData?.email || ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    ACCOUNT LINKS
                    ================================================= */}

                <div className="p-2">

                  <Link
                    ref={firstItemRef}
                    to="/academic/account"
                    role="menuitem"
                    tabIndex={0}
                    onClick={() =>
                      setShowUserMenu(false)
                    }
                    className="
                      flex items-center gap-3

                      px-3 py-2.5

                      text-sm

                      text-gray-700
                      dark:text-gray-300

                      hover:bg-orange-50
                      dark:hover:bg-orange-500/10

                      hover:text-orange-600
                      dark:hover:text-orange-400

                      rounded-xl

                      transition-colors

                      outline-none

                      focus-visible:ring-2
                      focus-visible:ring-orange-500
                    "
                  >
                    <User
                      className="
                        w-4 h-4
                        text-orange-600
                        dark:text-orange-400
                      "
                    />

                    {t("account.title")}
                  </Link>

                  <Link
                    to="/academic/settings"
                    role="menuitem"
                    tabIndex={-1}
                    onClick={() =>
                      setShowUserMenu(false)
                    }
                    className="
                      flex items-center gap-3

                      px-3 py-2.5

                      text-sm

                      text-gray-700
                      dark:text-gray-300

                      hover:bg-orange-50
                      dark:hover:bg-orange-500/10

                      hover:text-orange-600
                      dark:hover:text-orange-400

                      rounded-xl

                      transition-colors

                      outline-none

                      focus-visible:ring-2
                      focus-visible:ring-orange-500
                    "
                  >
                    <Settings
                      className="
                        w-4 h-4

                        text-gray-500
                        dark:text-gray-500

                        group-hover:text-orange-500
                      "
                    />

                    {t("settings.title")}
                  </Link>
                </div>

                {/* =================================================
                    LOGOUT
                    ================================================= */}

                <div
                  className="
                    border-t
                    border-gray-200
                    dark:border-gray-700

                    p-2
                  "
                >
                  <button
                    role="menuitem"
                    tabIndex={-1}
                    onClick={onLogout}
                    className="
                      w-full

                      flex items-center gap-3

                      px-3 py-2.5

                      text-sm

                      text-red-600
                      dark:text-red-400

                      hover:bg-red-50
                      dark:hover:bg-red-900/20

                      hover:text-red-700
                      dark:hover:text-red-300

                      rounded-xl

                      transition-colors

                      outline-none

                      focus-visible:ring-2
                      focus-visible:ring-red-500
                    "
                  >
                    <LogOut className="w-4 h-4" />

                    {t("admin_menu.logout")}
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;