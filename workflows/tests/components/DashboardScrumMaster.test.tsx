import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardScrumMaster from '../../src/app/components/DashboardScrumMaster';

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('DashboardScrumMaster', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar el título del dashboard', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
    render(<DashboardScrumMaster projectId="test-project-id" />);
    expect(await screen.findByText('Dashboard Scrum Master')).toBeInTheDocument();
  });

  it('debe mostrar mensaje de carga inicialmente', () => {
    render(<DashboardScrumMaster projectId="test-project-id" />);
    expect(screen.getByText('Cargando dashboard de Scrum Master...')).toBeInTheDocument();
  });

  it('debe mostrar métricas de sprints cuando cargan los datos', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([])
    });

    await act(async () => {
      render(<DashboardScrumMaster projectId="test-project-id" />);
    });

    expect(screen.getByText('Dashboard Scrum Master')).toBeInTheDocument();
  });

  it('debe mostrar métricas de sprints, velocidad y bloqueos', async () => {
    const mockSprints = [{ id: 'sprint1', name: 'Sprint 1', progress: 50 }];
    const mockTeam = [{ member: 'John Doe', velocity: 5 }];
    const mockBlockers = [{ id: 'blocker1', description: 'Test Blocker' }];

    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/sprints/metrics')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSprints)
        });
      }
      if (url.includes('/team/metrics')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTeam)
        });
      }
      if (url.includes('/blockers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBlockers)
        });
      }
      return Promise.resolve({ ok: false });
    });

    render(<DashboardScrumMaster projectId="test-project-id" />);

    // Esperar a que carguen los datos
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(screen.getByText('Sprints Activos')).toBeInTheDocument();
    expect(screen.getByText('Velocidad del Equipo')).toBeInTheDocument();
    expect(screen.getByText('Bloqueos Activos')).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay bloqueos', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/sprints/metrics')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
      if (url.includes('/team/metrics')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
      if (url.includes('/blockers')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        });
      }
      return Promise.resolve({ ok: false });
    });

    render(<DashboardScrumMaster projectId="test-project-id" />);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(screen.getByText('No hay bloqueos activos')).toBeInTheDocument();
  });
});