# Project Instructions

## Tech Stack
- **Frontend**: Next.js (App Router, React 18, TypeScript, Tailwind CSS, NextUI, Redux Toolkit)
- **Backend**: Express (TypeScript, Mongoose/MongoDB, Zod, tsx, compression, cookies, passport/google auth)
- **Deployment**: PM2 Cluster (with `ecosystem.config.js`), Nginx, MongoDB

## Build & Run Commands

### Root Commands (using Concurrently)
- Install all dependencies (root, backend, frontend): `npm run install-all`
- Run both in development: `npm run dev`
- Build both for production: `npm run build`
- Start both in production: `npm run start`

### Backend Commands (`grow-backend/`)
- Install dependencies: `npm install`
- Dev server: `npm run dev` (uses tsx to watch `src/server.ts`)
- Build: `npm run build` (tsc & tsc-alias)
- Production run: `npm start`
- Seed all database collections: `npm run db:seed-all-courses`
- Seed specific data:
  - Admin: `npm run db:create-admin`
  - Superadmin: `npm run db:seed-superadmin`
  - Demo Course: `npm run db:create-demo-course`
  - Live Classes (500 classes): `npm run db:seed-live-classes`
  - Jobs: `npm run db:seed-jobs`
  - Blogs: `npm run db:seed-blogs`

### Frontend Commands (`learn-grow/`)
- Install dependencies: `npm install`
- Dev server: `npm run dev` (next dev)
- Build: `npm run build` (next build)
- Production run: `npm run start`
- Linter: `npm run lint`

## Code Style & Conventions

### Directory Structure & Architecture
- **Root**: Houses the orchestration scripts and PM2 config.
- **`grow-backend/`**: Express REST API. Organized into modules (`src/modules/[moduleName]/` containing controller, service, model, routes, and validation schemas).
- **`learn-grow/`**: Next.js application using the App Router (`app/` directory). Core components are located in `components/`, Redux slices/store in `redux/`, utilities/helpers in `lib/`.

### Naming Conventions
- **Frontend Components**: PascalCase (e.g., `LoginForm.tsx`, `CoursesSection.tsx`).
- **Frontend Folders / App Routes**: lowercase/kebab-case.
- **Backend Files**: lowercase/kebab-case, and module-specific files follow the pattern `name.layer.ts` (e.g., `user.controller.ts`, `user.routes.ts`, `user.service.ts`).
- **Backend Routes**: Mounted under `/api/[module-name]` in `app.ts`.

### Error Handling & API Conventions
- **Backend Controllers**: Wrapped in `try/catch` blocks.
- **Backend Responses**: Consistently return JSON structured as:
  - Success: `{ success: true, message: "...", data: ... }`
  - Failure: `{ success: false, message: "...", error: error.message }`
- **Frontend Requests**: Use `axios` or Redux slices for handling API requests.
