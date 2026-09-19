import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Languages,
  ShieldCheck,
  Sparkles,
  BookMarked,
  BarChart3
} from "lucide-react";

const Home = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  // بيانات الإحصائيات العامة
  const stats = [
    {
      title: isAr ? "إجمالي البحوث" : "Total Researches",
      value: "6",
      change: "+12.5%",
      trend: "up",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-500"
    },
    {
      title: isAr ? "نشاط الخدمات" : "Service Activity",
      value: "213",
      change: "+22.0%",
      trend: "up",
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-500"
    },
    {
      title: isAr ? "المهام الجديدة" : "New Tasks",
      value: "37",
      change: "+8.0%",
      trend: "up",
      icon: AlertCircle,
      color: "text-orange-600",
      bg: "bg-purple-50",
      border: "border-purple-500"
    },
    {
      title: isAr ? "المكتملة" : "Completed",
      value: "26",
      change: "-2.4%",
      trend: "down",
      icon: CheckCircle,
      color: "text-orange-600",
      bg: "bg-emerald-50",
      border: "border-emerald-500"
    },
  ];

  // بيانات تفاصيل الخدمات (إضافة جديدة)
  const servicesData = [
    {
      name: isAr ? "الترجمة" : "Translation",
      total: 13,
      completed: 8,
      color: "bg-orange-500",
      icon: Languages,
      trend: "+15%"
    },
    {
      name: isAr ? "التحكيم" : "Review",
      total: 320,
      completed: 145,
      color: "bg-orange-500",
      icon: ShieldCheck,
      trend: "+5%"
    },
    {
      name: isAr ? "المساعد الذكي" : "AI Assistant",
      total: 1200,
      completed: 1100,
      color: "bg-orange-500",
      icon: Sparkles,
      trend: "+40%"
    },
    {
      name: isAr ? "اختيار المجلة" : "Journal Selection",
      total: 85,
      completed: 60,
      color: "bg-orange-500",
      icon: BookMarked,
      trend: "+8%"
    },
    {
      name: isAr ? "التقييم" : "Evaluation",
      total: 60,
      completed: 25,
      color: "bg-orange-500",
      icon: BarChart3,
      trend: "+2%"
    }
  ];

  const recentActivities = [
    { id: 1, user: "Dr. Ahmed Ali", action: "قدم طلب ترجمة", time: "منذ 2 ساعة", status: "pending" },
    { id: 2, user: "Sara Smith", action: "أنهت مهمة تحكيم", time: "منذ 5 ساعات", status: "completed" },
    { id: 3, user: "Prof. John Doe", action: "نشر بحث جديد", time: "منذ يوم", status: "completed" },
    { id: 4, user: "Tech Support", action: "رد على استفسار", time: "منذ يومين", status: "pending" },
  ];

  return (
    <div className="w-full space-y-6 animate-[fade-in_0.4s_ease-out]">
      
      {/* العنوان */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAr ? "لوحة التحكم" : "Dashboard Overview"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isAr ? "مرحباً بك، إليك ملخص أدائك اليوم" : "Welcome back, here's your performance summary"}
          </p>
        </div>
        <button className="px-4 py-2 bg-white dark:bg-brand-dark-card border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm w-fit">
          {isAr ? "تصدير التقرير" : "Export Report"}
        </button>
      </div>

      {/* 1. بطاقات الإحصائيات (تم تكبيرها لملء الشاشة) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-2">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className="bg-white dark:bg-brand-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-brand-dark-border relative overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${stat.border.replace('border-', 'bg-')}`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                stat.trend === 'up' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
              <span className="text-xs text-gray-400">{isAr ? "مقارنة بالشهر الماضي" : "vs last month"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. الرسم البياني الرئيسي (عرض كامل) */}
      <div className="bg-white dark:bg-brand-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-brand-dark-border px-2">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {isAr ? "نظرة عامة على النشاط" : "Activity Overview"}
          </h3>
          <select className="bg-gray-50 dark:bg-brand-dark-hover border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg px-3 py-1.5 outline-none">
            <option>{isAr ? "آخر 6 أشهر" : "Last 6 Months"}</option>
            <option>{isAr ? "هذا العام" : "This Year"}</option>
          </select>
        </div>
        
        {/* محاكاة رسم بياني بـ CSS خالص */}
        <div className="h-64 w-full flex items-end justify-between gap-2 md:gap-4 px-2">
          {[40, 65, 30, 85, 55, 77].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full h-full bg-orange-100 dark:bg-orange-900/20 rounded-t-lg overflow-hidden group-hover:bg-orange-200 transition-colors">
                <div 
                  className="absolute bottom-0 w-full bg-orange-500 rounded-t-lg transition-all duration-1000 ease-out"
                  style={{ height: `${height}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. تفاصيل الخدمات (قسم جديد) */}
      <div className="bg-white dark:bg-brand-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-brand-dark-border px-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
          {isAr ? "أداء الخدمات التفصيلي" : "Service Performance Details"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
          {servicesData.map((service, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-brand-dark-border hover:border-gray-200 dark:hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${service.color.replace('bg-', 'bg-').replace('500', '50')} ${service.color.replace('bg-', 'text-').replace('500', '600')}`}>
                  <service.icon className="w-5 h-5" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{service.name}</h4>
                  <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> {service.trend}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{isAr ? "المنجز" : "Completed"}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{service.completed} / {service.total}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`${service.color} h-2 rounded-full transition-all duration-1000`}
                    style={{ width: `${(service.completed / service.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. القسم السفلي: جدول + رسم دائري */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 px-2">
        
        {/* الجدول (يسار، يأخذ 2/3 العرض) */}
        <div className="xl:col-span-2 bg-white dark:bg-brand-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-brand-dark-border overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-brand-dark-border flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {isAr ? "الأنشطة الحديثة" : "Recent Activity"}
            </h3>
            <Link to="tasks" className="text-sm text-brand-orange font-medium hover:underline">
              {isAr ? "عرض الكل" : "View All"}
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-brand-dark-hover/50">
                <tr>
                  <th className="px-6 py-3">{isAr ? "المستخدم" : "User"}</th>
                  <th className="px-6 py-3">{isAr ? "النشاط" : "Activity"}</th>
                  <th className="px-6 py-3">{isAr ? "الحالة" : "Status"}</th>
                  <th className="px-6 py-3">{isAr ? "الوقت" : "Time"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-brand-dark-border">
                {recentActivities.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {item.user}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {item.action}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        item.status === 'completed' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      }`}>
                        {item.status === 'completed' ? (isAr ? "مكتمل" : "Done") : (isAr ? "قيد الانتظار" : "Pending")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* الرسم الدائري (يمين، يأخذ 1/3 العرض) */}
        <div className="bg-white dark:bg-brand-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-brand-dark-border flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white w-full mb-6 text-left">
            {isAr ? "توزيع المهام" : "Tasks Distribution"}
          </h3>
          
          {/* محاكاة رسم دائري بـ CSS Conic Gradient */}
          <div className="relative w-48 h-48 rounded-full" 
               style={{
                 background: 'conic-gradient(#f97316 0% 65%, #3b82f6 65% 85%, #10b981 85% 100%)'
               }}>
            <div className="absolute inset-4 bg-white dark:bg-brand-dark-card rounded-full flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">856</span>
              <span className="text-xs text-gray-500">{isAr ? "الإجمالي" : "Total"}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-gray-600 dark:text-gray-300">{isAr ? "قيد التنفيذ" : "In Progress"}</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">65%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-gray-600 dark:text-gray-300">{isAr ? "قيد المراجعة" : "In Review"}</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">20%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-gray-600 dark:text-gray-300">{isAr ? "مكتمل" : "Completed"}</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">15%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;