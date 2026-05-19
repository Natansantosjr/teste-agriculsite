# Project Context

## Project Overview
Cambuí Online is a web-based agricultural monitoring and decision-making platform powered by AI. It enables users to analyze agricultural data through role-based access (ADM, Gerente Regional, Fiscal de Campo), providing features like AI predictions, geospatial data visualization, production analysis, alerts, and security auditing. The platform uses React/TypeScript frontend with a Python/FastAPI backend and PostgreSQL database.

## Key Decisions
| Date | Decision | By | Rationale |
|------|----------|-----|-----------|
| 2026-05-10 | React + TypeScript + Tailwind CSS + shadcn/ui for frontend | Alex | Modern, maintainable stack with great DX |
| 2026-05-10 | FastAPI + SQLAlchemy for backend | Alex | High performance Python API framework with ORM |
| 2026-05-10 | Role-based access (ADM, Gerente, Fiscal) | Alex | Different user types need different permissions |
| 2026-05-10 | OAuth authentication via Atoms Cloud | Alex | Secure, managed auth without custom implementation |
| 2026-05-11 | Login page as default route | Alex | Users must authenticate before accessing the system |
| 2026-05-11 | Login page checks auth state and redirects | Alex | Prevents authenticated users from being stuck on login |

## Constraints
- Dark theme (deep blue #0F172A background) across the application
- Portuguese (Brazilian) language for all UI text
- Role-based access control: ADM (full access), Gerente (regional), Fiscal (field)
- LGPD compliance required for data protection
- Sidebar navigation with 64px left margin for main content
- Emerald/green accent colors for interactive elements