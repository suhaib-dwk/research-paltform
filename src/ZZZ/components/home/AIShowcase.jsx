import { CheckCircle2, AlertCircle, Eye, Sparkles, Gauge } from "lucide-react";

export default function AIShowcase({ isAr }) {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        {/* Section title */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-brand-orange font-semibold text-sm tracking-wide">
            {isAr ? "الذكاء الاصطناعي" : "Artificial Intelligence"}
          </span>
          <h2
            className="text-3xl md:text-4xl font-normal text-brand-ink mt-3 mb-4"
            style={{ fontFamily: "var(--font-ar)" }}
          >
            {isAr
              ? "ذكاء اصطناعي يفهم البحث العلمي"
              : "AI That Understands Research"}
          </h2>
          <p className="text-brand-muted leading-relaxed">
            {isAr
              ? "تُسرّع خوارزمياتنا مطابقة الأدلة واكتشاف الفجوات البحثية خلال ثوانٍ، مع إبقاء الإنسان دائمًا في موقع القرار النهائي للحالات الحساسة."
              : "Our engine accelerates evidence matching and gap detection in seconds, while keeping a human firmly in the loop for every sensitive decision."}
          </p>
        </div>

        {/* Sub-section A: Confidence bands visual */}
        <div className="max-w-5xl mx-auto">
          {/* Gauge bar */}
          <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-brand-orange to-gray-300 mb-6" />

          <div className="flex flex-col md:flex-row gap-4">
            {/* Segment 1: Auto-Accepted */}
            <div className="flex-1 bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-semibold">≥ 90%</span>
              </div>
              <h3 className="font-bold text-lg mb-2">
                {isAr ? "قبول تلقائي" : "Auto-Accepted"}
              </h3>
              <p className="text-sm leading-relaxed">
                {isAr
                  ? "يُقبل تلقائياً مع تسجيل كامل للتدقيق"
                  : "Accepted automatically, with a full audit trail"}
              </p>
            </div>

            {/* Segment 2: Human Confirmation */}
            <div className="flex-1 bg-brand-orange/10 border border-brand-orange text-brand-orange rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">60–90%</span>
              </div>
              <h3 className="font-bold text-lg mb-2">
                {isAr ? "تأكيد بشري" : "Human Confirmation"}
              </h3>
              <p className="text-sm leading-relaxed">
                {isAr
                  ? "يُقترح على الخبير للتأكيد قبل الاعتماد"
                  : "Flagged for expert confirmation before approval"}
              </p>
            </div>

            {/* Segment 3: Manual Review */}
            <div className="flex-1 bg-gray-50 border border-gray-300 text-gray-600 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5" />
                <span className="text-sm font-semibold">&lt; 60%</span>
              </div>
              <h3 className="font-bold text-lg mb-2">
                {isAr ? "مراجعة يدوية" : "Manual Review"}
              </h3>
              <p className="text-sm leading-relaxed">
                {isAr
                  ? "يُحال مباشرة لمراجعة بشرية كاملة"
                  : "Routed directly to a full human review"}
              </p>
            </div>
          </div>

          <p className="text-xs text-brand-muted text-center mt-4">
            {isAr
              ? "حتى المطابقات عالية الثقة تخضع لتدقيق، القرار النهائي دائمًا قابل للتتبع"
              : "Even high-confidence matches are logged, every decision stays traceable."}
          </p>
        </div>

        {/* Sub-section B: Existing AI features */}
        <div className="max-w-5xl mx-auto mt-16 flex flex-col md:flex-row gap-6">
          {/* Card 1: Academic AI Assistant */}
          <div className="flex-1 bg-brand-cream-hero rounded-lg p-6">
            <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-brand-ink mb-2">
              {isAr ? "المساعد الذكي الأكاديمي" : "Academic AI Assistant"}
            </h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              {isAr
                ? "يساعد الباحثين في صياغة العناوين، تحسين النصوص الأكاديمية، وتقديم إرشاد منهجي"
                : "Helps researchers draft titles, refine academic writing, and get methodological guidance"}
            </p>
          </div>

          {/* Card 2: Smart Readiness Assessment */}
          <div className="flex-1 bg-brand-cream-hero rounded-lg p-6">
            <div className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-4">
              <Gauge className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-brand-ink mb-2">
              {isAr ? "تقييم الجاهزية الذكي" : "Smart Readiness Assessment"}
            </h3>
            <p className="text-sm text-brand-muted leading-relaxed">
              {isAr
                ? "يحلل بيانات الجامعة فوريًا ويحدد نقاط القوة والفجوات الحرجة تجاه الاعتماد والتصنيف"
                : "Instantly analyzes university data to surface strengths and critical gaps toward accreditation and ranking"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
