import { GET as getStories, POST as postStory } from '../../src/app/api/projects/[projectId]/stories/route';
import { GET as getEvaluations, POST as postEvaluation } from '../../src/app/api/projects/[projectId]/evaluations/route';
import { PrismaClient } from '@prisma/client';

// Mock NextRequest
class MockNextRequest extends Request {
  cookies = { get: jest.fn() };
  geo = {};
  ip = '';
  nextUrl = new URL('http://localhost');
}

const createMockRequest = (url: string, options: RequestInit) => new MockNextRequest(url || 'http://localhost', options);

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    userStory: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    evaluation: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/projects/[projectId]/stories', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar historias del proyecto', async () => {
    const projectId = 'proj1';
    const stories = [{ id: '1', title: 'Story 1', priority: 1 }];

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.userStory.findMany.mockResolvedValue(stories);

    const response = await getStories(createMockRequest('http://localhost', {}) as any, { params: { projectId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(stories);
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await getStories(createMockRequest('http://localhost', {}) as any, { params: { projectId: '1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});

describe('POST /api/projects/[projectId]/stories', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe crear historia exitosamente', async () => {
    const projectId = 'proj1';
    const storyData = { title: 'New Story', description: 'Desc', priority: 1 };
    const createdStory = { id: '1', ...storyData, projectId };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.userStory.create.mockResolvedValue(createdStory);

    const request = new Request('http://localhost/api/projects/proj1/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await postStory(request as any, { params: { projectId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(createdStory);
  });

  it('debe retornar error si faltan campos requeridos', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });

    const request = new Request('http://localhost/api/projects/proj1/stories', {
      method: 'POST',
      body: JSON.stringify({ description: 'Desc' }), // falta title y priority
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await postStory(request as any, { params: { projectId: 'proj1' } });

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Missing required fields');
  });
});

describe('GET /api/projects/[projectId]/evaluations', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar evaluaciones para docente', async () => {
    const projectId = 'proj1';
    const evaluations = [{ id: '1', score: 8.5 }];

    mockGetServerSession.mockResolvedValue({ user: { id: '1', role: 'DOCENTE' } });
    mockPrisma.evaluation.findMany.mockResolvedValue(evaluations);

    const response = await getEvaluations(createMockRequest('http://localhost', {}) as any, { params: { projectId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(evaluations);
  });

  it('debe filtrar evaluaciones para estudiante', async () => {
    const projectId = 'proj1';
    const evaluations = [{ id: '1', score: 8.5, studentId: 'student1' }];

    mockGetServerSession.mockResolvedValue({ user: { id: 'student1', role: 'ESTUDIANTE' } });
    mockPrisma.evaluation.findMany.mockResolvedValue(evaluations);

    const response = await getEvaluations(createMockRequest('http://localhost', {}) as any, { params: { projectId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(evaluations);
    expect(mockPrisma.evaluation.findMany).toHaveBeenCalledWith({
      where: { projectId, studentId: 'student1' },
      include: {
        student: { select: { id: true, name: true } },
        sprint: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  });
});

describe('POST /api/projects/[projectId]/evaluations', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe crear evaluacion exitosamente', async () => {
    const projectId = 'proj1';
    const evalData = { sprintId: 'sprint1', studentId: 'student1', score: 9.0, feedback: 'Good' };
    const createdEval = { id: '1', ...evalData, projectId, evaluatorId: 'teacher1' };

    mockGetServerSession.mockResolvedValue({ user: { id: 'teacher1', role: 'DOCENTE' } });
    mockPrisma.evaluation.create.mockResolvedValue(createdEval);
    mockPrisma.notification.create.mockResolvedValue({});

    const request = new Request('http://localhost/api/projects/proj1/evaluations', {
      method: 'POST',
      body: JSON.stringify(evalData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await postEvaluation(request as any, { params: { projectId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(createdEval);
  });

  it('debe retornar error si no es docente', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1', role: 'ESTUDIANTE' } });

    const request = new Request('http://localhost/api/projects/proj1/evaluations', {
      method: 'POST',
      body: JSON.stringify({ sprintId: '1', studentId: '2', score: 8 }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await postEvaluation(request as any, { params: { projectId: 'proj1' } });

    expect(response.status).toBe(403);
    expect(await response.text()).toBe('Forbidden: Only teachers can create evaluations');
  });
});