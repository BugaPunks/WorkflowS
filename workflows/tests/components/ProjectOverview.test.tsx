import { render, screen } from '@testing-library/react';
import ProjectOverview from '@/app/components/ProjectOverview';
import { Project, Task, UserStory, Sprint, ProjectUser } from '@/types';

// Mock Next.js Link
jest.mock('next/link', () => {
  const React = require('react');
  return ({ children, href, ...props }: any) => React.createElement('a', { href, ...props }, children);
});

describe('ProjectOverview', () => {
  const mockUser: ProjectUser = {
    id: '1',
    user: {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'ESTUDIANTE',
    },
    userId: 'user1',
    projectId: 'project1',
    role: 'TEAM_DEVELOPER',
  };

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Task description',
    status: 'IN_PROGRESS',
    storyPoints: 5,
    assignedTo: mockUser.user,
    userStory: {
      project: {
        id: 'project1',
        name: 'Test Project',
      },
    },
  };

  const mockUserStory: UserStory = {
    id: '1',
    title: 'Test Story',
    description: 'Story description',
    priority: 1,
    status: 'TODO',
    acceptanceCriteria: 'Criteria',
    projectId: 'project1',
    tasks: [mockTask],
  };

  const mockSprint: Sprint = {
    id: '1',
    name: 'Sprint 1',
    startDate: new Date().toISOString().split('T')[0], // Today
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    stories: [mockUserStory],
  };

  const mockProject: Project = {
    id: 'project1',
    name: 'Test Project',
    description: 'Project description',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    users: [mockUser],
    userStories: [mockUserStory],
    sprints: [mockSprint],
    documents: [],
  };

  it('renders project header with name and description', () => {
    render(<ProjectOverview project={mockProject} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Project description')).toBeInTheDocument();
  });

  it('renders action buttons', () => {
    render(<ProjectOverview project={mockProject} />);
    expect(screen.getByText('Ver Tablero')).toBeInTheDocument();
    expect(screen.getByText('Configuración')).toBeInTheDocument();

    const boardLink = screen.getByText('Ver Tablero').closest('a');
    const settingsLink = screen.getByText('Configuración').closest('a');

    expect(boardLink).toHaveAttribute('href', '/projects/project1/board');
    expect(settingsLink).toHaveAttribute('href', '/projects/project1/settings');
  });

  it('displays key metrics correctly', () => {
    render(<ProjectOverview project={mockProject} />);

    // Progress metric
    expect(screen.getByText('Progreso General')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument(); // No completed tasks
    expect(screen.getByText('0/1 tareas')).toBeInTheDocument();

    // Active members
    expect(screen.getByText('Miembros Activos')).toBeInTheDocument();
    const activeMembersCount = screen.getAllByText('1')[1]; // Second occurrence
    expect(activeMembersCount).toBeInTheDocument();
    expect(screen.getByText('de 1 total')).toBeInTheDocument();

    // Current sprint
    expect(screen.getByText('Sprint Actual')).toBeInTheDocument();
    const currentSprintText = screen.getAllByText('Sprint 1')[0]; // First occurrence in metrics
    expect(currentSprintText).toBeInTheDocument();

    // Stories count
    expect(screen.getByText('Historias')).toBeInTheDocument();
    expect(screen.getByText('1', { selector: '.text-orange-600' })).toBeInTheDocument();
    expect(screen.getByText('en backlog')).toBeInTheDocument();
  });

  it('displays sprint timeline', () => {
    render(<ProjectOverview project={mockProject} />);
    expect(screen.getByText('Línea de Tiempo de Sprints')).toBeInTheDocument();
    const timelineSprintText = screen.getAllByText('Sprint 1')[1]; // Second occurrence in timeline
    expect(timelineSprintText).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('displays recent tasks', () => {
    render(<ProjectOverview project={mockProject} />);
    expect(screen.getByText('Actividad Reciente')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Project • John Doe')).toBeInTheDocument();
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
  });

  it('displays team overview', () => {
    render(<ProjectOverview project={mockProject} />);
    expect(screen.getByText('Equipo del Proyecto')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('TEAM_DEVELOPER')).toBeInTheDocument();
  });

  it('shows no recent tasks message when no tasks exist', () => {
    const projectWithoutTasks: Project = {
      ...mockProject,
      userStories: [{
        ...mockUserStory,
        tasks: [],
      }],
    };

    render(<ProjectOverview project={projectWithoutTasks} />);
    expect(screen.getByText('No hay tareas recientes')).toBeInTheDocument();
  });

  it('shows no active sprint when none is current', () => {
    const pastSprint: Sprint = {
      ...mockSprint,
      startDate: '2023-01-01',
      endDate: '2023-01-15',
    };

    const projectWithPastSprint: Project = {
      ...mockProject,
      sprints: [pastSprint],
    };

    render(<ProjectOverview project={projectWithPastSprint} />);
    expect(screen.getByText('Ninguno')).toBeInTheDocument();
    expect(screen.getByText('Sin sprint activo')).toBeInTheDocument();
  });

  it('calculates completion rate correctly', () => {
    const completedTask: Task = {
      ...mockTask,
      status: 'COMPLETED',
    };

    const projectWithCompletedTasks: Project = {
      ...mockProject,
      userStories: [{
        ...mockUserStory,
        tasks: [completedTask],
      }],
    };

    render(<ProjectOverview project={projectWithCompletedTasks} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('1/1 tareas')).toBeInTheDocument();
  });

  it('handles project without description', () => {
    const projectWithoutDescription: Project = {
      ...mockProject,
      description: null,
    };

    render(<ProjectOverview project={projectWithoutDescription} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    // Should not crash without description
  });
});