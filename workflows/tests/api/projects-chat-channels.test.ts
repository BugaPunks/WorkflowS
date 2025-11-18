import { NextRequest } from 'next/server';
import { GET, POST } from '../../src/app/api/projects/[projectId]/chat/channels/route';
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
    chatChannel: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    projectUser: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('/api/projects/[projectId]/chat/channels', () => {
  let prisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockGetServerSession = require('next-auth/next').getServerSession;
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('debe retornar canales de chat del proyecto', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockChannels = [
        {
          id: 'channel-1',
          name: 'General',
          type: 'PROJECT',
          _count: { messages: 5 },
        },
      ];
      prisma.chatChannel.findMany.mockResolvedValue(mockChannels);

      const request = new NextRequest('http://localhost/api/projects/project-1/chat/channels');
      const response = await GET(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockChannels);
    });

    it('debe retornar 401 si no hay sesión', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/projects/project-1/chat/channels');
      const response = await GET(request, { params: { projectId: 'project-1' } });

      expect(response.status).toBe(401);
    });
  });

  describe('POST', () => {
    it('debe crear un nuevo canal de chat', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockProjectUser = { id: 'pu-1' };
      prisma.projectUser.findUnique.mockResolvedValue(mockProjectUser);

      const mockChannel = {
        id: 'channel-1',
        name: 'Nuevo Canal',
        type: 'PROJECT',
        projectId: 'project-1',
        createdById: 'user-1',
      };
      prisma.chatChannel.create.mockResolvedValue(mockChannel);

      const request = new NextRequest('http://localhost/api/projects/project-1/chat/channels', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Nuevo Canal',
          type: 'PROJECT',
        }),
      });
      const response = await POST(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(mockChannel);
    });

    it('debe retornar 403 si el usuario no es miembro del proyecto', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      prisma.projectUser.findUnique.mockResolvedValue(null);

      const request = new NextRequest('http://localhost/api/projects/project-1/chat/channels', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Nuevo Canal',
          type: 'PROJECT',
        }),
      });
      const response = await POST(request, { params: { projectId: 'project-1' } });

      expect(response.status).toBe(403);
    });
  });
});