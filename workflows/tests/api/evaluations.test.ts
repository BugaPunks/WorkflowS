import { POST } from '../../src/app/api/evaluations/route';
import { PrismaClient } from '@prisma/client';

const createMockRequest = (url: string, options: RequestInit) => {
  const mockUrl = new URL(url);
  const request = new Request(mockUrl.toString(), options);
  (request as any).nextUrl = mockUrl;
  return request;
};

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    sprint: {
      findUnique: jest.fn(),
    },
    evaluation: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('@/lib/auth-utils', () => ({
  requireDocente: jest.fn(),
}));

jest.mock('@/lib/error-utils', () => ({
  handleApiError: jest.fn(),
  ERROR_MESSAGES: {
    MISSING_FIELDS: 'Faltan campos requeridos',
    SPRINT_NOT_FOUND: 'Sprint no encontrado',
  },
}));

describe('/api/evaluations', () => {
  let prisma: any;
  let mockRequireDocente: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockRequireDocente = require('@/lib/auth-utils').requireDocente;
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('debe crear evaluación exitosamente', async () => {
      const mockSession = {
        user: { id: 'teacher-1', role: 'DOCENTE' },
      };
      mockRequireDocente.mockResolvedValue(mockSession);

      const mockSprint = { projectId: 'project-1' };
      prisma.sprint.findUnique.mockResolvedValue(mockSprint);

      const mockEvaluation = {
        id: 'eval-1',
        projectId: 'project-1',
        sprintId: 'sprint-1',
        studentId: 'student-1',
        evaluatorId: 'teacher-1',
        score: 85,
        feedback: 'Buen trabajo',
      };
      prisma.evaluation.create.mockResolvedValue(mockEvaluation);

      const request = createMockRequest('http://localhost/api/evaluations', {
        method: 'POST',
        body: JSON.stringify({
          sprintId: 'sprint-1',
          studentId: 'student-1',
          score: 85,
          feedback: 'Buen trabajo',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockEvaluation);
      expect(prisma.sprint.findUnique).toHaveBeenCalledWith({
        where: { id: 'sprint-1' },
        select: { projectId: true },
      });
      expect(prisma.evaluation.create).toHaveBeenCalledWith({
        data: {
          projectId: 'project-1',
          sprintId: 'sprint-1',
          studentId: 'student-1',
          evaluatorId: 'teacher-1',
          score: 85,
          feedback: 'Buen trabajo',
        },
      });
    });

    it('debe retornar error si no hay sesión', async () => {
      const mockError = new Error('UNAUTHORIZED');
      mockRequireDocente.mockRejectedValue(mockError);

      const request = createMockRequest('http://localhost/api/evaluations', {
        method: 'POST',
        body: JSON.stringify({
          sprintId: 'sprint-1',
          studentId: 'student-1',
          score: 85,
        }),
      });

      await expect(POST(request)).rejects.toThrow('UNAUTHORIZED');
    });

    it('debe retornar error si el usuario no es docente', async () => {
      const mockError = new Error('FORBIDDEN');
      mockRequireDocente.mockRejectedValue(mockError);

      const request = createMockRequest('http://localhost/api/evaluations', {
        method: 'POST',
        body: JSON.stringify({
          sprintId: 'sprint-1',
          studentId: 'student-1',
          score: 85,
        }),
      });

      await expect(POST(request)).rejects.toThrow('FORBIDDEN');
    });

    it('debe retornar error si faltan campos requeridos', async () => {
      const mockSession = {
        user: { id: 'teacher-1', role: 'DOCENTE' },
      };
      mockRequireDocente.mockResolvedValue(mockSession);

      const request = createMockRequest('http://localhost/api/evaluations', {
        method: 'POST',
        body: JSON.stringify({
          studentId: 'student-1',
          score: 85,
        }),
      });

      const response = await POST(request);
      const errorResponse = await response.json();

      expect(response.status).toBe(400);
      expect(errorResponse.error.message).toBe('Faltan campos requeridos');
    });

    it('debe retornar error si el sprint no existe', async () => {
      const mockSession = {
        user: { id: 'teacher-1', role: 'DOCENTE' },
      };
      mockRequireDocente.mockResolvedValue(mockSession);

      prisma.sprint.findUnique.mockResolvedValue(null);

      const request = createMockRequest('http://localhost/api/evaluations', {
        method: 'POST',
        body: JSON.stringify({
          sprintId: 'sprint-1',
          studentId: 'student-1',
          score: 85,
        }),
      });

      const response = await POST(request);
      const errorResponse = await response.json();

      expect(response.status).toBe(404);
      expect(errorResponse.error.message).toBe('Sprint no encontrado');
    });
  });
});