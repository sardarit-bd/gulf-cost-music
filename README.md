# Gulf Coast Music - Frontend Application

A modern, responsive music platform and multivendor dashboard for the Gulf Coast music ecosystem. Built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Role Architecture](#-role-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites & System Requirements](#-prerequisites--system-requirements)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Authentication & Session Flow](#-authentication--session-flow)
- [API Integration](#-api-integration)
- [Media Upload & Cloudinary Architecture](#-media-upload--cloudinary-architecture)
- [Deployment Guide](#-deployment-guide)
- [Known Architecture Notes & Future Enhancements](#-known-architecture-notes--future-enhancements)

---

## 🎵 Project Overview

Gulf Coast Music connects artists, venues, recording studios, journalists, photographers, and fans across the Gulf Coast region (Louisiana, Mississippi, Alabama, and Florida).

### Key Features:
- **Public Directory & Discovery:** Browse Artists by genre, Venues by state/city, Recording Studios, News articles, Casts (Podcasts), Waves (Tracks), Live Cameras, and Marketplace.
- **Multirole Dashboard Portals:**
  - **Admin:** Manage users, events, news, sponsorships, casts, waves, studios, venues, photographers, and homepage sections.
  - **Artist:** Music track uploads, portfolio management, marketplace sales, merchandise, and Stripe billing.
  - **Venue:** Event show schedules, venue profiles, photo galleries, ticket marketplace.
  - **Studio:** Equipment listings, service packages, media gallery showcase, and bookings.
  - **Journalist:** Editorial news authoring, publishing workflow, and coverage management.
  - **Photographer:** High-res photo and video portfolio showcase, service listings.
  - **Fan / General User:** Order history, favorites (waves/casts), and marketplace orders.
- **Stripe Connect & Subscriptions:** Tiered Pro plans and marketplace payout onboarding.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.1.6](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19.2.0](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS |
| **Components** | Radix UI primitives, Lucide Icons, React Icons |
| **Animations** | Framer Motion, Swiper.js, React Fast Marquee |
| **Media Handling** | Next-Cloudinary (`next-cloudinary`) & Cloudinary Upload Widget |
| **Charts & Visuals**| Chart.js, React-ChartJS-2 |
| **Notifications** | `react-hot-toast` & `react-toastify` |
| **HTTP Client** | Native `fetch` API and Axios |

---

## 👥 Role Architecture

Access control is enforced at both the middleware level (`middleware.js`) and UI routing for the 7 system roles:

| Role | Dashboard Route | Cookie Identifier | Description |
|---|---|---|---|
| **Admin** | `/dashboard/admin` | `role=admin` | Full administrative control over users, CMS, and events |
| **Artist** | `/dashboard/artist` | `role=artist` | Music tracks, portfolio, merch, and sales management |
| **Venue** | `/dashboard/venue` | `role=venue` | Event calendar, show creation, and ticket marketplace |
| **Journalist** | `/dashboard/journalist` | `role=journalist` | Editorial articles, news publishing, and press coverage |
| **Photographer** | `/dashboard/photographer` | `role=photographer` | Portfolio galleries, video showcases, and photography services |
| **Studio** | `/dashboard/studio` | `role=studio` | Recording studio services, equipment lists, and media gallery |
| **Fan / User** | `/dashboard/fan` | `role=fan` | Track favorites, ticket purchases, and marketplace orders |

---

## 📁 Project Structure

The project uses Next.js App Router with domain-driven modular components:

```text
src/
├── app/                           # Next.js App Router pages, layouts, and route groups
│   ├── (auth)/                    # Authentication pages: /signin, /signup, /forgot, /reset-password
│   ├── dashboard/                 # Protected role-based dashboard portals (admin, artist, venue, etc.)
│   ├── artists/, venues/, ...     # Public discovery and directory route trees
│   ├── stripe/, billing/          # Stripe checkout, subscription, and Connect redirect handlers
│   ├── layout.jsx                 # Root layout with fonts, layout shell, and global providers
│   └── page.jsx                   # Public homepage
│
├── components/
│   ├── modules/                   # Domain-specific feature modules (admin, artist, home, merch, venues, etc.)
│   ├── shared/                    # Reusable cross-cutting UI components (billing, market, order, loaders)
│   └── ui/                        # Radix UI and base design primitives (button, card, dialog, select, etc.)
│
├── context/
│   └── AuthContext.js             # Global authentication provider, user session state, and session refresh
│
├── lib/
│   ├── auth.js                    # useSession secondary hook and local session sync
│   ├── marketplaceRoutes.js       # Dynamic route mapper for role-specific marketplace views
│   └── utils.js                   # Class utility helper (clsx + tailwind-merge)
│
├── ui/                            # Custom modal and input form controls
│
└── utils/
    ├── cookies.js                 # Client-side cookie retrieval helper
    ├── errorHandler.js            # API error response formatting helper
    ├── formatters.js              # Date and currency formatters
    ├── userMenus.js               # Role-based sidebar menu definitions
    └── withAuth.jsx               # Client-side HOC route protection
```

---

## ⚙️ Prerequisites & System Requirements

- **Node.js:** `v20.x` or `v22.x` recommended (minimum Node.js `18.18+`)
- **Package Manager:** `npm` (v9+ or v10+)
- **Git**

Verify your environment:
```bash
node -v
npm -v
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sardarit-bd/gulf-cost-music.git
cd gulf-cost-music
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the required configuration (see details below).

### 4. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🔐 Environment Variables

The project requires the following environment variables defined in `.env.local` (local) or your deployment environment (Vercel):

```env
# Backend API Configuration
# Point to local server during development, or production API
NEXT_PUBLIC_BASE_URL=https://api.gulfcoastmusic.live

# Cloudinary Public Configuration
# Used for media delivery and client-side video uploads (hero video, photographer portfolio)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

> **Security Note:** Never commit `.env` or `.env.local` containing sensitive credentials to Git. An `.env.example` template is provided in the repository root.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the development server at [http://localhost:3000](http://localhost:3000) using Turbopack |
| `npm run build` | Compiles the production build (verifies static & dynamic routes) |
| `npm run start` | Starts the production server after running `npm run build` |
| `npm run lint` | Runs ESLint 9 to check for syntax and style issues |

---

## 🔑 Authentication & Session Flow

The application manages user sessions using JSON Web Tokens (JWT) stored across both HTTP-accessible cookies and browser storage:

### 1. Registration (`/signup`)
- Users register by selecting their account role (Artist, Venue, Journalist, Photographer, Studio, or Fan), regional location (State & City), and optional Pro subscription plan ($10/month).
- Admin accounts are provisioned via backend seeding and cannot be created through public registration.

### 2. Sign In (`/signin`)
- Sends credentials to `POST /api/auth/login`.
- On success, sets browser cookies with `SameSite=Lax` (and `Secure` in production):
  - `token`: Active JWT access token
  - `role`: User type identifier (`admin`, `artist`, `venue`, etc.)
  - `user`: URL-encoded JSON user profile
- Mirrors `token` and `user` into `localStorage` for immediate client component access.
- Automatically routes the user to their designated dashboard via the role redirect map.

### 3. Session Verification (`/api/auth/me`)
- On application mount, `AuthProvider` in `src/context/AuthContext.js` validates the active `token` cookie against `GET /api/auth/me`.
- If the token is invalid or expired, the session is cleared.

### 4. Password Recovery
- **Forgot Password (`/forgot`):** Submits the user's email to `POST /api/auth/forgot-password` to trigger a reset email.
- **Reset Password (`/reset-password/[token]`):** Sends the new password to `PUT /api/auth/reset-password/:token`.

### 5. Sign Out
- Calling `logout()` in `AuthContext` or `useSession()` clears the `token`, `role`, and `user` cookies (`max-age=0`), wipes `localStorage`, resets React state, and redirects to `/signin`.

### 6. Route Guarding
- **Edge Middleware (`middleware.js`):** Intercepts all requests matching `/dashboard/:path*`. Redirects unauthenticated requests to `/signin` and unauthorized role attempts to `/unauthorized`.
- **Client Guard (`src/utils/withAuth.jsx`):** Higher-Order Component that enforces client-side role validation on specific views.

---

## 🌐 API Integration

The frontend communicates with the backend REST API via `process.env.NEXT_PUBLIC_BASE_URL`.

### Base URLs
- **Production API:** `https://api.gulfcoastmusic.live`
- **Development API:** `http://localhost:5000` or `http://localhost:5001`

### Request Handling
- **Shared API Client (`src/components/shared/market/api.js` & `src/app/dashboard/studio/lib/api.js`):**
  - Centralized `ApiClient` class that automatically reads the `token` cookie, sets `Authorization: Bearer <token>`, and includes `credentials: 'include'`.
  - Automatically clears cookies and handles session expiration on `401 Unauthorized`.
  - Provides a built-in `upload(endpoint, formData)` method that automatically formats `multipart/form-data` requests without manual header conflicts.
- **Direct `fetch()` Calls:** Used for core authentication endpoints (`/api/auth/*`) and public dynamic feeds (`/api/hero`).
- **Axios:** Used in select management modules and studio pages for direct REST operations.

> **API Endpoint Reference:**  
> For the complete backend API endpoint reference, see **`API_ENDPOINTS.md`**.

---

## ☁️ Media Upload & Cloudinary Architecture

The platform uses a hybrid media architecture combining direct client uploads with backend-mediated storage:

### A. Direct Client-Side Video Uploads (Cloudinary)
Certain large video assets bypass the application server to optimize performance:
1. **Hero Video Banner:** Managed in admin controls and home page using direct Cloudinary URLs (`https://res.cloudinary.com/${cloudName}/video/upload/...`).
2. **Photographer Video Portfolio:** In `src/components/modules/dashboard/photographer/photographer/VideosPage.jsx`, promotional videos are uploaded directly from the browser via REST `POST` to `https://api.cloudinary.com/v1_1/${cloudName}/video/upload` using `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.
3. **Video Upload Widget:** Uses `CldUploadWidget` from `next-cloudinary` via `src/components/modules/videoUpload/VideoUploader.js` configured with `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`.

### B. Backend-Mediated Media Uploads (Multipart FormData)
Most media files are uploaded directly to the backend API via standard `multipart/form-data`:
- **Artist MP3 Audio Tracks:** Uploaded through artist dashboard forms to backend media endpoints.
- **Profile Avatars & Photos:** Artist, photographer, venue, and studio profile photos.
- **Venue Event Flyers & Show Images:** Submitted with event creation forms (`/api/venue/events`).
- **News Article Featured Images:** Handled by journalist editor forms.
- **Sponsor Logos & Merch Product Images:** Handled by admin and merchandise forms.

The Express backend processes these via `multer` and securely persists them to Cloudinary using server-side credentials.

---

## 🚀 Deployment Guide

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import the `gulf-cost-music` repository.
4. Set Framework Preset to **Next.js**.
5. Add the Environment Variables:
   - `NEXT_PUBLIC_BASE_URL` = `https://api.gulfcoastmusic.live`
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` = `[your-cloud-name]`
   - `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` = `[your-preset-name]`
6. Click **Deploy**.

### Self-Hosted / Node Server
```bash
# 1. Install dependencies
npm ci

# 2. Build the production application
npm run build

# 3. Start the Node.js production server
npm run start -p 3000
```
Use a process manager such as `pm2` (`pm2 start npm --name "gcm-frontend" -- start`) and Nginx as a reverse proxy.

---

## 📌 Known Architecture Notes & Future Enhancements

1. **API Client Centralization:** Direct `fetch()` calls and `axios` calls exist alongside the shared `ApiClient` class (`src/components/shared/market/api.js`). Standardizing all requests through a single client or TanStack Query is recommended for future refactoring.
2. **Toast Provider:** Global toasts are configured in `ClientLayout.jsx`. Avoid mounting local `<Toaster />` tags in sub-pages to prevent duplicate popups.
3. **Image Optimization:** In `next.config.mjs`, `images.unoptimized` is set to `true` to ensure maximum compatibility with external image hosts without hitting Vercel image optimization quotas. If Vercel Image Optimization is desired, this can be set to `false`.
4. **App Directory Naming:** Note that `src/app/calender` is spelled with an `e` (matching existing backend/routing links).
