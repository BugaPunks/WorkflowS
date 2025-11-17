import { GET } from '../../src/app/api/users/list/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/users/list', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar lista de usuarios', async () => {
    const users = [
      { id: '1', name: 'User 1', email: 'user1@example.com', role: 'ESTUDIANTE' },
      { id: '2', name: 'User 2', email: 'user2@example.com', role: 'DOCENTE' },
    ];

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.user.findMany.mockResolvedValue(users);

    const response = await GET();
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(users);
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});