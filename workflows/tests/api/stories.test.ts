import { PUT, DELETE } from '../../src/app/api/stories/[storyId]/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    userStory: {
      update: jest.fn(),
      delete: jest.fn(),
    },
    task: {
      deleteMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('PUT /api/stories/[storyId]', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe actualizar la historia de usuario exitosamente', async () => {
    const storyId = '1';
    const updateData = {
      title: 'Updated Story',
      description: 'Updated Description',
      acceptanceCriteria: 'Criteria',
      priority: 2,
      status: 'IN_PROGRESS',
      sprintId: 'sprint1',
    };
    const updatedStory = { id: storyId, ...updateData };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.userStory.update.mockResolvedValue(updatedStory);

    const request = new Request('http://localhost/api/stories/1', {
      method: 'PUT',
      body: JSON.stringify(updateData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { storyId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(updatedStory);
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new Request('http://localhost/api/stories/1', {
      method: 'PUT',
      body: JSON.stringify({ title: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { storyId: '1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});

describe('DELETE /api/stories/[storyId]', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe eliminar la historia de usuario exitosamente', async () => {
    const storyId = '1';

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.task.deleteMany.mockResolvedValue({});
    mockPrisma.userStory.delete.mockResolvedValue({});

    const request = new Request('http://localhost/api/stories/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { storyId } });

    expect(response.status).toBe(204);
    expect(mockPrisma.task.deleteMany).toHaveBeenCalledWith({ where: { userStoryId: storyId } });
    expect(mockPrisma.userStory.delete).toHaveBeenCalledWith({ where: { id: storyId } });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new Request('http://localhost/api/stories/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { storyId: '1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});