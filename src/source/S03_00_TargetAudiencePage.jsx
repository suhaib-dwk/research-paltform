import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Landmark, Building2, School, FlaskConical, GraduationCap, BookOpen, Users, Briefcase, ChevronDown } from "lucide-react";
import { useInnerLang, Breadcrumb, InnerHero, AnchorNav, SectionHead, CtaBand, CardArrow } from "./S01_Home/InnerBlocks";

// =========================================================
// الفئة المستهدفة (/target-audience) — خريطة المنظومة كما هي مبنية فعلًا:
// ثلاث فئات رئيسية (الوزارة / الجامعات والمؤسسات / الباحثون والطلبة) بتسلسلها
// الحقيقي: الوزارة تشرف على الجامعات، الجامعة تضم كلياتها (الكلية تابعة
// للجامعة وتختار جامعتها عند التسجيل) والكلية تضم أقسامها، والباحث ينتمي إلى
// كليته. مراكز البحث تُسجَّل مستقلة أو تابعة لجامعة. كل عقدة تفتح صفحتها
// التعريفية (/audience/:key) ومنها نموذج تسجيل دورها.
// =========================================================

const TargetAudiencePage = () => {
  const { t, isRTL, ArrowIcon } = useInnerLang();
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const L = (ar, en) => (isRTL ? ar : en);

  const login = { to: "/login", label: t("nav.login") };
  const register = (role) => ({ to: `/register?role=${role}`, label: `${L("إنشاء حساب", "Create account")} — ${t(`roles.${role}`)}` });

  // ── الفئات الثلاث بترتيب المكونات ──
  const groups = [
    {
      id: "ministry", number: "01", icon: Landmark,
      kicker: L("المكوّن الأول — لوحات الوزارة والذكاء البحثي الوطني", "Component one — Ministry dashboards & national research intelligence"),
      title: L("الوزارة", "The Ministry"),
      desc: L(
        "الجهة المشرفة على المنظومة كلها: ترى الصورة الوطنية للبحث العلمي عبر بيانات الجامعات المصرّح بمشاركتها، وتحدد الأولويات، وتدير الشراكات وفرص التمويل — بحوكمة وصلاحيات واضحة.",
        "The supervising body of the whole ecosystem: it sees the national research picture through data universities authorise, sets priorities, and manages partnerships and funding — with clear governance and permissions.",
      ),
      nodes: [
        { key: "ministry", icon: Landmark, title: t("roles.ministry"), tag: L("حساب جهة حكومية", "Government entity account"), desc: t("audiences.types.ministry.tagline") },
      ],
    },
    {
      id: "institutions", number: "02", icon: Building2,
      kicker: L("المكوّن الثاني — الجودة والاعتماد والتصنيفات", "Component two — Quality, accreditation & rankings"),
      title: L("الجامعات والمؤسسات", "Universities & institutions"),
      desc: L(
        "الجامعة هي المؤسسة الأم: تسجّل حسابها ثم تُدار تحتها الكليات والأقسام ومراكزها البحثية. الكلية لا تقف وحدها — تسجَّل تابعةً لجامعة محددة وتصعّد تقاريرها إليها. ومركز البحث يُسجَّل مستقلًا أو تابعًا لجامعة.",
        "The university is the parent institution: it registers its account, and colleges, departments and research centres are managed beneath it. A college never stands alone — it registers under a specific university and escalates its reports to it. A research centre registers independently or under a university.",
      ),
      nodes: [
        { key: "university", icon: Building2, title: t("roles.university"), tag: L("المؤسسة الأم", "Parent institution"), desc: t("audiences.types.university.tagline") },
        { key: "college", icon: School, title: t("roles.college"), tag: L("تابعة لجامعة مسجّلة", "Belongs to a registered university"), desc: t("audiences.types.college.tagline") },
        { key: "research_center", icon: FlaskConical, title: t("roles.research_center"), tag: L("مستقل أو تابع لجامعة", "Independent or university-affiliated"), desc: t("audiences.types.research_center.tagline") },
      ],
    },
    {
      id: "researchers", number: "03", icon: GraduationCap,
      kicker: L("المكوّن الثالث — خدمات البحث والممكنات البحثية", "Component three — Research services & enablers"),
      title: L("الباحثون والطلبة", "Researchers & students"),
      desc: L(
        "الأفراد داخل الكليات: رحلة واحدة بثلاث مراحل — من طالب البكالوريوس إلى الدراسات العليا إلى عضو هيئة التدريس والباحث — ينتقل فيها الملف البحثي مع صاحبه، وتتدرج الخدمات مع مستواه.",
        "The individuals inside colleges: one journey in three stages — from undergraduate to postgraduate to faculty member and researcher — where the research profile travels with its owner and services scale with the level.",
      ),
      nodes: [
        { key: "undergrad", icon: BookOpen, title: t("home.stage_undergrad_title"), tag: t("home.stage1_label"), desc: t("audiences.types.undergrad.tagline") },
        { key: "grad", icon: GraduationCap, title: t("home.stage_grad_title"), tag: t("home.stage2_label"), desc: t("audiences.types.grad.tagline") },
        { key: "faculty", icon: Users, title: t("home.stage_faculty_title"), tag: t("home.stage3_label"), desc: t("audiences.types.faculty.tagline") },
      ],
    },
  ];

  const anchors = [
    { href: "#structure", label: L("هيكل المنظومة", "Structure") },
    { href: "#ministry", label: L("الوزارة", "Ministry") },
    { href: "#institutions", label: L("الجامعات والمؤسسات", "Institutions") },
    { href: "#researchers", label: L("الباحثون والطلبة", "Researchers") },
    { href: "#staff", label: L("الموظفون ومقدّمو الخدمة", "Staff & providers") },
  ];

  return (
    <>
      <Breadcrumb
        section={t("nav.target_audience")}
        items={[{ to: "/", label: t("nav.home") }, { label: t("nav.target_audience") }]}
      />

      <InnerHero
        tone="light"
        image="/Home/home02.jpg"
        kicker={L("لمن هذه المنصة", "Who the platform is for")}
        titlePre={L("ثلاث فئات، ", "Three audiences, ")}
        titleEm={L("منظومة واحدة", "one system")}
        titlePost="."
        intro={L(
          "الوزارة تشرف، والجامعة تضم كلياتها ومراكزها، والباحث ينتمي إلى كليته. لكل فئة أدواتها ولوحاتها ومسار تسجيلها الخاص — لكنها جميعًا تعمل على سجل بحثي واحد يتدفق من الباحث إلى القسم إلى الكلية إلى الجامعة إلى الوزارة.",
          "The Ministry supervises, the university contains its colleges and centres, and the researcher belongs to a college. Each audience has its own tools, dashboards and registration path — yet all work on one research record that flows from researcher to department to college to university to the Ministry.",
        )}
        primary={login}
        secondary={{ to: "#structure", label: L("اعرض الهيكل", "View the structure") }}
      >
        <div className="bg-white p-6 md:p-7 flex flex-col gap-5 shadow-[0_24px_60px_-30px_rgba(36,27,20,0.35)]">
          {[
            [3, L("فئات رئيسية", "main audiences")],
            [7, L("أدوار لها حساب وصفحة تعريفية", "roles with an account and a page")],
            [5, L("مستويات في سجل بحثي واحد", "levels in one research record")],
          ].map(([n, label], i) => (
            <div key={i} className={`flex items-baseline gap-4 ${i < 2 ? "pb-5 border-b border-gray-100" : ""}`}>
              <span className="text-4xl font-bold text-brand-orange leading-none">{n}</span>
              <span className="text-sm font-bold text-brand-ink">{label}</span>
            </div>
          ))}
        </div>
      </InnerHero>

      <AnchorNav items={anchors} cta={login} />

      {/* ═══════ 1) هيكل المنظومة — شجرة التبعية ═══════ */}
      <section id="structure" className="bg-white py-16 md:py-20 scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHead
            kicker={L("هيكل المنظومة", "System structure")}
            title={L("من يتبع من — بالترتيب الفعلي.", "Who belongs to whom — the real order.")}
            desc={L(
              "الشجرة أدناه هي التسلسل الذي تُبنى عليه الحسابات والصلاحيات والتقارير في سورس: كل مستوى يرى ما تحته ويصعّد إلى ما فوقه.",
              "The tree below is the hierarchy on which accounts, permissions and reports in SOURCE are built: each level sees what is beneath it and escalates to what is above it.",
            )}
          />

          <div className="max-w-4xl mx-auto">
            {/* الوزارة */}
            <TreeNode to="/audience/ministry" icon={Landmark} tone="dark" level={L("المستوى الوطني", "National level")}
              title={t("roles.ministry")} desc={L("تشرف على كل الجامعات وترى الصورة الوطنية", "Supervises all universities and sees the national picture")} />
            <Connector />

            {/* الجامعة + مركز البحث */}
            <div className="grid md:grid-cols-[1fr_auto] gap-6 items-start">
              <div>
                <TreeNode to="/audience/university" icon={Building2} tone="orange" level={L("المؤسسة الأم", "Parent institution")}
                  title={t("roles.university")} desc={L("حساب الجامعة — وتحته تُدار الكليات والأقسام والمراكز", "The university account — colleges, departments and centres are managed beneath it")} />
                <Connector />
                {/* الكلية داخل الجامعة */}
                <div className="ms-6 md:ms-12 border-s-2 border-dashed border-brand-orange/40 ps-5 md:ps-8">
                  <TreeNode to="/audience/college" icon={School} tone="light" level={L("تابعة للجامعة", "Within the university")}
                    title={t("roles.college")} desc={L("تُسجَّل تابعةً لجامعة محددة، وتصعّد تقارير أقسامها إلى الجامعة", "Registers under a specific university and escalates its departments' reports to it")}
                    badge={L("الكلية تابعة للجامعة", "College belongs to the university")} />
                  <Connector />
                  {/* القسم داخل الكلية */}
                  <div className="ms-6 md:ms-12 border-s-2 border-dashed border-brand-orange/40 ps-5 md:ps-8">
                    <TreeNode icon={BookOpen} tone="plain" level={L("داخل الكلية", "Within the college")}
                      title={L("القسم الأكاديمي", "Academic department")} desc={L("وحدة المتابعة الأصغر — يُدار من حساب الكلية", "The smallest tracking unit — managed from the college account")} />
                    <Connector />
                    {/* الباحثون داخل القسم */}
                    <div className="ms-6 md:ms-12 border-s-2 border-dashed border-brand-orange/40 ps-5 md:ps-8">
                      <div className="bg-brand-cream-hero p-5 md:p-6">
                        <span className="text-brand-orange text-[11px] font-bold tracking-[0.2em] uppercase block mb-3">{L("الأفراد — ينتمون إلى كليتهم", "Individuals — belong to their college")}</span>
                        <div className="flex flex-wrap items-center gap-2">
                          {[["undergrad", t("home.stage_undergrad_title")], ["grad", t("home.stage_grad_title")], ["faculty", t("home.stage_faculty_title")]].map(([k, label], i) => (
                            <span key={k} className="inline-flex items-center gap-2">
                              <Link to={`/audience/${k}`} className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-brand-orange px-3.5 py-2 text-[13px] font-bold text-brand-ink transition-colors">
                                <GraduationCap className="w-3.5 h-3.5 text-brand-orange" />{label}
                              </Link>
                              {i < 2 && <ArrowIcon className="w-3.5 h-3.5 text-brand-muted" />}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* مركز البحث — مستقل أو تابع */}
              <div className="md:w-72 md:pt-0 pt-2">
                <TreeNode to="/audience/research_center" icon={FlaskConical} tone="light" level={L("مستقل أو تابع لجامعة", "Independent or affiliated")}
                  title={t("roles.research_center")} desc={L("يوثّق مشاريعه ومخرجاته، ويظهر في شبكة الشراكات الوطنية", "Documents its projects and outputs and appears in the national partnership network")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 2) الفئات الثلاث بالتفصيل ═══════ */}
      {groups.map((g, gi) => (
        <section key={g.id} id={g.id} className={`${gi % 2 === 0 ? "bg-brand-cream-hero" : "bg-white"} py-16 md:py-20 scroll-mt-28`}>
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              <div className="lg:col-span-5">
                <span className="text-brand-orange text-sm font-bold block mb-3">{g.number}</span>
                <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-4 block">{g.kicker}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-ink leading-tight mb-4">{g.title}</h2>
                <p className="text-[15px] md:text-base leading-relaxed text-brand-muted mb-6">{g.desc}</p>
                <Link to={`/audience/${g.nodes[0].key}`} className="inline-flex items-center gap-2 text-brand-orange font-bold text-sm hover:text-brand-orange-dark transition-colors">
                  {L("اقرأ المزيد عن هذه الفئة", "Read more about this audience")}
                  <ArrowIcon className="w-4 h-4" />
                </Link>
              </div>
              <div className={`lg:col-span-7 grid gap-5 ${g.nodes.length > 1 ? "sm:grid-cols-3" : "sm:grid-cols-1 max-w-md"}`}>
                {g.nodes.map((n, ni) => (
                  <Link key={n.key} to={`/audience/${n.key}`} className="group bg-white border border-gray-200 hover:border-brand-orange/40 hover:shadow-lg transition-all duration-300 p-6 flex flex-col relative">
                    {g.id === "researchers" && ni < g.nodes.length - 1 && (
                      <ArrowIcon className="hidden sm:block absolute top-1/2 -translate-y-1/2 -end-4 w-4 h-4 text-brand-muted z-10" />
                    )}
                    <span className="w-11 h-11 bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4 group-hover:bg-brand-orange group-hover:text-white transition-colors">
                      <n.icon className="w-5 h-5" strokeWidth={1.75} />
                    </span>
                    <span className="text-brand-orange text-[11px] font-bold tracking-[0.15em] uppercase mb-1.5 block">{n.tag}</span>
                    <h3 className="text-lg font-bold text-brand-ink mb-2">{n.title}</h3>
                    <p className="text-sm leading-relaxed text-brand-muted flex-1">{n.desc}</p>
                    <span className="mt-5 text-xs font-bold text-brand-muted group-hover:text-brand-orange transition-colors">{register(n.key).label}</span>
                    <CardArrow className="mt-3" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ═══════ 3) الموظفون ومقدّمو الخدمة ═══════ */}
      <section id="staff" className="bg-brand-ink py-14 md:py-16 scroll-mt-28">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex items-start gap-5">
            <span className="w-12 h-12 bg-brand-orange text-white flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5" strokeWidth={1.75} />
            </span>
            <div>
              <span className="text-brand-orange text-xs font-bold tracking-[0.3em] uppercase mb-2 block">{L("خارج الفئات الثلاث", "Outside the three audiences")}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">{L("موظفو المنصة ومقدّمو الخدمة", "Platform staff & service providers")}</h2>
              <p className="text-white/65 text-[15px] leading-relaxed max-w-2xl">
                {L("فرق التشغيل داخل المنصة والخبراء الذين ينفّذون خدمات التحكيم والتحرير والترجمة — لهم تسجيل خاص ولوحات مختلفة عن فئات المستفيدين.", "Operations teams inside the platform and the experts who deliver review, editing and translation services — they have their own registration and different dashboards from the beneficiary audiences.")}
              </p>
            </div>
          </div>
          <Link to="/staff" className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-6 py-3 text-sm font-bold hover:bg-white hover:text-brand-ink transition-colors flex-shrink-0 self-start lg:self-auto">
            {L("صفحة الموظفين ومقدّمي الخدمة", "Staff & providers page")}
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <CtaBand
        title={L("جاهز للانضمام؟ ابدأ من فئتك.", "Ready to join? Start from your audience.")}
        desc={L("اختر فئتك، اقرأ ما تقدمه لك المنصة، ثم أنشئ حسابك من صفحتها.", "Pick your audience, read what the platform offers you, then create your account from its page.")}
        primary={login}
        secondary={{ to: "/contact-us", label: t("nav.contact_us") }}
      />
    </>
  );
};

// ── عقدة في شجرة التبعية ──
const TreeNode = ({ to, icon: Icon, tone = "light", level, title, desc, badge }) => {
  const tones = {
    dark: "bg-brand-ink text-white border-brand-ink",
    orange: "bg-brand-orange text-white border-brand-orange",
    light: "bg-white text-brand-ink border-gray-200 hover:border-brand-orange/50",
    plain: "bg-brand-cream-hero text-brand-ink border-transparent",
  };
  const sub = tone === "dark" || tone === "orange" ? "text-white/70" : "text-brand-muted";
  const kicker = tone === "orange" ? "text-white/85" : "text-brand-orange";
  const body = (
    <div className={`border p-5 md:p-6 flex items-start gap-4 transition-colors ${tones[tone]}`}>
      <span className={`w-11 h-11 flex items-center justify-center flex-shrink-0 ${tone === "orange" ? "bg-white/15" : tone === "dark" ? "bg-brand-orange text-white" : "bg-brand-orange/10 text-brand-orange"}`}>
        <Icon className="w-5 h-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`text-[11px] font-bold tracking-[0.15em] uppercase ${kicker}`}>{level}</span>
          {badge && <span className="text-[11px] font-bold bg-brand-orange/10 text-brand-orange px-2 py-0.5">{badge}</span>}
        </div>
        <h3 className="text-lg font-bold leading-tight mb-1">{title}</h3>
        <p className={`text-[13px] leading-relaxed ${sub}`}>{desc}</p>
      </div>
    </div>
  );
  return to ? <Link to={to} className="block group">{body}</Link> : body;
};

const Connector = () => (
  <div className="relative ms-[41px] md:ms-[45px] h-9 w-0.5 bg-brand-orange/40">
    <ChevronDown className="absolute -bottom-1.5 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 w-4 h-4 text-brand-orange" />
  </div>
);

export default TargetAudiencePage;
