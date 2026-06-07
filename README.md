# AI-Solution — Customer Engagement & Demo Booking Web System

An academic prototype full-stack web application built for the **CET333 Product
Development** assignment.

---

## 1. Project overview

**AI-Solution** is a modern, AI SaaS-style web system that lets a fictitious AI
start-up showcase its services globally, capture customer interest and manage
that interest from a secure admin area. Visitors can browse company information,
**schedule a demo**, **join promotional events** and **submit general
inquiries**. Staff log in to a password-protected **admin dashboard** to view
analytics, manage records and publish events with image uploads.

The application is intentionally built **without an external database**. All
data is stored in human-readable **JSON files** and uploaded images are saved to
the local **`/public/uploads`** folder — making it easy to run, inspect and
demonstrate.

## 2. Assignment scenario summary

> AI-Solution is a fictitious AI start-up based in Sunderland. It provides
> AI-powered virtual assistant solutions, affordable prototyping solutions,
> software support and promotional events. The system must promote the company
> globally, allow customers to submit scheduled demo requests, allow users to
> join promotional events, collect customer inquiries, and provide a
> password-protected admin area where staff can view and analyse customer
> inquiry data.

## 3. Features

**Public site**

- Modern AI SaaS homepage (hero, company intro, services, AI virtual assistant,
  affordable prototyping, promotional events, benefits and call-to-action
  sections).
- **Schedule a Demo** form with full validation.
- **Join Events** page that lists events (with uploaded images) and an event
  registration form.
- **Contact / Inquiry** form for general enquiries.
- Fully responsive (desktop, tablet, mobile), accessible labels, loading states
  and clear success/error messages.

**Admin area (password protected)**

- Secure login with bcrypt-hashed passwords and a JWT session cookie.
- Dashboard with live analytics calculated from JSON:
  - Totals: inquiries, demo requests, event registrations, AI assistant /
    prototyping / sales-rep inquiries.
  - Charts: inquiry type distribution, country-wise inquiries, monthly
    inquiries, service interest comparison.
  - Latest inquiries table.
- Manage **inquiries**, **demo requests** and **event registrations**: search,
  filter by type and status, view details, update status, delete with
  confirmation.
- **Event management** with image upload (saved to `/public/uploads`), shown
  instantly on the public Events page; delete with confirmation.
- Logout, and route protection via middleware.

## 4. Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** components (Radix UI)
- **React Hook Form** + **Zod** validation (shared client + server schemas)
- **Node.js `fs/promises`** for JSON read/write
- **bcryptjs** for password hashing (a pure-JS, drop-in implementation of
  bcrypt — chosen so it installs without native build tools, especially on
  Windows)
- **jose** for the JWT admin session token
- **Recharts** for dashboard charts
- **lucide-react** icons
- **No external database**

## 5. Data storage — why JSON files instead of a database

This project uses local JSON files as a lightweight prototype storage system.
This approach is suitable for academic demonstration because it allows form
data, admin dashboard analytics, and event image records to be stored without
setting up an external database. Uploaded event images are saved in
`/public/uploads`, and the image path is stored in JSON. For a real production
system, a database such as PostgreSQL or MySQL and cloud image storage such as
Cloudinary, AWS S3, or Supabase Storage would be recommended.

All read/write logic lives in [`lib/json-db.ts`](lib/json-db.ts) with reusable
helpers: `ensureFileExists`, `readJsonFile`, `writeJsonFile`, `findById`,
`addRecord`, `updateRecord` and `deleteRecord`. Files are created automatically
if they do not exist, and are written with `JSON.stringify(data, null, 2)` so
they stay readable.

### Image storage (`/public/uploads`)

When an admin creates an event and uploads an image:

1. The file is validated server-side (JPG, JPEG, PNG or WEBP, max 5 MB).
2. It is saved to `/public/uploads` with a **unique filename** (timestamp + a
   short UUID), e.g. `event-1717327200000-1a2b3c4d.jpg`.
3. The public path (e.g. `/uploads/event-1717327200000-1a2b3c4d.jpg`) is stored
   in `data/events.json`.
4. Next.js serves the file as a normal static asset, so it displays on the
   public Events page via a standard `<img>` tag.

## 6. Installation

> Requires **Node.js 18.17+** (Node 20+ recommended).

```bash
# 1. Install dependencies
npm install

# 2. Seed the default admin account (creates data/admins.json)
npm run seed
```

## 7. How to run the project

```bash
# Development (http://localhost:3000)
npm run dev

# Production build + start
npm run build
npm start
```

Then open <http://localhost:3000>. The admin area is at
<http://localhost:3000/admin/login>.

## 8. How to seed the admin user

```bash
npm run seed
```

This runs [`scripts/seed-admin.mjs`](scripts/seed-admin.mjs), which writes the
default admin into `data/admins.json` with a **bcrypt-hashed** password (never
plain text). It is safe to run repeatedly — it will not create duplicates.

> Even if you forget to run it, the app **auto-seeds** the default admin the
> first time someone hits the login API, so login always works out of the box.

## 9. Default admin login credentials

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | `admin@aisolution.com` |
| Password | `Admin@123`            |

## 10. Folder structure

```
ai-solution-web-system/
├─ app/
│  ├─ layout.tsx              # Root layout (fonts, toaster)
│  ├─ globals.css             # Tailwind + theme tokens
│  ├─ (site)/                 # Public marketing pages (navbar + footer)
│  │  ├─ layout.tsx
│  │  ├─ page.tsx             # Homepage
│  │  ├─ schedule-demo/page.tsx
│  │  ├─ events/page.tsx
│  │  └─ contact/page.tsx
│  ├─ admin/
│  │  ├─ page.tsx             # Redirects to dashboard
│  │  ├─ login/page.tsx       # Public login (no sidebar)
│  │  └─ (panel)/             # Protected admin pages (sidebar shell)
│  │     ├─ layout.tsx
│  │     ├─ dashboard/page.tsx
│  │     ├─ inquiries/page.tsx
│  │     ├─ demo-requests/page.tsx
│  │     ├─ event-registrations/page.tsx
│  │     └─ events/page.tsx
│  └─ api/                    # Route handlers (Node runtime)
│     ├─ auth/login/route.ts
│     ├─ auth/logout/route.ts
│     ├─ inquiries/route.ts + [id]/route.ts
│     ├─ demo-requests/route.ts + [id]/route.ts
│     ├─ event-registrations/route.ts + [id]/route.ts
│     └─ events/route.ts + [id]/route.ts
├─ components/
│  ├─ ui/                     # shadcn/ui primitives
│  ├─ shared/                 # Navbar, Footer, Logo, headings
│  ├─ forms/                  # Schedule demo, contact, registration, event forms
│  └─ admin/                  # Sidebar, header, stats, charts, tables, login form
├─ lib/
│  ├─ json-db.ts              # JSON file read/write helpers
│  ├─ auth.ts                 # bcrypt + session cookie + admin seeding
│  ├─ session.ts              # Edge-safe JWT helpers (used by middleware)
│  ├─ validations.ts          # Zod schemas
│  ├─ analytics.ts            # Dashboard calculations from JSON
│  ├─ uploads.ts              # Image upload save/validate/delete
│  ├─ constants.ts            # Shared option lists
│  ├─ types.ts                # Data models
│  └─ utils.ts                # cn(), date formatting
├─ data/                      # JSON "database" (auto-created)
│  ├─ admins.json
│  ├─ inquiries.json
│  ├─ demoRequests.json
│  ├─ eventRegistrations.json
│  └─ events.json
├─ public/uploads/            # Uploaded event images (+ sample images)
├─ scripts/seed-admin.mjs     # Admin seeding script
└─ middleware.ts              # Protects /admin routes
```

## 11. Data models

- **Admin** — `id, name, email, passwordHash, createdAt, updatedAt`
- **Inquiry** — `id, fullName, email, phone, companyName, country, inquiryType,
  interestedService, projectDetails, message, status, createdAt, updatedAt`
- **DemoRequest** — `id, fullName, email, phone, companyName, country,
  interestedService, preferredDemoDate, message, status, createdAt, updatedAt`
- **EventRegistration** — `id, fullName, email, phone, companyName, country,
  eventName, message, status, createdAt, updatedAt`
- **Event** — `id, title, description, eventDate, location, imageUrl, createdAt,
  updatedAt`

Statuses: `New`, `Contacted`, `In Progress`, `Completed`.

## 12. Local prototype limitations

- **Not for production traffic.** JSON file writes are not transactional and can
  race under heavy concurrent use.
- **No horizontal scaling.** File storage assumes a single server with a local
  filesystem; it will not work on read-only or serverless filesystems.
- **Uploaded images live on local disk**, so they are not shared across multiple
  instances and are lost if the disk is wiped.
- **Basic auth model.** A single shared session secret and a simple JWT cookie —
  enough for a prototype, not hardened for production.
- Search/analytics load entire files into memory, which is fine for a demo-sized
  dataset but not for large volumes.

## 13. Production recommendation

For a real production system you would replace:

- **JSON files → a managed database** such as PostgreSQL or MySQL (e.g. via
  Prisma), giving transactions, indexing and concurrent-safe writes.
- **Local `/public/uploads` → cloud object storage** such as Cloudinary,
  AWS S3 or Supabase Storage, with a CDN for delivery.
- **Session secret** moved to a managed secret store, plus rate limiting,
  audit logging, email notifications and role-based access control.

---

### Environment variables (optional)

The app runs with sensible defaults. For production, set a strong session
secret:

```bash
# .env.local
JWT_SECRET="a-long-random-secret-string"
```

_Academic prototype — CET333 Product Development._
