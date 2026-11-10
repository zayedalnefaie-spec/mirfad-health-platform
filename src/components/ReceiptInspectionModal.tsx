import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Thermometer, 
  AlertTriangle, 
  FileCheck, 
  X, 
  FileSignature, 
  Building 
} from 'lucide-react';
import { SupplyRequest, UserProfile } from '../types';

interface ReceiptInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: SupplyRequest | null;
  currentUser: UserProfile;
  onConfirmReceipt: (
    requestId: string, 
    actualQuantity: number, 
    signatureName: string, 
    notes: string
  ) => void;
}

export const ReceiptInspectionModal: React.FC<ReceiptInspectionModalProps> = ({
  isOpen,
  onClose,
  request,
  currentUser,
  onConfirmReceipt
}) => {
  if (!isOpen || !request) return null;

  const [packageIntact, setPackageIntact] = useState(true);
  const [batchMatched, setBatchMatched] = useState(true);
  const [tempCompliant, setTempCompliant] = useState(true);
  const [actualQuantity, setActualQuantity] = useState(request.quantityRequested);
  const [signatureName, setSignatureName] = useState(currentUser.name);
  const [inspectionNotes, setInspectionNotes] = useState('تم فحص الطرد مخبرياً ومطابقة حرارة التبريد واستلام كامل الكمية بحالة ممتازة.');

  const canConfirm = packageIntact && batchMatched && tempCompliant && actualQuantity > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canConfirm) return;

    onConfirmReceipt(request.id, Number(actualQuantity), signatureName, inspectionNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#DFE9E9] max-w-xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between pb-4 border-b border-[#DFE9E9] mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#087A5C]/10 text-[#087A5C]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#173B43]">فحص جودة الشحنة وتأكيد الاستلام الرسمي</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                طلب إمداد رقم: <span className="font-mono font-bold">{request.requestNumber}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Summary Box */}
          <div className="p-3.5 bg-[#F6F9F9] rounded-xl border border-[#DFE9E9] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#173B43] text-sm">{request.itemNameAr}</span>
              <span className="font-mono font-bold text-[#087A5C] text-sm tabular-nums">
                {request.quantityRequested} {request.unit}
              </span>
            </div>
            <div className="text-neutral-500 text-[11px] flex items-center gap-3">
              <span>المنشأة المستلمة: {request.requestingHospitalName}</span>
              <span>·</span>
              <span>المصدر: {request.offers.find(o => o.status === 'accepted')?.offeringHospitalName}</span>
            </div>
          </div>

          {/* Quality & Safety Inspection Checklist */}
          <div>
            <label className="block font-bold text-neutral-700 mb-2">قائمة التحقق والفحص السريري الإلزامي:</label>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2.5 bg-white border border-[#DFE9E9] rounded-lg cursor-pointer hover:border-[#09AAA8] transition-colors">
                <span className="text-neutral-700 font-medium">1. سلامة العبوة الخارجية والأختام الأمنية وعدم وجود تسريب أو تلف</span>
                <input
                  type="checkbox"
                  checked={packageIntact}
                  onChange={(e) => setPackageIntact(e.target.checked)}
                  className="w-4 h-4 text-[#087A5C] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-white border border-[#DFE9E9] rounded-lg cursor-pointer hover:border-[#09AAA8] transition-colors">
                <span className="text-neutral-700 font-medium">2. مطابقة رقم التشغيلة والمواصفات الفنية مع بوليصة النقل</span>
                <input
                  type="checkbox"
                  checked={batchMatched}
                  onChange={(e) => setBatchMatched(e.target.checked)}
                  className="w-4 h-4 text-[#087A5C] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-white border border-[#DFE9E9] rounded-lg cursor-pointer hover:border-[#09AAA8] transition-colors">
                <span className="text-neutral-700 font-medium">3. قراءة سلسلة التبريد ضمن المدى المعتمد طوال مسار النقل</span>
                <input
                  type="checkbox"
                  checked={tempCompliant}
                  onChange={(e) => setTempCompliant(e.target.checked)}
                  className="w-4 h-4 text-[#087A5C] rounded"
                />
              </label>
            </div>
          </div>

          {/* Actual Quantity Verified */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">الكمية الفعلية المقبولة للاستلام:</label>
              <input
                type="number"
                min="1"
                value={actualQuantity}
                onChange={(e) => setActualQuantity(Number(e.target.value))}
                className="w-full p-2 bg-white border border-[#DFE9E9] rounded-lg font-mono font-bold text-sm text-[#173B43]"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">اسم المسؤول المستلم والمصرح له:</label>
              <input
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="w-full p-2 bg-white border border-[#DFE9E9] rounded-lg font-semibold text-[#173B43]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">تقرير الفحص وملاحظات الاستلام:</label>
            <textarea
              rows={2}
              value={inspectionNotes}
              onChange={(e) => setInspectionNotes(e.target.value)}
              className="w-full p-2 bg-white border border-[#DFE9E9] rounded-lg"
            />
          </div>

          {/* Sign-off Actions */}
          <div className="pt-3 border-t border-[#DFE9E9] flex items-center justify-between">
            <div className="text-[11px] text-neutral-500">
              * سيتم قيد العملية في سجل التدقيق وتحديث أرصدة المخزون تلقائياً
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={!canConfirm}
                className={`px-5 py-2 font-bold text-white rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer ${
                  canConfirm 
                    ? 'bg-[#087A5C] hover:bg-[#06654c]' 
                    : 'bg-neutral-300 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>اعتماد الاستلام وتحديث الرصيد</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
