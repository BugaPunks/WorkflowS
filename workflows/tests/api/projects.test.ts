import { POST, GET } from '../../src/app/api/projects/route';
import { PUT, DELETE } from '../../src/app/api/projects/[projectId]/route';
import { PrismaClient } from '@prisma/client';

// Mock NextRequest
class MockNextRequest extends Request {
  cookies = { get: jest.fn() };
  geo = {};
  ip = '';
  nextUrl = new URL('http://localhost');
}

const createMockRequest = (url: string, options: RequestInit) => new MockNextRequest(url, options);

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    project: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    projectUser: {
      deleteMany: jest.fn(),
    },
    document: {
      deleteMany: jest.fn(),
    },
    evaluation: {
      deleteMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('POST /api/projects', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe crear un proyecto exitosamente', async () => {
    const projectData = {
      name: 'Test Project',
      description: 'Description',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      users: [{ userId: '1', role: 'SCRUM_MASTER' }],
    };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.project.create.mockResolvedValue({
      id: '1',
      ...projectData,
      startDate: new Date(projectData.startDate),
      endDate: new Date(projectData.endDate),
    });

    const request = createMockRequest('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.name).toBe(projectData.name);
    expect(mockPrisma.project.create).toHaveBeenCalledWith({
      data: {
        name: projectData.name,
        description: projectData.description,
        startDate: new Date(projectData.startDate),
        endDate: new Date(projectData.endDate),
        users: {
          create: projectData.users.map((user: { userId: string; role: string }) => ({
            userId: user.userId,
            role: user.role,
          })),
        },
      },
    });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = createMockRequest('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });

  it('debe retornar error si faltan campos requeridos', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });

    const projectData = { name: 'Test' }; // faltan startDate y endDate

    const request = createMockRequest('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Missing required fields');
  });
});

describe('GET /api/projects', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar lista de proyectos', async () => {
    const projects = [{ id: '1', name: 'Project 1' }];
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.project.findMany.mockResolvedValue(projects);

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(projects);
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});

describe('PUT /api/projects/[projectId]', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe actualizar el proyecto exitosamente', async () => {
    const projectId = '1';
    const updateData = {
      name: 'Updated Project',
      description: 'Updated Description',
      startDate: '2023-02-01',
      endDate: '2023-11-30',
    };
    const updatedProject = { id: projectId, ...updateData, startDate: new Date(updateData.startDate), endDate: new Date(updateData.endDate) };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.project.update.mockResolvedValue(updatedProject);

    const request = createMockRequest('http://localhost/api/projects/1', {
      method: 'PUT',
      body: JSON.stringify(updateData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { projectId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.id).toBe(updatedProject.id);
    expect(result.name).toBe(updatedProject.name);
    expect(result.description).toBe(updatedProject.description);
    expect(new Date(result.startDate)).toEqual(updatedProject.startDate);
    expect(new Date(result.endDate)).toEqual(updatedProject.endDate);
    expect(mockPrisma.project.update).toHaveBeenCalledWith({
      where: { id: projectId },
      data: {
        name: updateData.name,
        description: updateData.description,
        startDate: new Date(updateData.startDate),
        endDate: new Date(updateData.endDate),
      },
    });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = createMockRequest('http://localhost/api/projects/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { projectId: '1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});

describe('DELETE /api/projects/[projectId]', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe eliminar el proyecto exitosamente', async () => {
    const projectId = '1';

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.projectUser.deleteMany.mockResolvedValue({});
    mockPrisma.document.deleteMany.mockResolvedValue({});
    mockPrisma.evaluation.deleteMany.mockResolvedValue({});
    mockPrisma.project.delete.mockResolvedValue({});

    const request = createMockRequest('http://localhost/api/projects/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { projectId } });

    expect(response.status).toBe(204);
    expect(mockPrisma.projectUser.deleteMany).toHaveBeenCalledWith({ where: { projectId } });
    expect(mockPrisma.document.deleteMany).toHaveBeenCalledWith({ where: { projectId } });
    expect(mockPrisma.evaluation.deleteMany).toHaveBeenCalledWith({ where: { projectId } });
    expect(mockPrisma.project.delete).toHaveBeenCalledWith({ where: { id: projectId } });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = createMockRequest('http://localhost/api/projects/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { projectId: '1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});