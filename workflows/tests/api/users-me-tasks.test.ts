import { GET } from '../../src/app/api/users/me/tasks/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    task: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/users/me/tasks', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar tareas asignadas al usuario actual', async () => {
    const tasks = [
      {
        id: 't1',
        title: 'Task 1',
        userStory: {
          project: { id: 'p1', name: 'Project 1' },
        },
      },
    ];

    mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
    mockPrisma.task.findMany.mockResolvedValue(tasks);

    const response = await GET(new Request('http://localhost/api/users/me/tasks') as any);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(tasks);
    expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
      where: { assignedToId: 'user1' },
      include: {
        userStory: {
          select: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/users/me/tasks') as any);

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});