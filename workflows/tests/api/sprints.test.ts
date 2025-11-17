import { PUT, DELETE } from '../../src/app/api/sprints/[sprintId]/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    sprint: {
      update: jest.fn(),
      delete: jest.fn(),
    },
    userStory: {
      updateMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('PUT /api/sprints/[sprintId]', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe actualizar el sprint exitosamente', async () => {
    const sprintId = '1';
    const updateData = {
      name: 'Updated Sprint',
      startDate: '2023-03-01',
      endDate: '2023-03-15',
    };
    const updatedSprint = { id: sprintId, ...updateData, startDate: new Date(updateData.startDate), endDate: new Date(updateData.endDate) };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.sprint.update.mockResolvedValue(updatedSprint);

    const request = new Request('http://localhost/api/sprints/1', {
      method: 'PUT',
      body: JSON.stringify(updateData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { sprintId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.id).toBe(updatedSprint.id);
    expect(result.name).toBe(updatedSprint.name);
    expect(new Date(result.startDate)).toEqual(updatedSprint.startDate);
    expect(new Date(result.endDate)).toEqual(updatedSprint.endDate);
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new Request('http://localhost/api/sprints/1', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Test' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { sprintId: '1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});

describe('DELETE /api/sprints/[sprintId]', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe eliminar el sprint exitosamente', async () => {
    const sprintId = '1';

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.userStory.updateMany.mockResolvedValue({});
    mockPrisma.sprint.delete.mockResolvedValue({});

    const request = new Request('http://localhost/api/sprints/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { sprintId } });

    expect(response.status).toBe(204);
    expect(mockPrisma.userStory.updateMany).toHaveBeenCalledWith({
      where: { sprintId },
      data: { sprintId: null },
    });
    expect(mockPrisma.sprint.delete).toHaveBeenCalledWith({ where: { id: sprintId } });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new Request('http://localhost/api/sprints/1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { sprintId: '1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});