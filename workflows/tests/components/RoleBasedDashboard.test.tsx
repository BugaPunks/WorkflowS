import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import RoleBasedDashboard from '../../src/app/components/RoleBasedDashboard';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com'
      }
    }
  })
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({
    projectId: 'test-project-id'
  })
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('RoleBasedDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar mensaje de carga inicialmente', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => new Promise(() => {}), // Never resolves to keep it in loading state
    });
    render(<RoleBasedDashboard />);
    expect(await screen.findByText('Cargando dashboard...')).toBeInTheDocument();
  });

  it('debe mostrar error cuando el usuario no es miembro del proyecto', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404
    });

    await act(async () => {
      render(<RoleBasedDashboard />);
    });

    expect(screen.getByText('No eres miembro de este proyecto')).toBeInTheDocument();
  });

  it('debe mostrar DashboardScrumMaster para rol SCRUM_MASTER', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ scrumRole: 'SCRUM_MASTER' }),
    });

    render(<RoleBasedDashboard />);

    // Need to mock the fetch calls inside the dashboard components
    mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
    });

    expect(await screen.findByText('Dashboard Scrum Master')).toBeInTheDocument();
  });

  it('debe mostrar DashboardProductOwner para rol PRODUCT_OWNER', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ scrumRole: 'PRODUCT_OWNER' }),
    });

    render(<RoleBasedDashboard />);

    mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
    });

    expect(await screen.findByText('Dashboard Product Owner')).toBeInTheDocument();
  });

  it('debe mostrar DashboardTeamDeveloper para rol TEAM_DEVELOPer', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ scrumRole: 'TEAM_DEVELOPER' }),
    });

    render(<RoleBasedDashboard />);

    mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
    });

    expect(await screen.findByText('Dashboard Team Developer')).toBeInTheDocument();
  });

  it('debe mostrar mensaje de rol no asignado', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ scrumRole: null })
    });

    await act(async () => {
      render(<RoleBasedDashboard />);
    });

    expect(screen.getByText('Rol no asignado')).toBeInTheDocument();
  });
});