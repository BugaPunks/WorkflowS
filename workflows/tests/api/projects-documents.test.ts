import { GET, POST } from '../../src/app/api/projects/[projectId]/documents/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    document: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

describe('GET /api/projects/[projectId]/documents', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe retornar documentos del proyecto', async () => {
    const projectId = 'proj1';
    const documents = [{ id: '1', filename: 'doc.pdf', uploadedBy: { name: 'User' } }];

    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });
    mockPrisma.document.findMany.mockResolvedValue(documents);

    const response = await GET(new Request('http://localhost/api/projects/proj1/documents') as any, { params: { projectId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(documents);
  });

  it('debe retornar error si no hay sesion', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const response = await GET(new Request('http://localhost/api/projects/proj1/documents') as any, { params: { projectId: 'proj1' } });

    expect(response.status).toBe(401);
    expect(await response.text()).toBe('Unauthorized');
  });
});

describe('POST /api/projects/[projectId]/documents', () => {
  let mockPrisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockGetServerSession = require('next-auth').getServerSession;
  });

  it('debe crear documento exitosamente', async () => {
    const projectId = 'proj1';
    const docData = { filename: 'new.pdf', url: 'http://example.com/new.pdf', filetype: 'pdf', taskId: 'task1' };
    const createdDoc = { id: '1', ...docData, projectId, uploadedById: 'user1' };

    mockGetServerSession.mockResolvedValue({ user: { id: 'user1' } });
    mockPrisma.document.create.mockResolvedValue(createdDoc);

    const request = new Request('http://localhost/api/projects/proj1/documents', {
      method: 'POST',
      body: JSON.stringify(docData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any, { params: { projectId } });
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual(createdDoc);
  });

  it('debe retornar error si faltan campos requeridos', async () => {
    mockGetServerSession.mockResolvedValue({ user: { id: '1' } });

    const request = new Request('http://localhost/api/projects/proj1/documents', {
      method: 'POST',
      body: JSON.stringify({ filename: 'test.pdf' }), // falta url y filetype
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request as any, { params: { projectId: 'proj1' } });

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Missing required fields');
  });
});