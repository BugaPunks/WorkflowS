import { PUT, DELETE } from '../../src/app/api/tasks/[taskId]/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    task: {
      update: jest.fn(),
      delete: jest.fn(),
    },
    comment: {
      deleteMany: jest.fn(),
    },
    document: {
      deleteMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('PUT /api/tasks/[taskId]', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe actualizar la tarea exitosamente', async () => {
    const taskId = '1';
    const updateData = {
      title: 'Updated Task',
      description: 'Updated Description',
      storyPoints: 5,
      status: 'IN_PROGRESS',
      assignedToId: 'user2',
    };
    const updatedTask = { id: taskId, ...updateData };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.task.update.mockResolvedValue(updatedTask);

    const request = new Request('http://localhost/api/tasks/1', {
      method: 'PUT',
      body: JSON.stringify(updateData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { taskId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(updatedTask);
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new Request('http://localhost/api/tasks/1', {
      method: 'PUT',
      body: JSON.stringify({ title: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { taskId: '1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});

describe('DELETE /api/tasks/[taskId]', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe eliminar la tarea exitosamente', async () => {
    const taskId = '1';

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.comment.deleteMany.mockResolvedValue({});
    mockPrisma.document.deleteMany.mockResolvedValue({});
    mockPrisma.task.delete.mockResolvedValue({});

    const request = new Request('http://localhost/api/tasks/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { taskId } });

    expect(response.status).toBe(204);
    expect(mockPrisma.comment.deleteMany).toHaveBeenCalledWith({ where: { taskId } });
    expect(mockPrisma.document.deleteMany).toHaveBeenCalledWith({ where: { taskId } });
    expect(mockPrisma.task.delete).toHaveBeenCalledWith({ where: { id: taskId } });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new Request('http://localhost/api/tasks/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { taskId: '1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});