# Plataforma de Gestión de Proyectos Académicos

Esta es una plataforma web para la gestión de proyectos académicos utilizando metodologías ágiles (Scrum). La plataforma está diseñada para ser utilizada por estudiantes, docentes y administradores, y proporciona herramientas para gestionar equipos, sprints, backlogs, tareas, evaluaciones y métricas de progreso.

## Propósito

El propósito de esta plataforma es proporcionar una herramienta centralizada para la gestión de proyectos académicos, facilitando la colaboración entre estudiantes y la supervisión por parte de los docentes. La plataforma tiene como objetivo mejorar la organización, el seguimiento y la evaluación de los proyectos académicos, al tiempo que introduce a los estudiantes en las prácticas de desarrollo ágil.

## Tecnologías Utilizadas

- **Framework:** Next.js (con App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **ORM:** Prisma
- **Base de Datos:** SQLite (para desarrollo)
- **Autenticación:** NextAuth.js
- **Pruebas:** Jest y React Testing Library
- **Visualización de Datos:** Recharts

## Configuración y Uso

### Prerrequisitos

- Node.js (v18 o superior)
- npm

### Instalación

1. Clona el repositorio:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   ```
2. Instala las dependencias:
   ```bash
   cd workflows
   npm install
   ```
3. Configura la base de datos:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
La aplicación estará disponible en `http://localhost:3000`.

## Documentación

La documentación detallada del proyecto se encuentra en la carpeta `docs`. La documentación está organizada por iteraciones, y cada iteración incluye información sobre la planificación, el diseño, la codificación y las pruebas.

- [Iteración 1: Gestión de Equipos y Roles](./docs/iteracion1)
- [Iteración 2: Sprints y Backlogs](./docs/iteracion2)
- [Iteración 3: Seguimiento y Kanban](./docs/iteracion3)
- [Iteración 4: Evaluación y Calificación](./docs/iteracion4)
- [Iteración 5: Dashboard y Métricas](./docs/iteracion5)
