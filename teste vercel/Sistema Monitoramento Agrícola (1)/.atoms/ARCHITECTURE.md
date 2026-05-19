# Architecture Design

## System Overview
Cambuí Online is a full-stack web application with a React/TypeScript SPA frontend and a Python/FastAPI REST API backend. Authentication is handled via Atoms Cloud OAuth. The frontend communicates with the backend through an Axios-based API client with retry logic for resilience.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router v6, React Query, Recharts, Lucide Icons
- **Backend**: Python, FastAPI, SQLAlchemy, Alembic (migrations), PostgreSQL
- **Auth**: Atoms Cloud OAuth (via @metagptx/web-sdk)
- **State Management**: React Context API (AuthContext), React Query for server state
- **Build**: Vite, pnpm

## Module Design
| Module | Responsibility | Key Files |
|--------|---------------|-----------|
| Authentication | OAuth login, role selection, session management | contexts/AuthContext.tsx, pages/Login.tsx, pages/AuthCallback.tsx |
| Dashboard | Main metrics overview | pages/Index.tsx |
| Production | Agricultural production analysis | pages/ProductionAnalysis.tsx |
| AI Prediction | ML-based agricultural predictions | pages/AIPrediction.tsx |
| Geospatial | Map-based data visualization | pages/GeospatialData.tsx |
| Alerts | Notification and alert system | pages/Alerts.tsx |
| Infrastructure | Infrastructure monitoring | pages/Infrastructure.tsx |
| Admin | Client management, security audit | pages/AdminClients.tsx, pages/SecurityAudit.tsx |
| User Profile | User settings and info | pages/UserProfile.tsx |
| Layout | App shell with sidebar and header | components/Sidebar.tsx, components/Header.tsx |
| API Layer | HTTP client with retry logic | lib/api.ts, lib/retry.ts |

## Tech Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend Framework | React + TypeScript | Type safety, large ecosystem, team familiarity |
| UI Library | shadcn/ui + Tailwind | Customizable, accessible components with utility-first CSS |
| Backend Framework | FastAPI | High performance, auto-docs, async support |
| Auth Strategy | Atoms Cloud OAuth | Managed auth, secure, no custom implementation needed |
| API Resilience | Retry utility with exponential backoff | Handles transient network/server errors gracefully |
| Routing | React Router v6 with protected routes | Standard SPA routing with auth guards |
| Charts | Recharts | React-native charting, good for dashboards |

## File Tree Plan
```
app/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── core/                   # Config, settings
│   ├── models/                 # SQLAlchemy ORM models
│   ├── routers/                # API route handlers
│   ├── schemas/                # Pydantic validation schemas
│   ├── services/               # Business logic
│   ├── dependencies/           # Dependency injection
│   ├── data_models/            # Static data (cities, states, regions)
│   └── alembic/                # Database migrations
└── frontend/
    ├── src/
    │   ├── App.tsx             # Root routing configuration
    │   ├── main.tsx            # App entry point
    │   ├── pages/              # Page components (Login, Dashboard, etc.)
    │   ├── components/         # Shared UI components (Sidebar, Header, ui/)
    │   ├── contexts/           # React Context providers (AuthContext)
    │   ├── hooks/              # Custom React hooks
    │   ├── lib/                # Utilities (api client, retry logic)
    │   └── api/                # API integration layer
    └── public/                 # Static assets (logos, images)
```

## Implementation Guide
1. **Authentication Flow**: User selects role on Login page → OAuth redirect via Atoms Cloud → Callback processes token → AuthContext stores session → ProtectedRoutes grants access → Redirect to /dashboard
2. **API Calls**: All API calls go through `lib/api.ts` Axios client with `lib/retry.ts` wrapper for resilience
3. **Protected Routes**: `ProtectedRoutes` component in App.tsx checks `isAuthenticated` from AuthContext before rendering app layout
4. **Role-Based Access**: Selected role stored in context, used for conditional UI rendering and API permissions
5. **Layout**: AppLayout wraps protected pages with Sidebar (fixed left 64px width) and Header