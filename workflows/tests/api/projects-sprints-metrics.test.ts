import { NextRequest } from 'next/server';
import { GET } from '../../src/app/api/projects/[projectId]/sprints/metrics/route';
import { PrismaClient } from '@prisma/client';

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    sprint: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('/api/projects/[projectId]/sprints/metrics', () => {
  let prisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockGetServerSession = require('next-auth/next').getServerSession;
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('debe retornar métricas de sprints exitosamente', async () => {
      const mockSession = {
        user: { id: 'user-1' },
      };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockSprints = [
        {
          id: 'sprint-1',
          name: 'Sprint 1',
          endDate: new Date('2024-12-31'),
          stories: [
            {
              tasks: [
                { status: 'COMPLETED' },
                { status: 'PENDING' },
              ],
            },
          ],
        },
      ];
      prisma.sprint.findMany.mockResolvedValue(mockSprints);

      const request = new NextRequest('http://localhost/api/projects/project-1/sprints/metrics');
      const response = await GET(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([
        {
          id: 'sprint-1',
          name: 'Sprint 1',
          progress: 50,
          tasksCompleted: 1,
          totalTasks: 2,
          endDate: expect.any(String),
        },
      ]);
    });

    it('debe retornar 401 si no hay sesión', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/projects/project-1/sprints/metrics');
      const response = await GET(request, { params: { projectId: 'project-1' } });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('debe manejar errores de la base de datos', async () => {
      const mockSession = {
        user: { id: 'user-1' },
      };
      mockGetServerSession.mockResolvedValue(mockSession);

      prisma.sprint.findMany.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/projects/project-1/sprints/metrics');
      const response = await GET(request, { params: { projectId: 'project-1' } });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });
});