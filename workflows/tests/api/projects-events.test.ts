import { GET } from '../../src/app/api/projects/[projectId]/events/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    sprint: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/projects/[projectId]/events', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar eventos del proyecto', async () => {
    const projectId = 'proj1';
    const sprints = [
      { id: 's1', name: 'Sprint 1', startDate: '2023-10-01', endDate: '2023-10-15' },
      { id: 's2', name: 'Sprint 2', startDate: '2023-10-16', endDate: '2023-10-30' },
    ];

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.sprint.findMany.mockResolvedValue(sprints);

    const response = await GET(new Request('http://localhost/api/projects/proj1/events') as any, { params: { projectId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    expect(result[0]).toEqual({
      id: 's1',
      title: 'Sprint 1',
      start: '2023-10-01',
      end: '2023-10-15',
    });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/projects/proj1/events') as any, { params: { projectId: 'proj1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});