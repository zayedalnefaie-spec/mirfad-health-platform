import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Pill, 
  Package, 
  Flame, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Thermometer, 
  Plus, 
  Building2, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { InventoryItem, ResourceCategory, HealthSectorId } from '../types';
import { HEALTH_SECTORS } from '../data/mockData';

interface InventoryViewProps {
  inventory: InventoryItem[];
  onOpenSupplyModal: (initialItemId?: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  inventory,
  onOpenSupplyModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForDetails, setSelectedItemForDetails] = useState<InventoryItem | null>(null);

  // Filter logic
  const filteredItems = inventory.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedSector !== 'all' && item.sectorId !== selectedSector) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAr = item.nameAr.toLowerCase().includes(q);
      const matchEn = item.nameEn.toLowerCase().includes(q);
      const matchBatch = item.batchNumber.toLowerCase().includes(q);
      const matchHosp = item.hospitalName.toLowerCase().includes(q);
      if (!matchAr && !matchEn && !matchBatch && !matchHosp) return false;
    }
    return true;
  });

  const getCategoryIcon = (category: ResourceCategory) => {
    switch (category) {
      case 'medicines':
        return <Pill className="w-4 h-4 text-[#087A5C]" />;
      case 'supplies':
        return <Package className="w-4 h-4 text-[#09AAA8]" />;
      case 'blood':
        return <Flame className="w-4 h-4 text-[#D84E53]" />;
      case 'equipment':
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getCategoryLabel = (category: ResourceCategory) => {
    switch (category) {
      case 'medicines': return 'الأدوية التخصصية';
      case 'supplies': return 'مستلزمات جراحية';
      case 'blood': return 'الدم ومشتقاته';
      case 'equipment': return 'أجهزة طبية حرجة';
    }
  };

  const getStatusBadge = (status: 'available' | 'low' | 'critical') => {
    switch (status) {
      case 'available':
        return (
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>متوفر</span>
          </span>
        );
      case 'low':
        return (
          <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>منخفض</span>
          </span>
        );
      case 'critical':
        return (
          <span className="text-xs text-red-700 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>حرج / شحيح</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="bg-white p-5 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#173B43]">سجل المخزون الصحي الموحد متعدد الفئات</h2>
          <p className="text-xs text-neutral-500 mt-1">
            رصد حي وموثق لتوافر الموارد بين كافة المنشآت الشريكة بالقطاعات الخمسة
          </p>
        </div>

        <button
          onClick={() => onOpenSupplyModal()}
          className="px-4 py-2 text-xs font-bold text-white bg-[#087A5C] hover:bg-[#06654c] rounded-lg shadow-sm transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>طلب دعم لمورد غير متوفر</span>
        </button>
      </div>

      {/* Category Segmented Buttons (Interactive filter controls) */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-xl border border-[#DFE9E9] overflow-x-auto shadow-sm">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#087A5C] text-white shadow-sm'
              : 'text-neutral-600 hover:text-[#087A5C] hover:bg-neutral-50'
          }`}
        >
          كافة الفئات ({inventory.length})
        </button>

        <button
          onClick={() => setSelectedCategory('medicines')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'medicines'
              ? 'bg-[#087A5C] text-white shadow-sm'
              : 'text-neutral-600 hover:text-[#087A5C] hover:bg-neutral-50'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>الأدوية التخصصية ({inventory.filter(i => i.category === 'medicines').length})</span>
        </button>

        <button
          onClick={() => setSelectedCategory('supplies')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'supplies'
              ? 'bg-[#087A5C] text-white shadow-sm'
              : 'text-neutral-600 hover:text-[#087A5C] hover:bg-neutral-50'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>المستلزمات الطبية ({inventory.filter(i => i.category === 'supplies').length})</span>
        </button>

        <button
          onClick={() => setSelectedCategory('blood')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'blood'
              ? 'bg-[#087A5C] text-white shadow-sm'
              : 'text-neutral-600 hover:text-[#087A5C] hover:bg-neutral-50'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>الدم ومشتقاته ({inventory.filter(i => i.category === 'blood').length})</span>
        </button>

        <button
          onClick={() => setSelectedCategory('equipment')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
            selectedCategory === 'equipment'
              ? 'bg-[#087A5C] text-white shadow-sm'
              : 'text-neutral-600 hover:text-[#087A5C] hover:bg-neutral-50'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>الأجهزة الطبية ({inventory.filter(i => i.category === 'equipment').length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم العلمي، الاسم التجاري، رقم التشغيلة، أو المنشأة..."
            className="w-full pr-9 pl-4 py-2 text-xs bg-[#F6F9F9] border border-[#DFE9E9] rounded-lg focus:outline-none focus:border-[#09AAA8] text-[#173B43]"
          />
        </div>

        {/* Sector Selector */}
        <div className="w-full md:w-auto">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full md:w-48 py-2 px-3 text-xs bg-[#F6F9F9] border border-[#DFE9E9] rounded-lg focus:outline-none focus:border-[#09AAA8] text-[#173B43]"
          >
            <option value="all">كافة القطاعات الصحية</option>
            {HEALTH_SECTORS.map(sec => (
              <option key={sec.id} value={sec.id}>{sec.nameAr}</option>
            ))}
          </select>
        </div>

        {/* Stock Status Selector */}
        <div className="w-full md:w-auto">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full md:w-40 py-2 px-3 text-xs bg-[#F6F9F9] border border-[#DFE9E9] rounded-lg focus:outline-none focus:border-[#09AAA8] text-[#173B43]"
          >
            <option value="all">كافة الحالات</option>
            <option value="available">متوفر فقط</option>
            <option value="low">منخفض (تحت الأمان)</option>
            <option value="critical">حرج جداً</option>
          </select>
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-white rounded-xl border border-[#DFE9E9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#F6F9F9] border-b border-[#DFE9E9] text-[11px] font-bold text-neutral-600">
                <th className="py-3 px-4">الصنف والمواصفات السريرية</th>
                <th className="py-3 px-3">الفئة</th>
                <th className="py-3 px-3">المنشأة المالكة</th>
                <th className="py-3 px-3">الرصيد / حد الأمان</th>
                <th className="py-3 px-3">التشغيلة / الصلاحية</th>
                <th className="py-3 px-3">سلسلة التبريد</th>
                <th className="py-3 px-3">الحالة</th>
                <th className="py-3 px-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE9E9] text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    لم يتم العثور على أصناف مطابقة لمعايير البحث
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const percentOfBuffer = Math.min(100, Math.round((item.currentStock / (item.safeBuffer * 1.5)) * 100));
                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-neutral-50/80 transition-colors cursor-pointer"
                      onClick={() => setSelectedItemForDetails(item)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 p-1.5 rounded-md bg-neutral-100 shrink-0">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <div className="font-bold text-[#173B43]">{item.nameAr}</div>
                            <div className="text-[11px] text-neutral-500 font-mono">{item.nameEn}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-neutral-700 font-medium">
                          {getCategoryLabel(item.category)}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-neutral-800 font-medium">{item.hospitalName}</div>
                        <div className="text-[10px] text-neutral-500">
                          {HEALTH_SECTORS.find(s => s.id === item.sectorId)?.badge}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold font-mono text-sm text-[#173B43] tabular-nums">
                            {item.currentStock}
                          </span>
                          <span className="text-[10px] text-neutral-500">من حد {item.safeBuffer} {item.unit}</span>
                        </div>
                        <div className="w-24 h-1.5 bg-neutral-200 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.status === 'critical' ? 'bg-[#D84E53]' : item.status === 'low' ? 'bg-[#DDA745]' : 'bg-[#087A5C]'
                            }`}
                            style={{ width: `${percentOfBuffer}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-mono text-[11px] text-neutral-600">{item.batchNumber}</div>
                        <div className="text-[10px] text-neutral-500">صلاحية: {item.expiryOrMaintenanceDate}</div>
                      </td>

                      <td className="py-3 px-3">
                        {item.coldChainRequirement ? (
                          <div className="flex items-center gap-1 text-[11px] text-[#087A5C]">
                            <Thermometer className="w-3.5 h-3.5 text-[#09AAA8]" />
                            <span>{item.tempRange || item.coldChainRequirement}</span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 text-[11px]">حرارة عادية</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {getStatusBadge(item.status)}
                      </td>

                      <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        {item.status !== 'available' ? (
                          <button
                            onClick={() => onOpenSupplyModal(item.id)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-[#D84E53] hover:bg-red-700 rounded-md transition-colors"
                          >
                            طلب تعزيز
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedItemForDetails(item)}
                            className="px-2.5 py-1 text-[11px] font-medium text-[#087A5C] bg-[#087A5C]/10 hover:bg-[#087A5C]/20 rounded-md transition-colors"
                          >
                            تفاصيل
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Details Modal */}
      {selectedItemForDetails && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DFE9E9] max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 border-b border-[#DFE9E9] pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#087A5C]/10 text-[#087A5C]">
                  {getCategoryIcon(selectedItemForDetails.category)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#173B43]">{selectedItemForDetails.nameAr}</h3>
                  <p className="text-xs text-neutral-500 font-mono">{selectedItemForDetails.nameEn}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItemForDetails(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#F6F9F9] rounded-lg">
                  <div className="text-neutral-500 text-[10px]">المنشأة المالكة</div>
                  <div className="font-bold text-[#173B43] mt-0.5">{selectedItemForDetails.hospitalName}</div>
                </div>

                <div className="p-3 bg-[#F6F9F9] rounded-lg">
                  <div className="text-neutral-500 text-[10px]">القطاع الصحي</div>
                  <div className="font-bold text-[#173B43] mt-0.5">
                    {HEALTH_SECTORS.find(s => s.id === selectedItemForDetails.sectorId)?.nameAr}
                  </div>
                </div>

                <div className="p-3 bg-[#F6F9F9] rounded-lg">
                  <div className="text-neutral-500 text-[10px]">الكمية الحالية</div>
                  <div className="font-bold font-mono text-[#087A5C] text-sm mt-0.5">
                    {selectedItemForDetails.currentStock} {selectedItemForDetails.unit}
                  </div>
                </div>

                <div className="p-3 bg-[#F6F9F9] rounded-lg">
                  <div className="text-neutral-500 text-[10px]">حد الأمان التشغيلي</div>
                  <div className="font-bold font-mono text-neutral-700 text-sm mt-0.5">
                    {selectedItemForDetails.safeBuffer} {selectedItemForDetails.unit}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F6F9F9] rounded-lg">
                <div className="text-neutral-500 text-[10px]">موقع التخزين الدقيق</div>
                <div className="font-semibold text-[#173B43] mt-0.5">{selectedItemForDetails.storageLocation}</div>
              </div>

              <div className="p-3 bg-[#F6F9F9] rounded-lg">
                <div className="text-neutral-500 text-[10px]">اشتراطات الحفظ وسلسلة التبريد</div>
                <div className="font-semibold text-[#087A5C] mt-0.5">
                  {selectedItemForDetails.coldChainRequirement || 'حرارة الغرفة العادية'}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-neutral-100 rounded-lg">
                <span className="text-neutral-600">رقم التشغيلة (Batch):</span>
                <span className="font-mono font-bold text-[#173B43]">{selectedItemForDetails.batchNumber}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#DFE9E9]">
              <button
                onClick={() => setSelectedItemForDetails(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  const id = selectedItemForDetails.id;
                  setSelectedItemForDetails(null);
                  onOpenSupplyModal(id);
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#087A5C] hover:bg-[#06654c] rounded-lg shadow-sm"
              >
                إنشاء طلب إمداد لهذا الصنف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
