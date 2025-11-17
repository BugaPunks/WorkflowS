import { GET } from '../../src/app/api/sprints/[sprintId]/burndown/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    sprint: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/sprints/[sprintId]/burndown', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar datos de burndown exitosamente', async () => {
    const sprintId = 'sprint1';
    const sprint = {
      id: sprintId,
      startDate: '2023-10-01',
      endDate: '2023-10-05',
      stories: [
        {
          tasks: [
            { storyPoints: 5, status: 'COMPLETED', updatedAt: '2023-10-03T10:00:00Z' },
            { storyPoints: 3, status: 'PENDING', updatedAt: '2023-10-01T10:00:00Z' },
          ],
        },
      ],
    };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.sprint.findUnique.mockResolvedValue(sprint);

    const response = await GET(new Request('http://localhost/api/sprints/sprint1/burndown') as any, { params: { sprintId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5); // 5 days
    expect(result[0]).toHaveProperty('date');
    expect(result[0]).toHaveProperty('ideal');
    expect(result[0]).toHaveProperty('actual');
  });

  it('debe retornar error si sprint no existe', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.sprint.findUnique.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/sprints/sprint1/burndown') as any, { params: { sprintId: 'sprint1' } });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Sprint not found');
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/sprints/sprint1/burndown') as any, { params: { sprintId: 'sprint1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});