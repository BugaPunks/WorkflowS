# Change: Add Communication System (Iteration 4)

## Why
La plataforma actual solo tiene comentarios básicos en tareas, pero falta un sistema completo de comunicación interna como especificado en RF9.1 de la Iteración 4. Los usuarios necesitan un sistema de mensajería para coordinar mejor el trabajo en equipo.

## What Changes
Implementar sistema completo de comunicación interna según especificación:
- Chat en tiempo real entre miembros del proyecto
- Canales de comunicación por proyecto
- Mensajes directos entre usuarios
- Notificaciones de mensajes no leídos
- Historial de conversaciones

## Impact
- **Affected specs**: communication, notifications, project-management
- **Affected code**: 
  - New API endpoints: `/api/projects/[projectId]/chat/*`, `/api/messages/*`
  - New components: ChatPanel, MessageList, MessageInput, ChannelSelector
  - Database updates: Add Message, ChatChannel, MessageRead models
- **Breaking changes**: None - all additions