# Change: Complete Missing Features from Iterations 3-5

## Why
La plataforma actual tiene implementados los módulos core de las Iteraciones 1-2, pero faltan funcionalidades específicas de las Iteraciones 3-5 y las "Ideas Adicionales" documentadas en docs/Instrucciones.md para completar la plataforma.

## What Changes
Implementar las funcionalidades faltantes según el roadmap:
- **Iteración 3**: Dashboard personalizado por rol
- **Iteración 4**: Calendario de eventos (F13)
- **Iteración 5**: Exportación de datos
- **Ideas Adicionales**: Rúbricas Avanzado, Gamificación, Peer Review, Plantillas de Proyectos, Integración con Calendarios Externos

## Impact
- **Affected specs**: dashboard, calendar, export, evaluation, project-management, user-management
- **Affected code**: 
  - New components: RoleDashboard, CalendarView, ExportPanel, RubricBuilder, GamificationPanel, PeerReviewSystem, TemplateSelector
  - New API endpoints: `/api/dashboard/*`, `/api/calendar/*`, `/api/export/*`, `/api/rubrics/*`, `/api/gamification/*`, `/api/peer-review/*`, `/api/templates/*`
  - Database updates: Add models for rubrics, achievements, templates, peer reviews
- **Breaking changes**: None - all additions following documented roadmap