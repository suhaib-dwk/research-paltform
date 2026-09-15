import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  // General
  BarChart3, FileText, Users, Map, Layers, Target, Award, Globe,
  // Partnerships
  Network, Handshake, FileSignature,
  // Funding
  Coins, Briefcase, TrendingUp,
  // System
  Database, ShieldAlert, Download, Filter, Plus, Search, Eye,
  MoreHorizontal, Calendar, AlertTriangle, CheckCircle2
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

// =========================================================
// الثوابت والألوان
// =========================================================
const COLORS = ['#c8a44e', '#0a1628', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

// بيانات وهمية للعرض (Mock Data)
const MOCK_DATA = {
  nationalTrend: [
    { year: '2020', pubs: 1200, funding: 15 },
    { year: '2021', pubs: 1450, funding: 18 },
    { year: '2022', pubs: 1800, funding: 22 },
    { year: '2023', pubs: 2100, funding: 28 },
    { year: '2024', pubs: 2400, funding: 35 },
  ],
  sectors: [
    { id: 1, name: 'Health', name_ar: 'الصحة', coverage: 82, gap: 'Low', priority: 'High' },
    { id: 2, name: 'Energy', name_ar: 'الطاقة', coverage: 45, gap: 'High', priority: 'Critical' },
    { id: 3, name: 'Water', name_ar: 'المياه', coverage: 60, gap: 'Medium', priority: 'High' },
    { id: 4, name: 'Agriculture', name_ar: 'الزراعة', coverage: 70, gap: 'Medium', priority: 'Medium' },
    { id: 5, name: 'Digital', name_ar: 'التحول الرقمي', coverage: 30, gap: 'Critical', priority: 'Critical' },
  ],
  partners: [
    { name: 'ALECSO', type: 'Regional', status: 'Active', logo: 'A' },
    { name: 'UNESCO', type: 'International', status: 'Active', logo: 'U' },
    { name: 'Ministry of Health', type: 'National', status: 'Active', logo: 'M' },
    { name: 'Local Industry', type: 'Private', status: 'Negotiating', logo: 'L' },
  ],
  opportunities: [
    { id: 101, title: 'Green Energy Grant', funder: 'EU Horizon', deadline: '2024-12-01', amount: '€500k', match: 95 },
    { id: 102, title: 'AI in Healthcare', funder: 'WHO', deadline: '2025-01-15', amount: '$200k', match: 88 },
    { id: 103, title: 'Water Desalination', funder: 'National Fund', deadline: '2024-11-20', amount: 'LYD 1M', match: 92 },
  ]
};

// =========================================================
// مكونات مشتركة (Shared Components)
// =========================================================
const PageHeader = ({ title, subtitle, icon: Icon, actions }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div className="flex items-center gap-3">
      <div className="p-3 bg-[#c8a44e]/10 text-[#c8a44e] rounded-2xl">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl font-black text-[#0a1628]">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
    {actions && (
      <div className="flex gap-2">
        {actions}
      </div>
    )}
  </div>
);

const StatCard = ({ label, value, icon: Icon, trend, color = "text-[#c8a44e]" }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
    <div className={`w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-black text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </div>
    {trend && (
      <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
        +{trend}%
      </span>
    )}
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-80">
    <h3 className="text-sm font-bold text-gray-700 mb-4">{title}</h3>
    <div className="h-64 w-full">{children}</div>
  </div>
);

// =========================================================
// 1. National Dashboard
// =========================================================
export const MinistryNationalDashboard = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader 
        title={isAr ? 'اللوحة الوطنية' : 'National Dashboard'} 
        subtitle={isAr ? 'نظرة شاملة على حالة البحث العلمي في الدولة' : 'Overview of national research status'}
        icon={BarChart3}
        actions={
          <button className="flex items-center gap-2 bg-[#0a1628] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#1a2744] transition-colors">
            <Download className="w-4 h-4" />
            {isAr ? 'تصدير التقرير' : 'Export Report'}
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={isAr ? 'إجمالي الباحثين' : 'Total Researchers'} value="12,450" icon={Users} trend={5.2} color="text-blue-600" />
        <StatCard label={isAr ? 'المنشورات العلمية' : 'Publications'} value="3,240" icon={FileText} trend={8.1} color="text-purple-600" />
        <StatCard label={isAr ? 'ميزانية البحث' : 'Research Budget'} value="$45M" icon={Coins} trend={12.5} color="text-emerald-600" />
        <StatCard label={isAr ? 'المشاريع النشطة' : 'Active Projects'} value="850" icon={Target} trend={2.1} color="text-orange-600" />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartCard title={isAr ? 'اتجاه النشر والتمويل' : 'Publications & Funding Trend'}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA.nationalTrend}>
                <defs>
                  <linearGradient id="colorPubs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0a1628" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0a1628" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area yAxisId="left" type="monotone" dataKey="pubs" stroke="#0a1628" fillOpacity={1} fill="url(#colorPubs)" name={isAr ? 'منشورات' : 'Pubs'} />
                <Line yAxisId="right" type="monotone" dataKey="funding" stroke="#c8a44e" strokeWidth={2} name={isAr ? 'تمويل (مليون)' : 'Funding (M)'} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartCard title={isAr ? 'توزيع الجامعات' : 'University Distribution'}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{name: 'Public', value: 400}, {name: 'Private', value: 300}]} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                    <Cell fill="#0a1628" />
                    <Cell fill="#c8a44e" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title={isAr ? 'التعاون الدولي' : 'International Collaboration'}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{name: '2023', collab: 30}, {name: '2024', collab: 45}]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Bar dataKey="collab" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Alerts & Priority Quick View */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              {isAr ? 'تنبيهات هامة' : 'Critical Alerts'}
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-xs font-bold text-red-700">{isAr ? 'فجوة تمويل حرجة' : 'Critical Funding Gap'}</p>
                <p className="text-[10px] text-red-600">{isAr ? 'قطاع الطاقة يعاني من نقص 40% في التمويل' : 'Energy sector lacks 40% funding'}</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-xs font-bold text-amber-700">{isAr ? 'انخفاض الإنتاج' : 'Output Decline'}</p>
                <p className="text-[10px] text-amber-600">{isAr ? 'الجامعة الغربية انخفض إنتاجها بنسبة 15%' : 'West Univ output down 15%'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
             <h3 className="font-bold text-gray-800 mb-4">{isAr ? 'أهم الأولويات' : 'Top Priorities'}</h3>
             <div className="space-y-4">
                {MOOCK_DATA.sectors.slice(0,3).map(sec => (
                   <div key={sec.id}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold text-gray-700">{isAr ? sec.name_ar : sec.name}</span>
                        <span className="text-[#c8a44e]">{sec.coverage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#c8a44e] h-1.5 rounded-full" style={{width: `${sec.coverage}%`}}></div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// 2. University Comparison
// =========================================================
export const MinistryUniversityComparison = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={isAr ? 'مقارنة الجامعات' : 'University Comparison'} 
        icon={BarChart3}
      />
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 overflow-x-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
          <Filter className="w-4 h-4" />
          {isAr ? 'المنطقة: كل المناطق' : 'Region: All Regions'}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
          <Layers className="w-4 h-4" />
          {isAr ? 'الحجم: كل الأحجام' : 'Size: All Sizes'}
        </div>
      </div>

      {/* Comparison Table/Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">U{i}</div>
              <div>
                <h3 className="font-bold text-gray-800">{isAr ? `الجامعة ${i}` : `University ${i}`}</h3>
                <p className="text-xs text-gray-500">{isAr ? 'عام' : 'Public'}</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">#{i}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-500">{isAr ? 'الإنتاج' : 'Output'}</span>
                <span className="font-bold">450</span>
              </div>
              <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-500">{isAr ? 'التمويل' : 'Funding'}</span>
                <span className="font-bold">$5M</span>
              </div>
              <div className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <span className="text-gray-500">{isAr ? 'التعاون' : 'Collaboration'}</span>
                <span className="font-bold">20%</span>
              </div>
              <button className="w-full mt-2 py-2 text-xs font-bold text-[#c8a44e] border border-[#c8a44e] rounded-lg hover:bg-[#c8a44e] hover:text-white transition-colors">
                {isAr ? 'عرض التفاصيل' : 'View Details'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================
// 3. Geographic Intelligence
// =========================================================
export const MinistryGeographicMap = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={isAr ? 'الخريطة البحثية' : 'Geographic Intelligence'} 
        subtitle={isAr ? 'تحليل مكاني للنشاط البحثي حسب البلديات' : 'Spatial analysis of research by municipality'}
        icon={Map}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Map Area (Placeholder) */}
        <div className="lg:col-span-3 bg-gray-100 rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-200">
           <div className="text-center">
             <Map className="w-16 h-16 text-gray-300 mx-auto mb-2" />
             <p className="text-gray-500 font-bold">{isAr ? 'محرك الخريطة (MapLibre/Leaflet)' : 'Map Engine Placeholder'}</p>
             <p className="text-xs text-gray-400 mt-1">{isAr ? 'يدعم طبقات البلديات والمناطق القابلة للتهيئة' : 'Supports configurable layers'}</p>
           </div>
           {/* Mock Region Pins */}
           <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-[#c8a44e] rounded-full animate-bounce"></div>
           <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-75"></div>
        </div>

        {/* Regional Stats Sidebar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 overflow-y-auto space-y-4">
           <h3 className="font-bold text-gray-800 border-b pb-2">{isAr ? 'إحصائيات المناطق' : 'Regional Stats'}</h3>
           {['Tripoli', 'Benghazi', 'Misrata', ' Sabha'].map((city, idx) => (
             <div key={idx} className="p-3 bg-gray-50 rounded-lg hover:bg-[#c8a44e]/5 transition-colors cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                   <span className="font-bold text-sm text-gray-800">{city}</span>
                   <span className="text-xs bg-white px-2 py-0.5 rounded shadow-sm text-gray-600">Act</span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                   <span>{isAr ? 'باحثين:' : 'Researchers:'} 120</span>
                   <span>{isAr ? 'مشاريع:' : 'Projects:'} 15</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// =========================================================
// 4. Research Fields
// =========================================================
export const MinistryResearchFields = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={isAr ? 'المجالات البحثية' : 'Research Fields'} 
        icon={Layers}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Medicine', name_ar: 'الطب', count: 850, trend: 'up' },
          { name: 'Engineering', name_ar: 'الهندسة', count: 720, trend: 'stable' },
          { name: 'IT', name_ar: 'تقنية المعلومات', count: 450, trend: 'up' },
          { name: 'Agriculture', name_ar: 'الزراعة', count: 300, trend: 'down' },
        ].map((field, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#c8a44e]/30 transition-all cursor-pointer">
             <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-800">{isAr ? field.name_ar : field.name}</h3>
                {field.trend === 'up' ? <TrendingUp className="w-5 h-5 text-emerald-500" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
             </div>
             <div className="text-3xl font-black text-[#0a1628] mb-2">{field.count}</div>
             <div className="text-xs text-gray-500">{isAr ? 'منشور علمي في هذا المجال' : 'Publications in this field'}</div>
             
             <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">AI</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">IoT</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================
// 5. Policy Intelligence
// =========================================================
export const MinistryPolicyIntelligence = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={isAr ? 'الذكاء السياسي' : 'Policy Intelligence'} 
        subtitle={isAr ? 'تحليلات لدعم القرارات الوزارية' : 'Analytics to support ministerial decisions'}
        icon={FileText}
        actions={
          <button className="flex items-center gap-2 bg-[#c8a44e] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#b08d40] transition-colors">
            <Plus className="w-4 h-4" />
            {isAr ? 'إنشاء سيناريو' : 'New Scenario'}
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Policy Packs */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800">{isAr ? 'حزم السياسات المنجزة' : 'Completed Policy Packs'}</h3>
          {[1, 2].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm text-gray-800">{isAr ? 'سياسة دعم الطاقة المتجددة' : 'Renewable Energy Support Policy'}</h4>
                <p className="text-xs text-gray-500 mt-1">{isAr ? 'تم التحديث: 2 أيام مضت' : 'Updated: 2 days ago'}</p>
              </div>
              <button className="text-gray-400 hover:text-[#c8a44e]"><Eye className="w-5 h-5" /></button>
            </div>
          ))}
        </div>

        {/* Active Scenarios */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-800">{isAr ? 'السيناريوهات النشطة' : 'Active Scenarios'}</h3>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
             <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-sm text-orange-800">{isAr ? 'تأثير زيادة تمويل الصحة' : 'Impact of Health Funding Increase'}</h4>
                <span className="text-xs bg-white text-orange-600 px-2 py-0.5 rounded-full">Running</span>
             </div>
             <p className="text-xs text-orange-700">{isAr ? 'جاري حساب التأثير المتوقع على مخرجات الأبحاث...' : 'Calculating expected impact on research outputs...'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// 6. Sectors & Priorities
// =========================================================
export const MinistrySectors = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={isAr ? 'القطاعات والأولويات' : 'Sectors & Priorities'} 
        icon={Target}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_DATA.sectors.map(sec => (
          <div key={sec.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-[#0a1628]">{isAr ? sec.name_ar : sec.name}</h3>
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                sec.priority === 'Critical' ? 'bg-red-100 text-red-700' : 
                sec.priority === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {sec.priority}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{isAr ? 'مؤشر الأولوية' : 'Priority Index'}</span>
                  <span className="font-bold">{sec.coverage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-[#0a1628] h-2 rounded-full" style={{width: `${sec.coverage}%`}}></div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertTriangle className={`w-4 h-4 ${sec.gap === 'High' ? 'text-red-500' : 'text-amber-500'}`} />
                <span>{isAr ? `فجوة: ${sec.gap}` : `Gap: ${sec.gap}`}</span>
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-2">
                 <button className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 py-2 rounded-lg transition-colors">
                    {isAr ? 'تحليل الفجوة' : 'Gap Analysis'}
                 </button>
                 <button className="flex-1 text-xs bg-[#c8a44e] text-white hover:bg-[#b08d40] py-2 rounded-lg transition-colors">
                    {isAr ? 'عرض المشاريع' : 'View Projects'}
                 </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================
// 7. Partnerships
// =========================================================
export const MinistryPartnerships = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={isAr ? 'شبكة الشركاء' : 'Partners Network'} 
        icon={Network}
        actions={
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
            <Handshake className="w-4 h-4" />
            {isAr ? 'إضافة شريك' : 'Add Partner'}
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Graph Placeholder */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 h-96 flex items-center justify-center relative">
           <Network className="w-24 h-24 text-gray-200 absolute" />
           <div className="z-10 text-center">
              <p className="font-bold text-gray-600">{isAr ? 'شبكة العلاقات' : 'Relationship Graph'}</p>
              <p className="text-xs text-gray-400">{isAr ? 'تصور بصري للشراكات الداخلية والخارجية' : 'Visual of internal and external partnerships'}</p>
           </div>
        </div>

        {/* Partner List */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 h-96 overflow-y-auto">
           <h3 className="font-bold text-gray-800 mb-2">{isAr ? 'أحدث الشركاء' : 'Recent Partners'}</h3>
           {MOCK_DATA.partners.map((p, i) => (
             <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-600 text-xs">{p.logo}</div>
                   <div>
                      <p className="text-sm font-bold text-gray-800">{p.name}</p>
                      <p className="text-[10px] text-gray-500">{p.type}</p>
                   </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export const MinistryAgreements = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={isAr ? 'إدارة الاتفاقيات' : 'Agreements Management'} 
        icon={FileSignature}
      />
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
             <tr>
               <th className="p-4 text-xs font-bold text-gray-500 uppercase">{isAr ? 'الشريك' : 'Partner'}</th>
               <th className="p-4 text-xs font-bold text-gray-500 uppercase">{isAr ? 'الموضوع' : 'Subject'}</th>
               <th className="p-4 text-xs font-bold text-gray-500 uppercase">{isAr ? 'الحالة' : 'Status'}</th>
               <th className="p-4 text-xs font-bold text-gray-500 uppercase">{isAr ? 'الإجراء' : 'Action'}</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[1,2,3].map(i => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold text-sm text-gray-800">Organization {i}</td>
                <td className="p-4 text-sm text-gray-600">{isAr ? 'بحث مشترك في الطاقة' : 'Joint Energy Research'}</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Active</span>
                </td>
                <td className="p-4 text-[#c8a44e] cursor-pointer hover:underline text-sm font-bold">{isAr ? 'التفاصيل' : 'Details'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =========================================================
// 8. Funding
// =========================================================
export const MinistryFunding = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={isAr ? 'فرص التمويل' : 'Funding Opportunities'} 
        icon={Coins}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         <StatCard label={isAr ? 'فرص متاحة' : 'Open Calls'} value="12" icon={Briefcase} />
         <StatCard label={isAr ? 'إجمالي الميزانية' : 'Total Budget'} value="$2.5M" icon={Coins} />
         <StatCard label={isAr ? 'تطابقات ناجحة' : 'Successful Matches'} value="45" icon={CheckCircle2} color="text-emerald-600" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
           <div className="relative flex-1">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
             <input type="text" placeholder={isAr ? "بحث عن فرصة..." : "Search opportunity..."} className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#c8a44e]" />
           </div>
           <button className="bg-[#0a1628] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
             <Filter className="w-4 h-4" />
             {isAr ? 'فلتر' : 'Filter'}
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
               <tr>
                 <th className="p-4 text-xs font-bold text-gray-500 uppercase">{isAr ? 'العنوان' : 'Title'}</th>
                 <th className="p-4 text-xs font-bold text-gray-500 uppercase">{isAr ? 'الممول' : 'Funder'}</th>
                 <th className="p-4 text-xs font-bold text-gray-500 uppercase">{isAr ? 'المبلغ' : 'Amount'}</th>
                 <th className="p-4 text-xs font-bold text-gray-500 uppercase">{isAr ? 'الموعد النهائي' : 'Deadline'}</th>
                 <th className="p-4 text-xs font-bold text-gray-500 uppercase">{isAr ? 'التطابق' : 'Match %'}</th>
                 <th className="p-4 text-xs font-bold text-gray-500 uppercase">{isAr ? 'إجراء' : 'Action'}</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_DATA.opportunities.map(opp => (
                <tr key={opp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-sm text-gray-800">{opp.title}</td>
                  <td className="p-4 text-sm text-gray-600">{opp.funder}</td>
                  <td className="p-4 text-sm font-bold text-[#c8a44e]">{opp.amount}</td>
                  <td className="p-4 text-sm text-gray-600 flex items-center gap-1"><Calendar className="w-3 h-3" /> {opp.deadline}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{opp.match}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{width: `${opp.match}%`}}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="text-xs bg-[#c8a44e] text-white px-3 py-1.5 rounded-lg hover:bg-[#b08d40] transition-colors">
                      {isAr ? 'عرض التطابق' : 'View Match'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// 9. System / Data Governance
// =========================================================
export const MinistryDataGovernance = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="space-y-6">
      <PageHeader 
        title={isAr ? 'حوكمة البيانات' : 'Data Governance'} 
        subtitle={isAr ? 'إدارة مصادر البيانات والصلاحيات والجودة' : 'Manage data sources, permissions, and quality'}
        icon={Database}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sources */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
             <ShieldAlert className="w-5 h-5 text-blue-600" />
             {isAr ? 'مصادر البيانات النشطة' : 'Active Data Sources'}
          </h3>
          <div className="space-y-3">
             {['University of Tripoli', 'Ministry of Health', 'External API (Scopus)'].map((src, i) => (
               <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{src}</span>
                  <span className="flex items-center gap-1 text-xs text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" /> Synced
                  </span>
               </div>
             ))}
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
             <FileText className="w-5 h-5 text-gray-500" />
             {isAr ? 'سجل التدقيق الأخير' : 'Recent Audit Log'}
          </h3>
          <div className="space-y-2 text-xs font-mono text-gray-600 bg-gray-900 text-green-400 p-4 rounded-xl overflow-y-auto h-48">
             <p>[10:00 AM] Admin updated priority weights</p>
             <p>[09:45 AM] Data ingestion from Univ #2 completed</p>
             <p>[09:30 AM] User access denied (Role: Undergrad)</p>
             <p>[09:15 AM] New Funding Opportunity added</p>
          </div>
        </div>
      </div>
    </div>
  );
};