import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from "recharts";

// =========================================================
// لوحة الإحصائيات بجانب بطاقة المكوّن في الصفحة الرئيسية: 4 أرقام + رسم بياني
// (أعمدة أو خط) من src/source/S01_Home/homeStats.js — بلا عرض للمصادر على الموقع.
// =========================================================
const ORANGE = "#FF8710";
const INK = "#241B14";
const MUTED = "#9CA3AF";

const tooltipStyle = { borderRadius: 12, border: "1px solid #F3F4F6", fontSize: 12, boxShadow: "0 12px 30px -12px rgba(36,27,20,0.25)" };

const StatChart = ({ chart, isRTL }) => {
  const lang = isRTL ? "ar" : "en";
  if (chart.type === "line") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chart.data} margin={{ top: 12, right: 12, left: -14, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: MUTED, fontWeight: 600 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => v.toLocaleString(isRTL ? "ar-EG" : "en-US")} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 700 }} />
          {chart.series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s[`label_${lang}`]}
              stroke={i === 0 ? ORANGE : INK}
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }
  const data = chart.data.map((d) => ({ ...d, name: d[`name_${lang}`] }));
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 22, right: 8, left: -14, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="4 6" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: MUTED, fontWeight: 600 }} axisLine={false} tickLine={false} interval={0} />
        <YAxis tick={{ fontSize: 11, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={(v) => Number(v).toLocaleString("en-US")} />
        <Tooltip cursor={{ fill: "rgba(255,135,16,0.06)" }} contentStyle={tooltipStyle} formatter={(v) => `${Number(v).toLocaleString("en-US")}${chart.unit || ""}`} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48} label={{ position: "top", fontSize: 10, fontWeight: 700, fill: INK, formatter: (v) => `${Number(v).toLocaleString("en-US")}${chart.unit || ""}` }}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.highlight ? ORANGE : INK} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const HomeStatsPanel = ({ stats, isRTL }) => {
  if (!stats) return null;
  const lang = isRTL ? "ar" : "en";
  const charts = stats.charts || (stats.chart ? [stats.chart] : []);
  return (
    <div className="h-full flex flex-col gap-4">
      {/* الأرقام — بالبرتقالي (بطلب صريح) */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.tiles.map((st, i) => (
          <div key={i} className="rounded-2xl bg-white border-2 border-gray-200 hover:border-brand-orange hover:shadow-lg transition-all duration-300 p-4 md:p-5 flex flex-col overflow-hidden">
            <span dir="ltr" className="text-[28px] md:text-[32px] font-bold leading-none text-brand-orange text-start mb-2">{st.value}</span>
            <p className="text-[12px] md:text-[13px] font-semibold leading-relaxed text-brand-muted">{st[`label_${lang}`]}</p>
          </div>
        ))}
      </div>

      {/* الرسوم البيانية (واحد أو أكثر جنبًا إلى جنب) */}
      <div className={`grid gap-4 flex-1 ${charts.length > 1 ? "xl:grid-cols-2" : ""}`}>
        {charts.map((chart, i) => (
          <div key={i} className="rounded-2xl bg-white border-2 border-gray-200 p-5 md:p-6 flex flex-col min-h-[280px] overflow-hidden">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h4 className="text-sm md:text-[15px] font-bold text-brand-ink leading-snug">{chart[`title_${lang}`]}</h4>
              <span className="w-2.5 h-2.5 rounded-full bg-brand-orange mt-1.5 flex-shrink-0" />
            </div>
            <div className="flex-1 min-h-[200px]" dir="ltr">
              <StatChart chart={chart} isRTL={isRTL} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeStatsPanel;
