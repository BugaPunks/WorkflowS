import { NextRequest } from 'next/server';
import { GET } from '../../src/app/api/projects/[projectId]/scrum-role/route';
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
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('/api/projects/[projectId]/scrum-role', () => {
  let prisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockGetServerSession = require('next-auth/next').getServerSession;
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('debe retornar el rol Scrum del usuario exitosamente', async () => {
      const mockSession = {
        user: { id: 'user-1' },
      };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockProjectUser = {
        role: 'SCRUM_MASTER',
      };
      prisma.projectUser.findUnique.mockResolvedValue(mockProjectUser);

      const request = new NextRequest('http://localhost/api/projects/project-1/scrum-role');
      const response = await GET(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        scrumRole: 'SCRUM_MASTER',
        projectId: 'project-1',
      });
      expect(prisma.projectUser.findUnique).toHaveBeenCalledWith({
        where: {
          userId_projectId: {
            userId: 'user-1',
            projectId: 'project-1',
          },
        },
        select: {
          role: true,
        },
      });
    });

    it('debe retornar 401 si no hay sesión', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/projects/project-1/scrum-role');
      const response = await GET(request, { params: { projectId: 'project-1' } });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data).toEqual({ error: 'Unauthorized' });
    });

    it('debe retornar 404 si el usuario no es miembro del proyecto', async () => {
      const mockSession = {
        user: { id: 'user-1' },
      };
      mockGetServerSession.mockResolvedValue(mockSession);

      prisma.projectUser.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/projects/project-1/scrum-role');
      const response = await GET(request, { params: { projectId: 'project-1' } });

      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ error: 'User not in project' });
    });

    it('debe manejar errores de la base de datos', async () => {
      const mockSession = {
        user: { id: 'user-1' },
      };
      mockGetServerSession.mockResolvedValue(mockSession);

      prisma.projectUser.findUnique.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost/api/projects/project-1/scrum-role');
      const response = await GET(request, { params: { projectId: 'project-1' } });

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Internal server error' });
    });
  });
});