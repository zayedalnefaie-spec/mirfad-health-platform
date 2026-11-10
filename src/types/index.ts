export type ResourceCategory = 'medicines' | 'supplies' | 'blood' | 'equipment';

export type PriorityLevel = 'critical' | 'urgent' | 'routine';

export type RequestStatus = 
  | 'draft'
  | 'broadcasted' 
  | 'offers_received' 
  | 'approved' 
  | 'in_preparation' 
  | 'in_transit' 
  | 'arrived' 
  | 'received' 
  | 'rejected' 
  | 'cancelled';

export type HealthSectorId = 'moh' | 'mngha' | 'mod' | 'moi' | 'kfshrc';

export interface HealthSector {
  id: HealthSectorId;
  nameAr: string;
  nameEn: string;
  badge: string;
  hospitalsCount: number;
  color: string;
}

export interface Hospital {
  id: string;
  nameAr: string;
  nameEn: string;
  sectorId: HealthSectorId;
  city: string;
  region: string;
  type: string;
  phone: string;
  activeRequestsCount: number;
  availableStockIndex: number; // percentage
  coordinates?: { lat: number; lng: number };
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  roleCategory: 'physician' | 'pharmacist' | 'lab_tech' | 'engineer' | 'logistics' | 'admin';
  hospitalId: string;
  hospitalName: string;
  sectorId: HealthSectorId;
  sectorName: string;
  avatarSeed: string;
}

export interface InventoryItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: ResourceCategory;
  hospitalId: string;
  hospitalName: string;
  sectorId: HealthSectorId;
  currentStock: number;
  safeBuffer: number;
  unit: string;
  status: 'available' | 'low' | 'critical';
  batchNumber: string;
  expiryOrMaintenanceDate: string;
  coldChainRequirement?: string;
  tempRange?: string;
  deviceCondition?: 'operational' | 'standby' | 'in_calibration';
  storageLocation: string;
  notes?: string;
}

export interface ResponseOffer {
  id: string;
  requestId: string;
  offeringHospitalId: string;
  offeringHospitalName: string;
  offeringSectorId: HealthSectorId;
  quantityOffered: number;
  prepTimeMinutes: number;
  transportProvidedBy: 'offering' | 'requesting' | 'mirfad_fleet';
  coldChainGuaranteed: boolean;
  notes?: string;
  status: 'pending' | 'accepted' | 'declined';
  submittedAt: string;
}

export interface ShipmentTelemetry {
  currentTempC: number;
  targetTempMinC: number;
  targetTempMaxC: number;
  tempHistory: { time: string; temp: number }[];
  vehiclePlate: string;
  driverName: string;
  driverPhone: string;
  currentLocationDesc: string;
  etaMinutes: number;
  departureTime: string;
}

export interface SupplyRequest {
  id: string;
  requestNumber: string;
  category: ResourceCategory;
  itemId?: string;
  itemNameAr: string;
  itemNameEn: string;
  quantityRequested: number;
  unit: string;
  priority: PriorityLevel;
  requestingHospitalId: string;
  requestingHospitalName: string;
  requestingSectorId: HealthSectorId;
  requestingCity: string;
  requestingUser: string;
  createdAt: string;
  status: RequestStatus;
  urgencyReason: string;
  coldChainRequired: boolean;
  requiredTempRange?: string;
  scope: 'cluster' | 'sector' | 'all_sectors';
  offers: ResponseOffer[];
  acceptedOfferId?: string;
  telemetry?: ShipmentTelemetry;
  receiptInspection?: {
    verifiedAt: string;
    verifiedBy: string;
    actualQuantity: number;
    tempComplianceMet: boolean;
    batchMatched: boolean;
    packageIntact: boolean;
    notes?: string;
    signatureName: string;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  hospitalName: string;
  action: string;
  details: string;
  category: 'request' | 'offer' | 'transit' | 'receipt' | 'inventory' | 'auth';
  verificationHash: string;
}
