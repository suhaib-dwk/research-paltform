import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  // General & Analytics
  BarChart3, Globe, Users, TrendingUp, Activity, Layers, Target,
  // Warning & Status
  AlertTriangle, ShieldCheck, Info,
  // Actions
  Download, Filter, ArrowUpRight, Eye, RefreshCw,
  // Specifics
  MapPin, Coins, FileText, GraduationCap
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useSite } from '../../../SiteContext';

// =========================================================
// الثوابت والبيانات (Mock Data)
// =========================================================
const COLORS = {
  primary: '#e8623a',
  secondary: '#0a1628',
  accent: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6'
};

const NATIONAL_TREND_DATA = [
  { year: '2019', publications: 850, funding: 12, impact: 1.2 },
  { year: '2020', publications: 1100, funding: 15, impact: 1.5 },
  { year: '2021', publications: 1450, funding: 22, impact: 1.8 },
  { year: '2022', publications: 1800, funding: 28, impact: 2.1 },
  { year: '2023', publications: 2100, funding: 35, impact: 2.4 },
  { year: '2024', publications: 2400, funding: 42, impact: 2.8 },
];

const RESEARCH_FIELDS_DATA = [
  { name: 'Engineering', value: 400, color: COLORS.primary },
  { name: 'Medicine', value: 350, color: COLORS.accent },
  { name: 'Science', value: 300, color: COLORS.secondary },
  { name: 'Agriculture', value: 200, color: COLORS.success },
  { name: 'Humanities', value: 150, color: COLORS.warning },
];

const REGIONAL_DATA = [
  { region: 'Tripoli', pubs: 850, rank: 1 },
  { region: 'Benghazi', pubs: 620, rank: 2 },
  { region: 'Misrata', pubs: 450, rank: 3 },
  { region: 'Sebha', pubs: 220, rank: 4 },
  { region: 'Zawiya', pubs: 180, rank: 5 },
];

const CRITICAL_ALERTS = [
  { id: 1, type: 'critical', title: 'Energy Sector Gap', desc: 'Research output is 40% below national targets.', time: '2h ago' },
  { id: 2, type: 'warning', title: 'Funding Delay', desc: 'Disbursement for Q3 grants pending.', time: '5h ago' },
];

const PRIORITY_STATUS = [
  { name: 'Water', coverage: 45, target: 80, status: 'Critical' },
  { name: 'Energy', coverage: 60, target: 90, status: 'High' },
  { name: 'Health', coverage: 85, target: 85, status: 'On Track' },
];

// =========================================================
// المكونات الفرعية (Sub-components)
// =========================================================
const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-[#1a1613]/60 border border-gray-100 dark:border-[#3a322c]/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color}`.split(' ')[1]}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      {trend && (
        <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowUpRight className="w-3 h-3 mr-1 rotate-180" />}
          {trendValue}%
        </span>
      )}
    </div>
    <div>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{value}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
    </div>
  </motion.div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white dark:bg-[#1a1613]/60 border border-gray-100 dark:border-[#3a322c]/40 rounded-2xl p-6 shadow-sm ${className}`}>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wide">{title}</h3>
      <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#3a322c]/50 rounded-lg text-gray-400 transition-colors">
        <Filter className="w-4 h-4" />
      </button>
    </div>
    {children}
  </div>
);

const AlertCard = ({ alert }) => {
  const isCritical = alert.type === 'critical';
  return (
    <div className={`p-4 rounded-xl border ${isCritical ? 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-800' : 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800'}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">{alert.title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{alert.desc}</p>
          <p className="text-[10px] text-gray-400 mt-2">{alert.time}</p>
        </div>
      </div>
    </div>
  );
};

// =========================================================
// المكون الرئيسي
// =========================================================
const MinistryNationalDashboard = () => {
  const { t, i18n } = useTranslation();
  const { currentLang, isRTL } = useSite();
  const isAr = currentLang === 'ar';

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      
      {/* ========================================= */}
      {/* 1. رأس الصفحة (Page Header) */}
      {/* ========================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[#e8623a]" />
            {isAr ? 'لوحة الذكاء البحثي الوطني' : 'National Research Intelligence'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isAr ? 'نظرة شاملة على حالة البحث العلمي، الأولويات، وأداء القطاعات' : 'Overview of research status, priorities, and sector performance'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0a1628] text-white rounded-xl text-sm font-bold hover:bg-[#1a2744] transition-colors shadow-lg">
            <Download className="w-4 h-4" />
            {isAr ? 'تصدير التقرير' : 'Export Report'}
          </button>
          <button 
            onClick={handleRefresh}
            className="p-2.5 bg-white dark:bg-[#211c18] border border-gray-200 dark:border-[#3a322c] text-gray-500 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a231e] transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin text-[#e8623a]' : ''}`} />
          </button>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. بطاقات المؤشرات الرئيسية (KPI Cards) */}
      {/* ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={isAr ? 'إجمالي الباحثين' : 'Total Researchers'} 
          value="12,450" 
          icon={Users} 
          trend={5.2} 
          trendValue="5.2%"
          color="text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20"
        />
        <StatCard 
          title={isAr ? 'المنشورات العلمية' : 'Scientific Publications'} 
          value="3,240" 
          icon={FileText} 
          trend={8.1} 
          trendValue="8.1%"
          color="text-[#e8623a] bg-[#e8623a]/10 dark:text-[#f0916d] dark:bg-[#e8623a]/10"
        />
        <StatCard 
          title={isAr ? 'ميزانية البحث' : 'Research Budget'} 
          value="$45M" 
          icon={Coins} 
          trend={12.5} 
          trendValue="12%"
          color="text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20"
        />
        <StatCard 
          title={isAr ? 'معامل التأثير' : 'Impact Factor'} 
          value="2.4" 
          icon={TrendingUp} 
          trend={2.1} 
          trendValue="2.1%"
          color="text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20"
        />
      </div>

      {/* ========================================= */}
      {/* 3. المحتوى الرئيسي (Grid Layout) */}
      {/* ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* العمود الأيمن (Charts & Analysis) - 2/3 Width */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* أ) مؤشر الاتجاه الوطني (National Trend) */}
          <ChartCard title={isAr ? 'الاتجاه الوطني (النشر والتمويل)' : 'National Trend (Pubs & Funding)'}>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={NATIONAL_TREND_DATA} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPubs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                  <Tooltip cursor={{ stroke: COLORS.primary, strokeWidth: 2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="publications" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorPubs)" name={isAr ? 'منشورات' : 'Publications'} />
                  <Line yAxisId="right" type="monotone" dataKey="funding" stroke="#10b981" strokeWidth={2} dot={false} name={isAr ? 'تمويل' : 'Funding'} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* ب) توزيع المجالات (Field Distribution) */}
          <ChartCard title={isAr ? 'توزيع البحث العلمي (حسب المجال)' : 'Research Distribution by Field'}>
            <div className="h-64 w-full flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={RESEARCH_FIELDS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {RESEARCH_FIELDS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend Custom */}
              <div className="hidden sm:flex flex-col gap-2 text-xs">
                {RESEARCH_FIELDS_DATA.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* ج) أداء المناطق (Regional Performance) */}
          <ChartCard title={isAr ? 'أداء المناطق (Top 5)' : 'Regional Performance (Top 5)'}>
            <div className="space-y-3">
              {REGIONAL_DATA.map((region, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 text-xs font-bold text-gray-500">{region.region}</div>
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-[#3a322c]/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${(region.pubs / 900) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-gradient-to-r from-[#e8623a] to-[#f0916d]"
                    />
                  </div>
                  <div className="w-12 text-right text-xs font-bold text-gray-900 dark:text-white">{region.pubs}</div>
                  <div className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-[#3a322c]/30 rounded text-xs font-bold text-gray-500">
                    {region.rank}
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

        </div>

        {/* العمود الأيسر (Intelligence, Alerts, Map) - 1/3 Width */}
        <div className="space-y-6">
          
          {/* 1) الذكاء التنبيهي (Critical Alerts) */}
          <div className="bg-white dark:bg-[#1a1613]/60 border border-gray-100 dark:border-[#3a322c]/40 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                {isAr ? 'تنبيهات هامة' : 'Critical Alerts'}
              </h3>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            </div>
            <div className="space-y-3">
              {CRITICAL_ALERTS.map(alert => <AlertCard key={alert.id} alert={alert} />)}
            </div>
          </div>

          {/* 2) تغطية الأولويات (Priority Coverage) */}
          <div className="bg-white dark:bg-[#1a1613]/60 border border-gray-100 dark:border-[#3a322c]/40 rounded-2xl p-5">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-bold text-gray-800 dark:text-white">{isAr ? 'تغطية الأولويات' : 'Priority Coverage'}</h3>
               <Target className="w-4 h-4 text-[#e8623a]" />
             </div>
             <div className="space-y-4">
               {PRIORITY_STATUS.map((item, i) => (
                 <div key={i} className="group">
                    <div className="flex justify-between text-xs mb-1.5">
                       <span className="font-bold text-gray-700 dark:text-gray-300">{item.name}</span>
                       <span className={`font-bold ${item.status === 'Critical' ? 'text-red-500' : item.status === 'High' ? 'text-amber-500' : 'text-emerald-500'}`}>
                         {item.coverage}%
                       </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-[#3a322c]/30 rounded-full h-2 relative">
                       <div 
                         className={`h-2 rounded-full transition-all duration-1000 ${item.status === 'Critical' ? 'bg-red-500' : item.status === 'High' ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                         style={{width: `${item.coverage}%`}}
                       ></div>
                       {/* Goal Marker */}
                       <div 
                         className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10 border-l border-r border-white dark:border-[#1a1613]" 
                         style={{left: `${(item.target / 100) * 100}%`}}
                         title="Target"
                       ></div>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 flex justify-between">
                       <span>{isAr ? 'الحالي' : 'Current'}</span>
                       <span>{isAr ? 'الهدف' : 'Target'}</span>
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* 3) الخريطة البحثية (Map Placeholder) */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-1 overflow-hidden relative group cursor-pointer min-h-[250px]">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-20" 
                 style={{backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
            </div>
            
            {/* Map Visual Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-center z-10">
                 <Globe className="w-12 h-12 text-white/30 mx-auto mb-3" />
                 <h3 className="text-white font-bold text-lg">{isAr ? 'الخريطة البحثية' : 'Research Map'}</h3>
                 <p className="text-gray-400 text-xs mt-1 px-4">{isAr ? 'تحليل مكاني للنشاط البحثي' : 'Spatial Analysis of Activity'}</p>
                 <button className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 mx-auto">
                   <Eye className="w-3 h-3" />
                   {isAr ? 'عرض التفاصيل' : 'View Details'}
                 </button>
               </div>
            </div>

            {/* Animated "Hotspots" */}
            {[1,2,3].map(i => (
              <motion.div 
                key={i}
                className="absolute w-3 h-3 bg-[#e8623a] rounded-full"
                style={{ top: `${30 + i * 15}%`, left: `${20 + i * 20}%` }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
              />
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default MinistryNationalDashboard;