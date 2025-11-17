import { GET, POST } from '../../src/app/api/projects/[projectId]/sprints/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    sprint: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/projects/[projectId]/sprints', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar sprints del proyecto', async () => {
    const projectId = 'proj1';
    const sprints = [{ id: 's1', name: 'Sprint 1', startDate: '2023-10-01', endDate: '2023-10-15' }];

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.sprint.findMany.mockResolvedValue(sprints);

    const response = await GET(new Request('http://localhost/api/projects/proj1/sprints') as any, { params: { projectId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(sprints);
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/projects/proj1/sprints') as any, { params: { projectId: 'proj1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});

describe('POST /api/projects/[projectId]/sprints', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe crear sprint exitosamente', async () => {
    const projectId = 'proj1';
    const sprintData = { name: 'New Sprint', startDate: '2023-11-01', endDate: '2023-11-15' };
    const createdSprint = { id: 's1', ...sprintData, projectId, startDate: new Date(sprintData.startDate), endDate: new Date(sprintData.endDate) };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.sprint.create.mockResolvedValue(createdSprint);

    const request = new Request('http://localhost/api/projects/proj1/sprints', {
      method: 'POST',
      body: JSON.stringify(sprintData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any, { params: { projectId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.id).toBe(createdSprint.id);
    expect(result.name).toBe(createdSprint.name);
    expect(new Date(result.startDate)).toEqual(createdSprint.startDate);
    expect(new Date(result.endDate)).toEqual(createdSprint.endDate);
  });

  it('debe retornar error si faltan campos requeridos', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });

    const request = new Request('http://localhost/api/projects/proj1/sprints', {
      method: 'POST',
      body: JSON.stringify({ name: 'Sprint' }), // falta startDate y endDate
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any, { params: { projectId: 'proj1' } });

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Missing required fields');
  });
});