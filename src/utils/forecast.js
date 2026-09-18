// =========================================================
// أدوات تحليلية بسيطة تُستخدم لتوليد "إحصائيات الذكاء الاصطناعي" من الأرقام
// المنشورة: اتجاه خطي بالمربعات الصغرى + نطاق ثقة تقريبي (±1.96 × الخطأ المعياري)،
// ومؤشر التركّز (هيرفندال). كل الأرقام تُحسب هنا — لا شيء مكتوب يدويًا.
// =========================================================

export const linearFit = (values) => {
  const n = values.length;
  const xs = values.map((_, i) => i);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = values.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  xs.forEach((x, i) => {
    sxy += (x - mx) * (values[i] - my);
    sxx += (x - mx) ** 2;
  });
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const predict = (x) => intercept + slope * x;
  const ssRes = values.reduce((s, y, i) => s + (y - predict(i)) ** 2, 0);
  const ssTot = values.reduce((s, y) => s + (y - my) ** 2, 0);
  const se = Math.sqrt(ssRes / Math.max(n - 2, 1));
  return { slope, intercept, predict, se, r2: ssTot ? 1 - ssRes / ssTot : 1, n };
};

// سلسلة للرسم: القيم الفعلية + التوقع للسنوات القادمة مع نطاق الثقة
export const buildForecast = (series, horizon = 3, { decimals = 0 } = {}) => {
  const values = series.map((d) => d.value);
  const fit = linearFit(values);
  const round = (v) => Number(v.toFixed(decimals));
  const lastYear = Number(series[series.length - 1].year);
  const points = series.map((d, i) => ({
    year: String(d.year),
    actual: d.value,
    // يبدأ خط التوقع من آخر نقطة فعلية ليتصل الخطان
    forecast: i === series.length - 1 ? d.value : null,
    band: i === series.length - 1 ? [d.value, d.value] : null,
  }));
  const future = [];
  for (let h = 1; h <= horizon; h += 1) {
    const x = values.length - 1 + h;
    const y = fit.predict(x);
    const margin = 1.96 * fit.se;
    const p = { year: String(lastYear + h), actual: null, forecast: round(y), band: [round(y - margin), round(y + margin)] };
    points.push(p);
    future.push(p);
  }
  return { points, future, fit };
};

// مؤشر هيرفندال–هيرشمان للتركّز (0 = موزّع تمامًا، 1 = مصدر واحد)
export const herfindahl = (values) => {
  const total = values.reduce((a, b) => a + b, 0);
  return values.reduce((s, v) => s + (v / total) ** 2, 0);
};

export const fmt = (v, decimals = 0) =>
  Number(v).toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
