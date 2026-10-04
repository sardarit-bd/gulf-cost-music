# Gulf Coast Music - Frontend Application

A modern, responsive music platform and multivendor dashboard for the Gulf Coast music ecosystem. Built with **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS v4**.

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Role Architecture](#-role-architecture)
- [Prerequisites & System Requirements](#-prerequisites--system-requirements)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [API Integration](#-api-integration)
- [Cloudinary Integration](#-cloudinary-integration)
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
| **Notifications** | `react-hot-toast` |
| **HTTP Client** | Native `fetch` API and Axios |

---

## 👥 Role Architecture

Access control is enforced at both the middleware level (`middleware.js`) and UI routing:

| Role | Dashboard Route | Cookie Identifier |
|---|---|---|
| **Admin** | `/dashboard/admin` | `role=admin` |
| **Artist** | `/dashboard/artist` | `role=artist` |
| **Venue** | `/dashboard/venue` | `role=venue` |
| **Journalist** | `/dashboard/journalist` | `role=journalist` |
| **Photographer** | `/dashboard/photographer` | `role=photographer` |
| **Studio** | `/dashboard/studio` | `role=studio` |
| **Fan / User** | `/dashboard/fan` | `role=fan` |

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
NEXT_PUBLIC_API_URL=https://api.gulfcoastmusic.live

# Cloudinary Public Configuration
# Used for media uploads (hero video, studio gallery, photographer videos)
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

## 🌐 API Integration

### Base URLs
- **Production API:** `https://api.gulfcoastmusic.live`
- **Development API:** `http://localhost:5001` or `http://localhost:5000`

### Authentication Flow
1. **Sign In (`/api/auth/login`):** User submits credentials. Upon successful response, server returns user payload and JWT token.
2. **Session Persistence:**
   - Auth cookies (`token`, `role`, `user`) are stored with `SameSite=Lax` and `Secure` flag (in production).
   - Local storage mirrors `token` and `user` for client components.
3. **Session Verification (`/api/auth/me`):** On application initialization, `AuthProvider` validates the active token against the backend.
4. **Sign Out:** Removes `token`, `role`, and `user` cookies, clears `localStorage`, and redirects to `/signin`.
5. **Route Guarding:** `middleware.js` inspects cookies on every request to `/dashboard/:path*`. Unauthenticated requests redirect to `/signin`, and unauthorized role attempts redirect to `/unauthorized`.

---

## ☁️ Cloudinary Integration

Cloudinary powers video uploads, hero banners, and portfolio galleries:
1. **Client-side Video Upload:** Utilizes `CldUploadWidget` from `next-cloudinary` using an unsigned upload preset (`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`).
2. **Direct REST Uploads:** Photographer and studio video uploads perform direct `POST` requests to `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`.
3. **Image Optimization:** Media is delivered via `res.cloudinary.com`, whitelisted under `remotePatterns` in `next.config.mjs`.

### New Ownership Setup Steps:
1. Create a free or paid Cloudinary account at [cloudinary.com](https://cloudinary.com).
2. Go to **Settings > Upload Settings > Upload presets**.
3. Create an **Unsigned** preset (e.g. `gulfcoast_preset`) with video and image permissions.
4. Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in your environment variables.

---

## 🚀 Deployment Guide

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com) and click **"New Project"**.
3. Import the `gulf-cost-music` repository.
4. Set Framework Preset to **Next.js**.
5. Add the Environment Variables:
   - `NEXT_PUBLIC_BASE_URL` = `https://api.gulfcoastmusic.live`
   - `NEXT_PUBLIC_API_URL` = `https://api.gulfcoastmusic.live`
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

1. **API Client Centralization:** Many components currently make direct `fetch()` calls using `process.env.NEXT_PUBLIC_BASE_URL`. A shared API client class exists in `src/components/shared/market/api.js`. In future refactoring, standardizing all API calls through a single client or TanStack Query is recommended.
2. **Toast Provider:** Global toasts are configured in `ClientLayout.jsx`. Avoid mounting local `<Toaster />` tags in sub-pages to prevent duplicate popups.
3. **Image Optimization:** In `next.config.mjs`, `images.unoptimized` is currently set to `true` to ensure maximum compatibility with external image hosts without hitting Vercel image optimization quotas. If Vercel Image Optimization is desired, this can be set to `false`.
4. **App Directory Naming:** Note that `src/app/calender` is spelled with an `e` (matching existing backend/routing links).
