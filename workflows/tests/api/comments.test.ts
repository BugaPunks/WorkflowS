import { GET, POST } from '../../src/app/api/tasks/[taskId]/comments/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    comment: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/tasks/[taskId]/comments', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar comentarios de la tarea', async () => {
    const taskId = 'task1';
    const comments = [{ id: '1', text: 'Comment', author: { id: '1', name: 'User' } }];

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.comment.findMany.mockResolvedValue(comments);

    const response = await GET(new Request('http://localhost/api/tasks/task1/comments') as any, { params: { taskId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(comments);
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/tasks/task1/comments') as any, { params: { taskId: 'task1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});

describe('POST /api/tasks/[taskId]/comments', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe crear comentario exitosamente', async () => {
    const taskId = 'task1';
    const commentData = { text: 'New comment' };
    const createdComment = { id: '1', ...commentData, taskId, authorId: 'user1', author: { id: 'user1', name: 'User' } };

    mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
    mockPrisma.comment.create.mockResolvedValue(createdComment);

    const request = new Request('http://localhost/api/tasks/task1/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any, { params: { taskId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(createdComment);
  });

  it('debe retornar error si falta texto', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });

    const request = new Request('http://localhost/api/tasks/task1/comments', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any, { params: { taskId: 'task1' } });

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Comment text is required');
  });
});