import { Link } from "react-router-dom";
import { CheckCircle, Briefcase, UserCog, Languages, Shield, FileText, MessageSquare, BookMarked, BarChart3, LayoutTemplate, Mail, Send, Award } from "lucide-react";
import { getAllServices } from "./S02_Services/servicesConfig";
import { useInnerLang, Breadcrumb, InnerHero, AnchorNav, SectionHead, QuoteBand, CtaBand, CardArrow } from "./S01_Home/InnerBlocks";

// =========================================================
// صفحة الموظفين ومقدّمي الخدمة (/staff) — الطبقة التشغيلية: المنصة تعمل
// بأيدي شبكة خبراء (مقدّمو الخدمة: محكّمون، مترجمون، مدققون، مستشارون…)
// وفريق تشغيل (موظفو المنصة). لكل دور: ما يفعله، ما يحتاجه للتسجيل، وزر
// "إنشاء حساب" يفتح نموذج التسجيل الخاص به مباشرة (/register?role=…).
// الحسابان يخضعان لمراجعة الإدارة وتفعيلها قبل بدء العمل.
// =========================================================

const SERVICE_ICONS = {
  "initial-review": Shield, translation: Languages, proofreading: FileText, consultation: MessageSquare,
  "expert-review": Award, "final-review": Shield, "journal-selection": BookMarked, "journal-evaluation": BarChart3,
  template: LayoutTemplate, correspondence: Mail, publication: Send,
};

const StaffPage = () => {
  const { t, isRTL, ArrowIcon } = useInnerLang();
  const lang = isRTL ? "ar" : "en";

  const L = isRTL
    ? {
        section: "للموظفين ومقدّمي الخدمة",
        kicker: "الطبقة التشغيلية — شبكة الخبراء وفريق التشغيل",
        titlePre: "المنصة تعمل بأيدي ", titleEm: "خبرائها وفريقها", titlePost: ".",
        intro: "خدمات سورس لا يقدّمها النظام وحده: محكّمون ومترجمون ومدققون ومستشارو نشر يستلمون الطلبات ويسلّمون الأعمال، وفريق تشغيل يدير المؤسسات والحسابات ويراقب جودة البيانات. لكلٍّ منهما تسجيل خاص وصلاحيات محددة.",
        provider: "مقدّم خدمة", providerRole: "شبكة الخبراء", providerDesc: "محكّم، مترجم، مدقق لغوي، مستشار منهجية أو إحصاء، أو مستشار نشر — تستلم طلبات الباحثين المطابقة لتخصصك وتسلّمها من لوحة مخصصة.",
        providerDo: ["استقبال طلبات الترجمة أو التدقيق أو التحكيم أو الاستشارة المطابقة لخدماتك", "تسليم الأعمال ومتابعتها من لوحة مخصصة مع سجل لكل طلب", "بناء سجل أداء وموثوقية عبر الوقت", "تواصل مباشر مع الباحثين والجامعات داخل المنصة"],
        providerNeed: ["الاسم الكامل والبريد والهاتف", "الخدمات التي تقدمها (اختيار متعدد)", "المؤهلات ونبذة مهنية", "السيرة الذاتية (PDF / Word)"],
        employee: "موظف المنصة", employeeRole: "فريق التشغيل", employeeDesc: "كادر تشغيل المنصة: إدارة الجامعات والكليات والحسابات، مراجعة الطلبات، ورقابة جودة البيانات — بسجل تدقيق كامل لكل إجراء.",
        employeeDo: ["إدارة الجامعات والكليات وحسابات المستخدمين من لوحة واحدة", "مراجعة طلبات الباحثين والجامعات واتخاذ إجراء بشأنها", "رقابة على جودة البيانات قبل اعتمادها", "سجل تدقيق كامل لكل إجراء يتم بالمنصة"],
        employeeNeed: ["الاسم الكامل", "المسمى الوظيفي والقسم", "البريد الإلكتروني والهاتف"],
        what: "ماذا تفعل", need: "ما تحتاجه للتسجيل", register: "إنشاء حساب",
        servicesKicker: "الخدمات التي تحتاج مقدّمين", servicesTitle: "الخدمات التي تعمل بخبراء بشريين.", servicesDesc: "عند التسجيل كمقدّم خدمة تختار الخدمات التي تقدّمها، فتصلك طلباتها فقط.",
        stepsKicker: "كيف يتم التفعيل", stepsTitle: "ثلاث خطوات من التسجيل إلى بدء العمل.",
        steps: [
          { title: "إنشاء الحساب", desc: "تعبئة نموذج الدور ورفع السيرة الذاتية لمقدّمي الخدمة." },
          { title: "مراجعة الإدارة", desc: "يتحقق فريق المنصة من المؤهلات والبيانات، ويبقى الحساب قيد الانتظار حتى الاعتماد." },
          { title: "التفعيل وبدء العمل", desc: "بعد الاعتماد تُفعَّل الصلاحيات وتظهر الطلبات أو أدوات التشغيل في لوحتك." },
        ],
        quote: "وصول مُدار إلى المراجعين والخبراء المتخصصين وخبراء المنهجية والإحصائيين والمحررين والمترجمين ومستشاري النشر وخبراء الابتكار والملكية الفكرية.",
        quoteSource: "المقترح — الطبقات التشغيلية الثلاث: شبكة الخبراء",
        ctaTitle: "انضم إلى شبكة الخبراء أو فريق التشغيل.", ctaDesc: "الحساب يُفعَّل بعد مراجعة الإدارة.",
        login: "تسجيل الدخول", nav: { roles: "الدوران", services: "الخدمات", steps: "التفعيل" },
      }
    : {
        section: "Staff & service providers",
        kicker: "The operating layer — expert network & operations team",
        titlePre: "The platform runs on ", titleEm: "its experts and its team", titlePost: ".",
        intro: "SOURCE services are not delivered by the system alone: reviewers, translators, editors and publication advisors receive requests and deliver work, while an operations team manages institutions and accounts and monitors data quality. Each has its own registration and permissions.",
        provider: "Service provider", providerRole: "Expert network", providerDesc: "Reviewer, translator, language editor, methodology or statistics consultant, or publication advisor — you receive researcher requests matching your services and deliver them from a dedicated dashboard.",
        providerDo: ["Receive translation, editing, review or consultation requests matching your services", "Deliver and track work from a dedicated dashboard with a log per request", "Build a performance and reliability record over time", "Communicate directly with researchers and universities inside the platform"],
        providerNeed: ["Full name, email and phone", "The services you provide (multi-select)", "Qualifications and a professional bio", "CV (PDF / Word)"],
        employee: "Platform employee", employeeRole: "Operations team", employeeDesc: "The platform's operating staff: managing universities, colleges and accounts, reviewing requests and monitoring data quality — with a full audit trail for every action.",
        employeeDo: ["Manage universities, colleges and user accounts from one dashboard", "Review researcher and university requests and act on them", "Oversee data quality before approval", "A full audit log of every action on the platform"],
        employeeNeed: ["Full name", "Job title and department", "Email and phone"],
        what: "What you do", need: "What you need to register", register: "Create account",
        servicesKicker: "Services that need providers", servicesTitle: "Services delivered by human experts.", servicesDesc: "When registering as a provider you pick the services you offer, so only their requests reach you.",
        stepsKicker: "How activation works", stepsTitle: "Three steps from registration to work.",
        steps: [
          { title: "Create the account", desc: "Fill the role form and upload a CV for providers." },
          { title: "Admin review", desc: "The platform team verifies qualifications and data; the account stays pending until approval." },
          { title: "Activation & start", desc: "After approval, permissions are activated and requests or operations tools appear in your dashboard." },
        ],
        quote: "Managed access to reviewers, subject-matter experts, methodologists, statisticians, editors, translators, publication advisors and innovation and IP experts.",
        quoteSource: "Proposal — the three operating layers: expert network",
        ctaTitle: "Join the expert network or the operations team.", ctaDesc: "Accounts are activated after admin review.",
        login: "Sign in", nav: { roles: "The two roles", services: "Services", steps: "Activation" },
      };

  const providerServices = getAllServices().filter((s) => s.slug !== "ai-assistant");

  const roles = [
    { key: "service_provider", icon: Briefcase, title: L.provider, role: L.providerRole, desc: L.providerDesc, does: L.providerDo, need: L.providerNeed, tone: "dark" },
    { key: "employee", icon: UserCog, title: L.employee, role: L.employeeRole, desc: L.employeeDesc, does: L.employeeDo, need: L.employeeNeed, tone: "light" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Breadcrumb section={L.section} items={[{ label: t("nav.home"), to: "/" }, { label: L.section }]} />
      <InnerHero
        image="/Home/04.jpg"
        kicker={L.kicker}
        titlePre={L.titlePre}
        titleEm={L.titleEm}
        titlePost={L.titlePost}
        intro={L.intro}
        primary={{ to: "/register?role=service_provider", label: `${L.register} — ${t("roles.service_provider")}` }}
        secondary={{ to: "/register?role=employee", label: `${L.register} — ${t("roles.employee")}` }}
      />
      <AnchorNav
        items={[{ href: "#roles", label: L.nav.roles }, { href: "#services", label: L.nav.services }, { href: "#steps", label: L.nav.steps }]}
        cta={{ to: "/register?role=service_provider", label: `${L.register} — ${t("roles.service_provider")}` }}
      />

      {/* الدوران */}
      <section id="roles" className="bg-gray-50 py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-6">
          {roles.map((r) => {
            const dark = r.tone === "dark";
            return (
              <div key={r.key} id={r.key} className={`p-8 md:p-10 flex flex-col scroll-mt-28 ${dark ? "bg-brand-ink text-white" : "bg-white border border-gray-200 text-brand-ink"}`}>
                <div className="flex items-center gap-4 mb-6">
                  <span className={`w-14 h-14 flex items-center justify-center ${dark ? "bg-brand-orange/15 text-brand-orange border border-brand-orange/30" : "bg-brand-orange/10 text-brand-orange"}`}>
                    <r.icon className="w-7 h-7" strokeWidth={1.5} />
                  </span>
                  <div>
                    <span className="block text-xs font-bold tracking-[0.2em] text-brand-orange mb-1">{r.role}</span>
                    <h2 className="text-2xl font-bold">{r.title}</h2>
                  </div>
                </div>
                <p className={`text-[15px] leading-relaxed mb-6 ${dark ? "text-white/70" : "text-brand-muted"}`}>{r.desc}</p>
                <span className={`text-[11px] font-bold tracking-[0.2em] uppercase mb-3 ${dark ? "text-white/50" : "text-brand-muted"}`}>{L.what}</span>
                <ul className="flex flex-col gap-2.5 mb-6">
                  {r.does.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm font-semibold leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className={`text-[11px] font-bold tracking-[0.2em] uppercase mb-3 ${dark ? "text-white/50" : "text-brand-muted"}`}>{L.need}</span>
                <div className="flex flex-wrap gap-2 mb-8">
                  {r.need.map((item) => (
                    <span key={item} className={`text-xs font-semibold px-3 py-1.5 ${dark ? "bg-white/10 text-white" : "bg-gray-100 text-brand-ink"}`}>{item}</span>
                  ))}
                </div>
                <Link
                  to={`/register?role=${r.key}`}
                  className="group mt-auto inline-flex items-center justify-between gap-3 bg-brand-orange text-white px-6 py-3.5 rounded-full font-bold text-sm hover:bg-brand-orange-dark transition-colors"
                >
                  {L.register} — {t(`roles.${r.key}`)}
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* الخدمات التي تحتاج مقدّمين */}
      <section id="services" className="bg-white py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={L.servicesKicker} title={L.servicesTitle} desc={L.servicesDesc} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {providerServices.map((s) => {
              const Icon = SERVICE_ICONS[s.slug] || FileText;
              return (
                <Link key={s.slug} to="/register?role=service_provider" className="group bg-white border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300 p-7 flex flex-col min-h-[210px]">
                  <span className="w-11 h-11 bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-5"><Icon className="w-[22px] h-[22px]" strokeWidth={1.75} /></span>
                  <h3 className="text-[17px] font-bold text-brand-ink mb-2">{s[`title_${lang}`]}</h3>
                  <p className="text-[13px] leading-relaxed text-brand-muted flex-1">{s[`desc_${lang}`]}</p>
                  <CardArrow />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* خطوات التفعيل */}
      <section id="steps" className="bg-brand-ink py-20 md:py-24 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead kicker={L.stepsKicker} title={L.stepsTitle} light />
          <div className="relative">
            <span className="hidden md:block absolute top-6 start-6 end-6 h-px bg-brand-orange/50"></span>
            <div className="relative grid md:grid-cols-3 gap-x-10 gap-y-10">
              {L.steps.map((step, i) => (
                <div key={step.title} className="flex flex-col items-start gap-4">
                  <span className={`w-12 h-12 rounded-full flex items-center justify-center text-[13px] font-extrabold ${i === L.steps.length - 1 ? "bg-brand-orange text-white" : "bg-brand-ink border border-brand-orange/60 text-brand-orange"}`}>0{i + 1}</span>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-sm text-white/65 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <QuoteBand quote={L.quote} source={L.quoteSource} tone="light" />
      <CtaBand
        title={L.ctaTitle}
        desc={L.ctaDesc}
        primary={{ to: "/register?role=service_provider", label: `${L.register} — ${t("roles.service_provider")}` }}
        secondary={{ to: "/login", label: L.login }}
      />
    </div>
  );
};

export default StaffPage;
