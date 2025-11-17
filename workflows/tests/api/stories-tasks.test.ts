import { POST } from '../../src/app/api/stories/[storyId]/tasks/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    task: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('POST /api/stories/[storyId]/tasks', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe crear tarea exitosamente', async () => {
    const storyId = 'story1';
    const taskData = { title: 'New Task', description: 'Desc', assignedToId: 'user2' };
    const createdTask = { id: '1', ...taskData, userStoryId: storyId };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.task.create.mockResolvedValue(createdTask);

    const request = new Request('http://localhost/api/stories/story1/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any, { params: { storyId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(createdTask);
  });

  it('debe retornar error si falta titulo', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });

    const request = new Request('http://localhost/api/stories/story1/tasks', {
      method: 'POST',
      body: JSON.stringify({ description: 'Desc' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any, { params: { storyId: 'story1' } });

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Title is a required field');
  });
});