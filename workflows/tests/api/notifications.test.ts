import { GET, PUT } from '../../src/app/api/notifications/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    notification: {
      findMany: jest.fn(),
      updateMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/notifications', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar notificaciones no leidas', async () => {
    const notifications = [{ id: '1', message: 'Test', read: false }];

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.notification.findMany.mockResolvedValue(notifications);

    const response = await GET(new Request('http://localhost/api/notifications') as any);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(notifications);
    expect(mockPrisma.notification.findMany).toHaveBeenCalledWith({
      where: { userId: '1', read: false },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/notifications') as any);

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});

describe('PUT /api/notifications', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe marcar notificaciones como leidas', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.notification.updateMany.mockResolvedValue({ count: 5 });

    const response = await PUT(new Request('http://localhost/api/notifications', { method: 'PUT' }) as any);

    expect(response.status).toBe(204);
    expect(mockPrisma.notification.updateMany).toHaveBeenCalledWith({
      where: { userId: '1', read: false },
      data: { read: true },
    });
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await PUT(new Request('http://localhost/api/notifications', { method: 'PUT' }) as any);

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});