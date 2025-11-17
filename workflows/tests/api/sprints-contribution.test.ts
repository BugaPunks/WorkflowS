import { GET } from '../../src/app/api/sprints/[sprintId]/contribution/route';
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

describe('GET /api/sprints/[sprintId]/contribution', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar reporte de contribucion exitosamente', async () => {
    const sprintId = 'sprint1';
    const tasks = [
      { assignedTo: { id: 'user1', name: 'User 1' }, storyPoints: 5 },
      { assignedTo: { id: 'user1', name: 'User 1' }, storyPoints: 3 },
      { assignedTo: { id: 'user2', name: 'User 2' }, storyPoints: 2 },
    ];

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.task.findMany.mockResolvedValue(tasks);

    const response = await GET(new Request('http://localhost/api/sprints/sprint1/contribution') as any, { params: { sprintId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2); // 2 users
    expect(result.find((r: any) => r.userId === 'user1')).toEqual({
      userId: 'user1',
      userName: 'User 1',
      tasksCompleted: 2,
      storyPointsContributed: 8,
    });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/sprints/sprint1/contribution') as any, { params: { sprintId: 'sprint1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});