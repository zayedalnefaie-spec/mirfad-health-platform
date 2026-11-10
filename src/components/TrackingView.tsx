import React, { useState } from 'react';
import { 
  Truck, 
  Thermometer, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  Navigation,
  FileSignature,
  Building,
  RefreshCw
} from 'lucide-react';
import { SupplyRequest } from '../types';

interface TrackingViewProps {
  requests: SupplyRequest[];
  selectedRequestId: string | null;
  onSelectRequest: (id: string) => void;
  onOpenReceiptInspection: (request: SupplyRequest) => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  requests,
  selectedRequestId,
  onSelectRequest,
  onOpenReceiptInspection
}) => {
  // Get trackable requests (in_transit or arrived or approved/in_preparation)
  const trackableRequests = requests.filter(r => 
    ['in_preparation', 'in_transit', 'arrived', 'received'].includes(r.status)
  );

  const activeRequest = trackableRequests.find(r => r.id === selectedRequestId) || trackableRequests[0];

  const [simulatedTemp, setSimulatedTemp] = useState<number | null>(null);

  if (!activeRequest) {
    return (
      <div className="bg-white rounded-xl border border-[#DFE9E9] p-12 text-center text-xs text-neutral-400">
        لا توجد شحنات في مرحلة النقل الميداني أو الاستلام حالياً.
      </div>
    );
  }

  const telemetry = activeRequest.telemetry;
  const currentTemp = simulatedTemp !== null ? simulatedTemp : (telemetry?.currentTempC || 4.2);
  const minTemp = telemetry?.targetTempMinC || 2.0;
  const maxTemp = telemetry?.targetTempMaxC || 8.0;
  const isTempSafe = currentTemp >= minTemp && currentTemp <= maxTemp;

  const steps = [
    { label: 'اعتماد العرض', done: true, current: false },
    { label: 'تجهيز الشحنة والتبريد', done: true, current: false },
    { label: 'استلام الناقل والانطلاق', done: activeRequest.status !== 'in_preparation', current: activeRequest.status === 'in_preparation' },
    { label: 'بالمسار الميداني الحي', done: ['in_transit', 'arrived', 'received'].includes(activeRequest.status), current: activeRequest.status === 'in_transit' },
    { label: 'وصول لباب المنشأة', done: ['arrived', 'received'].includes(activeRequest.status), current: activeRequest.status === 'arrived' },
    { label: 'فحص الجودة والتسليم', done: activeRequest.status === 'received', current: false }
  ];

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="bg-white p-5 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#09AAA8] font-semibold mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>بث تيليمتري مباشر لسلسلة التبريد وتتبع الشحنات الإسعافية</span>
          </div>
          <h2 className="text-lg font-bold text-[#173B43]">مركز التتبع الميداني وسلسلة التبريد</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            مراقبة المسار، درجة حرارة الطرود الحساسة، وزمن الوصول التقديري (ETA)
          </p>
        </div>

        {/* Shipment Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 whitespace-nowrap">اختر الشحنة:</span>
          <select
            value={activeRequest.id}
            onChange={(e) => onSelectRequest(e.target.value)}
            className="py-1.5 px-3 text-xs bg-[#F6F9F9] border border-[#DFE9E9] rounded-lg text-[#173B43] font-bold focus:outline-none focus:border-[#09AAA8]"
          >
            {trackableRequests.map(r => (
              <option key={r.id} value={r.id}>
                {r.requestNumber} - {r.itemNameAr.slice(0, 25)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Details & Cold Chain Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Shipment & Route (2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Active Shipment Header Card */}
          <div className="bg-white rounded-xl border border-[#DFE9E9] p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DFE9E9]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#087A5C]">{activeRequest.requestNumber}</span>
                  <span className="text-xs text-neutral-400">·</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#087A5C]/10 text-[#087A5C]">
                    {activeRequest.status === 'in_transit' ? 'جاري النقل' : activeRequest.status === 'arrived' ? 'وصل المستشفى' : 'مكتمل الاستلام'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#173B43] mt-1">{activeRequest.itemNameAr}</h3>
                <p className="text-xs text-neutral-500 font-mono">{activeRequest.itemNameEn}</p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[11px] text-neutral-500">الكمية المشحونة</div>
                <div className="text-lg font-black font-mono text-[#173B43] tabular-nums">
                  {activeRequest.quantityRequested} {activeRequest.unit}
                </div>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="py-2">
              <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
                {steps.map((st, i) => (
                  <div 
                    key={i} 
                    className={`text-center flex-1 ${
                      st.current ? 'text-[#087A5C] font-bold' : st.done ? 'text-neutral-800' : 'text-neutral-400'
                    }`}
                  >
                    {st.label}
                  </div>
                ))}
              </div>
              <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden flex">
                {steps.map((st, i) => (
                  <div 
                    key={i} 
                    className={`h-full flex-1 border-r border-white/50 transition-all ${
                      st.done ? 'bg-[#087A5C]' : st.current ? 'bg-[#09AAA8] animate-pulse' : 'bg-neutral-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Route Map Visual Simulation */}
            <div className="relative h-64 rounded-xl border border-[#DFE9E9] bg-slate-900 overflow-hidden flex items-center justify-center p-4">
              {/* Decorative Map Grid & Landmarks */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#09AAA8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {/* Route connecting line */}
              <div className="absolute w-3/4 h-1 bg-gradient-to-l from-emerald-500 via-[#09AAA8] to-[#DDA745] top-1/2 -translate-y-1/2 rounded-full"></div>

              {/* Origin Marker */}
              <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <Building className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-white font-bold mt-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                  {activeRequest.offers.find(o => o.status === 'accepted')?.offeringHospitalName.split('(')[0] || 'المستشفى المورد'}
                </div>
              </div>

              {/* Vehicle in Transit Marker (Animated) */}
              <div className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 flex flex-col items-center z-20">
                <div className="w-11 h-11 rounded-full bg-[#09AAA8] text-white flex items-center justify-center shadow-xl border-2 border-white animate-bounce">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-[10px] text-emerald-300 font-bold mt-1 bg-black/80 px-2 py-0.5 rounded backdrop-blur flex items-center gap-1 font-mono">
                  <span>{telemetry?.currentLocationDesc ? telemetry.currentLocationDesc.split('-')[0] : 'على الطريق'}</span>
                </div>
              </div>

              {/* Destination Marker */}
              <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-[10px] text-white font-bold mt-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                  {activeRequest.requestingHospitalName.split('(')[0]}
                </div>
              </div>

              {/* Bottom ETA Overlay */}
              <div className="absolute bottom-3 right-3 left-3 bg-black/70 backdrop-blur text-white px-4 py-2 rounded-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#DDA745]" />
                  <span>الوقت المتبقي للوصول (ETA):</span>
                  <span className="font-mono font-bold text-[#DDA745] text-sm tabular-nums">
                    {telemetry?.etaMinutes ?? 0} دقيقة
                  </span>
                </div>
                <div className="text-[11px] text-neutral-300">
                  انطلقت الساعة: {telemetry?.departureTime || '11:10'}
                </div>
              </div>
            </div>

            {/* Arrived and ready for inspection action */}
            {['arrived', 'in_transit'].includes(activeRequest.status) && (
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  عند وصول المركبة، يبدأ مسؤول الاستلام فحص سلامة الصندوق والتوقيع الرقمي:
                </span>
                <button
                  onClick={() => onOpenReceiptInspection(activeRequest)}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#087A5C] hover:bg-[#06654c] rounded-lg shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <FileSignature className="w-4 h-4" />
                  <span>بدء الفحص وتأكيد الاستلام الصيدلاني</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Cold Chain IoT Telemetry (1 col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#DFE9E9] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-teal-50 text-[#09AAA8]">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#173B43]">سلسلة التبريد الذكية (IoT)</h3>
                  <div className="text-[10px] text-neutral-500">حساس حراري رقمي متصل</div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isTempSafe ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {isTempSafe ? 'مطابق للبروتوكول' : 'تنبيه حراري'}
              </span>
            </div>

            {/* Current Temp Big Gauge */}
            <div className={`p-4 rounded-xl border text-center ${
              isTempSafe ? 'bg-emerald-50/50 border-emerald-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="text-[11px] text-neutral-500">درجة الحرارة اللحظية داخل الصندوق</div>
              <div className="text-3xl font-black font-mono text-[#087A5C] my-1 tabular-nums">
                {currentTemp.toFixed(1)}°C
              </div>
              <div className="text-xs text-neutral-600">
                المدى الآمن المعتمد: <strong className="font-mono text-[#173B43]">{minTemp}°C - {maxTemp}°C</strong>
              </div>
            </div>

            {/* Simulated Temp Controls for Demo Testing */}
            <div className="p-3 bg-[#F6F9F9] rounded-lg border border-[#DFE9E9] space-y-2">
              <div className="text-[10px] font-bold text-neutral-600">تجربة محاكاة درجات الحرارة (Demo Probe):</div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSimulatedTemp(minTemp + 1)}
                  className="flex-1 py-1 text-[10px] font-semibold bg-white border border-[#DFE9E9] rounded hover:border-[#087A5C]"
                >
                  حرارة مثالية
                </button>
                <button
                  onClick={() => setSimulatedTemp(maxTemp + 2.5)}
                  className="flex-1 py-1 text-[10px] font-semibold bg-white border border-[#DFE9E9] rounded hover:border-[#D84E53] text-[#D84E53]"
                >
                  محاكاة ارتفاع حراري
                </button>
                <button
                  onClick={() => setSimulatedTemp(null)}
                  className="p-1 text-neutral-500 hover:text-neutral-700"
                  title="استعادة القراءة الأصلية"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Temperature Log Trail */}
            <div>
              <div className="text-xs font-bold text-[#173B43] mb-2">سجل القراءات اللحظية:</div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {(telemetry?.tempHistory || [
                  { time: '11:15', temp: 21.8 },
                  { time: '11:20', temp: 22.0 },
                  { time: '11:25', temp: 22.1 }
                ]).map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-neutral-50 border border-neutral-100">
                    <span className="font-mono text-neutral-500 text-[11px]">{entry.time}</span>
                    <span className="font-mono font-bold text-[#087A5C] tabular-nums">{entry.temp}°C</span>
                    <span className="text-[10px] text-emerald-700">ضمن المعيار</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Courier & Vehicle Specs */}
          <div className="bg-white rounded-xl border border-[#DFE9E9] p-5 shadow-sm space-y-3 text-xs">
            <h4 className="font-bold text-[#173B43] border-b border-[#DFE9E9] pb-2">بيانات وسيلة النقل والمسعف المعتمد</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">لوحة المركبة:</span>
                <span className="font-mono font-bold text-[#173B43]">{telemetry?.vehiclePlate || 'أ ب ر 4812'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">المسعف المسؤول:</span>
                <span className="font-bold text-[#173B43]">{telemetry?.driverName || 'منصور السبيعي'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500">الاتصال المباشر:</span>
                <a 
                  href={`tel:${telemetry?.driverPhone || '0508472911'}`} 
                  className="font-mono font-bold text-[#087A5C] flex items-center gap-1 hover:underline"
                >
                  <Phone className="w-3 h-3" />
                  <span>{telemetry?.driverPhone || '050-8472911'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
