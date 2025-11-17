import { DELETE } from '../../src/app/api/documents/[documentId]/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    document: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('DELETE /api/documents/[documentId]', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe eliminar documento exitosamente', async () => {
    const documentId = 'doc1';
    const document = { id: documentId, filename: 'test.pdf' };

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.document.findUnique.mockResolvedValue(document);
    mockPrisma.document.delete.mockResolvedValue({});

    const request = new Request('http://localhost/api/documents/doc1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { documentId } });

    expect(response.status).toBe(204);
    expect(mockPrisma.document.findUnique).toHaveBeenCalledWith({ where: { id: documentId } });
    expect(mockPrisma.document.delete).toHaveBeenCalledWith({ where: { id: documentId } });
  });

  it('debe retornar error si documento no existe', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.document.findUnique.mockResolvedValue(null);

    const request = new Request('http://localhost/api/documents/doc1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { documentId: 'doc1' } });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe('Document not found');
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const request = new Request('http://localhost/api/documents/doc1', {
      method: 'DELETE',
    });

    const response = await DELETE(request as any, { params: { documentId: 'doc1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});