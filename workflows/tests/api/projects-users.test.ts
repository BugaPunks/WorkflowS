import { PUT, DELETE } from '../../src/app/api/projects/[projectId]/users/[userId]/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    projectUser: {
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('PUT /api/projects/[projectId]/users/[userId]', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe actualizar el rol del usuario en el proyecto exitosamente', async () => {
    const projectId = 'proj1';
    const userId = 'user1';
    const newRole = 'PRODUCT_OWNER';
    const updatedProjectUser = { userId, projectId, role: newRole };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.projectUser.update.mockResolvedValue(updatedProjectUser);

    const request = new Request('http://localhost/api/projects/proj1/users/user1', {
      method: 'PUT',
      body: JSON.stringify({ role: newRole }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { projectId, userId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(updatedProjectUser);
    expect(mockPrisma.projectUser.update).toHaveBeenCalledWith({
      where: {
        userId_projectId: { userId, projectId },
      },
      data: { role: newRole },
    });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new Request('http://localhost/api/projects/proj1/users/user1', {
      method: 'PUT',
      body: JSON.stringify({ role: 'TEAM_DEVELOPER' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { projectId: 'proj1', userId: 'user1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});

describe('DELETE /api/projects/[projectId]/users/[userId]', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe eliminar al usuario del proyecto exitosamente', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.projectUser.delete.mockResolvedValue({});

    const request = new Request('http://localhost/api/projects/proj1/users/user1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { projectId: 'proj1', userId: 'user1' } });

    expect(response.status).toBe(204);
    expect(mockPrisma.projectUser.delete).toHaveBeenCalledWith({
      where: {
        userId_projectId: { userId: 'user1', projectId: 'proj1' },
      },
    });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new Request('http://localhost/api/projects/proj1/users/user1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { projectId: 'proj1', userId: 'user1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});