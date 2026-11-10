# MIRFAD | مِرفاد

> **Healthcare Inter-Facility Integration & Emergency Resource Coordination Platform**  
> *منصة التكامل والإمداد الصحي لتنسيق الموارد وسلاسل الإمداد الطارئة بين المستشفيات والقطاعات الصحية*

- **Live Demo:** [https://mirfad.ai.studio](https://mirfad.ai.studio)
- **GitHub Repository:** [https://github.com/zayedalnefaie-spec/mirfad-health-platform](https://github.com/zayedalnefaie-spec/mirfad-health-platform)

---

## Overview

**MIRFAD** is a staff-facing healthcare resource coordination platform concept engineered to address inter-facility supply shortages across Saudi Arabia's major health sectors. Rather than relying on fragmented phone calls, unstructured messaging groups, or localized emergency procurements, MIRFAD provides authorized clinical and logistics personnel with verified cross-facility inventory visibility, structured broadcast requests, bilateral response offers, active cold-chain IoT tracking, and an immutable audit trail.

---

## Implemented Frontend Features

The web client is built using React 19, TypeScript, and Tailwind CSS v4, supporting full Arabic RTL typography, Stanford Biodesign clinical pathways, and a curated design system:

1. **Executive Operational Dashboard:**
   - Real-time KPI telemetry (94.2% fulfillment rate, 18.4 min average response time, active cold-chain transit count, total requests).
   - Dynamic alert banner highlighting items approaching or breaching clinical safety buffers.
   - Interactive 5-stage visual operational pipeline (Broadcast $\to$ Offers $\to$ Approval $\to$ Transit $\to$ Arrival/Inspection).

2. **Unified Multi-Category Inventory:**
   - Covers 4 clinical categories:
     - **Specialized Medicines & Antidotes** (e.g., Defibrotide, Andexanet Alfa, Factor VIII, Snake Antivenoms).
     - **Surgical Supplies** (e.g., Pediatric ECMO cannulation kits, reinforced tracheostomy tubes, aortic grafts).
     - **Blood & Blood Products** (e.g., O-negative leukodepleted RBCs, apheresis platelets, cryoprecipitate, fresh frozen plasma).
     - **Critical Medical Devices** (e.g., Portable Cardiohelp ECMO, Hamilton-T1 transport ventilators, Zoll defibrillators).
   - Real-time client-side search, sector filter, status filter, and safe buffer threshold progress indicators.

3. **Multi-Step Supply Request Wizard:**
   - Category selector and item specification.
   - Clinical urgency stratification: *Critical (Life-Saving)*, *Urgent (Clinical Need)*, and *Routine (Stock Replenishment)*.
   - Broadcast radius governance: Regional cluster, sector-only, or national multi-sector broadcast.
   - Mandatory cold-chain parameters (temperature ranges such as 2°C–8°C, 20°C–24°C continuous agitation, or deep freeze).

4. **Bilateral Requests & Offers Coordination:**
   - Tabbed views for outgoing facility requests, incoming partner requests, and archived deliveries.
   - Dynamic response offer submission with quantity pledges, prep time estimates, and fleet allocation.
   - Single-click offer approval that binds reserved quantities and launches the transit phase.

5. **Live Route & Cold-Chain IoT Telemetry (Simulated):**
   - Active route visualizer with origin, animated vehicle in transit, destination markers, and real-time ETA.
   - Live simulated IoT temperature sensor probe with continuous telemetry history and tolerance breach alerts.
   - Dedicated vehicle plate, designated paramedic contact, and direct phone link.

6. **Formal Quality Inspection & Receipt Station:**
   - Mandatory physical check requirements: seal integrity, batch matching, and temperature compliance verification.
   - Digital sign-off and instant inventory reconciliation.

7. **Cross-Sector Healthcare Directory:**
   - Integrated directory representing facilities across 5 key Saudi healthcare sectors:
     - Ministry of Health & Health Clusters (MOH)
     - Ministry of National Guard Health Affairs (MNGHA)
     - Ministry of Defense Health Services (MOD)
     - Ministry of Interior Medical Services (MOI)
     - King Faisal Specialist Hospital & Research Centre (KFSH&RC)

8. **Governance, Audit Trail & Regulatory Compliance:**
   - Immutable event ledger logging actors, roles, timestamps, actions, and SHA-256 integrity hashes.
   - One-click JSON export for regulatory and internal hospital audit reviews.

9. **Hackathon Innovation & Biodesign Dossier:**
   - Dedicated evaluation panel covering the Biodesign unmet clinical need analysis, SFDA regulatory pathway, elevator pitch, and official project team records.

10. **Role Switcher & Interactive System Tour:**
    - Instant switching between mock clinical and logistics roles (Emergency Consultant, Chief Pharmacist, Biomedical Engineer, Lab Specialist).
    - 5-step guided interactive walkthrough explaining the operational model to judges.

---

## Implemented Reference Backend Endpoints

The project includes a reviewable Node.js / Express reference REST API (`server/app.ts`) with in-memory working state, validation, CORS headers, 128kb request size limit, and SHA-256 audit generation:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns service status (`ok`), mode (`prototype`), persistence (`in-memory`), and prototype disclaimer. |
| `GET` | `/api/sectors` | Returns the directory of participating health sectors and facility tallies. |
| `GET` | `/api/hospitals` | Returns the complete directory of participating reference hospitals with readiness indices. |
| `GET` | `/api/inventory` | Returns unified inventory items with optional `category`, `sectorId`, and `status` query filters. |
| `GET` | `/api/requests` | Returns supply requests with optional `status` and `priority` query filters. |
| `POST` | `/api/requests` | Validates required fields, generates UUIDs and request numbers (`MRF-YYYY-XXXX`), sets status `broadcasted`, and records an audit entry. |
| `POST` | `/api/requests/:requestId/offers` | Submits an fulfillment offer, sets request status `offers_received`, and appends an audit entry. |
| `POST` | `/api/requests/:requestId/accept-offer` | Accepts one offer, marks other offers `declined`, transitions status to `in_transit`, populates telemetry, and records an audit entry. |
| `POST` | `/api/requests/:requestId/receipt` | Validates inspection checklist, sets status `received`, reconciles stock on linked inventory items, and logs an audit entry. |
| `GET` | `/api/audit` | Returns the complete audit event trail with SHA-256 verification hashes. |

---

## Local Setup & Development Instructions

### Prerequisites
- Node.js 20+ (or Node.js 22 LTS recommended)
- npm 10+

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/zayedalnefaie-spec/mirfad-health-platform.git
cd mirfad-health-platform
npm install
```

### Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
To run the frontend purely in offline demo mode (default for web previews), leave `VITE_USE_API="false"`.  
To connect the frontend to the reference Express API, set `VITE_USE_API="true"` in your `.env`.

### Running the Reference API
Start the backend server on port 8787:
```bash
npm run dev:api
```
The API will be accessible at `http://localhost:8787/api/health`.

### Running the Frontend
In a separate terminal, launch the Vite dev server on port 3000:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser. When `VITE_USE_API="true"`, Vite automatically proxies `/api/*` calls to the reference backend on `http://localhost:8787`.

### Running the Test Suite
Execute the built-in Node test suite:
```bash
npm test
```
This runs `server/api.test.ts` via Node's native test runner (`node:test` + native `fetch`), validating:
1. Health check response metadata and prototype labels.
2. Filtered query execution on critical stock items.
3. Creation of an auditable supply request and cryptographic SHA-256 audit trail generation.

---

## Prototype Boundaries & Disclaimer

> **Important Regulatory & Scope Notice for Hackathon Evaluators:**
> 
> - **Simulated Data:** All hospital names, inventory counts, batch numbers, priority statuses, dispatch coordinates, vehicle telemetry, driver details, and audit records in this project are simulated for design verification, hackathon evaluation, and workflow demonstration.
> - **No Real Patient Records:** This system does not access, store, or process real Electronic Health Records (EHR), Protected Health Information (PHI), or identifiable patient data.
> - **In-Memory Reference State:** The backend operates with an in-memory working store cloned from verified baseline structures. Restarting the backend process resets state to default seeds.
> - **No Live External Connections:** The prototype is not currently integrated with live Ministry of Health databases, the National Track & Trace System (RSD), hospital ERP/HIS systems, 997 dispatch consoles, or physical IoT telematics hardware.
> - **Production Roadmap:** Any live deployment requires formal bilateral data-sharing memorandums between health sectors, institutional clinical governance approval, Saudi Food & Drug Authority (SFDA) software-as-a-medical-device/distribution alignment, National Cybersecurity Authority (NCA) compliance audits, role-based identity federation (e.g., Nafath/NPHIES), and end-to-end integration testing.
