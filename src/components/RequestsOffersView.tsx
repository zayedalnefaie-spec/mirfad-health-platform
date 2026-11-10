import React, { useState } from 'react';
import { 
  Send, 
  Inbox, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Thermometer, 
  Plus, 
  FileCheck,
  Building2,
  Calendar,
  X
} from 'lucide-react';
import { SupplyRequest, ResponseOffer, UserProfile, RequestStatus } from '../types';
import { HEALTH_SECTORS } from '../data/mockData';

interface RequestsOffersViewProps {
  currentUser: UserProfile;
  requests: SupplyRequest[];
  onAcceptOffer: (requestId: string, offerId: string) => void;
  onSubmitOffer: (requestId: string, offer: ResponseOffer) => void;
  onOpenSupplyModal: () => void;
  onSelectForTracking: (requestId: string) => void;
  onOpenReceiptInspection: (request: SupplyRequest) => void;
}

export const RequestsOffersView: React.FC<RequestsOffersViewProps> = ({
  currentUser,
  requests,
  onAcceptOffer,
  onSubmitOffer,
  onOpenSupplyModal,
  onSelectForTracking,
  onOpenReceiptInspection
}) => {
  const [activeTab, setActiveTab] = useState<'outgoing' | 'incoming' | 'completed'>('outgoing');
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  // Offer submission modal state
  const [offeringModalRequest, setOfferingModalRequest] = useState<SupplyRequest | null>(null);
  const [quantityOffered, setQuantityOffered] = useState<number>(1);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number>(20);
  const [transportProvidedBy, setTransportProvidedBy] = useState<'offering' | 'requesting' | 'mirfad_fleet'>('mirfad_fleet');
  const [coldChainGuaranteed, setColdChainGuaranteed] = useState<boolean>(true);
  const [offerNotes, setOfferNotes] = useState<string>('الكمية متوفرة بمطابقة سريرية ومعايرة سارية وجاهزة للشحن فوراً.');

  // Categorize requests
  const outgoingRequests = requests.filter(r => r.requestingHospitalId === currentUser.hospitalId && r.status !== 'received');
  const incomingRequests = requests.filter(r => r.requestingHospitalId !== currentUser.hospitalId && !['received', 'cancelled'].includes(r.status));
  const completedRequests = requests.filter(r => r.status === 'received');

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'broadcasted':
        return <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded-full">بث جديد (بانتظار العروض)</span>;
      case 'offers_received':
        return <span className="text-xs font-bold text-[#09AAA8] bg-[#09AAA8]/10 px-2.5 py-0.5 rounded-full">عروض متاحة للمراجعة</span>;
      case 'approved':
      case 'in_preparation':
        return <span className="text-xs font-bold text-[#087A5C] bg-[#087A5C]/10 px-2.5 py-0.5 rounded-full">معتمد وجاري التجهيز</span>;
      case 'in_transit':
        return <span className="text-xs font-bold text-[#DDA745] bg-[#DDA745]/15 px-2.5 py-0.5 rounded-full">في مسار النقل الميداني</span>;
      case 'arrived':
        return <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">وصل للمنشأة (بانتظار الفحص)</span>;
      case 'received':
        return <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">مستلم وموثق بالسجل</span>;
      default:
        return <span className="text-xs text-neutral-500">{status}</span>;
    }
  };

  const handleOpenOfferModal = (req: SupplyRequest) => {
    setOfferingModalRequest(req);
    setQuantityOffered(req.quantityRequested);
    setOfferNotes('تم فحص المخزون والكمية متاحة دون التأثير على حد الأمان للمنشأة.');
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeringModalRequest) return;

    const newOffer: ResponseOffer = {
      id: `off-${Date.now()}`,
      requestId: offeringModalRequest.id,
      offeringHospitalId: currentUser.hospitalId,
      offeringHospitalName: currentUser.hospitalName,
      offeringSectorId: currentUser.sectorId,
      quantityOffered: Number(quantityOffered),
      prepTimeMinutes: Number(prepTimeMinutes),
      transportProvidedBy,
      coldChainGuaranteed,
      notes: offerNotes,
      status: 'pending',
      submittedAt: 'الآن'
    };

    onSubmitOffer(offeringModalRequest.id, newOffer);
    setOfferingModalRequest(null);
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="bg-white p-5 rounded-xl border border-[#DFE9E9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#173B43]">إدارة طلبات الإمداد التبادلي وعروض الاستجابة</h2>
          <p className="text-xs text-neutral-500 mt-1">
            متابعة دورة الطلبات الواردة والصادرة، اعتماد عروض الدعم، وإصدار أوامر التحريك اللوجستي
          </p>
        </div>

        <button
          onClick={onOpenSupplyModal}
          className="px-4 py-2 text-xs font-bold text-white bg-[#087A5C] hover:bg-[#06654c] rounded-lg shadow-sm transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>طلب إمداد جديد</span>
        </button>
      </div>

      {/* Segmented Tab Controls */}
      <div className="flex items-center gap-2 border-b border-[#DFE9E9] pb-1 text-xs">
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'outgoing'
              ? 'bg-[#087A5C] text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>طلبات صادرة من منشأتي ({outgoingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'incoming'
              ? 'bg-[#087A5C] text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>طلبات واردة من مستشفيات أخرى ({incomingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-[#087A5C] text-white shadow-sm'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>الطلبات المكتملة والمستلمة ({completedRequests.length})</span>
        </button>
      </div>

      {/* Content for Tabs */}
      <div className="space-y-4">
        {activeTab === 'outgoing' && (
          <>
            {outgoingRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#DFE9E9] p-12 text-center text-neutral-400 text-xs">
                لا توجد طلبات صادرة نشطة من منشأتك حالياً. يمكنك إنشاء طلب جديد عند وجود نقص.
              </div>
            ) : (
              outgoingRequests.map(req => {
                const isExpanded = expandedRequestId === req.id || req.status === 'offers_received';
                return (
                  <div key={req.id} className="bg-white rounded-xl border border-[#DFE9E9] shadow-sm overflow-hidden">
                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            req.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {req.priority === 'critical' ? 'طارئ جداً - إنقاذ حياة' : 'عاجل'}
                          </span>
                          <span className="font-mono text-xs font-bold text-neutral-600">{req.requestNumber}</span>
                          <span className="text-xs text-neutral-400">·</span>
                          <span className="text-xs text-neutral-500">تم البث: {req.createdAt}</span>
                          <span className="text-xs text-neutral-400">·</span>
                          <span className="text-xs text-neutral-500">بواسطة: {req.requestingUser}</span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <h3 className="text-base font-bold text-[#173B43]">{req.itemNameAr}</h3>
                          <span className="text-xs font-mono text-neutral-500">{req.itemNameEn}</span>
                        </div>

                        <p className="text-xs text-neutral-600 line-clamp-2">
                          <span className="font-semibold text-neutral-700">المبرر:</span> {req.urgencyReason}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-left md:text-right">
                          <div className="text-[11px] text-neutral-500">الكمية المطلوبة</div>
                          <div className="text-base font-bold font-mono text-[#087A5C] tabular-nums">
                            {req.quantityRequested} {req.unit}
                          </div>
                        </div>

                        <div>{getStatusBadge(req.status)}</div>

                        <button
                          onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100"
                        >
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Drawer: Offers list & actions */}
                    {isExpanded && (
                      <div className="border-t border-[#DFE9E9] bg-[#F6F9F9] p-5 space-y-4 text-xs">
                        {req.status === 'in_transit' && (
                          <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#087A5C] font-semibold">
                              <Truck className="w-4 h-4 text-[#09AAA8]" />
                              <span>الشحنة بالمسار الميداني حالياً</span>
                            </div>
                            <button
                              onClick={() => onSelectForTracking(req.id)}
                              className="px-3 py-1 text-xs font-bold bg-[#087A5C] text-white rounded-md hover:bg-[#06654c]"
                            >
                              عرض شاشة التتبع الحراري
                            </button>
                          </div>
                        )}

                        {req.status === 'arrived' && (
                          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-2 text-blue-900 font-bold">
                              <ShieldCheck className="w-5 h-5 text-blue-600" />
                              <span>وصلت الشحنة لبوابة المنشأة! بانتظار استكمال فحص الجودة والتسليم الصيدلاني</span>
                            </div>
                            <button
                              onClick={() => onOpenReceiptInspection(req)}
                              className="px-4 py-1.5 text-xs font-bold bg-blue-700 text-white rounded-md hover:bg-blue-800 shadow-sm"
                            >
                              بدء الفحص وتأكيد الاستلام
                            </button>
                          </div>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-[#173B43]">
                              عروض الاستجابة المقدمة من المستشفيات ({req.offers.length}):
                            </span>
                            {req.offers.length === 0 && (
                              <span className="text-neutral-400 text-[11px]">جاري انتظار استجابة المنشآت الشريكة...</span>
                            )}
                          </div>

                          {req.offers.length === 0 ? (
                            <div className="p-4 bg-white rounded-lg border border-[#DFE9E9] text-center text-neutral-400">
                              لم تقدم أي منشأة عرض استجابة حتى الآن. سيتم إشعارك فور ورود عروض.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {req.offers.map(offer => (
                                <div 
                                  key={offer.id}
                                  className={`p-3.5 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white ${
                                    offer.status === 'accepted' ? 'border-[#087A5C] ring-1 ring-[#087A5C]' : 'border-[#DFE9E9]'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-[#173B43]">{offer.offeringHospitalName}</span>
                                      <span className="text-[10px] text-neutral-500 font-medium">· منذ وقت قصير</span>
                                      {offer.status === 'accepted' && (
                                        <span className="text-[10px] font-bold text-white bg-[#087A5C] px-2 py-0.2 rounded-full">
                                          تم اعتماده وتأكيد الحجز
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-neutral-600 mt-1 flex items-center gap-3 flex-wrap text-[11px]">
                                      <span>الكمية المعروضة: <strong className="text-[#087A5C]">{offer.quantityOffered} {req.unit}</strong></span>
                                      <span>·</span>
                                      <span>زمن التجهيز: <strong>{offer.prepTimeMinutes} دقيقة</strong></span>
                                      <span>·</span>
                                      <span>ضمان التبريد: <strong>{offer.coldChainGuaranteed ? 'مطابق ومعتمد' : 'غير مطلوب'}</strong></span>
                                    </div>
                                    {offer.notes && (
                                      <p className="text-[11px] text-neutral-500 mt-1 italic">
                                        « {offer.notes} »
                                      </p>
                                    )}
                                  </div>

                                  <div className="shrink-0 flex items-center gap-2">
                                    {offer.status === 'pending' && req.status === 'offers_received' && (
                                      <button
                                        onClick={() => onAcceptOffer(req.id, offer.id)}
                                        className="px-4 py-1.5 text-xs font-bold text-white bg-[#087A5C] hover:bg-[#06654c] rounded-md shadow-sm transition-colors cursor-pointer"
                                      >
                                        اعتماد العرض وحجز الكمية
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === 'incoming' && (
          <>
            {incomingRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#DFE9E9] p-12 text-center text-neutral-400 text-xs">
                لا توجد طلبات إمداد واردة بانتظار استجابتك حالياً.
              </div>
            ) : (
              incomingRequests.map(req => {
                const userOffered = req.offers.some(o => o.offeringHospitalId === currentUser.hospitalId);
                return (
                  <div key={req.id} className="bg-white rounded-xl border border-[#DFE9E9] p-5 shadow-sm space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            req.priority === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {req.priority === 'critical' ? 'طارئ جداً' : 'عاجل'}
                          </span>
                          <span className="font-mono text-xs font-bold text-neutral-600">{req.requestNumber}</span>
                          <span className="text-xs text-neutral-400">·</span>
                          <span className="text-xs font-bold text-[#087A5C]">{req.requestingHospitalName}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#173B43]">{req.itemNameAr}</h3>
                        <p className="text-xs text-neutral-600">{req.urgencyReason}</p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-left md:text-right">
                          <div className="text-[11px] text-neutral-500">الكمية المطلوبة</div>
                          <div className="text-base font-bold font-mono text-[#173B43]">
                            {req.quantityRequested} {req.unit}
                          </div>
                        </div>

                        {userOffered ? (
                          <span className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>قدمت منشأتك عرضاً</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenOfferModal(req)}
                            className="px-4 py-2 text-xs font-bold text-white bg-[#09AAA8] hover:bg-[#078e8c] rounded-lg shadow-sm transition-colors cursor-pointer"
                          >
                            تقديم عرض استجابة
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedRequests.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#DFE9E9] p-12 text-center text-neutral-400 text-xs">
                لا توجد طلبات مؤرشفة بعد.
              </div>
            ) : (
              completedRequests.map(req => (
                <div key={req.id} className="bg-white rounded-xl border border-[#DFE9E9] p-5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FileCheck className="w-3 h-3" />
                        <span>مستلم ومطابق</span>
                      </span>
                      <span className="font-mono text-xs text-neutral-500">{req.requestNumber}</span>
                    </div>
                    <span className="text-xs text-neutral-500">{req.receiptInspection?.verifiedAt}</span>
                  </div>

                  <div className="font-bold text-[#173B43]">{req.itemNameAr} ({req.quantityRequested} {req.unit})</div>
                  <div className="text-xs text-neutral-600 flex items-center gap-3">
                    <span>المنشأة المستفيدة: {req.requestingHospitalName}</span>
                    <span>·</span>
                    <span>الموقع المستلم: {req.receiptInspection?.signatureName}</span>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Offer Submission Modal */}
      {offeringModalRequest && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#DFE9E9] max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#DFE9E9] mb-4">
              <div>
                <h3 className="text-base font-bold text-[#173B43]">تقديم عرض استجابة إمداد صحي</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  طلب رقم: <span className="font-mono font-bold">{offeringModalRequest.requestNumber}</span>
                </p>
              </div>
              <button 
                onClick={() => setOfferingModalRequest(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendOffer} className="space-y-4 text-xs">
              <div className="p-3 bg-[#F6F9F9] rounded-lg">
                <div className="text-neutral-500 text-[10px]">الصنف المطلوب:</div>
                <div className="font-bold text-[#173B43] text-sm mt-0.5">{offeringModalRequest.itemNameAr}</div>
                <div className="text-[11px] text-neutral-600 mt-0.5">
                  الجهة الطالبة: {offeringModalRequest.requestingHospitalName} ({offeringModalRequest.quantityRequested} {offeringModalRequest.unit})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">الكمية التي تستطيع منشأتك تأمينها:</label>
                  <input
                    type="number"
                    min="1"
                    max={offeringModalRequest.quantityRequested * 2}
                    value={quantityOffered}
                    onChange={(e) => setQuantityOffered(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-[#DFE9E9] rounded-lg font-mono font-bold text-sm text-[#173B43]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1">الزمن المتوقع لتجهيز الصندوق (بالدقائق):</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-[#DFE9E9] rounded-lg font-mono font-bold text-sm text-[#173B43]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">آلية النقل المقترحة:</label>
                <select
                  value={transportProvidedBy}
                  onChange={(e: any) => setTransportProvidedBy(e.target.value)}
                  className="w-full p-2 bg-white border border-[#DFE9E9] rounded-lg text-neutral-700"
                >
                  <option value="mirfad_fleet">أسطول الإمداد المشترك لمنصة مِرفاد (مركبة مجهزة سلسلة تبريد)</option>
                  <option value="offering">سيارة نقل تابعة لمنشأتنا (المستشفى المورد)</option>
                  <option value="requesting">تنسيق استلام من قبل سيارة المستشفى الطالب</option>
                </select>
              </div>

              <label className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-lg cursor-pointer text-[#087A5C] font-semibold">
                <input
                  type="checkbox"
                  checked={coldChainGuaranteed}
                  onChange={(e) => setColdChainGuaranteed(e.target.checked)}
                  className="rounded text-[#087A5C]"
                />
                <span>نضمن شروط الحفظ والتبريد السريري المعتمد حتى التسليم</span>
              </label>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">ملاحظات سريرية أو لوجستية:</label>
                <textarea
                  rows={2}
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  className="w-full p-2 bg-white border border-[#DFE9E9] rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-[#DFE9E9] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOfferingModalRequest(null)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#09AAA8] hover:bg-[#078e8c] rounded-lg shadow-sm"
                >
                  إرسال عرض الاستجابة فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
