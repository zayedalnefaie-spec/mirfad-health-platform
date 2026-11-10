import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { RequestsOffersView } from './components/RequestsOffersView';
import { TrackingView } from './components/TrackingView';
import { NetworkDirectoryView } from './components/NetworkDirectoryView';
import { AuditGovernanceView } from './components/AuditGovernanceView';
import { HackathonDossierView } from './components/HackathonDossierView';
import { SupplyRequestModal } from './components/SupplyRequestModal';
import { ReceiptInspectionModal } from './components/ReceiptInspectionModal';
import { LoginModal } from './components/LoginModal';
import { SystemTourModal } from './components/SystemTourModal';
import { 
  DEMO_USERS, 
  INITIAL_INVENTORY, 
  INITIAL_SUPPLY_REQUESTS, 
  INITIAL_AUDIT_LOGS 
} from './data/mockData';
import { 
  UserProfile, 
  InventoryItem, 
  SupplyRequest, 
  ResponseOffer, 
  AuditLogEntry 
} from './types';
import { 
  fetchInventory, 
  fetchRequests, 
  fetchAuditLogs, 
  createSupplyRequest, 
  submitOffer, 
  acceptOffer, 
  confirmReceipt 
} from './services/api';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const isApiEnabled = import.meta.env.VITE_USE_API === 'true';

  // Global State (defaults to bundled initial data for instant offline review)
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [requests, setRequests] = useState<SupplyRequest[]>(INITIAL_SUPPLY_REQUESTS);
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Load from backend API when VITE_USE_API is explicitly enabled
  useEffect(() => {
    if (isApiEnabled) {
      Promise.all([
        fetchInventory().catch(() => INITIAL_INVENTORY),
        fetchRequests().catch(() => INITIAL_SUPPLY_REQUESTS),
        fetchAuditLogs().catch(() => INITIAL_AUDIT_LOGS)
      ]).then(([remoteInventory, remoteRequests, remoteLogs]) => {
        setInventory(remoteInventory);
        setRequests(remoteRequests);
        setLogs(remoteLogs);
      });
    }
  }, [isApiEnabled]);

  // Modals state
  const [isSupplyModalOpen, setIsSupplyModalOpen] = useState<boolean>(false);
  const [initialItemIdForSupply, setInitialItemIdForSupply] = useState<string | undefined>(undefined);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState<boolean>(false);
  const [selectedTrackingRequestId, setSelectedTrackingRequestId] = useState<string | null>(null);
  const [receiptInspectionRequest, setReceiptInspectionRequest] = useState<SupplyRequest | null>(null);

  // Transient Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Helper to add audit log to local working state
  const addAuditLog = (
    action: string, 
    details: string, 
    category: 'request' | 'offer' | 'transit' | 'receipt' | 'inventory' | 'auth'
  ) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: currentUser.name,
      actorRole: currentUser.role,
      hospitalName: currentUser.hospitalName,
      action,
      details,
      category,
      verificationHash: `SHA256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 6)}`
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // 1. Submit New Supply Request
  const handleCreateRequest = async (newRequest: SupplyRequest) => {
    if (isApiEnabled) {
      try {
        const created = await createSupplyRequest(newRequest);
        setRequests(prev => [created, ...prev]);
        const refreshedLogs = await fetchAuditLogs().catch(() => null);
        if (refreshedLogs) setLogs(refreshedLogs);
        showToast(`تم بث طلب الإمداد رقم ${created.requestNumber} بنجاح إلى شبكة المستشفيات`);
        return;
      } catch (err) {
        console.warn('API error, falling back to local state:', err);
      }
    }

    // Local offline state fallback
    setRequests(prev => [newRequest, ...prev]);
    addAuditLog('إنشاء وبث طلب إمداد', `بث طلب ${newRequest.itemNameAr} بكمية ${newRequest.quantityRequested} ${newRequest.unit}`, 'request');
    showToast(`تم بث طلب الإمداد رقم ${newRequest.requestNumber} بنجاح إلى شبكة المستشفيات`);
  };

  // 2. Submit Response Offer from a facility
  const handleSubmitOffer = async (requestId: string, offer: ResponseOffer) => {
    if (isApiEnabled) {
      try {
        const res = await submitOffer(requestId, offer);
        setRequests(prev => prev.map(r => r.id === requestId ? res.request : r));
        const refreshedLogs = await fetchAuditLogs().catch(() => null);
        if (refreshedLogs) setLogs(refreshedLogs);
        showToast(`تم إرسال عرض الاستجابة بنجاح إلى المنشأة الطالبة`);
        return;
      } catch (err) {
        console.warn('API error, falling back to local state:', err);
      }
    }

    // Local offline state fallback
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedOffers = [...req.offers, offer];
        return {
          ...req,
          status: req.status === 'broadcasted' ? 'offers_received' : req.status,
          offers: updatedOffers
        };
      }
      return req;
    }));

    addAuditLog('تقديم عرض استجابة إمداد', `تم تقديم عرض دعم للطلب ${requestId} بكمية ${offer.quantityOffered}`, 'offer');
    showToast(`تم إرسال عرض الاستجابة بنجاح إلى المنشأة الطالبة`);
  };

  // 3. Accept Offer & Reserve Quantity
  const handleAcceptOffer = async (requestId: string, offerId: string) => {
    if (isApiEnabled) {
      try {
        const res = await acceptOffer(requestId, offerId, currentUser.name);
        setRequests(prev => prev.map(r => r.id === requestId ? res.request : r));
        const refreshedLogs = await fetchAuditLogs().catch(() => null);
        if (refreshedLogs) setLogs(refreshedLogs);
        showToast(`تم اعتماد العرض وحجز الكمية بنجاح! الشحنة الآن بالمسار الميداني`);
        setSelectedTrackingRequestId(requestId);
        return;
      } catch (err) {
        console.warn('API error, falling back to local state:', err);
      }
    }

    // Local offline state fallback
    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedOffers = req.offers.map(o => ({
          ...o,
          status: o.id === offerId ? ('accepted' as const) : ('declined' as const)
        }));

        return {
          ...req,
          status: 'in_transit' as const,
          acceptedOfferId: offerId,
          offers: updatedOffers,
          telemetry: {
            currentTempC: req.category === 'blood' ? 22.1 : 4.5,
            targetTempMinC: req.category === 'blood' ? 20.0 : 2.0,
            targetTempMaxC: req.category === 'blood' ? 24.0 : 8.0,
            tempHistory: [
              { time: '11:30', temp: 4.2 },
              { time: '11:35', temp: 4.5 }
            ],
            vehiclePlate: 'أ ب ر 4812 (مركبة مجهزة)',
            driverName: 'منصور السبيعي',
            driverPhone: '050-8472911',
            currentLocationDesc: 'طريق الدائري السريع - متوجه لمقر المستشفى',
            etaMinutes: 18,
            departureTime: 'الآن'
          }
        };
      }
      return req;
    }));

    addAuditLog('اعتماد العرض وحجز المورد', `تم قبول العرض وتحويل الطلب للمسار اللوجستي الميداني`, 'offer');
    showToast(`تم اعتماد العرض وحجز الكمية بنجاح! الشحنة الآن بالمسار الميداني`);
    setSelectedTrackingRequestId(requestId);
  };

  // 4. Confirm Receipt & Reconcile Stock
  const handleConfirmReceipt = async (
    requestId: string, 
    actualQuantity: number, 
    signatureName: string, 
    notes: string
  ) => {
    if (isApiEnabled) {
      try {
        const res = await confirmReceipt(requestId, {
          actualQuantity,
          signatureName,
          notes
        });
        setRequests(prev => prev.map(r => r.id === requestId ? res.request : r));
        if (res.reconciledItem) {
          setInventory(prev => prev.map(item => item.id === res.reconciledItem?.id ? res.reconciledItem! : item));
        }
        const refreshedLogs = await fetchAuditLogs().catch(() => null);
        if (refreshedLogs) setLogs(refreshedLogs);
        showToast(`تم اعتماد الفحص والاستلام بنجاح، وتحديث رصيد المخزون التبادلي`);
        return;
      } catch (err) {
        console.warn('API error, falling back to local state:', err);
      }
    }

    // Local offline state fallback
    const targetReq = requests.find(r => r.id === requestId);
    if (!targetReq) return;

    setRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'received' as const,
          receiptInspection: {
            verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            verifiedBy: signatureName,
            actualQuantity,
            tempComplianceMet: true,
            batchMatched: true,
            packageIntact: true,
            notes,
            signatureName
          }
        };
      }
      return req;
    }));

    // Reconcile Inventory (increment recipient's stock or update existing item)
    setInventory(prev => {
      return prev.map(item => {
        if (item.id === targetReq.itemId) {
          const newStock = item.currentStock + actualQuantity;
          return {
            ...item,
            currentStock: newStock,
            status: newStock >= item.safeBuffer ? 'available' : 'low'
          };
        }
        return item;
      });
    });

    addAuditLog(
      'تأكيد استلام وتسوية مخزون', 
      `استلام مطابق للشحنة ${targetReq.requestNumber} بكمية ${actualQuantity} ${targetReq.unit} وتحديث رصيد الصيدلية`, 
      'receipt'
    );

    showToast(`تم اعتماد الفحص والاستلام بنجاح، وتحديث رصيد المخزون التبادلي`);
  };

  // Count of pending actions for the badge
  const pendingRequestsCount = requests.filter(r => r.status === 'offers_received' || r.status === 'arrived').length;

  return (
    <div className="min-h-screen bg-[#F6F9F9] flex flex-col justify-between selection:bg-[#09AAA8]/20 selection:text-[#087A5C]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-[#173B43] text-white px-4 py-3 rounded-xl shadow-xl border border-teal-800 flex items-center gap-3 text-xs max-w-md">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-[#09AAA8] shrink-0" />
            )}
            <div className="flex-1 font-medium">{toastMessage.text}</div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-white/60 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        currentUser={currentUser}
        activeView={activeView}
        onNavigate={setActiveView}
        onOpenSupplyModal={() => {
          setInitialItemIdForSupply(undefined);
          setIsSupplyModalOpen(true);
        }}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenTourModal={() => setIsTourModalOpen(true)}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Main View Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {activeView === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            requests={requests}
            inventory={inventory}
            onNavigate={setActiveView}
            onOpenSupplyModal={(itemId) => {
              setInitialItemIdForSupply(itemId);
              setIsSupplyModalOpen(true);
            }}
            onSelectRequestForTracking={(reqId) => {
              setSelectedTrackingRequestId(reqId);
              setActiveView('tracking');
            }}
          />
        )}

        {activeView === 'inventory' && (
          <InventoryView
            inventory={inventory}
            onOpenSupplyModal={(itemId) => {
              setInitialItemIdForSupply(itemId);
              setIsSupplyModalOpen(true);
            }}
          />
        )}

        {activeView === 'requests' && (
          <RequestsOffersView
            currentUser={currentUser}
            requests={requests}
            onAcceptOffer={handleAcceptOffer}
            onSubmitOffer={handleSubmitOffer}
            onOpenSupplyModal={() => {
              setInitialItemIdForSupply(undefined);
              setIsSupplyModalOpen(true);
            }}
            onSelectForTracking={(reqId) => {
              setSelectedTrackingRequestId(reqId);
              setActiveView('tracking');
            }}
            onOpenReceiptInspection={(req) => setReceiptInspectionRequest(req)}
          />
        )}

        {activeView === 'tracking' && (
          <TrackingView
            requests={requests}
            selectedRequestId={selectedTrackingRequestId}
            onSelectRequest={setSelectedTrackingRequestId}
            onOpenReceiptInspection={(req) => setReceiptInspectionRequest(req)}
          />
        )}

        {activeView === 'directory' && (
          <NetworkDirectoryView />
        )}

        {activeView === 'audit' && (
          <AuditGovernanceView logs={logs} />
        )}

        {activeView === 'hackathon' && (
          <HackathonDossierView />
        )}
      </main>

      {/* Modals */}
      <SupplyRequestModal
        isOpen={isSupplyModalOpen}
        onClose={() => setIsSupplyModalOpen(false)}
        currentUser={currentUser}
        inventory={inventory}
        initialItemId={initialItemIdForSupply}
        onSubmitRequest={handleCreateRequest}
      />

      <ReceiptInspectionModal
        isOpen={Boolean(receiptInspectionRequest)}
        onClose={() => setReceiptInspectionRequest(null)}
        request={receiptInspectionRequest}
        currentUser={currentUser}
        onConfirmReceipt={handleConfirmReceipt}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={(user) => {
          setCurrentUser(user);
          addAuditLog('تسجيل دخول للكادر', `تسجيل دخول نشط للمستخدم ${user.name} في ${user.hospitalName}`, 'auth');
          showToast(`تم تبديل الجلسة إلى: ${user.name}`);
        }}
      />

      <SystemTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        onNavigate={setActiveView}
      />

      {/* Clean, Quiet Footer */}
      <footer className="border-t border-[#DFE9E9] bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#087A5C]">مِرفاد | MIRFAD</span>
            <span>·</span>
            <span>منصة التكامل والإمداد الصحي التبادلي</span>
            <span>·</span>
            <span className="font-mono">نسخة الهاكثون 2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>فريق العمل: د. محمد نصرالله · أ. معاذ الكردي · م. ريان الحربي</span>
            <span>·</span>
            <button 
              onClick={() => setIsTourModalOpen(true)}
              className="text-[#087A5C] hover:underline cursor-pointer"
            >
              دليل الاستخدام
            </button>
            <span>·</span>
            <button 
              onClick={() => setActiveView('hackathon')}
              className="text-[#09AAA8] hover:underline cursor-pointer"
            >
              ملف الابتكار
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
