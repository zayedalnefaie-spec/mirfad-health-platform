import express, { Express, Request, Response, NextFunction } from 'express';
import { randomUUID, createHash } from 'node:crypto';
import { 
  HEALTH_SECTORS, 
  HOSPITALS, 
  INITIAL_INVENTORY, 
  INITIAL_SUPPLY_REQUESTS, 
  INITIAL_AUDIT_LOGS 
} from '../src/data/mockData';
import { 
  InventoryItem, 
  SupplyRequest, 
  ResponseOffer, 
  AuditLogEntry, 
  ResourceCategory,
  PriorityLevel,
  RequestStatus
} from '../src/types';

export function createApp(): Express {
  const app = express();

  // Security & performance configurations
  app.disable('x-powered-by');
  app.use(express.json({ limit: '128kb' }));

  // Prototype CORS & header branding (clearly labeled for hackathon review)
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('X-Mirfad-Mode', 'prototype-reference-backend');
    res.setHeader('X-Mirfad-Data-Notice', 'simulated-data-no-real-patient-records');
    if (_req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // In-memory working copies cloned from initial seed data
  let workingInventory: InventoryItem[] = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
  let workingRequests: SupplyRequest[] = JSON.parse(JSON.stringify(INITIAL_SUPPLY_REQUESTS));
  let workingLogs: AuditLogEntry[] = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));

  // Helper for SHA-256 audit log hash calculation
  function createAuditHash(payload: string): string {
    const raw = `${payload}:${Date.now()}:${randomUUID()}`;
    return `SHA256:${createHash('sha256').update(raw).digest('hex').slice(0, 16)}`;
  }

  // 1. Health Endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'mirfad-reference-api',
      mode: 'prototype',
      persistence: 'in-memory',
      note: 'Reference backend for MIRFAD hackathon evaluation. Uses simulated data; no real patient data is stored.',
      timestamp: new Date().toISOString()
    });
  });

  // 2. Health Sectors Endpoint
  app.get('/api/sectors', (_req: Request, res: Response) => {
    res.json(HEALTH_SECTORS);
  });

  // 3. Hospitals Directory Endpoint
  app.get('/api/hospitals', (_req: Request, res: Response) => {
    res.json(HOSPITALS);
  });

  // 4. Inventory Endpoint with query filters
  app.get('/api/inventory', (req: Request, res: Response) => {
    const { category, sectorId, status } = req.query;
    let result = [...workingInventory];

    if (typeof category === 'string' && category !== 'all') {
      result = result.filter(item => item.category === category);
    }
    if (typeof sectorId === 'string' && sectorId !== 'all') {
      result = result.filter(item => item.sectorId === sectorId);
    }
    if (typeof status === 'string' && status !== 'all') {
      result = result.filter(item => item.status === status);
    }

    res.json(result);
  });

  // 5. Supply Requests Endpoint with query filters
  app.get('/api/requests', (req: Request, res: Response) => {
    const { status, priority } = req.query;
    let result = [...workingRequests];

    if (typeof status === 'string' && status !== 'all') {
      result = result.filter(r => r.status === status);
    }
    if (typeof priority === 'string' && priority !== 'all') {
      result = result.filter(r => r.priority === priority);
    }

    res.json(result);
  });

  // 6. Create Supply Request
  app.post('/api/requests', (req: Request, res: Response) => {
    const { 
      itemNameAr, 
      category, 
      quantityRequested, 
      unit, 
      priority, 
      requestingHospitalId, 
      requestingHospitalName, 
      requestingSectorId, 
      requestingUser 
    } = req.body;

    if (
      !itemNameAr || 
      !category || 
      !quantityRequested || 
      Number(quantityRequested) <= 0 || 
      !unit || 
      !priority || 
      !requestingHospitalId || 
      !requestingHospitalName || 
      !requestingSectorId || 
      !requestingUser
    ) {
      res.status(400).json({ 
        error: 'Missing or invalid required request fields',
        required: [
          'itemNameAr', 
          'category', 
          'quantityRequested', 
          'unit', 
          'priority', 
          'requestingHospitalId', 
          'requestingHospitalName', 
          'requestingSectorId', 
          'requestingUser'
        ]
      });
      return;
    }

    const id = `req-${randomUUID()}`;
    const requestNumber = `MRF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: SupplyRequest = {
      id,
      requestNumber,
      category: category as ResourceCategory,
      itemId: req.body.itemId,
      itemNameAr,
      itemNameEn: req.body.itemNameEn || itemNameAr,
      quantityRequested: Number(quantityRequested),
      unit,
      priority: priority as PriorityLevel,
      requestingHospitalId,
      requestingHospitalName,
      requestingSectorId,
      requestingCity: req.body.requestingCity || 'الرياض',
      requestingUser,
      createdAt: 'الآن (عبر واجهة API)',
      status: 'broadcasted' as RequestStatus,
      urgencyReason: req.body.urgencyReason || 'طلب إمداد صحي عاجل تم بثه عبر المنظومة',
      coldChainRequired: Boolean(req.body.coldChainRequired),
      requiredTempRange: req.body.requiredTempRange,
      scope: req.body.scope || 'all_sectors',
      offers: []
    };

    workingRequests.unshift(newRequest);

    // Create corresponding audit log
    const auditRecord: AuditLogEntry = {
      id: `log-${randomUUID()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: requestingUser,
      actorRole: req.body.actorRole || 'كادر صحي مصرح',
      hospitalName: requestingHospitalName,
      action: 'إنشاء وبث طلب إمداد',
      details: `بث طلب ${newRequest.itemNameAr} (${newRequest.quantityRequested} ${newRequest.unit}) برقم ${newRequest.requestNumber}`,
      category: 'request',
      verificationHash: createAuditHash(`${id}:${requestNumber}`)
    };
    workingLogs.unshift(auditRecord);

    res.status(201).json(newRequest);
  });

  // 7. Submit Response Offer for a Request
  app.post('/api/requests/:requestId/offers', (req: Request, res: Response) => {
    const { requestId } = req.params;
    const request = workingRequests.find(r => r.id === requestId);

    if (!request) {
      res.status(404).json({ error: `Request with id ${requestId} not found` });
      return;
    }

    const { 
      offeringHospitalId, 
      offeringHospitalName, 
      offeringSectorId, 
      quantityOffered 
    } = req.body;

    if (!offeringHospitalId || !offeringHospitalName || !offeringSectorId || !quantityOffered || Number(quantityOffered) <= 0) {
      res.status(400).json({ 
        error: 'Missing required offer fields',
        required: ['offeringHospitalId', 'offeringHospitalName', 'offeringSectorId', 'quantityOffered']
      });
      return;
    }

    const offerId = `off-${randomUUID()}`;
    const newOffer: ResponseOffer = {
      id: offerId,
      requestId: request.id,
      offeringHospitalId,
      offeringHospitalName,
      offeringSectorId,
      quantityOffered: Number(quantityOffered),
      prepTimeMinutes: Number(req.body.prepTimeMinutes) || 20,
      transportProvidedBy: req.body.transportProvidedBy || 'mirfad_fleet',
      coldChainGuaranteed: req.body.coldChainGuaranteed !== false,
      notes: req.body.notes || 'عرض استجابة إمداد موثق',
      status: 'pending',
      submittedAt: 'الآن'
    };

    request.offers.push(newOffer);
    if (request.status === 'broadcasted' || request.status === 'draft') {
      request.status = 'offers_received';
    }

    // Write audit record
    const auditRecord: AuditLogEntry = {
      id: `log-${randomUUID()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: req.body.actorName || offeringHospitalName,
      actorRole: 'منسق مخزون وسلاسل إمداد',
      hospitalName: offeringHospitalName,
      action: 'تقديم عرض استجابة إمداد',
      details: `تقديم عرض لتوفير ${newOffer.quantityOffered} ${request.unit} لطلب ${request.requestNumber}`,
      category: 'offer',
      verificationHash: createAuditHash(`${offerId}:${request.id}`)
    };
    workingLogs.unshift(auditRecord);

    res.status(201).json({ request, offer: newOffer });
  });

  // 8. Accept Offer & Transition to In-Transit
  app.post('/api/requests/:requestId/accept-offer', (req: Request, res: Response) => {
    const { requestId } = req.params;
    const { offerId } = req.body;

    const request = workingRequests.find(r => r.id === requestId);
    if (!request) {
      res.status(404).json({ error: `Request with id ${requestId} not found` });
      return;
    }

    if (!offerId) {
      res.status(400).json({ error: 'Missing required field: offerId' });
      return;
    }

    const targetOffer = request.offers.find(o => o.id === offerId);
    if (!targetOffer) {
      res.status(404).json({ error: `Offer with id ${offerId} not found on this request` });
      return;
    }

    // Mark target offer accepted, others declined
    request.offers.forEach(o => {
      o.status = (o.id === offerId) ? 'accepted' : 'declined';
    });

    request.acceptedOfferId = offerId;
    request.status = 'in_transit';

    // Populate live telemetry for tracking view
    request.telemetry = {
      currentTempC: request.category === 'blood' ? 22.1 : 4.5,
      targetTempMinC: request.category === 'blood' ? 20.0 : 2.0,
      targetTempMaxC: request.category === 'blood' ? 24.0 : 8.0,
      tempHistory: [
        { time: '11:30', temp: 4.2 },
        { time: '11:35', temp: 4.5 }
      ],
      vehiclePlate: 'أ ب ر 4812 (مركبة مجهزة)',
      driverName: 'منصور السبيعي',
      driverPhone: '050-8472911',
      currentLocationDesc: 'المسار الميداني السريع نحو المستشفى الطالب',
      etaMinutes: 18,
      departureTime: 'الآن'
    };

    const auditRecord: AuditLogEntry = {
      id: `log-${randomUUID()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: req.body.actorName || request.requestingUser,
      actorRole: 'طبيب / منسق طوارئ معتمد',
      hospitalName: request.requestingHospitalName,
      action: 'اعتماد العرض وحجز المورد',
      details: `تم اعتماد عرض ${targetOffer.offeringHospitalName} وتحويل الطلب ${request.requestNumber} للنقل والتتبع الحراري`,
      category: 'offer',
      verificationHash: createAuditHash(`${offerId}:${request.id}:accepted`)
    };
    workingLogs.unshift(auditRecord);

    res.json({ request, acceptedOffer: targetOffer });
  });

  // 9. Confirm Receipt & Reconcile Inventory
  app.post('/api/requests/:requestId/receipt', (req: Request, res: Response) => {
    const { requestId } = req.params;
    const { actualQuantity, signatureName, notes } = req.body;

    const request = workingRequests.find(r => r.id === requestId);
    if (!request) {
      res.status(404).json({ error: `Request with id ${requestId} not found` });
      return;
    }

    if (actualQuantity === undefined || Number(actualQuantity) <= 0 || !signatureName) {
      res.status(400).json({ 
        error: 'Missing required receipt fields: actualQuantity (>0) and signatureName are required' 
      });
      return;
    }

    request.status = 'received';
    request.receiptInspection = {
      verifiedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      verifiedBy: signatureName,
      actualQuantity: Number(actualQuantity),
      tempComplianceMet: req.body.tempComplianceMet !== false,
      batchMatched: req.body.batchMatched !== false,
      packageIntact: req.body.packageIntact !== false,
      notes: notes || 'تم فحص الطرد مخبرياً ومطابقة حرارة التبريد واستلام كامل الكمية بحالة ممتازة.',
      signatureName
    };

    // Reconcile Inventory if linked to an itemId
    let reconciledItem: InventoryItem | null = null;
    if (request.itemId) {
      const item = workingInventory.find(i => i.id === request.itemId);
      if (item) {
        item.currentStock += Number(actualQuantity);
        if (item.currentStock >= item.safeBuffer) {
          item.status = 'available';
        } else if (item.currentStock > 0) {
          item.status = 'low';
        }
        reconciledItem = item;
      }
    }

    const auditRecord: AuditLogEntry = {
      id: `log-${randomUUID()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actorName: signatureName,
      actorRole: 'مسؤول الاستلام والفحص الصيدلاني',
      hospitalName: request.requestingHospitalName,
      action: 'تأكيد استلام وتسوية مخزون',
      details: `استلام مطابق للطلب ${request.requestNumber} بكمية ${actualQuantity} ${request.unit} وتحديث رصيد المنشأة`,
      category: 'receipt',
      verificationHash: createAuditHash(`${request.id}:receipt:${actualQuantity}`)
    };
    workingLogs.unshift(auditRecord);

    res.json({ request, reconciledItem });
  });

  // 10. Audit Log Trail
  app.get('/api/audit', (_req: Request, res: Response) => {
    res.json(workingLogs);
  });

  return app;
}

export default createApp;
