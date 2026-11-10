import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { AddressInfo } from 'node:net';
import { Server } from 'node:http';
import { createApp } from './app';

describe('MIRFAD Reference API Tests', () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const addr = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('GET /api/health returns prototype status and service metadata', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);

    const body = await res.json();
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'mirfad-reference-api');
    assert.equal(body.mode, 'prototype');
    assert.equal(body.persistence, 'in-memory');
  });

  it('GET /api/inventory?status=critical filters for critical inventory items', async () => {
    const res = await fetch(`${baseUrl}/api/inventory?status=critical`);
    assert.equal(res.status, 200);

    const items = await res.json();
    assert.ok(Array.isArray(items), 'Inventory should be an array');
    assert.ok(items.length > 0, 'Should return at least one critical item');
    assert.ok(
      items.every((item: { status: string }) => item.status === 'critical'),
      'All filtered items must have status critical'
    );
  });

  it('POST /api/requests creates a broadcasted request and records an audit log entry', async () => {
    const newRequestPayload = {
      category: 'medicines',
      itemNameAr: 'ترياق سم العقارب متعدد التكافؤ',
      itemNameEn: 'Polyvalent Antivenom',
      quantityRequested: 5,
      unit: 'أمبولة',
      priority: 'critical',
      requestingHospitalId: 'hosp-ksmc',
      requestingHospitalName: 'مدينة الملك سعود الطبية',
      requestingSectorId: 'moh',
      requestingUser: 'د. فيصل الهذلي',
      urgencyReason: 'حالة تسمم حاد في قسم الطوارئ مع نفاد المخزون الموضعي',
      coldChainRequired: true,
      requiredTempRange: '2°C - 8°C'
    };

    const createRes = await fetch(`${baseUrl}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRequestPayload)
    });

    assert.equal(createRes.status, 201);
    const createdRequest = await createRes.json();
    assert.ok(createdRequest.id, 'Created request should have an id');
    assert.ok(createdRequest.requestNumber.startsWith('MRF-'), 'Request number should start with MRF-');
    assert.equal(createdRequest.status, 'broadcasted');
    assert.equal(createdRequest.itemNameAr, newRequestPayload.itemNameAr);

    // Verify audit log has recorded the action
    const auditRes = await fetch(`${baseUrl}/api/audit`);
    assert.equal(auditRes.status, 200);
    const logs = await auditRes.json();
    assert.ok(Array.isArray(logs), 'Logs should be an array');

    const matchingLog = logs.find(
      (log: { action: string; details: string; verificationHash: string }) => 
        log.action === 'إنشاء وبث طلب إمداد' && log.details.includes(createdRequest.requestNumber)
    );

    assert.ok(matchingLog, 'Audit trail should include the newly created request');
    assert.ok(matchingLog.verificationHash.startsWith('SHA256:'), 'Audit hash must use SHA256 prefix');
  });
});
