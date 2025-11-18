import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextResponse } from "next/server";

export interface AuthenticatedSession {
  user: {
    id: string;
    role: string;
  };
}

/**
 * Validates user session and returns it
 * @returns AuthenticatedSession or null if not authenticated
 */
export async function getAuthenticatedSession(): Promise<AuthenticatedSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return {
    user: {
      id: session.user.id,
      role: session.user.role || 'ESTUDIANTE',
    },
  };
}

/**
 * Requires authentication and returns session
 * @returns AuthenticatedSession
 * @throws Error with 'UNAUTHORIZED' if not authenticated
 */
export async function requireAuth(): Promise<AuthenticatedSession> {
  const session = await getAuthenticatedSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}

/**
 * Requires specific role
 * @param requiredRole - The role required
 * @returns AuthenticatedSession
 * @throws Error with 'FORBIDDEN' if not authorized
 */
export async function requireRole(requiredRole: string): Promise<AuthenticatedSession> {
  const session = await requireAuth();
  if (session.user.role !== requiredRole) {
    throw new Error('FORBIDDEN');
  }
  return session;
}

/**
 * Requires admin role
 * @returns AuthenticatedSession
 * @throws NextResponse with 403 if not admin
 */
export async function requireAdmin(): Promise<AuthenticatedSession> {
  return requireRole('ADMIN');
}

/**
 * Requires docente role
 * @returns AuthenticatedSession
 * @throws Error with 'FORBIDDEN' if not docente
 */
export async function requireDocente(): Promise<AuthenticatedSession> {
  return requireRole('DOCENTE');
}

/**
 * Requires estudiante role
 * @returns AuthenticatedSession
 * @throws NextResponse with 403 if not estudiante
 */
export async function requireEstudiante(): Promise<AuthenticatedSession> {
  return requireRole('ESTUDIANTE');
}

/**
 * Check if user has specific role (doesn't throw)
 * @param role - Role to check
 * @returns boolean
 */
export async function hasRole(role: string): Promise<boolean> {
  try {
    const session = await getAuthenticatedSession();
    return session?.user.role === role;
  } catch {
    return false;
  }
}

/**
 * Check if user is docente (doesn't throw)
 * @returns boolean
 */
export async function isDocente(): Promise<boolean> {
  return hasRole('DOCENTE');
}

/**
 * Check if user is admin (doesn't throw)
 * @returns boolean
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('ADMIN');
}

/**
 * Check if user is estudiante (doesn't throw)
 * @returns boolean
 */
export async function isEstudiante(): Promise<boolean> {
  return hasRole('ESTUDIANTE');
}