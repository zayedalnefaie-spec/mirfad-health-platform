import React, { useState, useEffect } from 'react';
import { 
  X, 
  Pill, 
  Package, 
  Flame, 
  Activity, 
  AlertTriangle, 
  Clock, 
  Send, 
  Check, 
  ShieldCheck, 
  Thermometer, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  ResourceCategory, 
  PriorityLevel, 
  SupplyRequest, 
  UserProfile, 
  InventoryItem 
} from '../types';

interface SupplyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  inventory: InventoryItem[];
  initialItemId?: string;
  onSubmitRequest: (newRequest: SupplyRequest) => void;
}

export const SupplyRequestModal: React.FC<SupplyRequestModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  inventory,
  initialItemId,
  onSubmitRequest
}) => {
  const [step, setStep] = useState<number>(1);
  const [category, setCategory] = useState<ResourceCategory>('medicines');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [customItemNameAr, setCustomItemNameAr] = useState<string>('');
  const [customItemNameEn, setCustomItemNameEn] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(2);
  const [unit, setUnit] = useState<string>('فيال (Vial)');
  const [priority, setPriority] = useState<PriorityLevel>('critical');
  const [urgencyReason, setUrgencyReason] = useState<string>('حالة سريرية طارئة مهددة للحياة مع نفاذ المخزون المحلي');
  const [scope, setScope] = useState<'cluster' | 'sector' | 'all_sectors'>('all_sectors');
  const [coldChainRequired, setColdChainRequired] = useState<boolean>(true);
  const [requiredTempRange, setRequiredTempRange] = useState<string>('2°C - 8°C (سلسلة تبريد مبردة)');

  useEffect(() => {
    if (initialItemId) {
      const found = inventory.find(i => i.id === initialItemId);
      if (found) {
        setSelectedItemId(found.id);
        setCategory(found.category);
        setUnit(found.unit);
        setCustomItemNameAr(found.nameAr);
        setCustomItemNameEn(found.nameEn);
        if (found.coldChainRequirement) {
          setColdChainRequired(true);
          setRequiredTempRange(found.tempRange || found.coldChainRequirement);
        }
      }
    }
  }, [initialItemId, inventory]);

  if (!isOpen) return null;

  const categoryItems = inventory.filter(i => i.category === category);

  const handleSelectItem = (item: InventoryItem) => {
    setSelectedItemId(item.id);
    setCustomItemNameAr(item.nameAr);
    setCustomItemNameEn(item.nameEn);
    setUnit(item.unit);
    if (item.coldChainRequirement) {
      setColdChainRequired(true);
      setRequiredTempRange(item.tempRange || item.coldChainRequirement);
    } else {
      setColdChainRequired(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNameAr = customItemNameAr.trim() || 'صنف طارئ غير مسمى';
    const finalNameEn = customItemNameEn.trim() || 'Emergency Requested Item';
    const randomReqNumber = `MRF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: SupplyRequest = {
      id: `req-${Date.now()}`,
      requestNumber: randomReqNumber,
      category,
      itemId: selectedItemId || undefined,
      itemNameAr: finalNameAr,
      itemNameEn: finalNameEn,
      quantityRequested: Number(quantity),
      unit,
      priority,
      requestingHospitalId: currentUser.hospitalId,
      requestingHospitalName: currentUser.hospitalName,
      requestingSectorId: currentUser.sectorId,
      requestingCity: 'الرياض',
      requestingUser: currentUser.name,
      createdAt: 'الآن (بث جديد)',
      status: 'broadcasted',
      urgencyReason,
      coldChainRequired,
      requiredTempRange: coldChainRequired ? requiredTempRange : undefined,
      scope,
      offers: []
    };

    onSubmitRequest(newRequest);
    onClose();
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DFE9E9] max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#087A5C] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold">إنشاء وبث طلب إمداد صحي طارئ</h3>
              <p className="text-xs text-white/80 mt-0.5">
                توجيه الطلب اللحظي إلى مستودعات ومستشفيات الشبكة الوطنية المشاركة
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper indicator */}
        <div className="bg-[#F6F9F9] px-6 py-3 border-b border-[#DFE9E9] flex items-center justify-between text-xs">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'font-bold text-[#087A5C]' : 'text-neutral-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-[#087A5C] text-white' : 'bg-neutral-200 text-neutral-600'}`}>1</span>
            <span>الصنف والمواصفات</span>
          </div>
          <span className="text-neutral-300">──</span>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'font-bold text-[#087A5C]' : 'text-neutral-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-[#087A5C] text-white' : 'bg-neutral-200 text-neutral-600'}`}>2</span>
            <span>الكمية والأولوية</span>
          </div>
          <span className="text-neutral-300">──</span>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'font-bold text-[#087A5C]' : 'text-neutral-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-[#087A5C] text-white' : 'bg-neutral-200 text-neutral-600'}`}>3</span>
            <span>نطاق البث واللوجستيات</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-2">اختر فئة المورد المطلوب:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setCategory('medicines'); setUnit('فيال (Vial)'); }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      category === 'medicines' 
                        ? 'border-[#087A5C] bg-[#087A5C]/5 text-[#087A5C] font-bold' 
                        : 'border-[#DFE9E9] text-neutral-600 hover:border-[#09AAA8]'
                    }`}
                  >
                    <Pill className="w-5 h-5" />
                    <span>أدوية تخصصية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCategory('supplies'); setUnit('طقم / وحدة'); }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      category === 'supplies' 
                        ? 'border-[#087A5C] bg-[#087A5C]/5 text-[#087A5C] font-bold' 
                        : 'border-[#DFE9E9] text-neutral-600 hover:border-[#09AAA8]'
                    }`}
                  >
                    <Package className="w-5 h-5" />
                    <span>مستلزمات طبية</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCategory('blood'); setUnit('وحدة دم (Unit)'); }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      category === 'blood' 
                        ? 'border-[#087A5C] bg-[#087A5C]/5 text-[#087A5C] font-bold' 
                        : 'border-[#DFE9E9] text-neutral-600 hover:border-[#09AAA8]'
                    }`}
                  >
                    <Flame className="w-5 h-5" />
                    <span>الدم ومشتقاته</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCategory('equipment'); setUnit('جهاز طبي'); }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      category === 'equipment' 
                        ? 'border-[#087A5C] bg-[#087A5C]/5 text-[#087A5C] font-bold' 
                        : 'border-[#DFE9E9] text-neutral-600 hover:border-[#09AAA8]'
                    }`}
                  >
                    <Activity className="w-5 h-5" />
                    <span>أجهزة طبية</span>
                  </button>
                </div>
              </div>

              {/* Items in category */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1.5">
                  اختر من دليل الأصناف المتداولة أو أدخل مخصصاً:
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto border border-[#DFE9E9] rounded-lg p-2 bg-[#F6F9F9]">
                  {categoryItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      className={`p-2.5 rounded-md cursor-pointer transition-colors flex items-center justify-between ${
                        selectedItemId === item.id ? 'bg-[#087A5C] text-white font-bold' : 'hover:bg-white text-neutral-700'
                      }`}
                    >
                      <div>
                        <div>{item.nameAr}</div>
                        <div className={`text-[10px] font-mono ${selectedItemId === item.id ? 'text-white/80' : 'text-neutral-400'}`}>
                          {item.nameEn}
                        </div>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded ${
                        selectedItemId === item.id ? 'bg-white/20' : 'bg-neutral-200/60'
                      }`}>
                        {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom item name if needed */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">الاسم بالعربية:</label>
                  <input
                    type="text"
                    value={customItemNameAr}
                    onChange={(e) => {
                      setCustomItemNameAr(e.target.value);
                      setSelectedItemId('');
                    }}
                    placeholder="مثال: ترياق أنديكسانيل 200mg"
                    className="w-full p-2.5 bg-white border border-[#DFE9E9] rounded-lg focus:outline-none focus:border-[#09AAA8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">الاسم بالإنجليزية (Scientific):</label>
                  <input
                    type="text"
                    value={customItemNameEn}
                    onChange={(e) => setCustomItemNameEn(e.target.value)}
                    placeholder="e.g. Andexanet Alfa 200mg"
                    className="w-full p-2.5 bg-white border border-[#DFE9E9] rounded-lg focus:outline-none focus:border-[#09AAA8]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">الكمية المطلوبة بدقة:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-[#DFE9E9] rounded-lg font-mono text-base font-bold text-[#173B43]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">وحدة القياس / التعبئة:</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="فيال / وحدة دم / جهاز"
                    className="w-full p-2.5 bg-white border border-[#DFE9E9] rounded-lg text-neutral-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-2">مستوى أولوية الاحتياج:</label>
                <div className="grid grid-cols-3 gap-2.5">
                  <div
                    onClick={() => setPriority('critical')}
                    className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                      priority === 'critical' ? 'border-[#D84E53] bg-red-50 text-[#D84E53] font-bold ring-1 ring-red-400' : 'border-[#DFE9E9] text-neutral-600'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 mx-auto mb-1 text-[#D84E53]" />
                    <div className="font-bold text-xs">طارئ - إنقاذ حياة</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">خلال 30-60 دقيقة</div>
                  </div>

                  <div
                    onClick={() => setPriority('urgent')}
                    className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                      priority === 'urgent' ? 'border-[#DDA745] bg-amber-50 text-[#DDA745] font-bold ring-1 ring-amber-400' : 'border-[#DFE9E9] text-neutral-600'
                    }`}
                  >
                    <Clock className="w-5 h-5 mx-auto mb-1 text-[#DDA745]" />
                    <div className="font-bold text-xs">عاجل سريري</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">خلال 2-4 ساعات</div>
                  </div>

                  <div
                    onClick={() => setPriority('routine')}
                    className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                      priority === 'routine' ? 'border-[#087A5C] bg-emerald-50 text-[#087A5C] font-bold ring-1 ring-emerald-400' : 'border-[#DFE9E9] text-neutral-600'
                    }`}
                  >
                    <Check className="w-5 h-5 mx-auto mb-1 text-[#087A5C]" />
                    <div className="font-bold text-xs">تعويض مخزون</div>
                    <div className="text-[10px] text-neutral-500 mt-0.5">خلال اليوم نفسه</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  المبرر السريري وتفاصيل الحالة (Clinical Urgency Justification):
                </label>
                <textarea
                  rows={3}
                  value={urgencyReason}
                  onChange={(e) => setUrgencyReason(e.target.value)}
                  placeholder="اكتب التبرير الطبي أو السريري لحاجة المستشفى العاجلة..."
                  className="w-full p-2.5 bg-white border border-[#DFE9E9] rounded-lg text-neutral-700 leading-relaxed"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-2">نطاق بث إشعار النقص (Broadcast Radius):</label>
                <div className="space-y-2">
                  <div
                    onClick={() => setScope('all_sectors')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                      scope === 'all_sectors' ? 'border-[#087A5C] bg-emerald-50/50 font-bold' : 'border-[#DFE9E9]'
                    }`}
                  >
                    <input type="radio" checked={scope === 'all_sectors'} readOnly className="mt-1" />
                    <div>
                      <div className="text-[#173B43]">شامل كافة القطاعات الصحية الخمسة بالمملكة (موصى به للحالات الحرجة)</div>
                      <div className="text-[11px] text-neutral-500 font-normal">
                        يصل الطلب لوزارة الصحة، الحرس الوطني، وزارة الدفاع، قوى الأمن، ومستشفى الملك فيصل التخصصي فوراً.
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setScope('sector')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                      scope === 'sector' ? 'border-[#087A5C] bg-emerald-50/50 font-bold' : 'border-[#DFE9E9]'
                    }`}
                  >
                    <input type="radio" checked={scope === 'sector'} readOnly className="mt-1" />
                    <div>
                      <div className="text-[#173B43]">على مستوى القطاع الصحي التابع للمستشفى فقط</div>
                      <div className="text-[11px] text-neutral-500 font-normal">
                        يقتصر على منشآت نفس القطاع داخل المنطقة.
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setScope('cluster')}
                    className={`p-3 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
                      scope === 'cluster' ? 'border-[#087A5C] bg-emerald-50/50 font-bold' : 'border-[#DFE9E9]'
                    }`}
                  >
                    <input type="radio" checked={scope === 'cluster'} readOnly className="mt-1" />
                    <div>
                      <div className="text-[#173B43]">داخل التجمع الصحي المحلي فقط</div>
                      <div className="text-[11px] text-neutral-500 font-normal">
                        للمنشآت الأقرب جغرافياً في محيط المدينة.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistics & Cold Chain */}
              <div className="p-4 bg-[#F6F9F9] rounded-xl border border-[#DFE9E9] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-[#09AAA8]" />
                    <span className="font-bold text-[#173B43]">اشتراطات سلسلة التبريد وسرعة النقل:</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#087A5C]">
                    <input
                      type="checkbox"
                      checked={coldChainRequired}
                      onChange={(e) => setColdChainRequired(e.target.checked)}
                      className="rounded text-[#087A5C]"
                    />
                    <span>يتطلب سلسلة تبريد نشطة</span>
                  </label>
                </div>

                {coldChainRequired && (
                  <div>
                    <label className="block text-neutral-600 mb-1">المدى الحراري المعتمد للحفظ:</label>
                    <select
                      value={requiredTempRange}
                      onChange={(e) => setRequiredTempRange(e.target.value)}
                      className="w-full p-2 bg-white border border-[#DFE9E9] rounded-lg"
                    >
                      <option value="2°C - 8°C (سلسلة تبريد مبردة)">2°C - 8°C (أدوية ولقاحات مبردة)</option>
                      <option value="2°C - 6°C (دم ومشتقات الكريات الحمراء)">2°C - 6°C (كريات دم حمراء مكدسة)</option>
                      <option value="-25°C to -18°C (بلازما ورواسب مجمدة)">-25°C إلى -18°C (تجميد عميق للبلازما)</option>
                      <option value="20°C - 24°C مع تقليب مستمر (صفائح دموية)">20°C - 24°C مع تقليب مستمر (صفائح دموية)</option>
                      <option value="15°C - 25°C (حرارة غرفة مضبوطة)">15°C - 25°C (حرارة غرفة مضبوطة)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-[#F6F9F9] p-4 border-t border-[#DFE9E9] flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-[#DFE9E9] hover:bg-neutral-50 rounded-lg flex items-center gap-1.5"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الخطوة السابقة</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
            >
              إلغاء
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#087A5C] hover:bg-[#06654c] rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <span>متابعة</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2 text-xs font-bold text-white bg-[#087A5C] hover:bg-[#06654c] rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>بث الطلب فوراً للشبكة</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
