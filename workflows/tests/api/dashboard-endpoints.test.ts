import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Mock NextAuth
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}));

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    projectUser: { findUnique: jest.fn(), findMany: jest.fn() },
    sprint: { findMany: jest.fn(), findFirst: jest.fn() },
    task: { findMany: jest.fn(), count: jest.fn() },
    userStory: { findMany: jest.fn() },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('Dashboard API Endpoints', () => {
  let prisma: any;
  let mockGetServerSession: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockGetServerSession = require('next-auth/next').getServerSession;
    jest.clearAllMocks();
  });

  describe('GET /api/projects/[projectId]/scrum-role', () => {
    it('debe retornar el rol Scrum del usuario exitosamente', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockProjectUser = { role: 'SCRUM_MASTER' };
      prisma.projectUser.findUnique.mockResolvedValue(mockProjectUser);

      const { GET } = require('../../src/app/api/projects/[projectId]/scrum-role/route');
      const request = new NextRequest('http://localhost/api/projects/project-1/scrum-role');
      const response = await GET(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        scrumRole: 'SCRUM_MASTER',
        projectId: 'project-1',
      });
    });
  });

  describe('GET /api/projects/[projectId]/sprints/metrics', () => {
    it('debe retornar métricas de sprints', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockSprints = [
        {
          id: 'sprint-1',
          name: 'Sprint 1',
          stories: [
            {
              tasks: [
                { status: 'COMPLETED' },
                { status: 'PENDING' },
              ],
            },
          ],
          endDate: new Date('2024-12-31'),
        },
      ];
      prisma.sprint.findMany.mockResolvedValue(mockSprints);

      const { GET } = require('../../src/app/api/projects/[projectId]/sprints/metrics/route');
      const request = new NextRequest('http://localhost/api/projects/project-1/sprints/metrics');
      const response = await GET(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([
        {
          id: 'sprint-1',
          name: 'Sprint 1',
          progress: 50,
          tasksCompleted: 1,
          totalTasks: 2,
          endDate: expect.any(String),
        },
      ]);
    });
  });

  describe('GET /api/projects/[projectId]/team/metrics', () => {
    it('debe retornar métricas del equipo', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockProjectUsers = [
        { 
          userId: 'user-1', 
          role: 'TEAM_DEVELOPER',
          user: { id: 'user-1', name: 'User 1' }
        },
        { 
          userId: 'user-2', 
          role: 'SCRUM_MASTER',
          user: { id: 'user-2', name: 'User 2' }
        },
      ];
      prisma.projectUser.findMany.mockResolvedValue(mockProjectUsers);

      const mockTasks = [
        { status: 'COMPLETED', assignedToId: 'user-1' },
        { status: 'PENDING', assignedToId: 'user-1' },
        { status: 'COMPLETED', assignedToId: 'user-2' },
        { status: 'PENDING', assignedToId: 'user-2' },
      ];
      prisma.task.findMany.mockResolvedValue(mockTasks);

      const { GET } = require('../../src/app/api/projects/[projectId]/team/metrics/route');
      const request = new NextRequest('http://localhost/api/projects/project-1/team/metrics');
      const response = await GET(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([
        {
          id: 'user-1',
          name: 'User 1',
          tasksCompleted: 2,
          tasksPending: 2,
          role: 'TEAM_DEVELOPER',
        },
        {
          id: 'user-2',
          name: 'User 2',
          tasksCompleted: 2,
          tasksPending: 2,
          role: 'SCRUM_MASTER',
        },
      ]);
    });
  });

  describe('GET /api/projects/[projectId]/blockers', () => {
    it('debe retornar bloqueos simulados', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const { GET } = require('../../src/app/api/projects/[projectId]/blockers/route');
      const request = new NextRequest('http://localhost/api/projects/project-1/blockers');
      const response = await GET(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([
        {
          id: '1',
          description: 'Esperando aprobación del diseño del cliente',
          taskId: 'task-1',
          reportedBy: 'Juan Pérez',
          createdAt: expect.any(String),
        },
        {
          id: '2',
          description: 'Dependencia con el equipo de backend bloqueada',
          taskId: 'task-2',
          reportedBy: 'María García',
          createdAt: expect.any(String),
        },
      ]);
    });
  });

  describe('GET /api/projects/[projectId]/stories/backlog', () => {
    it('debe retornar historias del backlog', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockStories = [
        {
          id: 'story-1',
          title: 'User Story 1',
          priority: 8,
          status: 'TODO',
          acceptanceCriteria: 'Criteria 1',
          storyPoints: 5,
          sprint: { id: 'sprint-1', name: 'Sprint 1' },
        },
        {
          id: 'story-2',
          title: 'User Story 2',
          priority: 5,
          status: 'IN_PROGRESS',
          acceptanceCriteria: 'Criteria 2',
          storyPoints: 8,
          sprint: { id: 'sprint-1', name: 'Sprint 1' },
        },
        {
          id: 'story-3',
          title: 'User Story 3',
          priority: 3,
          status: 'DONE',
          acceptanceCriteria: 'Criteria 3',
          storyPoints: 3,
          sprint: { id: 'sprint-1', name: 'Sprint 1' },
        },
      ];
      prisma.userStory.findMany.mockResolvedValue(mockStories);

      const { GET } = require('../../src/app/api/projects/[projectId]/stories/backlog/route');
      const request = new NextRequest('http://localhost/api/projects/project-1/stories/backlog');
      const response = await GET(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockStories);
    });
  });

  describe('GET /api/projects/[projectId]/stories/metrics', () => {
    it('debe retornar métricas de historias', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockStories = [
        { status: 'DONE', priority: 5 },
        { status: 'IN_PROGRESS', priority: 8 },
        { status: 'TODO', priority: 3 },
      ];
      prisma.userStory.findMany.mockResolvedValue(mockStories);

      const { GET } = require('../../src/app/api/projects/[projectId]/stories/metrics/route');
      const request = new NextRequest('http://localhost/api/projects/project-1/stories/metrics');
      const response = await GET(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        totalStories: 3,
        completedStories: 1,
        inProgressStories: 1,
        pendingStories: 1,
        totalStoryPoints: 16,
        completedStoryPoints: 5,
      });
    });
  });

  describe('GET /api/projects/[projectId]/tasks/my-tasks', () => {
    it('debe retornar tareas del usuario', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockTasks = [
        {
          id: 'task-1',
          title: 'Task 1',
          status: 'PENDING',
          userStory: { id: 'story-1', title: 'Story 1' },
        },
        {
          id: 'task-2',
          title: 'Task 2',
          status: 'IN_PROGRESS',
          userStory: { id: 'story-1', title: 'Story 1' },
        },
        {
          id: 'task-3',
          title: 'Task 3',
          status: 'COMPLETED',
          userStory: { id: 'story-1', title: 'Story 1' },
        },
      ];
      prisma.task.findMany.mockResolvedValue(mockTasks);

      const { GET } = require('../../src/app/api/projects/[projectId]/tasks/my-tasks/route');
      const request = new NextRequest('http://localhost/api/projects/project-1/tasks/my-tasks');
      const response = await GET(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockTasks);
    });
  });

  describe('GET /api/projects/[projectId]/tasks/my-metrics', () => {
    it('debe retornar métricas personales del usuario', async () => {
      const mockSession = { user: { id: 'user-1' } };
      mockGetServerSession.mockResolvedValue(mockSession);

      const mockTasks = [
        { status: 'COMPLETED' },
        { status: 'IN_PROGRESS' },
        { status: 'PENDING' },
      ];
      prisma.task.findMany.mockResolvedValue(mockTasks);

      const mockCurrentSprint = { id: 'sprint-1' };
      prisma.sprint.findFirst.mockResolvedValue(mockCurrentSprint);

      prisma.task.count.mockResolvedValue(2);

      const { GET } = require('../../src/app/api/projects/[projectId]/tasks/my-metrics/route');
      const request = new NextRequest('http://localhost/api/projects/project-1/tasks/my-metrics');
      const response = await GET(request, { params: { projectId: 'project-1' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        totalTasks: 3,
        completedTasks: 1,
        inProgressTasks: 1,
        pendingTasks: 1,
        completionRate: 33,
        currentSprintTasks: 2,
      });
    });
  });
});