import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Search, 
  ShieldCheck, 
  Layers, 
  Info, 
  ExternalLink,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { HEALTH_SECTORS, HOSPITALS } from '../data/mockData';
import { HealthSectorId } from '../types';

export const NetworkDirectoryView: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const cities = Array.from(new Set(HOSPITALS.map(h => h.city)));

  const filteredHospitals = HOSPITALS.filter(hosp => {
    if (selectedSector !== 'all' && hosp.sectorId !== selectedSector) return false;
    if (selectedCity !== 'all' && hosp.city !== selectedCity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAr = hosp.nameAr.toLowerCase().includes(q);
      const matchEn = hosp.nameEn.toLowerCase().includes(q);
      const matchCity = hosp.city.toLowerCase().includes(q);
      if (!matchAr && !matchEn && !matchCity) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white p-5 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#173B43]">دليل المنشآت والشبكة الصحية المشتركة</h2>
          <p className="text-xs text-neutral-500 mt-1">
            دليل استرشادي لتكامل المستشفيات المرجعية عبر القطاعات الصحية الخمسة في المملكة
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-[#087A5C]" />
          <span>جاهزية الربط المتبادل: <strong>5 قطاعات رئيسية</strong></span>
        </div>
      </div>

      {/* Official Advisory Banner (Document requirement) */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#DDA745] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">تنبيه تنظيمي وتوثيقي:</span> إدراج أسماء المنشآت والقطاعات الصحية يمثل نموذجاً هيكلياً أولياً لاختبار مسارات التكامل التبادلي ضمن الهاكثون. يتطلب التشغيل الميداني الفعلي اعتماد اتفاقيات مشاركة البيانات والحوكمة الرسمية وسياسات أمن المعلومات الصحية.
        </div>
      </div>

      {/* 5 Sectors Showcase Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {HEALTH_SECTORS.map(sec => {
          const isSelected = selectedSector === sec.id;
          return (
            <div
              key={sec.id}
              onClick={() => setSelectedSector(isSelected ? 'all' : sec.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all bg-white flex flex-col justify-between ${
                isSelected 
                  ? 'border-[#087A5C] ring-2 ring-[#087A5C]/20 shadow-sm' 
                  : 'border-[#DFE9E9] hover:border-[#09AAA8]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                    {sec.badge}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.color }}></span>
                </div>
                <h3 className="font-bold text-xs text-[#173B43] mt-2.5 line-clamp-2">
                  {sec.nameAr}
                </h3>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 flex items-center justify-between">
                <span>المنشآت المشمولة:</span>
                <strong className="font-mono text-[#087A5C]">{sec.hospitalsCount}</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث باسم المستشفى، المدينة، أو نوع المنشأة..."
            className="w-full pr-9 pl-4 py-2 text-xs bg-[#F6F9F9] border border-[#DFE9E9] rounded-lg text-[#173B43] focus:outline-none focus:border-[#09AAA8]"
          />
        </div>

        <div className="w-full md:w-auto">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full md:w-52 py-2 px-3 text-xs bg-[#F6F9F9] border border-[#DFE9E9] rounded-lg text-[#173B43]"
          >
            <option value="all">كافة القطاعات (الكل)</option>
            {HEALTH_SECTORS.map(sec => (
              <option key={sec.id} value={sec.id}>{sec.nameAr}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full md:w-40 py-2 px-3 text-xs bg-[#F6F9F9] border border-[#DFE9E9] rounded-lg text-[#173B43]"
          >
            <option value="all">كافة المدن</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHospitals.map(hosp => {
          const sector = HEALTH_SECTORS.find(s => s.id === hosp.sectorId);
          return (
            <div 
              key={hosp.id}
              className="bg-white rounded-xl border border-[#DFE9E9] p-5 shadow-sm hover:border-[#09AAA8] transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700">
                    {sector?.badge || 'MOH'}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                    <MapPin className="w-3.5 h-3.5 text-[#09AAA8]" />
                    <span>{hosp.city} · {hosp.region}</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-[#173B43]">{hosp.nameAr}</h3>
                  <div className="text-[10px] font-mono text-neutral-400 mt-0.5">{hosp.nameEn}</div>
                </div>

                <div className="text-xs text-neutral-600 bg-[#F6F9F9] p-2.5 rounded-lg border border-[#DFE9E9]">
                  <div className="text-[10px] text-neutral-400">التصنيف الوظيفي:</div>
                  <div className="font-medium text-[#173B43] mt-0.5">{hosp.type}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DFE9E9] flex items-center justify-between text-xs">
                <a 
                  href={`tel:${hosp.phone}`}
                  className="text-neutral-600 hover:text-[#087A5C] flex items-center gap-1 font-mono font-bold"
                >
                  <Phone className="w-3.5 h-3.5 text-[#087A5C]" />
                  <span>{hosp.phone}</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-neutral-500">مؤشر الجاهزية:</span>
                  <span className="font-mono font-bold text-[#087A5C] tabular-nums">{hosp.availableStockIndex}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
