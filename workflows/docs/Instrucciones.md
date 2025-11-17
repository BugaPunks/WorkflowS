Quiero desarrollar un plataforma completa para la gestion de proyectos, aca las especificaciones con las que debe cumplir, tu puedes elegir las herramientas con las que se te sea mas facil desarrollar, la paltaforma debe ser intuitiva y facil de usar, pero cumpliendo con todo lo sgt ademas de ser totalmente completa, te porporciono en el directorio la ultima version de la documentacion de Tailwind y la db debe ser SQL:

1. Visión General del Proyecto (El "Qué" y "Por Qué")

Este proyecto, llamado "WorkflowS" , busca resolver las ineficiencias en la gestión de proyectos académicos en la Universidad La Salle.

El Problema

La gestión actual se basa en métodos manuales y herramientas fragmentadas (hojas de cálculo, email, mensajería). Esto genera:

    Para Docentes: Sobrecarga administrativa, dificultad en el seguimiento del progreso real y retrasos en la retroalimentación.

Para Estudiantes: Desorganización, asignación desigual de responsabilidades, tensiones en los equipos y entregas de menor calidad.

El Objetivo (Tu Misión)

Desarrollar una plataforma web especializada para la gestión de proyectos académicos ágiles. El objetivo es crear un entorno digital que facilite la aplicación de Scrum, optimice el seguimiento, la comunicación y la evaluación del trabajo en equipo.

2. Usuarios y Roles del Sistema

Tu plataforma debe soportar dos niveles de roles: los tipos de usuario de la plataforma y los roles específicos de Scrum dentro de un proyecto.

Tipos de Usuarios

    Administrador: Gestiona la plataforma global, crea usuarios y asigna roles iniciales.

Docente: Crea y supervisa proyectos, evalúa entregables y da retroalimentación.

Estudiante: Participa en proyectos, asume roles Scrum y colabora en tareas.

Roles en el Sistema (Scrum)

    Administrador del Sistema (Admin): Gestión global.

Scrum Master: Facilita el proceso y elimina impedimentos.

Product Owner: Define y prioriza las historias de usuario.

Team Developer: Miembro del equipo que implementa las historias.

3. Requisitos Funcionales (El "Build List")

Esta es la lista de qué debe hacer la plataforma, extraída directamente de tu análisis.

Módulo 1: Gestión de Usuarios y Roles

    RF1.1: CRUD de usuarios (Crear, Modificar, Eliminar).

RF1.2: Soportar los 4 roles (Admin, Scrum Master, Product Owner, Team Developer).

RF1.3: Permitir la asignación de roles a nivel de proyecto.

Módulo 2: Gestión de Proyectos

    RF2.1: CRUD de proyectos.

RF2.2: Asignar estudiantes a proyectos con roles específicos.

RF2.3: Definir fechas de inicio y fin para proyectos.

Módulo 3: Gestión de Sprints

    RF3.1: CRUD de sprints dentro de un proyecto.

RF3.2: Asignar historias de usuario a sprints.

RF3.3: Definir fechas de inicio y fin para sprints.

Módulo 4: Gestión del Backlog (Historias y Tareas)

    RF4.1: CRUD de historias de usuario.

RF4.2: Asignar prioridades a las historias.

RF4.3: Definir criterios de aceptación.

RF5.1: CRUD de tareas (asociadas a historias de usuario).

RF5.2: Asignar tareas a miembros del equipo.

RF5.3: Actualizar estado de tareas (pendiente, en progreso, completada).

Módulo 5: Tablero Kanban

    RF6.1: Proveer un tablero Kanban visual.

RF6.2: Permitir arrastrar y soltar (drag-and-drop) tareas para actualizar su estado.

Módulo 6: Evaluación y Retroalimentación

    RF7.1: Permitir la evaluación de entregables con criterios predefinidos.

RF7.2: Asignar calificaciones (a nivel sprint o proyecto).

RF7.3: Proveer retroalimentación detallada.

Módulo 7: Métricas y Reportes

    RF8.1: Generar gráficos de burndown para el progreso de sprints.

RF8.2: Proveer métricas de contribución individual.

RF8.3: Generar reportes de desempeño (proyecto y equipo).

Módulo 8: Comunicación y Documentos

    RF9.1: Sistema de mensajería interna.

RF9.2: Enviar notificaciones (asignación de tareas, evaluaciones, etc.).

RF10.1: Cargar y descargar documentos (asociados a proyectos y tareas).

RF10.2: Mantener historial de versiones de documentos.

4. Requisitos No Funcionales (Las "Reglas" Técnicas)

Esto define cómo de bien debe funcionar la plataforma.

    Usabilidad:

        Interfaz intuitiva, fácil de usar sin experiencia previa en Scrum.

Accesible desde dispositivos móviles y de escritorio (Responsive Design).

Rendimiento:

    Respuesta < 2 segundos para operaciones comunes.

Soportar al menos 100 usuarios concurrentes.

Seguridad:

    Autenticación segura.

Control de acceso basado en roles (RBAC).

Disponibilidad:

    99% de tiempo de actividad (uptime).

Mantenibilidad:

    Código documentado y modular.

Interoperabilidad:

    Debe proveer APIs para futuras integraciones.

Soportar importación/exportación de datos.

5. Plan de Desarrollo (Product Backlog Priorizado)

Tu documento ya define un "Release Planning". Este es tu roadmap de desarrollo, dividido en iteraciones.

    Iteración 1 (Core):

        Sistema de autenticación y gestión de usuarios.

Creación/gestión de proyectos y asignación de roles.

Gestión de historias de usuario (Backlog).

Iteración 2 (Scrum Básico):

    Creación y gestión de Sprints.

Gestión de tareas (creación y asignación).

Tablero Kanban (visualización y drag-and-drop).

Iteración 3 (Seguimiento y Métricas):

    Sistema de evaluación y retroalimentación.

Generación de métricas y reportes (Burndown).

Sistema de notificaciones.

Dashboard personalizado por rol.

Iteración 4 (Utilidades):

    Gestión de documentos (subir/descargar).

Sistema de comunicación interna (chat/comentarios).

Calendario de eventos (fechas de Sprints).

Iteración 5 (Cierre):

    Exportación de datos.

6. Historias de Usuario Clave (Para IA)

Puedes usar estas historias de tu documento para pedirle a una IA que genere código, pruebas o modelos de datos.

    HU 2 (Docente): "Como docente, quiero crear proyectos, definir sus fechas de inicio y fin, y asignar estudiantes con roles específicos (Scrum Master, Product Owner, Team Developer) para organizar el trabajo colaborativo de manera efectiva."

HU 3 (Product Owner): "Como Product Owner, quiero crear, modificar y priorizar historias de usuario, así como definir criterios de aceptación para cada una, con el fin de establecer claramente los requisitos del proyecto."

HU 5 (Team Developer): "Como Team Developer, quiero crear, modificar y actualizar el estado de las tareas asociadas a las historias de usuario para gestionar mi trabajo diario y mantener informado al equipo sobre mi progreso."

HU 6 (Miembro del equipo): "Como miembro del equipo, quiero visualizar las tareas en un tablero Kanban y poder arrastrarlas entre columnas para actualizar su estado de manera intuitiva y seguir el progreso del proyecto."

HU 7 (Docente): "Como docente, quiero evaluar los entregables de los estudiantes con criterios predefinidos y proporcionar retroalimentación detallada para ayudarles a mejorar y asignar calificaciones justas."

HU 8 (Docente): "Como docente, quiero acceder a métricas y reportes sobre el progreso de los sprints, la contribución individual de los miembros del equipo y el desempeño general del proyecto para evaluar objetivamente el trabajo realizado."

7. 💡 Ideas Adicionales (Para una Plataforma más Completa)

Como solicitaste, aquí hay algunas ideas para llevar tu plataforma "WorkflowS" al siguiente nivel, basándose en tu plan actual:

    Sistema de Rúbricas Avanzado:

        En lugar de solo "criterios predefinidos" (RF7.1), crea un constructor de rúbricas donde los docentes puedan crear plantillas (ej. "Rúbrica para Documentación", "Rúbrica para Presentación Final") y reutilizarlas.

    Valor: Estandariza la evaluación y la hace más transparente.

Gamificación (Motivación Estudiantil):

    Otorga insignias (badges) por completar sprints a tiempo, ser el "mejor contribuidor" (basado en RF8.2 ), o cerrar tareas.

    Valor: Fomenta la participación y el compromiso estudiantil.

Módulo de "Peer Review" (Evaluación por Pares):

    Permite que los estudiantes se evalúen entre sí al final de un sprint o proyecto. El docente usaría esto como un input más para la nota de contribución individual (RF8.2).

    Valor: Fomenta la responsabilidad del equipo y da al docente más datos sobre la dinámica interna.

Plantillas de Proyectos:

    Permite a los docentes crear "plantillas" de proyectos. Si siempre da un proyecto de "Investigación" que tiene los mismos Sprints (Ej. Sprint 1: Marco Teórico, Sprint 2: Desarrollo), puede crear una plantilla y reutilizarla.

    Valor: Ahorra tiempo administrativo al docente (problema central ).

Integración con Calendarios Externos:

    Además del calendario interno (F13), permite a los usuarios exportar las fechas de Sprints y entregas a Google Calendar o Outlook.

Valor: Mejora la organización personal del estudiante.

Pdta: Al final ejecuta npm run lint y npm run build y corrige los errores.