# Solar Billing & Quotation Management System

This document outlines the architecture, technology stack, and module-wise implementation details to build a GST-compliant invoicing and quotation generation system tailored for a solar distribution business.

## User Review Required

> [!IMPORTANT]
> Since this is a new project that requires both a frontend and a backend, please review the technology choices and the database selection below. 
> I will set up a new project directory at `C:\Users\adars\.gemini\antigravity\scratch\solar-billing-system`. **Please update your active workspace to this directory so we can begin coding once the plan is approved.**

## Proposed Architecture & Tech Stack

To meet the requirements, the application will be split into a frontend client and a backend API:

- **Frontend Environment**: **React (via Vite)** + **Tailwind CSS**. It provides a fast, rich UI that can cleanly handle the tab-based navigation for invoices and quotations.
- **Backend API**: **Django** + **Django REST Framework (DRF)**. This handles business logic, calculation, customer data, and document generation robustly. 
- **Database**: **PostgreSQL** (with SQLite for local development start unless configured otherwise) to handle relational data efficiently.
- **PDF Generation**: **WeasyPrint** integrated via Django to convert styled HTML templates to professional PDF invoices/quotations.

## Phases of Implementation

### Phase 1: Project Setup & Database Models
- Initialize the Django project (`backend/`) and React project (`frontend/`).
- Create Django models for:
  - `Customer` (Name, GSTIN, State, Address)
  - `Product` (Item name, Unit Price, GST Rate)
  - `Package` (Predefined setups like 3kW, 5kW comprising multiple products)
  - `Invoice` & `InvoiceItem` (Date, Customer reference, Tax calculation breakdown)
  - `Quotation` & `QuotationItem`

### Phase 2: Core Backend Logic (Calculation & APIs)
- Implement serializers and DRF views for CRUD operations.
- Implement the Calculation Engine:
  - Intrastate vs. Interstate GST routing (CGST/SGST vs IGST) based on the Customer's State versus the Company's State.
- Develop the HTML-to-PDF generation endpoints using WeasyPrint or ReportLab for Invoices and Quotations.

### Phase 3: Frontend Interface Development
- Build the Base Layout (vibrant, modern design with dynamic micro-animations).
- Develop Tab-based navigation (Invoices, Quotations, Customers, Packages).
- Create dynamic React forms for Invoices/Quotations with real-time total and tax recalculation as items are added.

### Phase 4: Integration & PDF Handling
- Hook the React frontend to the Django REST endpoints.
- Ensure easy one-click download/preview of the generated PDFs directly in the browser.

## Open Questions

1. **Database:** Would you like to use **PostgreSQL** right from the start, or start with **SQLite** for easier local development and port to PostgreSQL later?
2. **Setup:** Are there any specific company details (Logo, GSTIN, Default State) that we should configure for testing the GST calculations (e.g., to determine CGST/SGST vs IGST)?
3. **Frontend Preference:** I suggested React via Vite for a pure Single Page Application architecture, which pairs beautifully with Django REST. Alternatively, we could use Next.js. Is React + Vite acceptable?

## Verification Plan

### Automated Tests
- Unit testing for the Django Calculation Engine to guarantee the mathematical accuracy of the GST splits and totals.
- API Endpoint testing for creating invoices and fetching records.

### Manual Verification
- Testing the UI workflows (e.g. selecting a predefined 3kW package and confirming it auto-populates all items and prices).
- Generating a sample Invoice PDF and verifying its professional appearance and accurate tax breakdown.
