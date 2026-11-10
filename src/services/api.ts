import { 
  HealthSector, 
  Hospital, 
  InventoryItem, 
  SupplyRequest, 
  ResponseOffer, 
  AuditLogEntry 
} from '../types';

const API_BASE = '/api';

export interface HealthResponse {
  status: string;
  service: string;
  mode: string;
  persistence: string;
  note?: string;
  timestamp: string;
}

/**
 * Check reference backend health status
 */
export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed with status: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch all participating health sectors
 */
export async function fetchSectors(): Promise<HealthSector[]> {
  const res = await fetch(`${API_BASE}/sectors`);
  if (!res.ok) {
    throw new Error(`Failed to fetch sectors: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch all registered partner hospitals
 */
export async function fetchHospitals(): Promise<Hospital[]> {
  const res = await fetch(`${API_BASE}/hospitals`);
  if (!res.ok) {
    throw new Error(`Failed to fetch hospitals: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch unified inventory with optional filtering
 */
export async function fetchInventory(filters?: {
  category?: string;
  sectorId?: string;
  status?: string;
}): Promise<InventoryItem[]> {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== 'all') {
    params.set('category', filters.category);
  }
  if (filters?.sectorId && filters.sectorId !== 'all') {
    params.set('sectorId', filters.sectorId);
  }
  if (filters?.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/inventory${query}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch inventory: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch supply requests with optional filtering
 */
export async function fetchRequests(filters?: {
  status?: string;
  priority?: string;
}): Promise<SupplyRequest[]> {
  const params = new URLSearchParams();
  if (filters?.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }
  if (filters?.priority && filters.priority !== 'all') {
    params.set('priority', filters.priority);
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE}/requests${query}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch supply requests: ${res.status}`);
  }
  return res.json();
}

/**
 * Broadcast a new supply request
 */
export async function createSupplyRequest(
  payload: Partial<SupplyRequest>
): Promise<SupplyRequest> {
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to create request: ${res.status}`);
  }
  return res.json();
}

/**
 * Submit an offer to fulfill a supply request
 */
export async function submitOffer(
  requestId: string,
  offerPayload: Partial<ResponseOffer> & { actorName?: string }
): Promise<{ request: SupplyRequest; offer: ResponseOffer }> {
  const res = await fetch(`${API_BASE}/requests/${requestId}/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offerPayload)
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to submit offer: ${res.status}`);
  }
  return res.json();
}

/**
 * Accept a specific offer for a request
 */
export async function acceptOffer(
  requestId: string,
  offerId: string,
  actorName?: string
): Promise<{ request: SupplyRequest; acceptedOffer: ResponseOffer }> {
  const res = await fetch(`${API_BASE}/requests/${requestId}/accept-offer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offerId, actorName })
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to accept offer: ${res.status}`);
  }
  return res.json();
}

/**
 * Confirm receipt, complete inspection, and reconcile inventory
 */
export async function confirmReceipt(
  requestId: string,
  inspection: {
    actualQuantity: number;
    signatureName: string;
    notes?: string;
    tempComplianceMet?: boolean;
    batchMatched?: boolean;
    packageIntact?: boolean;
  }
): Promise<{ request: SupplyRequest; reconciledItem?: InventoryItem | null }> {
  const res = await fetch(`${API_BASE}/requests/${requestId}/receipt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inspection)
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to confirm receipt: ${res.status}`);
  }
  return res.json();
}

/**
 * Fetch audit logs trail
 */
export async function fetchAuditLogs(): Promise<AuditLogEntry[]> {
  const res = await fetch(`${API_BASE}/audit`);
  if (!res.ok) {
    throw new Error(`Failed to fetch audit logs: ${res.status}`);
  }
  return res.json();
}
