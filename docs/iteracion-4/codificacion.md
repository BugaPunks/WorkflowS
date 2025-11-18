# Iteración 4: Evaluación y Calificación

## Codificación

### Implementación del Sistema de Evaluación
Se desarrollaron los componentes de la interfaz de usuario y los endpoints de la API para crear y gestionar las evaluaciones.

*   **Estado:** Implementado.

### Desarrollo del Cálculo Automático de Calificaciones
Se implementó la lógica para calcular la calificación final de un estudiante basándose en las puntuaciones de cada criterio y sus ponderaciones.

**Snippet de Código Relevante:**
A continuación, se muestra una función de utilidad para calcular la calificación promedio.

*   **Título:** `calculateAverageGrade`
*   **Nota:** Esta función recibe un array de calificaciones y devuelve el promedio.

```typescript
// src/utils/grades.ts

function calculateAverageGrade(grades: { score: number; weight: number }[]): number {
  const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);
  const weightedSum = grades.reduce((sum, grade) => sum + grade.score * grade.weight, 0);

  return weightedSum / totalWeight;
}
```

### Programación de Formularios de Retroalimentación
Se implementaron los formularios que permiten a los docentes enviar retroalimentación a los estudiantes.

*   **Estado:** Implementado.

### Entregables
- **Código Fuente Comentado:** El código se encuentra en el directorio `src/`.
- **Módulo de Evaluación Funcional:** El sistema de evaluación y calificación está operativo.
