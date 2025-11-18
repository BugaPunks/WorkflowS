import { NextRequest } from 'next/server';
import { POST } from '../../src/app/api/projects/[projectId]/export/route';
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
    projectUser: {
      findUnique: jest.fn(),
    },
    exportHistory: {
      create: jest.fn(),
      update: jest.fn(),
    },
    project: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('/api/projects/[projectId]/export POST', () => {
  let prisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockGetServerSession = require('next-auth/next').getServerSession;
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('debe exportar proyecto en formato JSON exitosamente', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockProjectUser = { id: 'pu-1' };
      prisma.projectUser.findUnique.mockResolvedValue(mockProjectUser);

      const mockExportRecord = { id: 'export-1' };
      prisma.exportHistory.create.mockResolvedValue(mockExportRecord);

      const mockProject = {
        id: 'project-1',
        name: 'Test Project',
        description: 'Test Description',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        users: [
          {
            user: { id: 'user-1', name: 'User 1', email: 'user1@test.com' },
          },
        ],
        stories: [],
        sprints: [],
        evaluations: [],
      };
      prisma.project.findUnique.mockResolvedValue(mockProject);

      prisma.exportHistory.update.mockResolvedValue({});

      const request = new NextRequest('http://localhost/api/projects/project-1/export', {
        method: 'POST',
        body: JSON.stringify({
          format: 'JSON',
          include: ['all'],
        }),
      });
      const response = await POST(request, { params: { projectId: 'project-1' } });

      expect(response.status).toBe(200);
      expect(prisma.exportHistory.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          projectId: 'project-1',
          type: 'PROJECT',
          format: 'JSON',
          fileName: 'project-project-1-export.json',
          status: 'processing',
        },
      });
      expect(prisma.exportHistory.update).toHaveBeenCalled();
    });

    it('debe retornar 401 si no hay sesión', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/projects/project-1/export', {
        method: 'POST',
        body: JSON.stringify({ format: 'JSON' }),
      });
      const response = await POST(request, { params: { projectId: 'project-1' } });

      expect(response.status).toBe(401);
    });

    it('debe retornar 403 si el usuario no es miembro del proyecto', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      prisma.projectUser.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/projects/project-1/export', {
        method: 'POST',
        body: JSON.stringify({ format: 'JSON' }),
      });
      const response = await POST(request, { params: { projectId: 'project-1' } });

      expect(response.status).toBe(403);
    });
  });
});