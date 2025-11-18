import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

// Mock de Next.js headers y cookies para API routes
jest.mock('next/headers', () => ({
  headers: jest.fn(() => new Map()),
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock de next-auth para evitar problemas de contexto
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

// Establecer base de datos de prueba
process.env.DATABASE_URL = 'file:./test.db';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Crear base de datos de prueba
  execSync('npx prisma migrate deploy --schema=./prisma/schema.prisma');
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  // Limpiar datos de prueba
  await prisma.comment.deleteMany();
  await prisma.document.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.evaluation.deleteMany();
  await prisma.task.deleteMany();
  await prisma.userStory.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.projectUser.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
});

export { prisma };