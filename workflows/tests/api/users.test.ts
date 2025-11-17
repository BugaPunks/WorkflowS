import { POST } from '../../src/app/api/users/route';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('POST /api/users', () => {
  let mockPrisma: any;
  let mockBcrypt: any;

  beforeEach(() => {
    mockPrisma = new PrismaClient();
    mockBcrypt = require('bcryptjs');
  });

  it('debe crear un usuario exitosamente', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
      role: 'ESTUDIANTE',
    };

    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: '1',
      ...userData,
      password: 'hashedpassword',
    });
    mockBcrypt.hash.mockResolvedValue('hashedpassword');

    const request = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.email).toBe(userData.email);
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { email: userData.email } });
    expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: userData.email,
        name: userData.name,
        password: 'hashedpassword',
        role: userData.role,
      },
    });
  });

  it('debe retornar error si el email ya existe', async () => {
    const userData = {
      email: 'existing@example.com',
      password: 'password123',
    };

    mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: userData.email });

    const request = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('User already exists');
  });

  it('debe retornar error si faltan campos requeridos', async () => {
    const userData = { email: 'test@example.com' }; // falta password

    const request = new Request('http://localhost/api/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Email and password are required');
  });
});