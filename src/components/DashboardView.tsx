import React from 'react';
import { 
  AlertTriangle, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Package, 
  Pill, 
  Radio, 
  ShieldCheck, 
  Thermometer, 
  TrendingUp, 
  Truck, 
  Activity,
  Layers,
  Building,
  ChevronLeft
} from 'lucide-react';
import { SupplyRequest, InventoryItem, UserProfile } from '../types';

interface DashboardViewProps {
  currentUser: UserProfile;
  requests: SupplyRequest[];
  inventory: InventoryItem[];
  onNavigate: (view: string) => void;
  onOpenSupplyModal: (initialItemId?: string) => void;
  onSelectRequestForTracking: (requestId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  requests,
  inventory,
  onNavigate,
  onOpenSupplyModal,
  onSelectRequestForTracking
}) => {
  const criticalItems = inventory.filter(item => item.status === 'critical');
  const activeRequests = requests.filter(r => !['received', 'rejected', 'cancelled'].includes(r.status));
  const inTransitRequests = requests.filter(r => r.status === 'in_transit');
  const arrivedRequests = requests.filter(r => r.status === 'arrived');

  // Category counts
  const medCount = inventory.filter(i => i.category === 'medicines').length;
  const supCount = inventory.filter(i => i.category === 'supplies').length;
  const bldCount = inventory.filter(i => i.category === 'blood').length;
  const eqCount = inventory.filter(i => i.category === 'equipment').length;

  return (
    <div className="space-y-6">
      {/* Welcome & Facility Health Banner */}
      <div className="bg-white rounded-xl border border-[#DFE9E9] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#087A5C] font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-[#087A5C]"></span>
              <span>مركز العمليات التبادلي المشترك · الربط ساري بين 5 قطاعات</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-[#173B43]">
              مرحباً، {currentUser.name}
            </h1>
            <p className="text-sm text-neutral-600 mt-1">
              أنت متصل بصلاحية <span className="font-semibold text-[#173B43]">{currentUser.role}</span> في <span className="text-[#087A5C] font-semibold">{currentUser.hospitalName}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenSupplyModal()}
              className="px-4 py-2.5 text-xs font-bold text-white bg-[#087A5C] hover:bg-[#06654c] rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>طلب إمداد نقص جديد</span>
            </button>
            <button
              onClick={() => onNavigate('inventory')}
              className="px-4 py-2.5 text-xs font-semibold text-[#173B43] bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-all flex items-center gap-1.5"
            >
              <span>استعراض المخزون الشامل</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Urgent Shortage Notice if any critical items exist */}
        {criticalItems.length > 0 && (
          <div className="mt-5 p-3.5 rounded-lg bg-red-50/80 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-red-100 text-red-700 shrink-0">
                <AlertTriangle className="w-5 h-5 text-[#D84E53]" />
              </div>
              <div>
                <div className="text-xs font-bold text-red-900 flex items-center gap-2">
                  <span>تنبيه هبوط مخزون حرج: يوجد {criticalItems.length} أصناف وصلت لمستوى الخطر</span>
                  <span className="text-[10px] bg-red-200/80 text-red-800 px-1.5 py-0.2 rounded font-mono">CRITICAL</span>
                </div>
                <div className="text-xs text-red-700 mt-0.5">
                  أبرزها: {criticalItems.map(i => i.nameAr.split('(')[0]).slice(0, 2).join(' ، ')}
                </div>
              </div>
            </div>
            <button
              onClick={() => onOpenSupplyModal(criticalItems[0]?.id)}
              className="px-3 py-1.5 text-xs font-bold bg-[#D84E53] hover:bg-red-700 text-white rounded-md whitespace-nowrap transition-colors"
            >
              طلب تعزيز فوري للصنف الأشد عجزاً
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">معدل تلبية الاحتياج</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#087A5C] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#173B43] font-mono tabular-nums">94.2%</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="w-3 h-3 ml-0.5" /> +2.4%
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">تلبية الطلبات عبر المنشآت الشريكة دون إلغاء</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">متوسط زمن الاستجابة</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#09AAA8] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#173B43] font-mono tabular-nums">18.4</span>
              <span className="text-xs font-medium text-neutral-600">دقيقة</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                -4.1 دقيقة
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">من لحظة بث النقص إلى أول عرض معتمد</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">شحنات النقل النشطة</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#DDA745] flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#173B43] font-mono tabular-nums">{inTransitRequests.length + arrivedRequests.length}</span>
              <span className="text-xs font-medium text-neutral-600">شحنات</span>
              <span className="text-xs font-semibold text-[#09AAA8]">
                {inTransitRequests.length} بالمسار الميداني
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">تتبع حراري وسلسلة تبريد لحظية معتمدة</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">الطلبات المسجلة بالنظام</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#173B43] font-mono tabular-nums">{requests.length}</span>
              <span className="text-xs font-medium text-neutral-600">طلبات</span>
              <span className="text-xs font-semibold text-neutral-600">
                {activeRequests.length} جارية
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">تنسيق متبادل بين المنشآت والمستودعات</p>
          </div>
        </div>
      </div>

      {/* Visual Operational Pipeline */}
      <div className="bg-white rounded-xl border border-[#DFE9E9] p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-[#173B43]">مسار تشغيل طلبات الإمداد التبادلي</h2>
            <p className="text-xs text-neutral-500 mt-0.5">رحلة المورد الصحي من إعلان النقص حتى الفحص والاستلام الصيدلاني</p>
          </div>
          <button 
            onClick={() => onNavigate('requests')}
            className="text-xs font-semibold text-[#087A5C] hover:underline flex items-center gap-1"
          >
            <span>استعراض كافة الطلبات</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg border border-[#DFE9E9] bg-[#F6F9F9]">
            <div className="text-[11px] font-semibold text-neutral-500">1. بث النقص</div>
            <div className="text-lg font-bold text-[#173B43] mt-1 font-mono">
              {requests.filter(r => r.status === 'broadcasted').length}
            </div>
            <div className="text-[10px] text-neutral-500">بانتظار العروض</div>
          </div>

          <div className="p-3 rounded-lg border border-teal-200 bg-teal-50/50">
            <div className="text-[11px] font-semibold text-[#09AAA8]">2. عروض واردة</div>
            <div className="text-lg font-bold text-[#09AAA8] mt-1 font-mono">
              {requests.filter(r => r.status === 'offers_received').length}
            </div>
            <div className="text-[10px] text-neutral-600">جاهزة للمقارنة والاعتماد</div>
          </div>

          <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
            <div className="text-[11px] font-semibold text-[#087A5C]">3. اعتماد وحجز</div>
            <div className="text-lg font-bold text-[#087A5C] mt-1 font-mono">
              {requests.filter(r => r.status === 'approved' || r.status === 'in_preparation').length}
            </div>
            <div className="text-[10px] text-neutral-600">قيد التجهيز المخبري</div>
          </div>

          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50">
            <div className="text-[11px] font-semibold text-[#DDA745]">4. النقل والتبريد</div>
            <div className="text-lg font-bold text-[#DDA745] mt-1 font-mono">
              {inTransitRequests.length}
            </div>
            <div className="text-[10px] text-neutral-600">تتبع درجات الحرارة</div>
          </div>

          <div className="p-3 rounded-lg border border-blue-200 bg-blue-50/50">
            <div className="text-[11px] font-semibold text-blue-700">5. وصول وفحص</div>
            <div className="text-lg font-bold text-blue-700 mt-1 font-mono">
              {arrivedRequests.length}
            </div>
            <div className="text-[10px] text-neutral-600">بانتظار توقيع الاستلام</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Active Shipments & 4 Resource Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Logistics / In-transit Focus (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-[#DFE9E9] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#09AAA8]" />
                <h3 className="text-base font-bold text-[#173B43]">الشحنات الجارية وسلسلة التبريد الميدانية</h3>
              </div>
              <button 
                onClick={() => onNavigate('tracking')}
                className="text-xs font-semibold text-[#09AAA8] hover:underline"
              >
                شاشة التتبع المباشر
              </button>
            </div>

            {inTransitRequests.length === 0 && arrivedRequests.length === 0 ? (
              <div className="text-center py-8 text-neutral-400 text-xs">
                لا توجد شحنات جارية حالياً على الطريق
              </div>
            ) : (
              <div className="space-y-3">
                {[...inTransitRequests, ...arrivedRequests].map((req) => (
                  <div 
                    key={req.id} 
                    className="p-4 rounded-xl border border-[#DFE9E9] hover:border-[#09AAA8] transition-all bg-[#F6F9F9] flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                    onClick={() => {
                      onSelectRequestForTracking(req.id);
                      onNavigate('tracking');
                    }}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          req.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.priority === 'critical' ? 'طارئ جداً' : 'عاجل'}
                        </span>
                        <span className="font-mono text-xs text-neutral-500 font-semibold">{req.requestNumber}</span>
                        <span className="text-xs text-neutral-400">·</span>
                        <span className="text-xs font-bold text-[#173B43]">{req.itemNameAr}</span>
                      </div>
                      <div className="text-xs text-neutral-600 flex items-center gap-2 flex-wrap">
                        <span>المرسل: {req.offers.find(o => o.status === 'accepted')?.offeringHospitalName}</span>
                        <span>←</span>
                        <span>المستلم: {req.requestingHospitalName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {req.telemetry && (
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#DFE9E9]">
                          <Thermometer className="w-4 h-4 text-[#09AAA8]" />
                          <div className="text-right">
                            <div className="text-[10px] text-neutral-500">حرارة الصندوق</div>
                            <div className="font-mono font-bold text-xs text-[#087A5C] tabular-nums">
                              {req.telemetry.currentTempC}°C
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-left">
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-md bg-[#09AAA8]/15 text-[#087A5C]">
                          {req.status === 'in_transit' ? `في الطريق (ETA: ${req.telemetry?.etaMinutes} دقيقة)` : 'وصل بانتظار الفحص'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 4 Multi-Category Overview */}
          <div className="bg-white rounded-xl border border-[#DFE9E9] p-5 shadow-sm">
            <h3 className="text-base font-bold text-[#173B43] mb-3">جاهزية المخزون حسب الفئات الأربع المعتمدة</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div 
                onClick={() => onNavigate('inventory')}
                className="p-3.5 rounded-xl border border-[#DFE9E9] hover:border-[#087A5C] transition-colors cursor-pointer text-center group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#087A5C] mx-auto flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Pill className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#173B43]">الأدوية التخصصية</div>
                <div className="text-xs text-neutral-500 mt-0.5">{medCount} صنف مسجل</div>
              </div>

              <div 
                onClick={() => onNavigate('inventory')}
                className="p-3.5 rounded-xl border border-[#DFE9E9] hover:border-[#087A5C] transition-colors cursor-pointer text-center group"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-[#09AAA8] mx-auto flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#173B43]">المستلزمات الطبية</div>
                <div className="text-xs text-neutral-500 mt-0.5">{supCount} صنف مسجل</div>
              </div>

              <div 
                onClick={() => onNavigate('inventory')}
                className="p-3.5 rounded-xl border border-[#DFE9E9] hover:border-[#087A5C] transition-colors cursor-pointer text-center group"
              >
                <div className="w-9 h-9 rounded-lg bg-red-50 text-[#D84E53] mx-auto flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Flame className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#173B43]">الدم ومشتقاته</div>
                <div className="text-xs text-neutral-500 mt-0.5">{bldCount} صنف مسجل</div>
              </div>

              <div 
                onClick={() => onNavigate('inventory')}
                className="p-3.5 rounded-xl border border-[#DFE9E9] hover:border-[#087A5C] transition-colors cursor-pointer text-center group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 mx-auto flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#173B43]">الأجهزة الطبية</div>
                <div className="text-xs text-neutral-500 mt-0.5">{eqCount} جهاز مسجل</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Participating Health Sectors & Quick Links (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#DFE9E9] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#173B43]">القطاعات الصحية المتصلة</h3>
              <span className="text-[10px] text-neutral-400">تكامل تجريبي</span>
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-lg border border-[#DFE9E9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#087A5C]"></span>
                  <span className="font-semibold text-[#173B43]">وزارة الصحة والتجمعات</span>
                </div>
                <span className="font-mono text-neutral-500 text-[11px]">284 منشأة</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#DFE9E9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#105B3A]"></span>
                  <span className="font-semibold text-[#173B43]">الشؤون الصحية بالحرس الوطني</span>
                </div>
                <span className="font-mono text-neutral-500 text-[11px]">14 منشأة</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#DFE9E9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1B4D3E]"></span>
                  <span className="font-semibold text-[#173B43]">الخدمات الصحية بوزارة الدفاع</span>
                </div>
                <span className="font-mono text-neutral-500 text-[11px]">26 منشأة</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#DFE9E9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#173B43]"></span>
                  <span className="font-semibold text-[#173B43]">الخدمات الطبية بوزارة الداخلية</span>
                </div>
                <span className="font-mono text-neutral-500 text-[11px]">12 منشأة</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#DFE9E9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#09AAA8]"></span>
                  <span className="font-semibold text-[#173B43]">مستشفى الملك فيصل التخصصي</span>
                </div>
                <span className="font-mono text-neutral-500 text-[11px]">5 مراكز</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('directory')}
              className="w-full mt-4 py-2 text-xs font-semibold text-[#087A5C] border border-[#087A5C]/30 hover:bg-[#087A5C]/5 rounded-lg transition-colors"
            >
              فتح دليل المستشفيات وأرقام الاتصال
            </button>
          </div>

          {/* Hackathon & Innovation Dossier Pitch Card */}
          <div className="bg-gradient-to-br from-[#087A5C] to-[#09AAA8] text-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-[#DDA745] font-bold text-xs mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>ملف الابتكار والهاكثون السريري</span>
            </div>
            <h4 className="text-base font-bold text-white">منهجية Stanford Biodesign والأثر السريري</h4>
            <p className="text-xs text-white/85 mt-1 leading-relaxed">
              استكشف النموذج المعتمد للتحقق من المشكلة، والمسار التنظيمي للهيئة العامة للغذاء والدواء (SFDA)، وأعضاء الفريق.
            </p>
            <button
              onClick={() => onNavigate('hackathon')}
              className="mt-3.5 px-3 py-1.5 text-xs font-bold text-[#087A5C] bg-white hover:bg-neutral-100 rounded-md shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>فتح ملف المحكمين والهاكثون</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
