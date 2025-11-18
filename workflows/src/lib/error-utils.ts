import { NextResponse } from "next/server";

/**
 * Standardized error responses
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
  statusCode: number,
  message: string,
  details?: any
): NextResponse {
  const error = {
    error: {
      message,
      statusCode,
      ...(details && { details })
    }
  };

  return NextResponse.json(error, { status: statusCode });
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return createErrorResponse(error.statusCode, error.message, error.details);
  }

  if (error instanceof NextResponse) {
    return error; // Already a NextResponse
  }

  // Handle thrown Error objects
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') {
      return createErrorResponse(401, 'No autorizado');
    }
    if (error.message === 'FORBIDDEN') {
      return createErrorResponse(403, 'Acceso denegado');
    }
  }

  // Log unexpected errors (in development)
  if (process.env.NODE_ENV === 'development') {
    console.error('Unexpected API error:', error);
  }

  return createErrorResponse(500, 'Error interno del servidor');
}

/**
 * Common error messages in Spanish
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso denegado',
  NOT_FOUND: 'Recurso no encontrado',
  BAD_REQUEST: 'Solicitud inválida',
  CONFLICT: 'Conflicto con el estado actual',
  INTERNAL_ERROR: 'Error interno del servidor',
  VALIDATION_ERROR: 'Datos de entrada inválidos',
  MISSING_FIELDS: 'Faltan campos requeridos',
  INVALID_ROLE: 'Rol de usuario inválido',
  PROJECT_NOT_FOUND: 'Proyecto no encontrado',
  SPRINT_NOT_FOUND: 'Sprint no encontrado',
  STORY_NOT_FOUND: 'Historia no encontrada',
  TASK_NOT_FOUND: 'Tarea no encontrada',
  USER_NOT_FOUND: 'Usuario no encontrado',
} as const;

/**
 * Create common error responses
 */
export const errorResponses = {
  unauthorized: () => createErrorResponse(401, ERROR_MESSAGES.UNAUTHORIZED),
  forbidden: () => createErrorResponse(403, ERROR_MESSAGES.FORBIDDEN),
  notFound: (resource = 'recurso') => createErrorResponse(404, `${resource} no encontrado`),
  badRequest: (message = ERROR_MESSAGES.BAD_REQUEST) => createErrorResponse(400, message),
  conflict: (message = ERROR_MESSAGES.CONFLICT) => createErrorResponse(409, message),
  internalError: () => createErrorResponse(500, ERROR_MESSAGES.INTERNAL_ERROR),
};