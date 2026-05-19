# Sistema de Monitoramento Agrícola Cambuí Online - Fase 2

## Design References
- Color Palette: #0F172A (dark navy bg), #10B981 (emerald green - primary), #F59E0B (amber - warnings), #EF4444 (red - high risk), #3B82F6 (blue - info), #1E293B (dark cards), #F8FAFC (light text)
- Typography: Inter for UI, monospace for data values
- Style: Dark theme government dashboard, glassmorphism cards, data-dense layout with maps
- Landing page: Bold hero with satellite imagery, gradient overlays, animated feature cards, CTA buttons

## Images to Generate
- landing-hero-satellite-field.jpg: Wide panoramic satellite view of Brazilian agricultural fields with NDVI heat overlay, dramatic lighting
- landing-feature-ai-analysis.jpg: Abstract AI neural network visualization with agricultural data nodes, dark theme
- landing-feature-fiscal-integration.jpg: Digital dashboard showing fiscal data crossing with map overlays, dark futuristic theme
- landing-feature-geospatial.jpg: Satellite orbiting Earth focused on Brazil with data streams, cinematic style

## Development Tasks
- [x] Generate landing page images (4 images)
- [x] Create LandingPage.tsx - public landing page with hero, features, login CTA, branding
- [x] Create AdminClients.tsx - admin client management page (PJ CRUD, SaaS subscriptions)
- [x] Create SecurityAudit.tsx - LGPD compliance dashboard, audit logs, security overview
- [x] Create backend tables for clients (PJ) and audit_logs
- [x] Insert mock data for clients and audit logs
- [x] Update App.tsx with landing page route (public) and new admin routes
- [x] Update Sidebar.tsx with new admin menu items

## File Structure
1. `src/pages/LandingPage.tsx` - Public landing page with hero, features, login
2. `src/pages/AdminClients.tsx` - Admin client management (PJ entities)
3. `src/pages/SecurityAudit.tsx` - LGPD compliance and audit log viewer
4. `src/App.tsx` - Updated routing with landing page and new pages
5. `src/components/Sidebar.tsx` - Updated with admin menu items

## Admin Client Management (SaaS Model)
- Client (PJ) fields: CNPJ, Razão Social, Nome Fantasia, Plano (Basic/Pro/Enterprise), Status, Região, Contato
- CRUD operations for clients
- Subscription plan management
- Client status tracking (Ativo/Inativo/Suspenso)

## Security & LGPD Compliance
- Audit log viewer (user actions, timestamps, IP tracking)
- LGPD compliance status indicators
- Security metrics dashboard (active sessions, failed logins, encryption status)
- RBAC overview panel