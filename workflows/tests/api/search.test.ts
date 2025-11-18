import { GET } from '../../src/app/api/search/route';
import { PrismaClient } from '@prisma/client';

// Mock NextRequest
class MockNextRequest extends Request {
  cookies = { get: jest.fn() };
  geo = {};
  ip = '';
  nextUrl = new URL('http://localhost');
}

const createMockRequest = (url: string, searchParams?: URLSearchParams) => {
  const mockUrl = new URL(url);
  if (searchParams) {
    searchParams.forEach((value, key) => {
      mockUrl.searchParams.set(key, value);
    });
  }
  const request = new MockNextRequest(mockUrl.toString());
  (request as any).nextUrl = mockUrl;
  return request as any;
};

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    project: {
      findMany: jest.fn(),
    },
    userStory: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    task: {
      findMany: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

import { getServerSession } from 'next-auth/next';

describe("http://localhost/api/search", () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('debe retornar resultados de búsqueda exitosamente', async () => {
      const mockSession = {
        user: { id: 'user-1', role: 'ESTUDIANTE' },
      };
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      // Mock projects
      const mockProjects = [
        { id: 'project-1', name: 'Proyecto Test', description: 'Descripción test' },
      ];
      prisma.project.findMany.mockResolvedValueOnce(mockProjects);

      // Mock user stories
      const mockStories = [
        { id: 'story-1', title: 'Historia Test', projectId: 'project-1' },
      ];
      prisma.userStory.findMany.mockResolvedValueOnce(mockStories);

      // Mock story projects
      prisma.userStory.findMany.mockResolvedValueOnce([
        { id: 'story-1', project: { name: 'Proyecto Test' } },
      ]);

      // Mock tasks
      const mockTasks = [
        { id: 'task-1', title: 'Tarea Test', userStoryId: 'story-1', status: 'PENDING' },
      ];
      prisma.task.findMany.mockResolvedValueOnce(mockTasks);

      // Mock task story lookup
      prisma.userStory.findUnique.mockResolvedValue({
        project: { id: 'project-1', name: 'Proyecto Test' },
        users: [{ userId: 'user-1' }],
      });

      const searchParams = new URLSearchParams();
      searchParams.set('q', 'test');
      const request = createMockRequest("http://localhost/api/search", searchParams);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2); // project, story
      expect(data[0]).toMatchObject({
        type: 'project',
        title: 'Proyecto Test',
      });
      expect(data[1]).toMatchObject({
        type: 'story',
        title: 'Historia Test',
      });
    });

    it('debe retornar resultados vacíos para query muy corta', async () => {
      const mockSession = {
        user: { id: 'user-1', role: 'ESTUDIANTE' },
      };
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      const searchParams = new URLSearchParams();
      searchParams.set('q', 'a');
      const request = createMockRequest("http://localhost/api/search", searchParams);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('debe incluir usuarios para administradores', async () => {
      const mockSession = {
        user: { id: 'admin-1', role: 'ADMIN' },
      };
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      // Mock empty results for other searches
      prisma.project.findMany.mockResolvedValue([]);
      prisma.userStory.findMany.mockResolvedValue([]);
      prisma.task.findMany.mockResolvedValue([]);

      // Mock users
      const mockUsers = [
        { id: 'user-1', name: 'Usuario Test', email: 'test@example.com' },
      ];
      prisma.user.findMany.mockResolvedValue(mockUsers);

      const searchParams = new URLSearchParams();
      searchParams.set('q', 'test');
      const request = createMockRequest("http://localhost/api/search", searchParams);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toContainEqual({
        type: 'user',
        id: 'user-1',
        title: 'Usuario Test',
        subtitle: 'test@example.com',
        url: '/admin/users',
      });
    });

    it('debe retornar error si no hay sesión', async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const searchParams = new URLSearchParams();
      searchParams.set('q', 'test');
      const request = createMockRequest("http://localhost/api/search", searchParams);

      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('debe limitar resultados a 20', async () => {
      const mockSession = {
        user: { id: 'user-1', role: 'ESTUDIANTE' },
      };
      (getServerSession as jest.Mock).mockResolvedValue(mockSession);

      // Mock many results
      const manyProjects = Array.from({ length: 25 }, (_, i) => ({
        id: `project-${i}`,
        name: `Proyecto ${i}`,
        description: `Descripción ${i}`,
      }));
      prisma.project.findMany.mockResolvedValue(manyProjects);

      // Mock empty for others
      prisma.userStory.findMany.mockResolvedValue([]);
      prisma.task.findMany.mockResolvedValue([]);

      const searchParams = new URLSearchParams();
      searchParams.set('q', 'proyecto');
      const request = createMockRequest("http://localhost/api/search", searchParams);

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(20);
    });
  });
});