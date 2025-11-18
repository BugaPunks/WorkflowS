import { render, screen, waitFor, act } from '@testing-library/react';
import UserDashboard from '@/app/components/UserDashboard';
import { Task } from '@/types';

// Mock Next.js Link
jest.mock('next/link', () => {
  const React = require('react');
  return ({ children, href, ...props }: any) => React.createElement('a', { href, ...props }, children);
});

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('UserDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<UserDashboard />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('fetches user tasks on mount', async () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Task 1',
        status: 'PENDING',
        userStory: {
          project: {
            id: 'project1',
            name: 'Project 1',
          },
        },
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTasks),
    });

    render(<UserDashboard />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/users/me/tasks');
    });
  });

  it('displays task counts correctly', async () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Pending Task',
        status: 'PENDING',
        userStory: { project: { id: '1', name: 'Project 1' } },
      },
      {
        id: '2',
        title: 'In Progress Task',
        status: 'IN_PROGRESS',
        userStory: { project: { id: '1', name: 'Project 1' } },
      },
      {
        id: '3',
        title: 'Completed Task',
        status: 'COMPLETED',
        userStory: { project: { id: '1', name: 'Project 1' } },
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTasks),
    });

    await act(async () => {
      render(<UserDashboard />);
    });

    await waitFor(() => {
      const pendingCount = screen.getByText('Tareas Pendientes').nextElementSibling;
      const inProgressCount = screen.getByText('En Progreso').nextElementSibling;
      const completedCount = screen.getByText('Completadas').nextElementSibling;

      expect(pendingCount).toHaveTextContent('1');
      expect(inProgressCount).toHaveTextContent('1');
      expect(completedCount).toHaveTextContent('1');
    });
  });

  it('displays recent tasks', async () => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Recent Task 1',
        status: 'PENDING',
        userStory: { project: { id: '1', name: 'Project 1' } },
      },
      {
        id: '2',
        title: 'Recent Task 2',
        status: 'IN_PROGRESS',
        userStory: { project: { id: '2', name: 'Project 2' } },
      },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTasks),
    });

    render(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Recent Task 1')).toBeInTheDocument();
      expect(screen.getByText('Recent Task 2')).toBeInTheDocument();
      expect(screen.getByText('Project 1 - PENDING')).toBeInTheDocument();
      expect(screen.getByText('Project 2 - IN_PROGRESS')).toBeInTheDocument();
    });
  });

  it('displays quick action buttons', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Ver Mis Proyectos')).toBeInTheDocument();
      expect(screen.getByText('Unirme a un Proyecto')).toBeInTheDocument();
      expect(screen.getByText('Crear Nuevo Proyecto')).toBeInTheDocument();
    });

    const projectLinks = screen.getAllByText(/Proyectos/).map(link => link.closest('a'));
    expect(projectLinks.length).toBeGreaterThan(0);
  });

  it('shows dashboard title', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Mi Dashboard')).toBeInTheDocument();
    });
  });

  it('shows recent tasks section title', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(<UserDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Mis Tareas Recientes')).toBeInTheDocument();
      expect(screen.getByText('Acciones Rápidas')).toBeInTheDocument();
    });
  });

  it('handles empty tasks list', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await act(async () => {
      render(<UserDashboard />);
    });

    await waitFor(() => {
      // All task counts should be 0
      const pendingCount = screen.getByText('Tareas Pendientes').nextElementSibling;
      const inProgressCount = screen.getByText('En Progreso').nextElementSibling;
      const completedCount = screen.getByText('Completadas').nextElementSibling;

      expect(pendingCount).toHaveTextContent('0');
      expect(inProgressCount).toHaveTextContent('0');
      expect(completedCount).toHaveTextContent('0');
    });
  });

  it('handles API error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    render(<UserDashboard />);

    await waitFor(() => {
      // Should still render the dashboard structure even with error
      expect(screen.getByText('Mi Dashboard')).toBeInTheDocument();
    });
  });
});