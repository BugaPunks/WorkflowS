import { GET } from '../../src/app/api/projects/[projectId]/export/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    project: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/projects/[projectId]/export', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar datos de exportacion del proyecto', async () => {
    const projectId = 'proj1';
    const project = {
      id: projectId,
      name: 'Test Project',
      users: [],
      sprints: [],
    };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.project.findUnique.mockResolvedValue(project);

    const response = await GET(new Request('http://localhost/api/projects/proj1/export') as any, { params: { projectId } });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    expect(response.headers.get('Content-Disposition')).toContain('attachment');
    const result = await response.json();
    expect(result).toEqual(project);
  });

  it('debe retornar error si proyecto no existe', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.project.findUnique.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/projects/proj1/export') as any, { params: { projectId: 'proj1' } });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Project not found');
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/projects/proj1/export') as any, { params: { projectId: 'proj1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});