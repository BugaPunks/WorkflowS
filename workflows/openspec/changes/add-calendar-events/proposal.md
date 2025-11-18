# Change: Add Calendar Events System (Iteration 4)

## Why
La plataforma actual necesita un sistema de calendario integrado para mostrar fechas importantes del proyecto como parte de la Iteración 4. Los usuarios necesitan visualizar sprints, deadlines y eventos importantes en un calendario visual.

## What Changes
Implementar sistema completo de calendario de eventos según especificación:
- Calendario visual con fechas de sprints y milestones
- Notificaciones automáticas para deadlines
- Integración con calendarios externos (Google Calendar, Outlook)
- Vista mensual/semanal/diaria

## Impact
- **Affected specs**: calendar, notifications, project-management
- **Affected code**: 
  - New API endpoints: `/api/projects/[projectId]/calendar/events`
  - New components: CalendarView, EventModal, CalendarIntegration
  - Database updates: Add Event model with project relations
- **Breaking changes**: None - all additions