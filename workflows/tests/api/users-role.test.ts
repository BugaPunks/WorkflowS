import { PUT } from '../../src/app/api/users/[userId]/role/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('PUT /api/users/[userId]/role', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe actualizar el rol del usuario exitosamente', async () => {
    const userId = '1';
    const newRole = 'DOCENTE';
    const updatedUser = { id: userId, role: newRole };

    mockGetServerSession.mockResolvedValue({ user: { role: 'ADMIN' } });
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    const request = new Request('http://localhost/api/users/1/role', {
      method: 'PUT',
      body: JSON.stringify({ role: newRole }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { userId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(updatedUser);
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { role: newRole },
    });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new Request('http://localhost/api/users/1/role', {
      method: 'PUT',
      body: JSON.stringify({ role: 'DOCENTE' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { userId: '1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });

  it('debe retornar error si el usuario no es admin', async () => {
    mockGetServerSession.mockResolvedValue({ user: { role: 'ESTUDIANTE' } });

    const request = new Request('http://localhost/api/users/1/role', {
      method: 'PUT',
      body: JSON.stringify({ role: 'DOCENTE' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await PUT(request as any, { params: { userId: '1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});